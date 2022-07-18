import styled from "@emotion/styled";
import { isTraitOffer } from "./marketplaceHelpers";

const CollectionOffer = styled.div`
  background: var(--midGray);
  border-style: dashed;
  border-radius: 20px;
  border-color: var(--midGray);
  border-width: 1px;

  font-family: Terminal;

  padding: var(--sp0);

  :hover {
    background: var(--darkGray);
    border-color: var(--darkGray);
    color: var(--white);
    cursor: pointer;
  }

  transition: all 200ms;
`;

export default function CollectionOfferButton({ 
  setShowModal,
}: { 
  setShowModal: (show: boolean) => void;
}) {
  return (
    <CollectionOffer onClick={() => setShowModal(true)}>
      {`${ isTraitOffer() ? 'TRAIT' : 'COLLECTION' } OFFER`}
    </CollectionOffer>
  )
}
