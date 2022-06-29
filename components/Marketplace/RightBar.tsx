import styled from "@emotion/styled";
import Filters from "./Filters";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;

  margin-right: var(--sp3);
  margin-top: var(--sp1);
  max-width: 25ch;
  min-width: 25ch;

  z-index: 11;

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
}:{
  contract: string;
  loreChange: any;
  noLoreChange: any;
  setSource: any;
  selectionChange: any;
}) {

  return (
    <Container>  
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
