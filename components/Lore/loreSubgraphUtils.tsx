import client from "../../lib/graphql";
import { gql } from "@apollo/client";

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

export const GRAPH_ID_MATCHER = /^((?:0x).*)-(\d+)-(\d+)$/;

export const NORMALIZED_WIZARD_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS?.toLowerCase();

function getWizardLoreId(wizardNum: number, loreIndex: number) {
  return `${NORMALIZED_WIZARD_CONTRACT_ADDRESS}-${wizardNum
    .toString()
    .padStart(10, "0")}-${loreIndex.toString().padStart(10, "0")}`;
}

export async function getPreviousAndNextPageData(
  wizardNum: number,
  leftPageData: any,
  rightPageData: any
) {
  let queryString = "";

  // Add previous page if we in middle of book
  if (leftPageData) {
    queryString = `${queryString}
      prevRightPage: lores(first: 1, where: {id_lt: "${leftPageData.id}", struck: false, nsfw: false}, orderBy: id, orderDirection:desc) {
        id
      }
    `;
  } else {
    queryString = `${queryString}
      prevRightPage: lores(first: 1, where: {id_lt: "${getWizardLoreId(
        wizardNum,
        0
      )}", struck: false, nsfw: false}, orderBy: id, orderDirection:desc) {
        id
      }
    `;
  }

  if (rightPageData) {
    queryString = `${queryString}
      nextLeftPage: lores(first: 1, where: {id_gt: "${rightPageData.id}", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        id
      }
    `;
  } else if (leftPageData) {
    queryString = `${queryString}
      nextLeftPage: lores(first: 1, where: {id_gt: "${leftPageData.id}", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        id
      }
    `;
  } else {
    queryString = `${queryString}
      nextLeftPage: lores(first: 1, where: {id_gt: "${getWizardLoreId(
        wizardNum,
        0
      )}", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        id
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

  const nextLeftPageData = prevAndNextPageData?.nextLeftPage?.[0] ?? null;
  const prevRightPageData = prevAndNextPageData?.prevRightPage?.[0] ?? null;

  let previousWizardPageCount = 0;

  if (prevRightPageData) {
    // get previous wiz page count we can figure out the page number
    const prevRightPageWizardNum = parseInt(
      prevRightPageData.id.match(GRAPH_ID_MATCHER)[2] ?? "0"
    );

    if (prevRightPageWizardNum !== wizardNum) {
      const { data: prevWizardPageCount } = await client.query({
        query: gql`
            query WizardLore {
                lores( where: {tokenId: "${prevRightPageWizardNum}", tokenContract: "${NORMALIZED_WIZARD_CONTRACT_ADDRESS}", struck: false, nsfw: false}) {
                    id
                }
            }
        `,
      });

      previousWizardPageCount = (prevWizardPageCount?.lores ?? []).length;
    }
  }

  // console.log({
  //   nextLeftPageGraphData: nextLeftPageData,
  //   prevRightPageGraphData: prevRightPageData,
  //   previousWizardPageCount,
  // });
  return {
    nextLeftPageGraphData: nextLeftPageData,
    prevRightPageGraphData: prevRightPageData,
    previousWizardPageCount,
  };
}

export async function getCurrentWizardData(
  rightPageNum: number,
  wizardNum: number,
  leftPageNum: number
) {
  let currentWizAndPagequeryString = `
      rightPage: lores(skip: ${rightPageNum}, first: 1, orderBy: id, orderDirection: asc, where: {tokenId: "${wizardNum}", tokenContract: "${NORMALIZED_WIZARD_CONTRACT_ADDRESS}", struck: false, nsfw: false}) {
        ${COMMON_LORE_FIELDS}
      }
  `;

  // Add left page to query unless we on very first page (instead wiz is shown)
  if (leftPageNum >= 0) {
    currentWizAndPagequeryString = `${currentWizAndPagequeryString}
         leftPage: lores(skip: ${leftPageNum}, first: 1, orderBy: id, orderDirection: asc, where: {tokenId: "${wizardNum}", tokenContract: "${NORMALIZED_WIZARD_CONTRACT_ADDRESS}", struck: false, nsfw: false}) {
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

  return {
    leftPageGraphData: currentWizLoreData?.leftPage?.[0] ?? null,
    rightPageGraphData: currentWizLoreData?.rightPage?.[0] ?? null,
  };
}

export async function getPreAndNextPageRoutes(
  wizardNum: number,
  pageNum: number,
  leftPageGraphData: any,
  rightPageGraphData: any
) {
  const {
    nextLeftPageGraphData,
    prevRightPageGraphData,
    previousWizardPageCount,
  } = await getPreviousAndNextPageData(
    wizardNum,
    leftPageGraphData,
    rightPageGraphData
  );

  // Figure out previous route
  let previousPageRoute = null;
  if (prevRightPageGraphData) {
    // Previous page could be this wizards or previous wizard's last
    const previousIdMatcher = prevRightPageGraphData.id.match(GRAPH_ID_MATCHER);
    const previousPageWizNum = parseInt(previousIdMatcher?.[2] ?? "0");
    const previousPagePageNum =
      previousPageWizNum === wizardNum
        ? pageNum - 2
        : previousWizardPageCount > 0
        ? previousWizardPageCount - 1
        : 0;
    previousPageRoute = `/lore/${previousPageWizNum}/${previousPagePageNum}`;
  }

  // Figure out next route
  let nextPageRoute = null;
  if (nextLeftPageGraphData) {
    const nextIdMatcher = nextLeftPageGraphData.id.match(GRAPH_ID_MATCHER);
    const nextPageWizNum = parseInt(nextIdMatcher?.[2] ?? "0");
    const nextPagePageNum = nextPageWizNum === wizardNum ? pageNum + 2 : 0;
    nextPageRoute = `/lore/${nextPageWizNum}/${nextPagePageNum}`;
  }
  return { previousPageRoute, nextPageRoute };
}
