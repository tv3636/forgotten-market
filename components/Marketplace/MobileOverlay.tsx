import styled from "@emotion/styled";
import { ReactNode } from "react";
import Image from 'next/image';

const Burger = styled.div`
  width: 25px;
  height: 25px;
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;

  z-index: 12;
  background-color: var(--darkGray);
  opacity: .99;

  display: none;
  flex-direction: column;
  overflow: scroll;

  transition: all 250ms;
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  margin-top: var(--sp1);
  margin-bottom: var(--sp-1);
  margin-left: var(--sp-2);
  margin-right: var(--sp-2);
`;

const LogoContainer = styled.div`
  width: 180px;
  height: 59px;

  @media only screen and (max-width: 1250px) {
    width: 120px;
    height: 40px;

    position: absolute;
    left: 50%;
    top: var(--sp0);
    transform: translateX(-50%);
  }
`;

const BurgerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: var(--sp2);
`;

type Props = {
  burgerActive: boolean;
  setBurgerActive: (active: boolean) => void;
  children?: ReactNode;
};

export default function MobileOverlay(props: Props) {
  return (
    <MobileMenu style={props.burgerActive ? {display: 'block'} : {}}>
      <MobileHeader>
        <LogoContainer>
          <Image 
            src="/static/img/forgotten-runes-logo.png" 
            width="120px" 
            height="40px" 
            className="pointer"
          />  
        </LogoContainer>
        <Burger onClick={() => props.setBurgerActive(false)} style={{alignSelf: 'flex-end'}}>
          <Image src='/static/img/x.png' width='20px' height='20px'/>
        </Burger>
      </MobileHeader>
      <BurgerContainer>
        {props.children}
      </BurgerContainer>
    </MobileMenu>
  )
}
