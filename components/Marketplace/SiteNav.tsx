import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MobileOverlay from "./MobileOverlay";
import RuneHeader from "./RuneHeader";
import { CollectionContainer } from "./Sidebar";
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: var(--sp3);
  margin-right: var(--sp3);
  margin-top: var(--sp1);

  @media only screen and (max-width: 1450px) {
    margin-left: var(--sp0);
    margin-right: var(--sp0);
  }
  
  @media only screen and (max-width: 1250px) {
    margin-top: var(--sp1);
    margin-bottom: var(--sp1);
    margin-left: var(--sp0);
    margin-right: var(--sp0);
  }

  @media only screen and (max-width: 600px) {
    margin-bottom: var(--sp-1);
  }

  @media only screen and (min-width: 1250px) and (max-height: 700px) {
    margin-left: var(--sp2);
    margin-right: var(--sp2);
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 1250px) {
    flex-direction: column;
    justify-content: auto;
    align-items: center;

    
  }
`;

const MenuItem = styled.div`
  padding: var(--sp1);

  @media only screen and (max-width: 1250px) {
    padding: var(--sp-2);
  }
`;

const LogoContainer = styled.div`
  width: var(--sidebar);
  
  @media only screen and (max-width: 1450px) {
    width: calc(var(--sidebar) / 1.1);
  }
  
  @media only screen and (max-width: 1250px) {
    width: 180px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: var(--sp0);
  }

  @media only screen and (max-width: 600px) {
    width: 120px;
    height: 40px;
  }
`;

const StyledLogo = styled.img`
  width: 100%;

  @media only screen and (max-width: 600px) {
    width: 120px;
    height: 40px;
  }

`;

const Burger = styled.div`
  --scale: 0.7;
  width: calc(33.75px * var(--scale));
  height: calc(18.75px * var(--scale));

  margin-top: -10px;
`;

const FilterContainer = styled.div`
  height: 25px;
`;

const MobileWrapper = styled.div`
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 40 50;
  border-image-width: calc(var(--frameSize) / 1.25);
  border-style: solid;
  border-image-repeat: round;

  margin-bottom: var(--sp1);
  background-color: var(--darkGray);
  padding: var(--sp-1);
`;

export function MainMenu({
  className
}:{
  className: string;
}) {
  const [connectedWallet, setConnectedWallet] = useState<any>(null);
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  useEffect(() => {
    if (isConnected && address) {
      setConnectedWallet(address);
    }
  }, [isConnected])

  return (
    <Menu className={className}>
      <MenuItem>
        <Link href='/about'>HELP</Link>
      </MenuItem>
      <MenuItem>
        {connectedWallet ? 
            <Link href={`/address/${connectedWallet}`}>
              ACCOUNT
            </Link> :
          <div className='pointer' onClick={() => connect()}>CONNECT</div>
        }
      </MenuItem>
    </Menu>
  )
}

export default function SiteNav({
  setFilterActive,
}:{
  setFilterActive: (active: boolean) => void;
}) {
  const [burgerActive, setBurgerActive] = useState(false);
  const router = useRouter();
  let homepage = 'contractSlug' in router.query && !('tokenId' in router.query);

  return (
    <HeaderWrapper>
      <LogoContainer>
        <Link href={`/${
          'contractSlug' in router.query ? 
            router.query.contractSlug : 
            '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42'
        }`}>
          <StyledLogo 
            src="/static/img/forgotten-runes-logo.png" 
            className="pointer"
          />  
        </Link>
      </LogoContainer>
      <MainMenu className="desktop" />

      <Burger className="mobile" onClick={() => setBurgerActive(true)}>
          <img 
              src="/static/img/burger.png" 
              width="25px" 
              height="25px" 
              className="pointer"
            />  
          </Burger>
          <FilterContainer className="mobile" onClick={() => setFilterActive(true)}>
            { homepage && 
            <img 
                src="/static/img/filter.png" 
                width="25px" 
                height="25px" 
                className="pointer mobile"
              /> 
            }
         </FilterContainer>
        <MobileOverlay burgerActive={burgerActive} setBurgerActive={setBurgerActive}>
          <MobileWrapper>
            <RuneHeader plaintext={false} home={true}>NAVIGATION</RuneHeader>
            <MainMenu className="mobile"/>
          </MobileWrapper>
          <CollectionContainer setBurgerActive={setBurgerActive} />
        </MobileOverlay>
      
    </HeaderWrapper>
  )
}
