import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
import Link from "next/link";
import { useEthers } from "@usedapp/core";
import MarketConnect from "./Marketplace/MarketConnect";
import { useRouter } from 'next/router';

type Props = {};

const SiteNavElement = styled.nav`
  font-family: "Roboto Mono", system-ui, -apple-system, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  padding: 0 15px;

  li.highlighted a {
    background-color: #1f200d;
    border-radius: 5px;
    padding: 5px 8px !important;
  }

  .menu {
    margin-top: 0;
    margin-left: 0;
    width: 100%;
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
  }

  .main.menu.active {
    display: flex;
    flex-direction: column;
  }

  ul.menu {
    margin: 0;
  }

  .menu,
  .submenu {
    list-style-type: none;
  }
  .logo {
    font-size: 20px;
    padding: 7.5px 10px 7.5px 0;
    max-width: 80vw;
  }
  .item {
    padding: 10px;
  }
  .item.button {
    padding: 9px 5px;
  }
  .item:not(.button) a:hover,
  .item a:hover::after {
    color: #ccc;
  }

  .icon-link {
    max-width: 60px;
    justify-content: center;
    align-items: center;
    display: flex;
    margin: 0 auto;
  }
  a.icon-link:hover {
    opacity: 0.8;
  }

  /* Mobile menu */
  .menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
  .menu li a {
    display: block;
    padding: 15px 5px;
  }
  .toggle {
    order: 1;
    font-size: 20px;
  }
  .item.button {
    order: 2;
  }
  .item {
    order: 3;
    width: 100%;
    text-align: center;
    display: none;
  }
  .active .item {
    display: block;
  }
  /* Tablet menu */
  @media (min-width: 700px) {
    .menu {
      /* justify-content: center; */
      justify-content: flex-end;
    }
    .logo {
      flex: 1;
    }
    .toggle {
      flex: 1;
      text-align: right;
      order: 2;
    }
    /* Button up from tablet screen */
    .menu li.button a {
      padding: 10px 15px;
      margin: 5px 0;
    }
    .toggle {
      max-width: 60px;
    }
  }
  /* Desktop menu */
  @media (min-width: 960px) {
    .menu {
      align-items: center;
      flex-wrap: nowrap;
      background: none;
      justify-content: flex-end;
    }
    .logo {
      order: 0;
      margin-right: 2em;
    }
    .item {
      order: 1;
      position: relative;
      display: block;
      width: auto;
    }
    .toggle {
      display: none;
    }
  }
`;

const SiteNavRow = styled.div`
  .menu {
    justify-content: center;
  }
  .logo {
    @media (min-width: 960px) {
      max-width: 260px;
      width: 260px;
    }
  }
`;

const SiteNavTopRow = styled(SiteNavRow)`
  display: flex;
  justify-content: space-between;
  max-width: 1100px;
  min-width: 80vw;
  flex-direction: column;

  @media (min-width: 960px) {
    flex-direction: row;
  }

  .menu {
    justify-content: flex-end;
  }
`;

export const BrandedLogoImg = styled.img`
  width: 100%;
  height: auto;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 40%;
    height: 40%;
  }
`;

export const LogoToggleRow = styled.div`
  display: flex;
  flex-direction: row;

  .toggle-menu {
    min-width: 40px;
  }
`;

const MenuItem = styled.div`
  position: relative;  
  margin-right: 30px;
  font-size: 15px;
  color: var(--lightGray);
  cursor: pointer;
  
  display: flex;
  justify-content: center;

  :hover {
    color: white;

    .dropdown {
      display: flex;
    }
  }

  transition: all 200ms;
`;

const SoftLink = styled.a`
  text-decoration: none;
  color: var(--white);

  :hover {
    color: white;
  }

  transition: all 200ms;
`;

const AccountIcon = styled.div`
  position: relative;

  :hover {
    .dropdown {
      display: inline-block;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 57px !important;
  }

`;

const AccountDropDown = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  display: none;
  z-index: 1000;

`;

const CollectionOffer = styled.div`
  margin-right: 10px;
  margin-top: 3px;


  :hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin-right: 0px;
    margin-top: 0px;
    display: flex;
    justify-content: center;
  }

  transition: all 200ms;

`;

function Profile({ account }: {account: any}) {
  return (
    <AccountIcon className={"item"}>
      { account ? 
        <Link href={`/address/${account}`} passHref={true}>
          <SoftLink>
            <CollectionOffer style={{marginRight: '0'}}>
              <img 
                src='/static/img/marketplace/profile.png' 
                height={'15px'} 
                width={'15px'}
                onMouseOver={(e) =>
                  (e.currentTarget.src = '/static/img/marketplace/profile_hover.png')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.src = '/static/img/marketplace/profile.png')
                }
              />
            </CollectionOffer>
          </SoftLink>
        </Link> :
        <div>
          <CollectionOffer style={{marginRight: '0'}}>
            <img 
              src='/static/img/marketplace/profile.png' 
              height={'15px'} 
              width={'15px'}
              onMouseOver={(e) =>
                (e.currentTarget.src = '/static/img/marketplace/profile_hover.png')
              }
              onMouseOut={(e) =>
                (e.currentTarget.src = '/static/img/marketplace/profile.png')
              }
            />
          </CollectionOffer>
          <AccountDropDown className='dropdown'>
            <div style={{marginTop: '8px'}}>
              <MarketConnect/>
            </div>
          </AccountDropDown>
        </div>
      }
    </AccountIcon>
  )
}

export default function SiteNav({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const { account } = useEthers();
  const router = useRouter();

  let marketplace_url = 'contractSlug' in router.query ? 
  `/${router.query.contractSlug}` : 
  '/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42';

  return (
    <SiteNavElement>
      <SiteNavTopRow>
        <LogoToggleRow>
          <BrandedLogoImg
            src="/static/img/forgotten-runes-logo.png"
            className="logo"
            width="360"
            height="118"
          />
          <ul className={"menu toggle-menu" + (isOpen ? " active" : "")}>
            <li className="toggle">
              <a onClick={() => toggleIsOpen()}>
                <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
              </a>
            </li>
          </ul>
        </LogoToggleRow>
        <ul className={"main menu" + (isOpen ? " active" : "")}>
          <Link 
            href={marketplace_url} 
            passHref={true}
          >
            <SoftLink>
              <MenuItem className={"item"}>Marketplace</MenuItem>
            </SoftLink>
          </Link>
          <Link href={marketplace_url + '?activity=True'} passHref={true}>
            <SoftLink>
              <MenuItem className={"item"}>Activity</MenuItem>
            </SoftLink>
          </Link>
          <Link href="/about" passHref={true}>
            <SoftLink>
              <MenuItem className={"item"}>About</MenuItem>
            </SoftLink>
          </Link>
          <Link href="/faq" passHref={true}>
            <SoftLink>
              <MenuItem className={"item"}>FAQ</MenuItem>
            </SoftLink>
          </Link>
          <Profile account={account}/>
        </ul>
      </SiteNavTopRow>
    </SiteNavElement>
  );
}
