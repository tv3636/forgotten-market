import client from "../../lib/graphql";
import { gql } from "@apollo/client";
import { CHARACTER_CONTRACTS } from "../../contracts/ForgottenRunesWizardsCultContract";
import { getLoreUrl } from "./loreUtils";
import path from "path";
import { IndividualLorePageData } from "./types";
import { hydratePageDataFromMetadata } from "./markdownUtils";
import { promises as fs } from "fs";
import * as os from "os";

const COMMON_LORE_FIELDS = `
  id
  index
  creator
  tokenContract
  loreMetadataURI
  tokenId
  struck
  nsfw
  createdAtTimestamp
`;

export const GRAPH_ID_MATCHER = /^((?:0x).*)-(\d+)-(\d+)$/;

export const NORMALIZED_WIZARD_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS?.toLowerCase();

function getWizardLoreId(wizardNum: number, loreIndex: number) {
  return `${CHARACTER_CONTRACTS.wizards}-${wizardNum
    .toString()
    .padStart(10, "0")}-${loreIndex.toString().padStart(10, "0")}`;
}

const LORE_CACHE = path.join(os.tmpdir(), ".lore_cache");

export async function bustLoreCache() {
  try {
    await fs.unlink(LORE_CACHE);
    console.info(`Busted lore cache at ${LORE_CACHE}....`);
  } catch (_) {
    console.warn(
      `Cache file ${LORE_CACHE} not deleted, probably didn't exist in first place...`
    );
  }
}

export async function getLoreInChapterForm(
  tokenContract: string,
  updateCache: boolean = false
) {
  const cacheFile = `${LORE_CACHE}`;
  let results;

  try {
    const cachedData = JSON.parse(await fs.readFile(cacheFile, "utf8"));
    if (
      Math.floor((new Date().getTime() - cachedData.timestamp) / 1000 / 60) <= 2
    ) {
      results = cachedData.data;
      console.log("Using cached data for lore yay!");
    }
  } catch (e) {
    /* not fatal */
    console.warn("Cache file didn't exist or we couldn't open it");
  }

  if (!results) {
    console.log("No cached lore data - fetching from graph");
    const { data } = await client.query({
      query: gql`
        query WizardLore {
            loreTokens(first: 999, orderBy: tokenId, orderDirection: asc, where: {tokenContract: "${tokenContract}"}) {
                tokenContract
                tokenId
                lore(
                    where: { struck: false, nsfw: false }
                    orderBy: id
                    orderDirection: asc
                ) {
                    ${COMMON_LORE_FIELDS}
                }
            }
        }
    `,
      fetchPolicy: "no-cache",
    });

    results = data.loreTokens.map((loreTokenEntry: any) => {
      return {
        tokenId: parseInt(loreTokenEntry.tokenId),
        lore: loreTokenEntry.lore.map(
          (loreEntry: any) => loreEntry.loreMetadataURI
        ),
      };
    });

    if (updateCache) {
      await fs.writeFile(
        cacheFile,
        JSON.stringify({ timestamp: new Date().getTime(), data: results }),
        "utf-8"
      );
    }
  }

  return results;
}

export async function getIndexForToken(
  tokenId: number,
  paginatedLore: { tokenId: number; lore: any[] }[]
) {
  return paginatedLore.findIndex((element) => element.tokenId === tokenId);
}

export async function getLeftRightPages(
  loreTokenSlug: string,
  tokenId: number,
  leftPageNum: number,
  rightPageNum: number
) {
  const tokenContract = LORE_CONTRACTS.wizards;
  const loreInChapterForm = await getLoreInChapterForm(tokenContract);

  const chapterIndexForToken = await getIndexForToken(
    tokenId,
    loreInChapterForm
  );

  let leftPage: IndividualLorePageData;
  let rightPage: IndividualLorePageData;

  if (chapterIndexForToken === -1) {
    leftPage = {
      isEmpty: true,
      bgColor: `#000000`,
      firstImage: null,
      pageNumber: leftPageNum,
    };

    rightPage = {
      isEmpty: true,
      bgColor: "#000000",
      firstImage: null,
      pageNumber: rightPageNum,
    };
  } else {
    const lore = loreInChapterForm[chapterIndexForToken]?.lore ?? [];

    if (leftPageNum >= 0 && leftPageNum < lore.length) {
      leftPage = await hydratePageDataFromMetadata(lore[leftPageNum]);
    } else {
      // Would end up showing wizard
      leftPage = {
        isEmpty: true,
        bgColor: `#000000`,
        firstImage: null,
      };
    }
    leftPage.pageNumber = leftPageNum;

    if (rightPageNum < lore.length) {
      rightPage = await hydratePageDataFromMetadata(lore[rightPageNum]);
    } else {
      // Would end showing add lore
      rightPage = {
        isEmpty: true,
        bgColor: "#000000",
        firstImage: null,
      };
    }
    rightPage.pageNumber = rightPageNum;
  }

  //------
  // Figure out previous route
  let previousPageRoute = null;
  if (chapterIndexForToken > 0) {
    if (leftPageNum - 1 >= 0) {
      previousPageRoute = getLoreUrl(
        loreTokenSlug,
        loreInChapterForm[chapterIndexForToken].tokenId,
        leftPageNum - 1
      );
    } else {
      previousPageRoute = getLoreUrl(
        loreTokenSlug,
        loreInChapterForm[chapterIndexForToken - 1].tokenId,
        (loreInChapterForm[chapterIndexForToken - 1]?.lore ?? []).length - 1
      );
    }
  } else {
    //No previous pages implies this is first wizard in the book, so before it comes lore
    previousPageRoute = getLoreUrl("narrative", 0, 0);
  }

  // Figure out next route
  let nextPageRoute = null;
  if (
    rightPageNum <
    (loreInChapterForm[chapterIndexForToken]?.lore ?? []).length - 1
  ) {
    nextPageRoute = getLoreUrl(loreTokenSlug, tokenId, rightPageNum + 2);
  } else {
    if (chapterIndexForToken + 1 < loreInChapterForm.length) {
      nextPageRoute = getLoreUrl(
        loreTokenSlug,
        loreInChapterForm[chapterIndexForToken + 1].tokenId,
        0
      );
    }
  }

  return [leftPage, rightPage, previousPageRoute, nextPageRoute];
}

export async function getFirstAvailableWizardLoreUrl() {
  // We used to fetch this from subgraph but now we know wizard 0 always has lore so no need :)
  return getLoreUrl("wizards", 0, 0);
}

export async function getWizardsWithLore(): Promise<{
  [key: number]: boolean;
}> {
  const { data } = await client.query({
    query: gql`
        query WizardLore {
            loreTokens(orderBy: tokenId, where: {tokenContract: "${CHARACTER_CONTRACTS.wizards}"}) {
                tokenId
            }
        }
    `,
  });

  return (data?.loreTokens ?? []).reduce(
    (
      result: {
        [key: number]: boolean;
      },
      token: any
    ) => ((result[token.tokenId] = true), result),
    {}
  );
}
