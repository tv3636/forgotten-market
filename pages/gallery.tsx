import React from "react";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import client from "../lib/graphql";
import { gql } from "@apollo/client";
import { getWizardsWithLore } from "../components/Lore/loreSubgraphUtils";
import styled from "@emotion/styled";

const WizardMapLeaflet = dynamic(
  () => import("../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const Filler = styled.div`
  min-height: 100vh;
`;

const WizardGalleryPage = ({ wizardsWithLore }: { wizardsWithLore: any }) => {
  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <Filler>
        <WizardMapLeaflet bookOfLore={false} />
      </Filler>
    </Layout>
  );
};

export default WizardGalleryPage;
