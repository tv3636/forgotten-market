import styled from "@emotion/styled";
import { useRouter } from "next/router";

const CollectionOffer = styled.div`
  background: var(--mediumGray);
  border-style: dashed;
  border-radius: 20px;
  border-color: var(--mediumGray);
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
  const router = useRouter();
  let offerType = Object.keys(router.query).length == (2 + Number('source' in router.query)) ? 'TRAIT' : 'COLLECTION';

  return (
    <CollectionOffer onClick={() => setShowModal(true)}>
      {`${offerType} OFFER`}
    </CollectionOffer>
  )
}
