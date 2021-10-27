import React from "react";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";

const WizardMapLeaflet = dynamic(
  () => import("../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const WizardGalleryPage = ({ wizardsWithLore }: { wizardsWithLore: any }) => {
  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <WizardMapLeaflet bookOfLore={false} />
    </Layout>
  );
};

export default WizardGalleryPage;
