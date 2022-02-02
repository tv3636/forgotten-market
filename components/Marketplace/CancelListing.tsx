import styled from '@emotion/styled';
import { WyvernV2 } from '@reservoir0x/sdk'
import { useEthers } from '@usedapp/core';
import { Signer } from 'ethers'
import { useEffect, useState } from 'react';
import { paths } from '../../interfaces/apiTypes'
import setParams from "../../lib/params";
import { API_BASE_URL, CONTRACTS } from "./marketplaceConstants";

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

async function cancelOrder(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query'],
) {
  try {
    // Get the order parameters from the Reservoir API
    const url = new URL('/orders/fill', apiBase)

    setParams(url, query)

    const res = await fetch(url.href)

    const { order } =
      (await res.json()) as paths['/orders/fill']['get']['responses']['200']['schema']

    if (!order?.params) {
      console.error('There was an error fetching the order to be cancelled.')
      return false
    }
    console.log(order);
    // Instantiate a Wyvern object from the order parameters
    // obatined from the API
    const sellOrder = new WyvernV2.Order(chainId, order.params)

    // Instantiate a Wyvern exchange object
    const exch = new WyvernV2.Exchange(chainId)

    // Execute cancellation
    const { wait } = await exch.cancel(signer, sellOrder)

    // Wait for transaction to be mined
    await wait()

    return true
  } catch (err) {
    console.log(err)
  }

  return false
}

export default function CancelListing({
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

  useEffect(() => {
    async function run() {
      if (tokenId && contract) {
        const query: Parameters<typeof cancelOrder>[3] = {
          contract,
          tokenId,
          side: 'sell',
        }

        console.log(API_BASE_URL, chainId, signer, query);
    
        try {
          await cancelOrder(
            API_BASE_URL,
            chainId,
            signer,
            query,
          )
          setModal(false)
        } catch (error) {
          setModal(false)
          console.error(error)
        }
      }
    }
    run();
  }, []);

  return (
    <OverlayWrapper>
      <Overlay>
        <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
        <Title>Canceling listing...</Title>
      </Overlay>
    </OverlayWrapper>
  )
}