import styled from "@emotion/styled";
import { Title } from "./Order"

const ListPrice = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;

  margin-top: 35px;
  max-width: 250px;

  color: var(--white);
`;

const PriceInput = styled.input`
  background: var(--darkGray);
  border: dashed;
  padding: 10px;
  color: var(--lightGray);
  border-radius: 10px;
  border-color: var(--mediumGray);

  font-family: 'Roboto Mono';
  text-align: center;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
  }

  :focus {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
  }

  transition: all 100ms;
`;

export default function SetPrice({
  price,
  setPrice,
  submitAction
}:{
  price: string;
  setPrice: (price: string) => void;
  submitAction: (e: any) => void;
}) {
  return (
    <ListPrice>
      <Title style={{width: '5ch'}}>Price:&nbsp;&nbsp;&nbsp;</Title>
      <form onSubmit={(e) => { submitAction(e) }}>
        <PriceInput 
          type="number" 
          value={price} onChange={(e)=> setPrice(e.target.value)}
        />
      </form>
    </ListPrice>
  )
}
