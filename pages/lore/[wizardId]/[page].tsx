import Layout from "../../../components/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Book from "../../../components/Lore/Book";
import LoreAnimations from "../../../components/Lore/LoreAnimations";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { WizardLorePages } from "../../../components/Lore/types";
import wizardLorePagesTestData from "../../../data/lore-test.json";

const LorePage = ({
  wizardLorePages
}: {
  wizardLorePages: WizardLorePages;
}) => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  return (
    <Layout>
      <LoreAnimations>
        <Book
          wizardId={wizardId as string}
          page={page as string}
          wizardLorePages={wizardLorePages}
        />
      </LoreAnimations>
    </Layout>
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { data } = await client.query({
    query: gql`
      query WizardLore {
        wizard(id: ${context?.query?.wizardId}) {
          id
          lore(where: { struck: false, nsfw: false }) {
            id
            creator
            assetAddress
            loreMetadataURI
            parentLoreId
            tokenId
            struck
            nsfw
          }
        }
      }
    `
  });

  const wizardId = (context?.query?.wizardId as string) || "0";
  const wizardNum = parseInt(wizardId);
  const loreData: any = wizardLorePagesTestData.data;
  const wizardLorePages = {
    previousWizardLore:
      wizardNum > 0 ? loreData[(wizardNum - 1).toString()] : null,
    currentWizardLore: loreData[wizardId],
    nextWizardLore: loreData[(wizardNum + 1).toString()] || null
  };

  return {
    props: {
      wizardId: context?.query?.wizardId,
      page: context?.query?.page,
      lore: data.wizard?.lore ?? [],
      wizardLorePages
    }
  };
}
export default LorePage;
