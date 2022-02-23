import * as React from "react";
import styled from "@emotion/styled";
import { ResponsivePixelImg } from "./ResponsivePixelImg";

type Props = {};

const FooterWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 30px 30px 20px 30px;
  color: white;
  background-color: #0b060e;

  & > * {
    flex: 1 100%;
  }

  .logo {
    max-width: 200px;
  }

  .footer__addr {
    margin-right: 1.25em;
    margin-bottom: 2em;

    align-items: center;
    justify-content: center;
    display: flex;
  }

  .footer__logo {
    font-weight: 400;
    text-transform: lowercase;
    font-size: 1.5rem;
  }

  .footer__addr h2 {
    margin-top: 1.3em;
    font-size: 15px;
    font-weight: 400;
  }

  .nav__title {
    font-weight: 400;
    font-size: 15px;
  }

  .footer address {
    font-style: normal;
    color: #999;
  }

  .footer__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    max-width: max-content;
    background-color: rgb(33, 33, 33, 0.07);
    border-radius: 100px;
    color: #2f2f2f;
    line-height: 0;
    margin: 0.6em 0;
    font-size: 1rem;
    padding: 0 1.3em;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    line-height: 2em;
  }

  a {
    text-decoration: none;
  }

  .footer__nav {
    display: flex;
    flex-flow: row wrap;
  }

  .footer__nav > * {
    flex: 1 50%;
    margin-right: 1.25em;
  }

  .nav__ul a {
    color: #999;
  }

  .nav__ul--extra {
    column-count: 2;
    column-gap: 1.25em;
  }

  .legal {
    display: flex;
    flex-wrap: wrap;
    color: #999;
  }

  .legal__links {
    display: flex;
    align-items: center;
  }

  .heart {
    color: #2f2f2f;
  }

  .discord-widget {
    display: none;
  }

  @media screen and (min-width: 24.375em) {
    .legal .legal__links {
      margin-left: auto;
    }
  }

  @media screen and (min-width: 40.375em) {
    .discord-widget {
      display: block;
    }

    .footer__nav > * {
      flex: 1;
    }

    .nav__item--extra {
      flex-grow: 2;
    }

    .footer__addr {
      flex: 1 0px;
    }

    .footer__nav {
      flex: 2 0px;
    }
  }
`;

export default function Footer({}: Props) {
  return (
    <FooterWrapper>
      <div className="footer__addr">
        <ResponsivePixelImg
          src="/static/img/forgotten-runes-logo.png"
          className="logo"
          width="360"
          height="118"
        />

        {/* <h2>Contact</h2> */}
        {/* <address>
          5534 Somewhere In. The World 22193-10212
          <br />
          <a className="footer__btn" href="mailto:example@gmail.com">
            Email Us
          </a>
        </address> */}
      </div>
      <ul className="footer__nav">
        <li className="nav__item">
          <h2 className="nav__title">Social</h2>
          <ul className="nav__ul">
            <li>
              <a href="https://opensea.io/collection/forgottenruneswizardscult">
                OpenSea
              </a>
            </li>
            <li>
              <a href="https://twitter.com/forgottenrunes">Twitter</a>
            </li>
            <li>
              <a href="https://www.instagram.com/forgotten_runes/">Instagram</a>
            </li>
            <li>
              <a href="https://discord.gg/forgottenrunes">Discord</a>
            </li>
            <li>
              <a href="https://soundcloud.com/forgottenrunes">
                Soundcloud (AmAs)
              </a>
            </li>
          </ul>
        </li>
        <li className="nav__item nav__item--extra">
          <h2 className="nav__title">Resources</h2>
          <ul className="nav__ul nav__ul--extra">
            <li className="item">
              <a href="https://forgottenrunes.com" target="_blank">The Secret Tower</a>
            </li>
            <li className="item">
              <a href="https://forgottenrunes.com/wtf" target="_blank">
                wtf?
              </a>
            </li>

            <li className="item">
              <a href="https://forgottenrunes.com/lore" target="_blank">
                Book of Lore
              </a>
            </li>

            <li className="item">
              <a href="https://forgottenrunes.com/map" target="_blank">
                Map
              </a>
            </li>

            <li className="item">
              <a href="https://forgottenrunes.com/gallery" target="_blank">
                All Wizards
              </a>
            </li>

            <li className="item">
              <a href="https://forgottenrunes.com/posts" target="_blank">
                Blog
              </a>
            </li>
          </ul>
        </li>
        <li className="nav__item">
          <iframe
            src="https://discord.com/widget?id=853432452181262346&theme=dark"
            width="350"
            height="200"
            frameBorder={0}
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            className="discord-widget"
          ></iframe>

          {/* <h2 className="nav__title">Legal</h2>
          <ul className="nav__ul">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Use</a>
            </li>
            <li>
              <a href="#">Sitemap</a>
            </li>
          </ul> */}
        </li>
      </ul>
      <div className="legal">
        <p>&nbsp;</p>
        {/* <div className="legal__links">
          <span>
            Made with magic
          </span>
        </div> */}
      </div>
    </FooterWrapper>
  );
}
