import React from "react";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";

const WizardMapLeaflet = dynamic(
  () => import("../components/Lore/WizarMapLeaflet"),
  { ssr: false }
);

const WizardGalleryPage = () => {
  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <WizardMapLeaflet />
    </Layout>
  );
};

export default WizardGalleryPage;
