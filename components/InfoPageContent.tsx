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
  padding: 2em 2em;
  color: rgb(172 167 185);

  display: flex;
  justify-content: center;

  a {
    color: #a983ff;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: "Alagard", system-ui, -apple-system, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    line-height: 1.2em;
  }
  h1 {
    margin-top: 1.5em;
  }
  h2 {
    margin-top: 1.3em;
  }
  h3 {
    margin-top: 1em;
  }

  .content {
    width: 100%;
    max-width: 800px;
    line-height: 1.4em;
    p {
      line-height: 1.6em;
    }
  }

  p img {
    margin: 0.5em auto;
    width: 100%;
  }
`;

const InfoPageLayout = ({ children }: Props) => (
  <AboutWrapper>
    <div className="content">{children}</div>
  </AboutWrapper>
);

export default InfoPageLayout;
