import styled from "@emotion/styled";
import CollectionOfferButton from "./CollectionOfferButton";
import Filters from "./Filters";

const Container = styled.div`
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

  @media only screen and (min-width: 1250px) and (max-height: 700px) {
    min-width: calc(var(--sidebar) * .9);
  }
`;

export default function RightBar({
  contract,
  loreChange,
  noLoreChange,
  setSource,
  selectionChange,
  setShowModal,
  setActivity,
}:{
  contract: string;
  loreChange: any;
  noLoreChange: any;
  setSource: any;
  selectionChange: any;
  setShowModal: any;
  setActivity: any;
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
        setActivity={setActivity}
      />
    </Container>
  )
}
