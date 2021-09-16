import Layout from "../../../components/Layout";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import Book from "../../../components/Lore/Book";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import {
  IndividualLorePageData,
  LorePageData,
} from "../../../components/Lore/types";
import LoreSharedLayout from "../../../components/Lore/LoreSharedLayout";
import dynamic from "next/dynamic";
import { IPFS_SERVER } from "../../../constants";
import productionWizardData from "../../../data/nfts-prod.json";
import { flatMap } from "lodash";
const wizData = productionWizardData as { [wizardId: string]: any };

const WizardMapLeaflet = dynamic(
  () => import("../../../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const LorePage = ({
  wizardNum,
  lorePageData,
}: {
  wizardNum: number;
  lorePageData: LorePageData;
}) => {
  return (
    <Layout>
      <LoreSharedLayout>
        <Book wizardNum={wizardNum} lorePageData={lorePageData} />
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

async function getPreviousAndNextPagedata(
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
      prevRightPage: lores(first: 1, where: {id_lt: "wizards-${wizardNum
        .toString()
        .padStart(
          5,
          "0"
        )}-0000", struck: false, nsfw: false}, orderBy: id, orderDirection:desc) {
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
      nextLeftPage: lores(first: 1, where: {id_gt: "wizards-${wizardNum
        .toString()
        .padStart(
          5,
          "0"
        )}-0000", struck: false, nsfw: false}, orderBy: id, orderDirection:asc) {
        id
      }
    `;
  }

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
      prevRightPageData.id.match(/^(\d+)-(\d+)$/) ?? "0"
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
  return {
    nextLeftPageGraphData: nextLeftPageData,
    prevRightPageGraphData: prevRightPageData,
    previousWizardPageCount,
  };
}

async function getCurrentWizardData(
  rightPageNum: number,
  wizardNum: number,
  leftPageNum: number
) {
  let currentWizAndPagequeryString = `
      rightPage: lores(skip: ${rightPageNum}, first: 1, orderBy: id, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
        ${COMMON_LORE_FIELDS}
      }
  `;

  // Add left page to query unless we on very first page (instead wiz is shown)
  if (leftPageNum >= 0) {
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

  return {
    leftPageGraphData: currentWizLoreData?.leftPage?.[0] ?? null,
    rightPageGraphData: currentWizLoreData?.rightPage?.[0] ?? null,
  };
}

async function fetchLoreMetadata(loreMetadataURI: string | null): Promise<any> {
  if (!loreMetadataURI) return null;

  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;
  console.log("ipfsURL: ", ipfsURL);

  if (!ipfsURL || ipfsURL === "undefined") {
    return null;
  }

  return await fetch(ipfsURL).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      console.error("Bad IPFS request: " + res.statusText);
      return {};
    }
  });
}

async function hydratePageDataFromMetadata(
  loreMetadataURI: string
): Promise<IndividualLorePageData> {
  const metadata = await fetchLoreMetadata(loreMetadataURI);

  return {
    isEmpty: false,
    bgColor: metadata?.background_color ?? "black",
    title: metadata?.name ?? "Untitled",
    story: metadata?.description ?? "",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const wizardNum: number = parseInt(
    (context.params?.wizardId as string) ?? "0"
  );
  const pageNum: number = parseInt((context.params?.page as string) ?? "0");

  console.log(wizardNum);
  console.log(pageNum);

  if (pageNum % 2 !== 0) {
    // We always key from right page, so redirect...
    return {
      redirect: {
        destination: `/lore/${wizardNum}/${pageNum + 1}`,
      },
    };
  }

  const leftPageNum = pageNum - 1;
  const rightPageNum = pageNum;

  const { leftPageGraphData, rightPageGraphData } = await getCurrentWizardData(
    rightPageNum,
    wizardNum,
    leftPageNum
  );

  if (leftPageNum >= 1 && !leftPageGraphData && !rightPageGraphData) {
    // Trying to open lore pages that don't exist for wizard, go to 0th lore for now (yes later could be fancy and figure out last page that does exist if any etc)
    return {
      redirect: {
        destination: `/lore/${wizardNum}/0`,
      },
      revalidate: 2,
    };
  }

  const {
    nextLeftPageGraphData,
    prevRightPageGraphData,
    previousWizardPageCount,
  } = await getPreviousAndNextPagedata(
    wizardNum,
    leftPageGraphData,
    rightPageGraphData
  );

  let leftPage: IndividualLorePageData;

  if (leftPageGraphData) {
    leftPage = await hydratePageDataFromMetadata(
      leftPageGraphData.loreMetadataURI
    );
  } else {
    // Would end up showing wizard
    leftPage = {
      isEmpty: true,
      bgColor: `#${wizData[wizardNum.toString()].background_color}`,
    };
  }
  leftPage.pageNumber = leftPageNum;

  let rightPage: IndividualLorePageData;

  if (rightPageGraphData) {
    rightPage = await hydratePageDataFromMetadata(
      rightPageGraphData.loreMetadataURI
    );
  } else {
    // Would end showing add lore
    rightPage = {
      isEmpty: true,
      bgColor: "black",
    };
  }
  rightPage.pageNumber = rightPageNum;

  // Figure out previous route
  let previousPageRoute = null;
  if (prevRightPageGraphData) {
    // Previous page could be this wizards or previous wizard's last
    const previousIdMatcher = prevRightPageGraphData.id.match(
      /^wizards-(\d+)-(\d+)$/
    );
    const previousPageWizNum = parseInt(previousIdMatcher?.[1] ?? "0");
    const previousPagePageNum =
      previousPageWizNum === wizardNum
        ? leftPageNum - 1
        : previousWizardPageCount > 0
        ? previousWizardPageCount - 1
        : 0;
    previousPageRoute = `/lore/${previousPageWizNum}/${previousPagePageNum}`;
  }

  // Figure out next route
  let nextPageRoute = null;
  if (nextLeftPageGraphData) {
    const nextIdMatcher = nextLeftPageGraphData.id.match(
      /^wizards-(\d+)-(\d+)$/
    );
    const nextPageWizNum = parseInt(nextIdMatcher?.[1] ?? "0");
    const nextPagePageNum = nextPageWizNum === wizardNum ? pageNum + 2 : 0;
    nextPageRoute = `/lore/${nextPageWizNum}/${nextPagePageNum}`;
  }
  console.log({
    leftPage,
    rightPage,
    previousPageRoute,
    nextPageRoute,
  });
  return {
    props: {
      wizardNum,
      lorePageData: {
        leftPage,
        rightPage,
        previousPageRoute,
        nextPageRoute,
      },
    },
    revalidate: 2,
  };
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query WizardLore {
        wizards(orderBy: id) {
          id
          lore(
            where: { struck: false, nsfw: false }
            orderBy: id
            orderDirection: asc
          ) {
            id
          }
        }
      }
    `,
  });

  //Note: its so annoying NextJs doesn't let you pass extra data to getStaticProps so now we fetch inside there too sigh... https://github.com/vercel/next.js/discussions/11272
  const paths = flatMap(data.wizards, (wizardData: any) => {
    return (wizardData?.lore ?? []).map((loreData: any, index: number) => {
      return {
        params: {
          wizardId: wizardData.id,
          page: (index % 2 === 0 ? index : index + 1).toString(),
        },
      };
    });
  });
  // paths.filter((path) => parseInt(path.page) % 2 === 0); //TODO: this omits final lore page if its only left
  // console.log(paths);
  return {
    paths: paths,
    fallback: "blocking",
  };
}

export default LorePage;

// https://og.forgottenrunes.com/6001.png?wizard=6001&fontSize=128px
