import styled from '@emotion/styled';
import { WyvernV2 } from '@reservoir0x/sdk'
import { useEthers } from '@usedapp/core';
import { ethers, Signer } from 'ethers'
import { useEffect, useState } from 'react';
import { paths } from '../../interfaces/apiTypes'
import setParams from '../../lib/params'
import { API_BASE_URL, CONTRACTS } from './marketplaceConstants';

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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`

const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);

  @media only screen and (max-width: 600px) {
    max-width: 200px;
    max-height: 200px;
  }
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

/**
 *
 * @param apiBase The Reservoir API base url
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet, 4 - Rinkeby Testnet)
 * @param signer An Ethereum signer object
 * @param contract The contract address for the collection
 * @param setWaiting Function to update waiting state as needed
 * @returns `true` if the transaction was succesful, `fasle` otherwise
 */
async function instantBuy(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query'],
  setWaiting: any
) {
  try {
    // Fetch the best sell order for this token
    let url = new URL('/orders/fill', apiBase)

    setParams(url, query)

    const res = await fetch(url.href)

    const { order } =
      (await res.json()) as paths['/orders/fill']['get']['responses']['200']['schema']

    if (!order?.params) {
      throw new ReferenceError('Could not retrieve order params')
    }

    // Use SDK to create order object
    const sellOrder = new WyvernV2.Order(chainId, order.params)

    const signerAddress = await signer.getAddress()

    // Create a matching buy order
    const buyOrder = sellOrder.buildMatching(
      signerAddress,
      order.buildMatchingArgs
    )

    const exch = new WyvernV2.Exchange(chainId)

    // Execute order match
    const { wait } = await exch.match(signer, buyOrder, sellOrder)
    setWaiting(true);

    // Wait for the transaction to be mined
    await wait()
    
    setWaiting(false);
    return true
  } catch (err) {
    console.error(err)
  }

  return false
}

export default function SellOrder({
  contract,
  tokenId,
  name,
  setModal,
}: {
  contract: string;
  tokenId: string;
  name: string;
  setModal: any;
}) {
  const [successful, setSuccessful] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const { library, account } = useEthers();
  const signer = library?.getSigner();

  useEffect(() => {
    async function run() {
      const query: paths['/orders/fill']['get']['parameters']['query'] =
        {
          contract,
          tokenId,
          side: 'sell',
        }

      if (await instantBuy(API_BASE_URL, chainId, signer, query, setWaiting)) {
        // Listing successful, hide modal
        setSuccessful(true);
        setTimeout(
          () => setModal(false),
          5000
        );
      } else {
        // TODO - error in UI, listing failed
        setModal(false);
      }
    }
    run();
  }, []);

  return (
    <OverlayWrapper>
      <Overlay>
        { waiting ? 
        <Section>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>Purchasing {name} (#{tokenId})</Title>
          <Title style={{marginTop: "20px"}}>Transaction processing...</Title>
        </Section> : successful ? 
        <Section>
          <img src={"/static/img/marketplace/magicdust.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>{name} (#{tokenId})</Title>
          <Title style={{marginTop: "20px"}}>Purchase successful!</Title>
        </Section> :
        <Section>
          <TokenImage src={CONTRACTS[contract].image_url + tokenId + ".png"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>Purchasing {name} (#{tokenId})...</Title>
        </Section>
        }
      </Overlay> 
    </OverlayWrapper>
  )
}