import dynamic from "next/dynamic";
import React from "react";
import Layout from "../components/Layout";

const DynamicGameRoot = dynamic(() => import("../game/GameRoot"), {
  ssr: false
});

const IndexPage = () => (
  <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <DynamicGameRoot />
  </Layout>
);

export default IndexPage;
