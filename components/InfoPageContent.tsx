import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import SiteNav from "./SiteNav";
import styled from "@emotion/styled";

type Props = {
  children?: ReactNode;
};

const AboutWrapper = styled.div`
  padding: 2em 2em;
  color: rgb(172 167 185);

  display: flex;
  justify-content: center;

  .content {
    width: 100%;
    max-width: 800px;
    line-height: 1.4em;
    p {
      line-height: 1.6em;
    }
  }

  p img {
    margin: 0 auto;
    width: 100%;
  }
`;

const InfoPageLayout = ({ children }: Props) => (
  <AboutWrapper>
    <div className="content">{children}</div>
  </AboutWrapper>
);

export default InfoPageLayout;
