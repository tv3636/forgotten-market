import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: var(--sp3);
  margin-right: var(--sp3);
  margin-top: var(--sp1);
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuItem = styled.div`
  padding: var(--sp1);
`;

const ImageWrap = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export default function SiteNav({}:{}) {
  const { account } = useEthers();
  const router = useRouter();
  
  return (
    <HeaderWrapper>
      <Link href={`/new/${router.query.contractSlug}`}>
        <ImageWrap>
          <Image src="/static/img/forgotten-runes-logo.png" width="180px" height="59px"/>  
        </ImageWrap>
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
            <div>CONNECT</div>
          }
        </MenuItem>
      </Menu>
    </HeaderWrapper>
  )
}
