import Layout from "../../../components/Layout";
import { GetServerSidePropsContext } from "next";
import Book from "../../../components/Lore/Book";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { LorePageData } from "../../../components/Lore/types";
import LoreSharedLayout from "../../../components/Lore/LoreSharedLayout";
import dynamic from "next/dynamic";

const WizardMapLeaflet = dynamic(
  () => import("../../../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const LorePage = ({
  wizardId,
  page,
  lorePages,
}: {
  wizardId: string;
  page: string;
  lorePages: LorePageData;
}) => {
  return (
    <Layout>
      <LoreSharedLayout>
        <Book wizardId={wizardId} page={page} lorePageData={lorePages} />
      </LoreSharedLayout>
      <WizardMapLeaflet wizardLore={{}} bookOfLore={true} />
    </Layout>
  );
};

const COMMON_LORE_FIELDS = `
  id
  index
  creator
  tokenContract
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

  let currentWizAndPagequeryString = `
      rightPage: lores(skip: ${rightPageNum}, first: 1, orderBy: id, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
        ${COMMON_LORE_FIELDS}
      }
  `;

  // Add left page to query unless we on very first page (instead wiz is shown)
  if (leftPageNum > 0) {
    currentWizAndPagequeryString = `${currentWizAndPagequeryString}
         leftPage: lores(skip: ${leftPageNum}, first: 1, orderBy: id, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
          }
     `;
  }

  const { data: currentWizLoreData } = await client.query({
    query: gql`
      query WizardLore {
        ${currentWizAndPagequeryString}
      }
    `,
  });

  if (
    leftPageNum >= 1 &&
    !currentWizLoreData?.leftPage?.[0] &&
    !currentWizLoreData?.rightPage?.[0]
  ) {
    // Trying to open lore pages that don't exist for wizard, go to 0th lore for now (yes later could be fancy and figure out last page that does exist if any etc)
    return {
      redirect: {
        destination: `/lore/${wizardId}/0`,
      },
    };
  }

  const leftPageData: { [key: string]: string } =
    currentWizLoreData?.leftPage?.[0] ?? null;
  const rightPageData: { [key: string]: string } =
    currentWizLoreData?.rightPage?.[0] ?? null;

  let queryString = "";

  // Add previous two pages if we in middle of book
  if (leftPageData) {
    queryString = `${queryString}
      prevRightPage: lores(first: 1, where: {id_lt: "${leftPageData.id}", struck: false, nsfw: false}, orderBy: id, orderDirection:desc) {
        ${COMMON_LORE_FIELDS}
      }
    `;
  } else {
    queryString = `${queryString}
      prevRightPage: lores(first: 1, where: {id_lt: "wizards-${wizardId.padStart(
        5,
        "0"
      )}-0000", struck: false, nsfw: false}, orderBy: id, orderDirection:desc) {
        ${COMMON_LORE_FIELDS}
      }
    `;
  }

  if (rightPageData) {
    queryString = `${queryString}
      nextLeftPage: lores(first: 1, where: {id_gt: "${rightPageData.id}", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        ${COMMON_LORE_FIELDS}
      }
    `;
  } else if (leftPageData) {
    queryString = `${queryString}
      nextLeftPage: lores(first: 1, where: {id_gt: "${leftPageData.id}", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        ${COMMON_LORE_FIELDS}
      }
    `;
  } else {
    queryString = `${queryString}
      nextLeftPage: lores(first: 1, where: {id_gt: "wizards-${wizardId.padStart(
        5,
        "0"
      )}-0000", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        ${COMMON_LORE_FIELDS}
      }
    `;
  }

  // console.log(queryString);

  const { data: prevAndNextPageData } = await client.query({
    query: gql`
      query WizardLore {
        ${queryString}
      }
    `,
  });

  const prevRightPage = prevAndNextPageData?.prevRightPage?.[0] ?? null;
  let previousWizardPageCount = 0;

  if (prevRightPage) {
    // get previous wiz page count
    const prevRightPageWizardNum = parseInt(
      prevRightPage.id.match(/^(\d+)-(\d+)$/) ?? "0"
    );

    if (prevRightPageWizardNum !== wizardNum) {
      const { data: prevWizardPageCount } = await client.query({
        query: gql`
          query WizardLore {
            lores( where: {wizard: "${prevRightPageWizardNum}", struck: false, nsfw: false}) {
              id
            }
          }
      `,
      });

      previousWizardPageCount = (prevWizardPageCount?.lores ?? []).length;
    }
  }

  const lorePageData: LorePageData = {
    leftPage: leftPageData, // If null then show wizard here (i.e. its the first page)
    rightPage: rightPageData, // Could be null if wizard has no lore
    prevRightPage: prevRightPage, // Could be null if previous wizard has no lore
    nextLeftPage: prevAndNextPageData?.nextLeftPage?.[0] ?? null,
    prevWizardPageCount: previousWizardPageCount,
  };
  console.log(lorePageData);

  //TODO: update test data with above
  //const loreData: any = wizardLorePagesTestData.data;

  return {
    props: {
      wizardId: context?.query?.wizardId,
      page: leftPageNum >= 1 ? leftPageNum : 0,
      lorePages: lorePageData,
    },
  };
}
export default LorePage;

// https://og.forgottenrunes.com/6001.png?wizard=6001&fontSize=128px
