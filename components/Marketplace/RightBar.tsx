import styled from "@emotion/styled";
import CollectionOfferButton from "./CollectionOfferButton";
import Filters from "./Filters";

const Container = styled.div`

  margin-right: var(--sp3);
  margin-top: var(--sp1);
  height: calc(100% - var(--sp1));
  max-height: calc(100% - var(--sp1));

  padding-bottom: var(--sp0);

  max-width: var(--sidebar);
  min-width: var(--sidebar);
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex-direction: column;
  gap: var(--sp0);
`;

export default function RightBar({
  contract,
  loreChange,
  noLoreChange,
  setSource,
  selectionChange,
  setShowModal,
}:{
  contract: string;
  loreChange: any;
  noLoreChange: any;
  setSource: any;
  selectionChange: any;
  setShowModal: any;
}) {
  return (
    <Container className="noscrim desktop">  
      <CollectionOfferButton setShowModal={setShowModal} />
      <Filters 
        contract={contract} 
        loreChange={loreChange} 
        noLoreChange={noLoreChange} 
        setSource={setSource} 
        selectionChange={selectionChange} 
      />
    </Container>
  )
}
