import styled from "@emotion/styled";
import CollectionOfferButton from "./CollectionOfferButton";
import Filters from "./Filters";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;

  margin-right: var(--sp3);
  margin-top: var(--sp1);
  margin-bottom: 200px;

  max-width: var(--sidebar);
  min-width: var(--sidebar);;

  ::-webkit-scrollbar {
    display: none;
  }
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
