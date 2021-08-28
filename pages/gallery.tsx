import React from "react";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import client from "../lib/graphql";
import { gql } from "@apollo/client";

const WizardMapLeaflet = dynamic(
  () => import("../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const WizardGalleryPage = ({ wizardLore }: { wizardLore: object }) => {
  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <WizardMapLeaflet wizardLore={wizardLore} />
    </Layout>
  );
};

export async function getStaticProps() {
  // const { data } = await client.query({
  //   query: gql`
  //     query Lore {
  //       wizards {
  //         id
  //       }
  //     }
  //   `
  // });

  // // Note: due to the way we index our subgraph we assume existence of wizard = has lore (yes, edge case if wizard only has struck lore etc)
  // const wizardLore = data.wizards.reduce(
  //   (acc: object, { id }: { id: string }) => ({
  //     ...acc,
  //     [parseInt(id)]: true
  //   }),
  //   {}
  // );

  const wizardLore = {};

  return {
    props: {
      wizardLore
    },
    revalidate: 60 * 30 //30 mins
  };
}

export default WizardGalleryPage;
