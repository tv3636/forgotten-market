import Layout from "../../../../components/Layout";
import { GetStaticPropsContext } from "next";
import Book from "../../../../components/Lore/Book";
import client from "../../../../lib/graphql";
import { gql } from "@apollo/client";
import {
  IndividualLorePageData,
  LorePageData,
} from "../../../../components/Lore/types";
import LoreSharedLayout from "../../../../components/Lore/LoreSharedLayout";
import OgImage from "../../../../components/OgImage";
import dynamic from "next/dynamic";
import { IPFS_SERVER } from "../../../../constants";
import productionWizardData from "../../../../data/nfts-prod.json";
import { flatMap } from "lodash";
import {
  getCurrentWizardData,
  getPreAndNextPageRoutes,
} from "../../../../components/Lore/loreSubgraphUtils";
import { LORE_CONTRACTS } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { getLoreUrl } from "../../../../components/Lore/loreUtils";
import { promises as fs } from "fs";
import path from "path";

const wizData = productionWizardData as { [wizardId: string]: any };

const WizardMapLeaflet = dynamic(
  () => import("../../../../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const LorePage = ({
  loreTokenSlug,
  tokenId,
  lorePageData,
}: {
  loreTokenSlug: string;
  tokenId: number;
  lorePageData: LorePageData;
}) => {
  const og = loreTokenSlug === "wizards" && (
    <OgImage
      title={`The Lore of ${wizData[tokenId.toString()].name} #${tokenId})`}
      wizard={tokenId}
    />
  );

  return (
    <Layout>
      {og}
      <LoreSharedLayout>
        <Book
          loreTokenSlug={loreTokenSlug}
          tokenId={tokenId}
          lorePageData={lorePageData}
        />
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
  // console.log("ipfsURL: ", ipfsURL);

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
    bgColor: metadata?.background_color ?? "#000000",
    title: metadata?.name ?? "Untitled",
    story: metadata?.description ?? "",
  };
}

const NARRATIVE_DIR = path.join(process.cwd(), "posts", "narrative");

async function getNarrativePageData(pageNum: number, loreTokenSlug: string) {
  const leftPageNum = pageNum;
  const rightPageNum = pageNum + 1; // with lore e.g. 0 will be on the left unlike with wizards etc
  const fileExists = async (path: string) => {
    return !!(await fs.stat(path).catch((e: any) => false));
  };

  const leftNarrativeFileName = path.join(
    NARRATIVE_DIR,
    leftPageNum.toString() + ".md"
  );

  if (!(await fileExists(leftNarrativeFileName))) {
    console.log("no exist: " + leftNarrativeFileName);
    return {
      redirect: {
        destination: getLoreUrl("narrative", 0, 0),
        revalidate: 2,
      },
    };
  }

  const rightNarrativeFileName = path.join(
    NARRATIVE_DIR,
    rightPageNum.toString() + ".md"
  );
  const rightNarrativeExists = await fileExists(rightNarrativeFileName);

  const nextNarrativeFileName = path.join(
    NARRATIVE_DIR,
    (rightPageNum + 1).toString() + ".md"
  );
  const nextNarrativeExists = await fileExists(nextNarrativeFileName);

  return {
    props: {
      tokenId: null,
      loreTokenSlug,
      lorePageData: {
        leftPage: {
          bgColor: "#00000",
          isEmpty: false,
          title: "", //TODO
          story: await fs.readFile(leftNarrativeFileName, "utf8"),
          pageNum: leftPageNum,
        },
        rightPage: {
          bgColor: "#00000",
          isEmpty: false, //TODO: even if empty we set false as we pass empty story (to prevent add lore button) #hack
          title: "", //TODO
          story: rightNarrativeExists
            ? await fs.readFile(rightNarrativeFileName, "utf8")
            : "",
          pageNum: rightPageNum,
        },
        previousPageRoute: leftPageNum >= 1 ? leftPageNum - 1 : null,
        nextPageRoute: nextNarrativeExists
          ? rightPageNum + 1
          : getLoreUrl("wizards", 0, 0), //TODO: do graph query to get first wizard's first lore
      },
    },
    revalidate: 2,
  };
}

async function getNarrativePaths() {
  const postsDirectory = path.join(process.cwd(), "posts", "narrative");
  const filenames = await fs.readdir(postsDirectory);
  const posts = [];
  for (let i = 0; i < filenames.length; i++) {
    if (i % 2 !== 0) {
      //ignore odd pages as the previous "even" page would render it in the same "web" page
      continue;
    }

    const filePath = path.join(postsDirectory, filenames[i]);
    posts.push({
      params: {
        loreTokenSlug: "narrative",
        tokenId: "0",
        page: filePath.match(/^.*(\d)\.md$/)?.[1] ?? "0",
      },
    });
  }

  return posts;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const loreTokenSlug: string = context.params?.loreTokenSlug as string;
  const tokenId: number = parseInt((context.params?.tokenId as string) ?? "0");
  const pageNum: number = parseInt((context.params?.page as string) ?? "0");

  console.log(`In static props for ${tokenId} page ${pageNum}`);

  if (pageNum % 2 !== 0) {
    // We always key from right page, so redirect...
    return {
      redirect: {
        destination: getLoreUrl(loreTokenSlug, tokenId, pageNum + 1),
        revalidate: 2,
      },
    };
  }

  // Shortcut for narrative
  if (loreTokenSlug.toLowerCase() === "narrative") {
    return await getNarrativePageData(pageNum, loreTokenSlug);
  }

  const leftPageNum = pageNum - 1;
  const rightPageNum = pageNum;

  const { leftPageGraphData, rightPageGraphData } = await getCurrentWizardData(
    rightPageNum,
    tokenId,
    leftPageNum
  );

  console.log(`Left page graph data:`);
  console.log(leftPageGraphData);
  console.log(`Right page graph data:`);
  console.log(rightPageGraphData);

  if (leftPageNum >= 1 && !leftPageGraphData && !rightPageGraphData) {
    // Trying to open lore pages that don't exist for wizard, go to 0th lore for now (yes later could be fancy and figure out last page that does exist if any etc)
    return {
      redirect: {
        destination: getLoreUrl(loreTokenSlug, tokenId, 0),
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
      bgColor: `#${wizData[tokenId.toString()].background_color}`,
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
      bgColor: "#000000",
    };
  }

  const narrativePageCount = (
    await fs.readdir(path.join(process.cwd(), "posts", "narrative"))
  ).length;

  rightPage.pageNumber = rightPageNum;
  let { previousPageRoute, nextPageRoute } = await getPreAndNextPageRoutes(
    loreTokenSlug,
    tokenId,
    pageNum,
    leftPageGraphData,
    rightPageGraphData,
    narrativePageCount
  );
  console.log(
    `Static props for wizard ${tokenId} page ${pageNum} is returning the following:`
  );
  console.log({
    leftPage,
    rightPage,
    previousPageRoute,
    nextPageRoute,
  });
  return {
    props: {
      loreTokenSlug,
      tokenId,
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
  const paths = [];

  for (const [loreTokenSlug, loreTokenContract] of Object.entries(
    LORE_CONTRACTS
  )) {
    console.log(`Generating paths for ${loreTokenSlug} ${loreTokenContract}`);
    // console.log(`
    //     query WizardLore {
    //       loreTokens(orderBy: tokenId, where: {tokenContract: "${loreTokenContract}"}) {
    //         tokenContract
    //         tokenId
    //         lore(
    //           where: { struck: false, nsfw: false }
    //           orderBy: id
    //           orderDirection: asc
    //         ) {
    //           id
    //         }
    //       }
    //     }
    //   `);
    const { data } = await client.query({
      query: gql`
          query WizardLore {
              loreTokens(orderBy: tokenId, where: {tokenContract: "${loreTokenContract}"}) {
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

    // console.log(data);
    //Note: its so annoying NextJs doesn't let you pass extra data to getStaticProps so now we fetch inside there too sigh... https://github.com/vercel/next.js/discussions/11272
    paths.push(
      ...flatMap(data.loreTokens, (loreTokenData: any) => {
        return (loreTokenData?.lore ?? []).map(
          (loreData: any, index: number) => {
            return {
              params: {
                loreTokenSlug,
                tokenId: loreTokenData.tokenId,
                page: (index % 2 === 0 ? index : index + 1).toString(),
              },
            };
          }
        );
      })
    );
  }

  paths.push(...(await getNarrativePaths()));

  return {
    paths: paths,
    fallback: "blocking",
  };
}

export default LorePage;
