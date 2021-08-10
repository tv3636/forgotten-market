import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { ResponsivePixelImg } from "./ResponsivePixelImg";

type Props = {};

const SiteNavElement = styled.nav`
  padding: 0 15px;

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
    max-width: 256px;
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
      justify-content: center;
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

export default function SiteNav({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <SiteNavElement>
      <ul className={"menu" + (isOpen ? " active" : "")}>
        <li className="logo">
          <ResponsivePixelImg src="/static/img/forgotten-runes-logo.png" />
        </li>
        <li className="item">
          <a href="/">The Secret Tower</a>
        </li>
        <li className="item">
          <a href="/wtf">wtf?</a>
        </li>
        {/* <li className="item">
          <a href="/lore">Lore</a>
        </li> */}
        <li className="item">
          <a href="/map">Map</a>
        </li>
        {/* <li className="item">
          <a href="/blog">Blog</a>
        </li> */}
        <li className="item">
          <a
            href="https://opensea.io/collection/forgottenruneswizardscult"
            className="icon-link"
          >
            <ResponsivePixelImg src="/static/img/icons/social_opensea_default_w.png" />
          </a>
        </li>
        <li className="item">
          <a href="https://twitter.com/forgottenrunes" className="icon-link">
            <ResponsivePixelImg src="/static/img/icons/social_twitter_default_w.png" />
          </a>
        </li>
        <li className="item">
          <a
            href="https://www.instagram.com/forgotten_runes/"
            className="icon-link"
          >
            <ResponsivePixelImg src="/static/img/icons/social_ig_default_w.png" />
          </a>
        </li>
        <li className="item">
          <a href="https://discord.gg/forgottenrunes" className="icon-link">
            <ResponsivePixelImg src="/static/img/icons/social_discord_default_w.png" />
          </a>
        </li>

        <li className="toggle">
          <a onClick={() => toggleIsOpen()}>
            <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
          </a>
        </li>
      </ul>
    </SiteNavElement>
  );
}
