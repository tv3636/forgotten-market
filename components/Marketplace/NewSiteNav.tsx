import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { useMst } from "../../store";
import useWeb3Modal from "../../hooks/useWeb3Modal";

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: var(--sp3);
  margin-right: var(--sp3);
  margin-top: var(--sp2);

  @media only screen and (max-width: 1200px) {
    margin-top: var(--sp0);
    margin-bottom: var(--sp-3);
    margin-left: var(--sp0);
    margin-right: var(--sp0);
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
    justify-content: auto;
    align-items: center;

    margin-bottom: var(--sp1);
  }
`;

const MenuItem = styled.div`
  padding: var(--sp1);

  @media only screen and (max-width: 1200px) {
    padding: var(--sp-2);
  }
`;

const LogoContainer = styled.div`
  width: 180px;
  height: 59px;

  @media only screen and (max-width: 600px) {
    width: 120px;
    height: 40px;
  }
`;

const Burger = styled.div`
  width: 25px;
  height: 25px;

`;

export function MainMenu({}:{}) {
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
    <Menu>
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
  setBurgerActive,
}:{
  setBurgerActive: (active: boolean) => void,
}) {
  const router = useRouter();

  return (
    <HeaderWrapper>
      <LogoContainer>
        <Link href={`/${router.query.contractSlug}`}>
          <Image 
            src="/static/img/forgotten-runes-logo.png" 
            width="180px" 
            height="59px" 
            className="pointer"
            layout="responsive"
          />  
        </Link>
      </LogoContainer>
      <div className="desktop">
        <MainMenu />
      </div>
      <Burger className="mobile" onClick={() => setBurgerActive(true)}>
        <Image 
            src="/static/img/burger.png" 
            width="25px" 
            height="25px" 
            className="pointer"
            layout="responsive"
          />  
        </Burger>
    </HeaderWrapper>
  )
}
