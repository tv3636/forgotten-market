import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, CONTRACTS } from "./marketplaceConstants";
import { Provider } from "wagmi";
import OfferModal from "./OfferModal";
import { getProvider } from "../../hooks/useProvider";

const apiBase = process.env.NEXT_PUBLIC_API_BASE;
const chainId = process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID;
const openSeaApiKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  border-style: dashed;
  border-width: 2px;
  border-radius: 10px;
  border-color: var(--mediumGray);
  background-color: var(--darkGray);
  padding: 4px;

  font-family: Alagard;
  font-size: 18px;
  color: var(--lightGray);
`;

const Button = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const Price = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

const OfferingStyle = styled.div`
  position: absolute;
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;

  background-color: black;
  
`;

function Offering({ 
  contract,
  collection
}:{ 
  contract: string;
  collection: any;
}) {
  const provider = getProvider();
  const signer = provider.getSigner();
  const network = provider.getNetwork();

  const env = {
    apiBase: apiBase ?? "https://mainnet-api-v4.reservoir.tools/",
    chainId: Number(chainId) ?? 1,
    openSeaApiKey: openSeaApiKey ?? 'test'
  }

  //const isInTheWrongNetwork = signer && network.chain?.id !== env.chainId;
  const isInTheWrongNetwork = false;
  //console.log(network.chain?.id);
  console.log(network);

  const royalties = {
    bps: collection?.royalties?.bps,
    recipient: collection?.royalties?.recipient,
  }

  const data = {
    // COLLECTION WIDE OFFER
    collection: {
      id: collection?.collection?.id,
      image: collection?.collection?.image,
      name: collection?.collection?.name,
      tokenCount: collection?.set?.tokenCount ?? 0,
    },
    token: {
      contract: undefined,
      id: undefined,
      image: undefined,
      name: undefined,
      topBuyValue: undefined,
      floorSellValue: undefined,
    },
  }

  return (
  <OfferingStyle>
    <OfferModal
          trigger={
            <button
              className="btn-neutral-fill-dark px-11 py-4"
              disabled={!signer || isInTheWrongNetwork}
            >
              Make a collection bid
            </button>
          }
          royalties={royalties}
          signer={signer}
          data={data}
          env={env}
          mutate={collection.mutate}
        />
  </OfferingStyle>
  );
}

export default function CollectionOffer({ contract }: { contract: string }) {
  const [current, setCurrent] = useState(false);
  const [offerInProgress, setOfferInProgress] = useState(false);
  const [collection, setCollection] = useState(null);

  async function getCollection() {
    if (contract) {
      const collection = await fetch(API_BASE_URL + "collections/" + CONTRACTS[contract].collection);
      const collectionJson = await collection.json();
      setCurrent(collectionJson.collection.set.market.topBuy.value);
      setCollection(collectionJson);
    }
  }

  useEffect(() => {
    getCollection();
  }, [contract]);


  return (
    <Wrapper>
      <Provider>
        {offerInProgress && collection && <Offering contract={contract} collection={collection}/>}
        <Button onClick={(e) => { setOfferInProgress(true) }}
        >{'Make Collection Offer'}</Button>
        {current? <Price>{'Current: ' + current}</Price> : <Price>Current: None</Price>}
      </Provider>
    </Wrapper>
  )
}