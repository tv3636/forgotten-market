import Layout from "../../../components/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Book from "../../../components/Lore/Book";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";

const LorePage = ({lore}) => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  return (
    <Layout>
      <Book wizardId={wizardId as string} page={page as string} />
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
    `,
  });

  return {
    props: {
      wizardId: context?.query?.wizardId,
      page: context?.query?.page,
      lore: data.wizard?.lore ?? [],
    },
  };
}
export default LorePage;
