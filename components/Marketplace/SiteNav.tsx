import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { useMst } from "../../store";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { useState } from "react";
import MobileOverlay from "./MobileOverlay";
import RuneHeader from "./RuneHeader";
import { CollectionContainer } from "./Sidebar";

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: var(--sp3);
  margin-right: var(--sp3);
  margin-top: var(--sp1);
  
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

    margin-bottom: var(--sp1);
  }
`;

const MenuItem = styled.div`
  padding: var(--sp1);

  @media only screen and (max-width: 1250px) {
    padding: var(--sp-2);
  }
`;

const LogoContainer = styled.div`
  width: 180px;
  height: 59px;
  
  @media only screen and (max-width: 1250px) {
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

const Burger = styled.div`
  --scale: 0.7;
  width: calc(33.75px * var(--scale));
  height: calc(18.75px * var(--scale));

  margin-top: -10px;
`;

const FilterContainer = styled.div`
  height: 25px;
`;

export function MainMenu({
  className
}:{
  className: string;
}) {
  const { account } = useEthers();
  const { web3Settings } = useMst();
  const { activate } = useEthers();

  const setInjectedProvider = (newProvider: any) => {
    web3Settings.setInjectedProvider(newProvider);
    activate(newProvider);

    // workaround to reload page after wallet is connected
    window.location.reload();
  };

  const [web3Modal, loadWeb3Modal, logoutOfWeb3Modal] =
    useWeb3Modal(setInjectedProvider);

  return (
    <Menu className={className}>
      <MenuItem>
        <Link href='/about'>HELP</Link>
      </MenuItem>
      <MenuItem>
        {account ? 
            <Link href={`/address/${account}`}>
              ACCOUNT
            </Link> :
          <div className='pointer' onClick={() => loadWeb3Modal()}>CONNECT</div>
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
          <Image 
            src="/static/img/forgotten-runes-logo.png" 
            width="180px" 
            height="59px" 
            className="pointer"
            layout="responsive"
          />  
        </Link>
      </LogoContainer>
      <MainMenu className="desktop" />

      <Burger className="mobile" onClick={() => setBurgerActive(true)}>
          <Image 
              src="/static/img/burger.png" 
              width="25px" 
              height="25px" 
              className="pointer"
              layout="responsive"
            />  
          </Burger>
          <FilterContainer className="mobile" onClick={() => setFilterActive(true)}>
            { homepage && 
            <Image 
                src="/static/img/filter.png" 
                width="25px" 
                height="25px" 
                className="pointer mobile"
              /> 
            }
         </FilterContainer>
        <MobileOverlay burgerActive={burgerActive} setBurgerActive={setBurgerActive}>
          <RuneHeader>NAVIGATION</RuneHeader>
          <MainMenu className="mobile"/>
          <CollectionContainer setBurgerActive={setBurgerActive} />
        </MobileOverlay>
      
    </HeaderWrapper>
  )
}
