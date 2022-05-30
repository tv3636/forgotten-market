import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { API_BASE_URL, CONTRACTS } from "./marketplaceConstants";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const CollectionOffer = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--mediumGray);
  border-width: 2px;

  font-family: Alagard;
  font-size: 20px;
  color: var(--lightGray);

  padding: 10px;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin-right: 0px;
  }

  transition: border-color 100ms;

`;

const CollectionEthSymbol = styled.img`
  height: 14px;
  margin-left: 8px;
  margin-top: 3px;

  @media only screen and (max-width: 600px) {
    height: 10px;
  }
`;

export default function CollectionOfferButton({ 
  contract,
  setShowModal,
}: { 
  contract: string; 
  setShowModal: (show: boolean) => void;
}) {
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    async function getCollectionOffer() {
      const collection = await fetch(
        API_BASE_URL + "collections/v2?slug=" + CONTRACTS[contract].collection,
        {headers: headers}
      );
      const collectionJson = await collection.json();

      if (collectionJson.collections.length > 0) {
        setCurrentOffer(collectionJson.collections[0].topBidValue);
      }
    }

    getCollectionOffer();
  }, [contract]);
  if (currentOffer) {
    return (
      <CollectionOffer onClick={() => setShowModal(true)}>
        {"Collection Offer: "}
        <CollectionEthSymbol src="/static/img/marketplace/eth.png" />
        {` ${currentOffer}`}
      </CollectionOffer>
    )
  } else {
    return (
      <CollectionOffer onClick={() => setShowModal(true)}>
        {"Collection Offer"}
      </CollectionOffer>
    )
  }
}
