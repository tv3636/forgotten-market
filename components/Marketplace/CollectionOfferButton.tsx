import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { isTraitOffer } from "./marketplaceHelpers";

const CollectionOffer = styled.div`
  background-color: var(--darkGray);
  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: calc(var(--sp0) / 1.05);
  border-image-slice: 46 42 46 42;

  font-family: Terminal;
  color: var(--white);

  padding: var(--sp-4);
  padding-left: var(--sp-2);

  :hover {
    background-color: var(--mediumGray);
    border-color: var(--lightGray);
    color: white;
    cursor: pointer;
  }

  transition: all 200ms;
`;

export default function CollectionOfferButton({ 
  setShowModal,
}: { 
  setShowModal: (show: boolean) => void;
}) {
  const router = useRouter();
  
  return (
    <CollectionOffer onClick={() => setShowModal(true)}>
      {`${ isTraitOffer(router.query) ? 'TRAIT' : 'COLLECTION' } OFFER`}
    </CollectionOffer>
  )
}
