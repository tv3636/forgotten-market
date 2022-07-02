import styled from "@emotion/styled";
import { ReactNode } from "react";
import Image from 'next/image';

const Burger = styled.div`
  width: 20px;
  height: 20px;
`;
const MobileMenu = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;

  z-index: 10;
  background-color: var(--darkGray);
  opacity: .99;

  display: none;
  flex-direction: column;

  transition: all 250ms;
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const LogoContainer = styled.div`
  width: 180px;
  height: 59px;

  @media only screen and (max-width: 600px) {
    width: 120px;
    height: 40px;
  }
`;

const BurgerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  overflow: scroll;
`;

type Props = {
  burgerActive: boolean;
  setBurgerActive: (active: boolean) => void;
  children?: ReactNode;
};

export default function MobileOverlay(props: Props) {
  return (
    <MobileMenu style={props.burgerActive ? {display: 'flex'} : {}}>
      <MobileHeader>
        <LogoContainer style={{marginLeft: 'var(--sp2)', width: '120px', height: '40px'}}>
          <Image 
            src="/static/img/forgotten-runes-logo.png" 
            width="120px" 
            height="40px" 
            className="pointer"
          />  
        </LogoContainer>
        <Burger onClick={() => props.setBurgerActive(false)} style={{alignSelf: 'flex-end', margin: 'var(--sp2)'}}>
          <Image src='/static/img/x.png' width='20px' height='20px'/>
        </Burger>
      </MobileHeader>
      <BurgerContainer>
        {props.children}
      </BurgerContainer>
    </MobileMenu>
  )
}
