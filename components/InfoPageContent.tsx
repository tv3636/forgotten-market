import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import SiteNav from "./SiteNav";
import styled from "@emotion/styled";

type Props = {
  children?: ReactNode;
};

const AboutWrapper = styled.div`
  min-height: 95vh;
  color: #e2ded6;

  /* display: flex; */
  /* justify-content: center; */

  display: grid;
  grid-template-columns: 1fr min(60ch, calc(100% - 32px)) 1fr;
  grid-column-gap: 16px;
  grid-auto-rows: max-content;

  & > * {
    grid-column: 2;
  }

  .full-bleed {
    width: 100%;
    grid-column: 1 / 4;
  }

  a {
    color: #e2ded6;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    line-height: 1.2em;
  }

  h1 {
    margin-top: 1.5em;
    font-size: 40px;
  }
  h2 {
    margin-top: 1.3em;
    font-size: 32px;
  }
  h3 {
    margin-top: 1em;
    font-size: 26px;
  }
  h4 {
    margin-top: 1em;
    font-size: 22px;
  }

  line-height: 1.4em;
  font-size: 19px;

  p {
    line-height: 1.6em;
    font-size: 19px;
    margin-top: 0;
    margin-bottom: 32px;

    img {
      margin: 0.5em auto;
      width: 100%;
      border-radius: 3px;
    }
  }

  blockquote {
    background-color: #ffffff1f;
    margin: 0;
    padding: 12px 20px;
    border-radius: 5px;
    font-size: 1em;
    margin-bottom: 1em;

    p:first-child {
      margin-top: 1em;
    }
    p:last-child {
      font-size: 1em;
      margin-bottom: 1em;
    }
  }

  li {
    line-height: 1.8em;
  }

  hr {
    width: 100%;
    border-color: #ffffff63;
    grid-column: 1 / 4;
  }

  code {
    background-color: hsl(262deg 20% 16%);
    padding: 2px 4px;
    border-radius: 2px;
    margin: -2px 0px;
  }

  .embed-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;

    iframe,
    object,
    embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

const InfoPageLayout = ({ children }: Props) => (
  <AboutWrapper>
    {/* <div className="content">{children}</div> */}
    {children}
  </AboutWrapper>
);

export default InfoPageLayout;
