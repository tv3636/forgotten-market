import styled from "@emotion/styled";
import { ReactNode } from "react";

const Module = styled.div`
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;

  padding: var(--sp1);

  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  background-color: var(--darkGray);

  @media only screen and (max-width: 600px) {
   max-width: 80%;
  }
`;

const TraitModule = styled(Module)`
  flex-basis: 50%;
  flex-grow: 2;
  justify-content: space-between;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }

`;

export default function BaseModule({
  traitModule,
  children
}:{
  traitModule: boolean,
  children: ReactNode
}) {
  if (traitModule) {
    return (
      <TraitModule>
        {children}
      </TraitModule>
    );
  } else {
    return (
      <Module>
        {children}
      </Module>
    );
  }
}
