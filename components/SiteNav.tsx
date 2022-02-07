import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
import Link from "next/link";

type Props = {};

const SiteNavElement = styled.nav`
  font-family: "Roboto Mono", system-ui, -apple-system, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 15px;

  li.highlighted a {
    background-color: #1f200d;
    border-radius: 5px;
    padding: 5px 8px !important;
  }

  a {
    color: white;
    text-decoration: none;
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

export default function SiteNav({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

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
        <ul className={"menu" + (isOpen ? " active" : "")}>
          <li className="item">
            <a
              href="https://opensea.io/collection/forgottenruneswizardscult"
              className="icon-link"
            >
              <ResponsivePixelImg src="/static/img/icons/nav/opensea_default.png" />
            </a>
          </li>
          <li className="item">
            <a href="https://twitter.com/forgottenrunes" className="icon-link">
              <ResponsivePixelImg src="/static/img/icons/nav/twitter_default.png" />
            </a>
          </li>
          <li className="item">
            <a
              href="https://www.instagram.com/forgotten_runes/"
              className="icon-link"
            >
              <ResponsivePixelImg src="/static/img/icons/nav/ig_default.png" />
            </a>
          </li>
          <li className="item">
            <a href="https://discord.gg/forgottenrunes" className="icon-link">
              <ResponsivePixelImg src="/static/img/icons/nav/discord_default.png" />
            </a>
          </li>
        </ul>
      </SiteNavTopRow>
      <SiteNavRow>
        <ul className={"menu" + (isOpen ? " active" : "")}>
          <li className="item">
            <a href="/">The Secret Tower</a>
          </li>
          <li className="item">
            <Link as={"/wtf"} href={"/wtf"} passHref={true}>
              Start Here
            </Link>
          </li>

          <li className="item">
            <Link as={"/lore"} href={"/lore"} passHref={true}>
              <a>Book of Lore</a>
            </Link>
          </li>

          <li className="item">
            <Link as={"/map"} href={"/map"} passHref={true}>
              <a>Map</a>
            </Link>
          </li>

          <li className="item">
            <Link as={"/gallery"} href={"/gallery"} passHref={true}>
              <a>All Wizards</a>
            </Link>
          </li>

          <li className="item">
            <Link as={"/posts"} href={"/posts"} passHref={true}>
              <a>Blog</a>
            </Link>
          </li>

          <li className="item">
            <Link as={"/marketplace/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42"} href={"/marketplace/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42"} passHref={true}>
              <a>Marketplace</a>
            </Link>
          </li>
        </ul>
      </SiteNavRow>
    </SiteNavElement>
  );
}
