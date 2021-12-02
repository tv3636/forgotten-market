import Layout from "../../../../components/Layout";
import { GetStaticPropsContext } from "next";
import Book from "../../../../components/Lore/Book";
import { LorePageData } from "../../../../components/Lore/types";
import LoreSharedLayout from "../../../../components/Lore/LoreSharedLayout";
import OgImage from "../../../../components/OgImage";
import dynamic from "next/dynamic";

import {
  bustLoreCache,
  getFirstAvailableWizardLoreUrl,
  getLeftRightPages,
  getLoreInChapterForm,
  getWizardsWithLore,
} from "../../../../components/Lore/loreSubgraphUtils";
import { CHARACTER_CONTRACTS } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { getLoreUrl } from "../../../../components/Lore/loreUtils";
import { promises as fs } from "fs";
import path from "path";
import { useMedia } from "react-use";
import { useEffect, useState } from "react";
import flatMap from "lodash/flatMap";

import productionWizardData from "../../../../data/nfts-prod.json";
import productionSoulsData from "../../../../data/souls-prod.json";
import stagingSoulsData from "../../../../data/souls-staging.json";
import {
  ChainId,
  DAppProvider,
  useEtherBalance,
  useEthers,
  Config,
} from "@usedapp/core";

const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };
const wizData = productionWizardData as { [wizardId: string]: any };

const WizardMapLeaflet = dynamic(
  () => import("../../../../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const LorePage = ({
  loreTokenSlug,
  tokenId,
  lorePageData,
  wizardsWithLore,
}: {
  loreTokenSlug: "wizards" | "souls";
  tokenId: number;
  lorePageData: LorePageData;
  wizardsWithLore: { [key: number]: boolean };
}) => {
  const isWide = useMedia("(min-width: 1000px)");

  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    // We use a small timeout before showing gallery as it fires image fetching that can often block/queue lore book image fetching
    const timeout = window.setTimeout(() => setShowGallery(true), 200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  let title = "The Book of Lore";

  if (loreTokenSlug === "wizards") {
    title = `The Lore of ${wizData[tokenId.toString()].name} (#${tokenId})`;
  } else if (loreTokenSlug === "souls") {
    title = `The Lore of ${
      soulsData?.[tokenId.toString()]?.name ?? "a Soul"
    } (#${tokenId})`;
  }

  let ogImage =
    lorePageData.leftPage?.firstImage ?? lorePageData.rightPage?.firstImage;

  if (!ogImage && loreTokenSlug === "souls") {
    // Hack to prevent modifying of image api
    ogImage = `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/img/${tokenId}`;
  }
  const og = (
    <OgImage
      title={title}
      wizard={tokenId}
      images={ogImage}
      bgColor={
        lorePageData.leftPage?.firstImage
          ? lorePageData.leftPage?.bgColor
          : lorePageData.rightPage?.firstImage
          ? lorePageData.rightPage?.bgColor
          : undefined
      }
    />
  );
  const config: Config = {
    readOnlyChainId: parseInt(
      process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID as string
    ),
  };

  return (
    <Layout title={title}>
      {og}
      <>
        <Book
          loreTokenSlug={loreTokenSlug}
          tokenId={tokenId}
          lorePageData={lorePageData}
        />
      </>
      {isWide && showGallery && (
        <WizardMapLeaflet wizardsWithLore={wizardsWithLore} bookOfLore={true} />
      )}
    </Layout>
  );
};

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
          bgColor: "#000000",
          isEmpty: false,
          title: "The Book of Lore", //TODO
          story: await fs.readFile(leftNarrativeFileName, "utf8"),
          pageNum: leftPageNum,
        },
        rightPage: {
          bgColor: "#000000",
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
          : await getFirstAvailableWizardLoreUrl(),
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

  const [leftPage, rightPage, previousPageRoute, nextPageRoute] =
    await getLeftRightPages(loreTokenSlug, tokenId, leftPageNum, rightPageNum);

  console.log(
    `Regenerated ${loreTokenSlug} - ${tokenId} pages ${leftPageNum} and ${rightPageNum}`
  );
  // console.log({
  //   // leftPage,
  //   // rightPage,
  //   previousPageRoute,
  //   nextPageRoute,
  // });
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
      wizardsWithLore: await getWizardsWithLore(),
    },
    revalidate: 2,
  };
}

export async function getStaticPaths() {
  const paths = [];

  await bustLoreCache();

  for (const [loreTokenSlug, loreTokenContract] of Object.entries(
    CHARACTER_CONTRACTS
  )) {
    console.log(`Generating paths for ${loreTokenSlug} ${loreTokenContract}`);

    const loreInChapterForm = await getLoreInChapterForm(
      loreTokenContract,
      true
    );

    // console.log(data);
    //Note: its so annoying NextJs doesn't let you pass extra data to getStaticProps so now we fetch inside there too sigh... https://github.com/vercel/next.js/discussions/11272
    paths.push(
      ...flatMap(loreInChapterForm, (tokenLoreData: any) => {
        return (tokenLoreData?.lore ?? []).map(
          (loreData: any, index: number) => {
            return {
              params: {
                loreTokenSlug,
                tokenId: tokenLoreData.tokenId.toString(),
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
