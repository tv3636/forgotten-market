import styled from "@emotion/styled";
import { useRouter } from "next/router";

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

  @media only screen and (max-width: 600px) {
    font-size: var(--sp-1);
  }
`;

const ToggleButton = styled.div`
  text-align: center;
  justify-content: center;

  width: 17ch;

  padding-left: var(--sp-1);
  padding-right: var(--sp-1);
  padding-top: 0;
  padding-bottom: 0;

  background-color: var(--mediumGray);
  box-shadow: 0px 4px var(--darkGray);

  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 46 42 46 42;

  :hover {
    background-color: var(--darkGray);
    cursor: pointer;
  }

  transition: all 200ms;
`;

export default function MainToggle({
  activity,
}:{
  activity: boolean;
}) {
  const router = useRouter();

  function pushRouter() {
    router.push({query: router.query}, undefined, {shallow: true});
  }

  return (
    <Toggle>
      <ToggleButton 
        style={activity ? {} : { backgroundColor: 'var(--darkGray)'}} 
        className='leftButton'
        onClick={() => {delete router.query['activity']; pushRouter()}}
      >
        MARKETPLACE
      </ToggleButton>
      <ToggleButton 
        style={activity ? { backgroundColor: 'var(--darkGray)'} : {}} 
        className='rightButton'
        onClick={() => {router.query['activity'] = 'sales'; pushRouter()}}
      >
        ACTIVITY
      </ToggleButton>
    </Toggle>
  )
}
