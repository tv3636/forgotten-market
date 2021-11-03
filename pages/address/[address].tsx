import { GetStaticPaths, GetStaticProps } from "next";
import { getProvider } from "../../hooks/useProvider";
import Layout from "../../components/Layout";
import { Flex, Text } from "rebass";
import styled from "@emotion/styled";
import * as React from "react";
import {
  HoldingsGrid,
  ResponsiveMaybePixelImg,
} from "../../components/NFTDisplay";
import { useFetchDataFromTokenUri } from "../../hooks/useMyNfts";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { SocialItem } from "../../components/Lore/BookOfLoreControls";
import { getTokenDataForAllCollections } from "../../lib/nftUtilis";

const Address = ({
  address,
  tokenData,
}: {
  address: string;
  tokenData: any;
}) => {
  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <HoldingsGrid address={address} tokenData={tokenData} />
    </Layout>
  );
};

export default Address;

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const mainProvider = getProvider(true);

  const address = params?.address as string;
  const tokenData = await getTokenDataForAllCollections(mainProvider, address);

  return {
    props: {
      address,
      tokenData: tokenData,
    },
    revalidate: 3 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async ({}) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
