import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import SiteNav from "./SiteNav";
import Layout from "./Layout";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
import InfoPageContent from "./InfoPageContent";

type Props = {
  children?: ReactNode;
  title?: string;
  headerImgUrl?: string;
  description?: string;
};

const InfoPageLayout = ({
  children,
  headerImgUrl,
  description,
  title = "Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs"
}: Props) => (
  <Layout title={title} description={description}>
    {headerImgUrl && <ResponsivePixelImg src={headerImgUrl} />}
    <InfoPageContent>{children}</InfoPageContent>
  </Layout>
);

export default InfoPageLayout;
