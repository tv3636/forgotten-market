import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useNetwork, useSigner } from 'wagmi';
import { API_BASE_URL, CONTRACTS } from "./marketplaceConstants";
import { Provider } from "wagmi";
import OfferModal from "./OfferModal";
import { getProvider } from "../../hooks/useProvider";
import { Contract, ContractTransaction, ethers } from "ethers";
import {
  SOULS_ABI,
  WIZARDS_ABI,
  WYVERN_ABI
} from "../../contracts/abis";
import { useEthers } from "@usedapp/core";
import { paths } from "../../interfaces/apiTypes";
import setParams from "../../lib/params";
import { WyvernV2 } from '@reservoir0x/sdk';
import { DateTime } from 'luxon';

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

async function getWizardsContract( 
  provider: any, 
  contract: string 
) {
  return new ethers.Contract(contract, WIZARDS_ABI, provider);
}

async function listTokenForSell(
  chainId: number,
  signer: any,
  query: any,
  proxyApproved: boolean
) {
  if (!signer || !query.tokenId || !query.contract) {
    console.debug({ signer, query })
    return
  }

  try {
    if (proxyApproved) {
      // Build a selling order
      let url = new URL('/orders/build', API_BASE_URL)

      setParams(url, query)

      let res = await fetch(url.href)

      let { order } =
        (await res.json()) as paths['/orders/build']['get']['responses']['200']['schema']

      if (!order?.params) {
        throw 'API ERROR: Could not retrieve order params'
      }

      // Use SDK to create order object
      const sellOrder = new WyvernV2.Order(chainId, order.params)
      console.log(sellOrder);
      console.log(signer);

      // Sign selling order
      await sellOrder.sign(signer)

      console.log('signed');

      // Post order to the database
      let url2 = new URL('/orders', API_BASE_URL)

      await fetch(url2.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orders: [
            {
              kind: 'wyvern-v2',
              data: sellOrder.params,
            },
          ],
        }),
      })

      return true
    }

    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

async function canSend(owner: string, collectionContract: any, userProxy: string, tokenId: number) {
    // Check approval on the user proxy
    let isApproved = await collectionContract.isApprovedForAll(owner, userProxy)

    if (!isApproved) {
      const approvedAddress = await collectionContract.getApproved(tokenId)
      isApproved = approvedAddress.toLowerCase() === owner.toLowerCase()
    }

    if (isApproved) {
      // Set success
      return true
    } else {
      // Set the approval on the user proxy
      const { wait } = (await collectionContract.setApprovalForAll(userProxy, true)) as ContractTransaction

      // Wait for the transaction to get mined
      await wait()

      return true
    }
}

async function getProxy(provider: any, owner: string, account: string) {
  const proxyRegistryContract = new Contract(
    chainId === 4
      ? '0xf57b2c51ded3a29e6891aba85459d600256cf317'
      : '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    WYVERN_ABI,
    provider
  );
  
  if (owner.toLowerCase() !== account?.toLowerCase()) {
    console.error('Signer is not the token owner')
    return null
  } else {
    const userProxy = await proxyRegistryContract.proxies(owner)

    // Register proxy for wyvern exchange if it doesn't exist
    if (!userProxy) {
      let { wait } = (await proxyRegistryContract.registerProxy()) as ContractTransaction;
        
        // Wait for the transaction to get mined
        await wait();
        
        // Retrieve user proxy
        return await proxyRegistryContract.proxies(owner);
    }

    return userProxy;
  }
}

export default function SellOrder({
  contract,
  tokenId
}: {
  contract: string;
  tokenId: number;
}) {
  const provider = getProvider();
  const signer = provider.getSigner();
  const { account } = useEthers();

  useEffect(() => {
    async function run() {
      const wizContract = await getWizardsContract(provider, contract);
      const owner = await wizContract.ownerOf(tokenId);
      const proxy = await getProxy(provider, owner, account ?? '');
      const approved = await canSend(owner, wizContract, proxy, tokenId);

      const query: Parameters<any>['3'] = {
        contract,
        maker: owner,
        side: 'sell',
        price: ethers.utils.parseEther('1000000000000000000000000000000000000').toString(),
        fee: 250,
        feeRecipient: owner,
        tokenId: tokenId,
        expirationTime: DateTime.now().plus({ hours: 1 }).toMillis().toString(),
      }

      console.log(query);

      listTokenForSell(chainId, signer, query, approved);
      
    }

    run();
  }, []);

  return (
    <div></div>
  )
}
