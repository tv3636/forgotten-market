import Layout from "../../../components/Layout";
import { GetStaticPropsContext } from "next";
import Book from "../../../components/Lore/Book";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import {
  IndividualLorePageData,
  LorePageData,
} from "../../../components/Lore/types";
import LoreSharedLayout from "../../../components/Lore/LoreSharedLayout";
import OgImage from "../../../components/OgImage";
import dynamic from "next/dynamic";
import { IPFS_SERVER } from "../../../constants";
import productionWizardData from "../../../data/nfts-prod.json";
import { flatMap } from "lodash";
import {
  getCurrentWizardData,
  getPreAndNextPageRoutes,
} from "../../../components/Lore/loreSubgraphUtils";

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
  const wizardName = wizData[wizardId.toString()].name;
  return (
    <Layout>
      <OgImage
        title={`The Lore of ${wizardName} (#${wizardId})`}
        wizard={wizardId}
      />
      <LoreSharedLayout>
        <Book wizardNum={wizardNum} lorePageData={lorePageData} />
      </LoreSharedLayout>
      <WizardMapLeaflet wizardLore={{}} bookOfLore={true} />
    </Layout>
  );
};

async function fetchLoreMetadata(loreMetadataURI: string | null): Promise<any> {
  if (!loreMetadataURI) return null;

  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;
  console.log("ipfsURL: ", ipfsURL);

  if (!ipfsURL || ipfsURL === "undefined") {
    return null;
  }

  //TODO: retries?
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
  let { previousPageRoute, nextPageRoute } = await getPreAndNextPageRoutes(
    wizardNum,
    pageNum,
    leftPageGraphData,
    rightPageGraphData
  );
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
        loreTokens(orderBy: tokenId) {
          tokenContract
          tokenId
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

  console.log(data);

  //Note: its so annoying NextJs doesn't let you pass extra data to getStaticProps so now we fetch inside there too sigh... https://github.com/vercel/next.js/discussions/11272
  const paths = flatMap(data.loreTokens, (loreTokenData: any) => {
    return (loreTokenData?.lore ?? []).map((loreData: any, index: number) => {
      return {
        params: {
          wizardId: loreTokenData.tokenId,
          page: (index % 2 === 0 ? index : index + 1).toString(),
        },
      };
    });
  });

  return {
    paths: paths,
    fallback: "blocking",
  };
}

export default LorePage;

// https://og.forgottenrunes.com/6001.png?wizard=6001&fontSize=128px
