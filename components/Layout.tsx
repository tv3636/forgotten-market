import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import SiteNav from "./SiteNav";

type Props = {
  children?: ReactNode;
  description?: string;
  title?: string;
};

const Layout = ({
  children,
  description,
  title = "Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs"
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta name="twitter:title" content={title} key="twittertitle" />

      {description && (
        <meta property="og:description" content={description} key="ogdesc" />
      )}
      {description && (
        <meta
          name="twitter:description"
          content={description}
          key="twitterdesc"
        />
      )}

      {/* <meta property="og:image" content="image.png" /> */}
    </Head>
    <SiteNav />
    <header></header>
    {children}
    <footer></footer>
  </div>
);

export default Layout;
