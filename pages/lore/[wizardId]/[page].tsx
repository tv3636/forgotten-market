import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Book from "../../../components/Lore/Book";
import LoreAnimations from "../../../components/Lore/LoreAnimations";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { LorePageData } from "../../../components/Lore/types";
import LoreSharedLayout from "../../../components/Lore/LoreSharedLayout";

const LorePage = ({
  wizardId,
  page,
  lorePagesV2
}: {
  wizardId: string;
  page: string;
  lorePagesV2: LorePageData;
}) => {
  const router = useRouter();

  return (
    <Layout>
      <LoreSharedLayout>
        <Book wizardId={wizardId} page={page} lorePageData={lorePagesV2} />
      </LoreSharedLayout>
    </Layout>
  );
};

const COMMON_LORE_FIELDS = `
  id
  index
  creator
  assetAddress
  loreMetadataURI
  parentLoreId
  tokenId
  struck
  nsfw
  createdAtBlock
  createdAtTimestamp
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const wizardId = (context?.query?.wizardId as string) || "0";
  const wizardNum = parseInt(wizardId);
  const pageNum = parseInt((context?.query?.page as string) || "0");
  const pageIsEven = pageNum % 2 == 0;
  const leftPageNum = pageIsEven ? pageNum - 1 : pageNum;
  const rightPageNum = pageIsEven ? pageNum : pageNum + 1;

  let queryString = `
      rightPage: lores(skip: ${rightPageNum}, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
        ${COMMON_LORE_FIELDS}
      }
  `;

  // Add left page to query unless we on very first page (instead wiz is shown)
  if (leftPageNum > 0) {
    queryString = `${queryString}
         leftPage: lores(skip: ${leftPageNum}, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
          }
     `;
  }

  // Add previous two pages if we in middle of book
  if (leftPageNum == 1) {
    queryString = `${queryString}
      prevRightPage: lores(skip: ${0}, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;
  } else if (leftPageNum > 2) {
    queryString = `${queryString}
      prevLeftPage: lores(skip: ${
        leftPageNum - 2
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
      prevRightPage: lores(skip: ${
        leftPageNum - 1
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;
  } else {
    queryString = `${queryString}
      prevLeftPage: lores(skip: 2, first: 1, orderBy: createdAtBlock, orderDirection: desc, where: {wizard: "${
        wizardNum - 1
      }", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
      prevRightPage: lores(skip: 1, first: 1, orderBy: createdAtBlock, orderDirection: desc, where: {wizard: "${
        wizardNum - 1
      }", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;
  }

  //Add next two pages
  queryString = `${queryString}
      nextLeftPage: lores(skip: ${
        rightPageNum + 1
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
      nextRightPage: lores(skip: ${
        rightPageNum + 2
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;

  // Add next first page of next wizard always (as hard to tell if we on last two pages of current wizard upfront)
  queryString = `${queryString}
      nextWizardRightPage: lores(skip: 0, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${
        wizardNum + 1
      }", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;

  if (wizardNum > 0) {
    // We need to figure out page number of last page of previous wizard, and since graph doesn't do aggregates it seems, then just fetching all
    queryString = `${queryString}
      prevWizardAllLores: lores( where: {wizard: "${
        wizardNum - 1
      }", struck: false, nsfw: false}) {
            id
      }
    `;
  }

  const { data } = await client.query({
    query: gql`
      query WizardLore {
        ${queryString}
      }
    `
  });

  // console.log(data);
  const lorePageData: LorePageData = {
    leftPage: data?.leftPage?.[0] ?? null, // If null then show wizard here (i.e. its the first page)
    rightPage: data?.rightPage?.[0] ?? null, // Could be null if wizard has no lore
    prevLeftPage: data?.prevLeftPage?.[0] ?? null, // If null then show previous wizard here
    prevRightPage: data?.prevRightPage?.[0] ?? null, // Could be null if previous wizard has no lore
    nextLeftPage: data?.nextLeftPage?.[0] ?? null,
    nextRightPage: data?.nextRightPage?.[0] ?? null,
    //  If both next left and next right are null then you know nextLeft is wizard+1 and and nextRight is below
    nextWizardRightPage: data?.nextWizardRightPage?.[0] ?? null,
    prevWizardPageCount: (data?.prevWizardAllLores ?? []).length
  };
  console.log(lorePageData);

  //TODO: update test data with above
  //const loreData: any = wizardLorePagesTestData.data;

  return {
    props: {
      wizardId: context?.query?.wizardId,
      page: leftPageNum >= 1 ? leftPageNum : 0,
      lore: data.wizard?.lore ?? [],
      lorePagesV2: lorePageData
    }
  };
}
export default LorePage;
