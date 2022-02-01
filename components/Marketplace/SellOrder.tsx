import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, CONTRACTS } from "./marketplaceConstants";
import { Contract, ContractTransaction, ethers } from "ethers";
import { useEthers } from "@usedapp/core";
import { paths } from "../../interfaces/apiTypes";
import setParams from "../../lib/params";
import { WyvernV2 } from '@reservoir0x/sdk';
import { WYVERN_ABI } from "../../contracts/abis";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

const Overlay = styled.div`
  width: 50%;
  height: 50%; 
  background-color: black; 

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

const ListPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;

  color: var(--white);
`;

const PriceInput = styled.input`
  background: var(--darkGray);
  border: dashed;
  padding: 10px;
  color: var(--lightGray);
  border-radius: 10px;
  border-color: var(--mediumGray);

  font-family: 'Roboto Mono';
  text-align: center;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
  }

  :focus {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
  }
`;

const Expiration = styled.div`
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

const ButtonImage = styled.img`
  margin-top: var(--sp3);
  height: var(--sp3);
  image-rendering: pixelated;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
`;

async function getContract( 
  provider: any, 
  contract: string 
) {
  return new ethers.Contract(contract, CONTRACTS[contract].ABI, provider);
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
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [listPrice, setListPrice] = useState('');
  const [approved, setApproved] = useState(false);
  const [expiration, setExpiration] = useState(
    new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate() + 7)
    
  );
  console.log(library);

  useEffect(() => {
    async function run() {
      const wizContract = await getContract(library, contract);
      console.log(wizContract);
      const owner = await wizContract.ownerOf(tokenId);
      console.log(owner);
      const proxy = await getProxy(library, owner, account ?? '');
      console.log(proxy);
      setApproved(await canSend(owner, wizContract, proxy, tokenId));
    }
    run();
  }, []);

  function doSale() {
    if (isNaN(Number(listPrice)) || Number(listPrice) < 0) {
      console.log('invalid price'); 
      
      // TODO - error in UI
    } else {
      const query: Parameters<any>['3'] = {
        contract,
        maker: account,
        side: 'sell',
        price: ethers.utils.parseEther(listPrice).toString(),
        fee: 250,
        feeRecipient: '0xd584fe736e5aad97c437c579e884d15b17a54a51',
        tokenId: tokenId,
        expirationTime: Date.parse(expiration.toString()) / 1000,
      }

      console.log(query);
      listTokenForSell(chainId, signer, query, approved);
    }
  }

  return (
    <div style={{
      position: 'absolute', 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'transparent',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center'
    }}>
    <Overlay>
      <ListPrice>
        <Title>Price</Title>
        <form>
          <PriceInput type="text" style={{marginBottom: '20px'}} value={listPrice} onChange={(e)=> setListPrice(e.target.value)}></PriceInput>
        </form>
      </ListPrice>
      <Expiration>
        <Title>
          <div style={{marginRight: '10px', marginBottom: '5px'}}>Listing Expires</div>
          <InfoTooltip tooltip={'A listing can no longer be filled after its expiration. Invalidating a listing before its expiration requires manual cancellation'}/>
        </Title>
        <Flatpickr
          data-enable-time
          value={expiration}
          onChange={([date]) => {
            setExpiration(date);
          }}
          options={{
            "disable": [
              function(date) {
                return date < new Date();
              }
            ]
        }}
        />
      </Expiration>
      <ButtonImage
      src={"/static/img/marketplace/sell.png"}
      onMouseOver={(e) =>
        (e.currentTarget.src = "/static/img/marketplace/sell_hover.png")
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = "/static/img/marketplace/sell.png")
      }
      onClick={() => { doSale() }}
    />
    </Overlay>
    </div>
  )
}
