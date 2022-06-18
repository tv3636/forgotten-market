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
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuItem = styled.div`
  padding: var(--sp1);
`;

export default function SiteNav({}:{}) {
  const { account } = useEthers();
  const router = useRouter();

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
    <HeaderWrapper>
      <Link href={`/new/${router.query.contractSlug}`}>
        <Image src="/static/img/forgotten-runes-logo.png" width="180px" height="59px" className="pointer"/>  
      </Link>
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
    </HeaderWrapper>
  )
}
