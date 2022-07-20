import styled from "@emotion/styled";

const ButtonDiv = styled.div`
  background-color: var(--darkGray);
  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 46 42 46 42;

  box-shadow: 0px 2px var(--darkGray);

  padding: 0 var(--sp1);

  cursor: pointer;
  color: var(--white);

  font-family: Alagard;
  font-size: var(--sp1);

  :hover {
    background-color: var(--mediumGray);
    border-color: var(--lightGray);
    color: white;
  }
  
  transition: all 200ms;
`;

export default function ActionButton({ 
  text,
  onClick
}: { 
  text: string;
  onClick: any;
}) {
  return (
    <ButtonDiv onClick={onClick} style={text.length > 10 ? {padding: '0 var(--sp-1)'} : {}}> 
      {text.toUpperCase()}
    </ButtonDiv>
  )
}
