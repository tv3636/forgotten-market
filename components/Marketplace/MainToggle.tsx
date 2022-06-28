import styled from "@emotion/styled";
import Link from "next/link";

const Toggle = styled.div`
  display: flex;

  .leftButton {
    border-top-left-radius: var(--sp-2);
    border-bottom-left-radius: var(--sp-2);
  }
  
  .rightButton {
    border-top-right-radius: var(--sp-2);
    border-bottom-right-radius: var(--sp-2);
  }
`;

const ToggleButton = styled.div`
  text-align: center;
  justify-content: center;

  width: 17ch;

  padding-left: var(--sp1);
  padding-right: var(--sp1);
  padding-top: var(--sp-3);
  padding-bottom: var(--sp-3);

  background-color: var(--mediumGray);
  box-shadow: 0px 4px var(--darkGray);

  :hover {
    background-color: var(--darkGray);
    cursor: pointer;
  }

  transition: all 200ms;
`;

export default function MainToggle({
  contract,
  activity,
}:{
  contract: string;
  activity: boolean;
}) {
  return (
    <Toggle>
      <Link href={`/new/${contract}`}>
        <ToggleButton style={activity ? {} : { backgroundColor: 'var(--darkGray)'}} className='leftButton'>
          MARKETPLACE
        </ToggleButton>
      </Link>
      <Link href={`/new/${contract}?activity=True`}>
        <ToggleButton style={activity ? { backgroundColor: 'var(--darkGray)'} : {}} className='rightButton'>
          ACTIVITY
        </ToggleButton>
      </Link>
    </Toggle>
  )
}