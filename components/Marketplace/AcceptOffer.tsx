import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./marketplaceConstants";
import { useEthers } from "@usedapp/core";
import { paths } from "../../interfaces/apiTypes";
import setParams from "../../lib/params";
import { WyvernV2 } from '@reservoir0x/sdk';
import "flatpickr/dist/themes/material_green.css";
import { Contract, ContractTransaction, ethers } from "ethers";
import { Interface } from "ethers/lib/utils";


const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

const OverlayWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000085;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: flex-start;

  transition-property: background-color;
  transition-duration: 2s;
`;

const Overlay = styled.div`
  width: 60vw;
  height: 60vh;
  background-color: var(--black); 

  border: dashed;
  border-radius: 15px;
  border-color: var(--mediumGray);

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  margin: 10px;
  font-family: Alagard;
  font-size: 18px;
  color: var(--white);

  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

async function registerUserProxy(
  collectionContract: Contract,
  proxyRegistryContract: Contract,
  signer: any,
  tokenId: string
) {
  try {
    // Make sure the signer is the owner of the listed token
    const owner = await collectionContract.connect(signer).ownerOf(tokenId)

    const signerAddress = await signer.getAddress()

    if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
      throw new Error('The signer is not the token owner.')
    }

    // Retrieve user proxy
    const userProxy = await proxyRegistryContract
      .connect(signer)
      .proxies(signerAddress)

    if (userProxy === ethers.constants.AddressZero) {
      // If the user has no associated proxy, then register one
      let { wait } = (await proxyRegistryContract
        .connect(signer)
        .registerProxy()) as ContractTransaction

      // Wait for the transaction to get mined
      await wait()

      // Retrieve user proxy
      const userProxy = await proxyRegistryContract
        .connect(signer)
        .proxies(signerAddress)

      return userProxy
    } else {
      // The user already registered a proxy
      return userProxy
    }
  } catch (err) {
    console.error(err)
  }
  return null
}

async function checkProxyApproval(
  collectionContract: Contract,
  signer: any,
  userProxy: any,
  tokenId: string
) {
  try {
    const signerAddress = await signer.getAddress()
    // Check approval on the user proxy
    let isApproved = await collectionContract
      .connect(signer)
      .isApprovedForAll(signerAddress, userProxy)

    if (!isApproved) {
      const approvedAddress = await collectionContract
        .connect(signer)
        .getApproved(tokenId)
      isApproved = approvedAddress.toLowerCase() === signerAddress.toLowerCase()
    }

    if (!isApproved) {
      // Set the approval on the user proxy
      const { wait } = (await collectionContract
        .connect(signer)
        .setApprovalForAll(userProxy, true)) as ContractTransaction

      // Wait for the transaction to get mined
      await wait()
    }

    // Everything has executed successfully
    return true
  } catch (err) {
    console.error(err)
  }
  return false
}

async function isProxyApproved(
  chainId: number,
  signer: any,
  tokenId: string,
  contract: string
) {
  const collectionContract = new Contract(
    contract,
    new Interface([
      'function ownerOf(uint256 tokenId) view returns (address)',
      'function getApproved(uint256 tokenId) view returns (address)',
      'function isApprovedForAll(address owner, address operator) view returns (bool)',
      'function setApprovalForAll(address operator, bool approved)',
    ])
  )

  const proxyRegistryContract = new Contract(
    chainId === 4
      ? '0xf57b2c51ded3a29e6891aba85459d600256cf317'
      : '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    new Interface([
      'function proxies(address) view returns (address)',
      'function registerProxy()',
    ])
  )

  try {
    const userProxy = await registerUserProxy(
      collectionContract,
      proxyRegistryContract,
      signer,
      tokenId
    )
    const proxyApproved = await checkProxyApproval(
      collectionContract,
      signer,
      userProxy,
      tokenId
    )

    return proxyApproved
  } catch (err) {
    console.error(err)
  }
  return false
}


async function getMatchingOrders(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query']
) {
  try {
    // Get the best offer for the token
    const url = new URL('/orders/fill', apiBase)

    setParams(url, query)

    // Get the best BUY order data
    const res = await fetch(url.href)

    const { order } =
      (await res.json()) as paths['/orders/fill']['get']['responses']['200']['schema']

    if (!order?.params) {
      throw new ReferenceError('Could not retrieve order params from the API')
    }

    // Use SDK to create order object
    const buyOrder = new WyvernV2.Order(chainId, order?.params)

    const signerAddress = await signer.getAddress()

    // Instatiate an matching SELL Order
    const sellOrder = buyOrder.buildMatching(
      signerAddress,
      order.buildMatchingArgs
    )

    return { buyOrder, sellOrder }
  } catch (err) {
    console.error(err)
  }
  return null
}

/**
 *
 * @param apiBase The Reservoir API base url
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet, 4 - Rinkeby Testnet)
 * @param signer An Ethereum signer object
 * @param contract The contract address for the collection
 * @param tokenId The token ID
 * @returns `true` if the transaction was succesful, `fasle` otherwise
 */
 async function acceptOffer(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query'],
  setProcessing: any
) {
  try {
    const proxyApproved = await isProxyApproved(
      chainId,
      signer,
      query.tokenId,
      query.contract ?? ''
    )

    if (!proxyApproved) return false

    const orders = await getMatchingOrders(apiBase, chainId, signer, query)

    if (!orders) return false

    const { buyOrder, sellOrder } = orders
    // Instantiate WyvernV2 Exchange contract object
    const exchange = new WyvernV2.Exchange(chainId)

    // Execute token sell
    let { wait } = await exchange.match(signer, buyOrder, sellOrder)

    setProcessing(true);
    // Wait for transaction to be mined
    await wait()

    setProcessing(false);

    return true
  } catch (err) {
    console.error(err)
  }
  return false
}

export default function AcceptOffer({
  contract,
  tokenId,
  setModal,
}: {
  contract: string;
  tokenId: string;
  setModal: any;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [processing, setProcessing] = useState(false);

  const query: Parameters<typeof acceptOffer>[3] = {
    tokenId,
    contract,
    side: 'buy',
  };
  
  acceptOffer(API_BASE_URL, chainId, signer, query, setProcessing);
  setModal(false);

  return (
    <OverlayWrapper>
      { processing ? 
        <Overlay>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>Transaction processing...</Title>
        </Overlay> : 
        <Overlay>
          <Title style={{marginTop: "20px"}}>Accepting offer for (#{tokenId})...</Title>
        </Overlay>
      }
    </OverlayWrapper>
  )
}
