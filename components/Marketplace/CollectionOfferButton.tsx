import styled from "@emotion/styled";

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

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin-right: 0px;
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
      {"COLLECTION OFFER"}
    </CollectionOffer>
  )
}
