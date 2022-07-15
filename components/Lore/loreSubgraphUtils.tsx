import client from "../../lib/graphql";
import { gql } from "@apollo/client";
import { CHARACTER_CONTRACTS } from "../../contracts/ForgottenRunesWizardsCultContract";
import path from "path";
import { promises as fs } from "fs";
import * as os from "os";
import { COMMUNITY_CONTRACTS, CONTRACTS } from "../Marketplace/marketplaceConstants";

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

const LORE_CACHE = path.join(os.tmpdir(), ".lore_cache");


const WIZARDS_THAT_HAVE_LORE_CACHE = path.join(
  os.tmpdir(),
  ".wizards_that_have_lore_cache"
);

function getLoreUrl(
  loreTokenSlug: string,
  tokenId: number,
  pageNum: number
) {
  return `/lore/${loreTokenSlug}/${tokenId}/${pageNum}`;
}

export async function bustLoreCache() {
  const files = [ WIZARDS_THAT_HAVE_LORE_CACHE ];

  for (var contract in CONTRACTS) {
    files.push(`${LORE_CACHE}_${CONTRACTS[contract].display.toLowerCase()}`);
  }

  for (var contract in COMMUNITY_CONTRACTS) {
    files.push(`${LORE_CACHE}_${COMMUNITY_CONTRACTS[contract].display.toLowerCase()}`);
  }

  for (let index in files) {
    const file = files[index];
    try {
      await fs.unlink(file);
      console.info(`Busted cache at ${file}....`);
    } catch (_) {
      console.warn(
        `Cache file ${file} not deleted, probably didn't exist in first place...`
      );
    }
  }
}

const LORE_CACHE_STALE_AFTER_MINUTES = 5;
const WIZARDS_THAT_HAVE_LORE_CACHE_STALE_AFTER_MINUTES = 10;

export async function getLoreInChapterForm(
  tokenContract: string,
  updateCache: boolean = false
) {
  let contracts = tokenContract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
  const cacheFile = `${LORE_CACHE}_${contracts[tokenContract].display.toLowerCase()}`;

  let results;

  try {
    const cachedData = JSON.parse(await fs.readFile(cacheFile, "utf8"));
    if (
      Math.floor((new Date().getTime() - cachedData.timestamp) / 1000 / 60) <=
      LORE_CACHE_STALE_AFTER_MINUTES // For x minutes during a deploy we keep using the file cache for lore
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

    results = [];

    // Not we optimistically fetch N lore pages at a time - this is a temporary hack as it's faster than waiting for results to then do another request etc
    const serverGraphPagesToFetch = 2;
    const graphResults = await Promise.all(
      Array.from({ length: serverGraphPagesToFetch }, (_, i) =>
        client.query({
          query: gql`
          query WizardLore {
              loreTokens(skip: ${
                i * 999
              }, first: 999, orderBy: tokenId, orderDirection: asc, where: {tokenContract: "${tokenContract}"}) {
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
        })
      )
    );
    console.log(`Got ${graphResults.length} queries worth of results....`);

    for (let i = 0; i < graphResults.length; i++) {
      const loreTokens = graphResults[i]?.data?.loreTokens ?? [];

      console.log(`Query ${i} had ${loreTokens.length} lore tokens`);

      results.push(
        ...loreTokens.map((loreTokenEntry: any) => {
          return {
            tokenId: parseInt(loreTokenEntry.tokenId),
            lore: loreTokenEntry.lore.map((loreEntry: any) => ({
              loreMetadataURI: loreEntry.loreMetadataURI,
              createdAtTimestamp: loreEntry.createdAtTimestamp,
              creator: loreEntry.creator,
              index: loreEntry.index,
            })),
          };
        })
      );
    }

    if (updateCache) {
      console.log("Updating cache file");
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

export async function getFirstAvailableWizardLoreUrl() {
  // We used to fetch this from subgraph but now we know wizard 0 always has lore so no need :)
  return getLoreUrl("wizards", 0, 0);
}

export async function getWizardsWithLore(contract: string = CHARACTER_CONTRACTS.wizards): Promise<{
  [key: number]: boolean;
}> {
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
  const cacheFile = `${LORE_CACHE}_${contracts[contract].display.toLowerCase()}`;
  let results: any = {};

  try {
    const cachedData = JSON.parse(await fs.readFile(cacheFile, "utf8"));
    console.log(cacheFile);
    if (
      Math.floor((new Date().getTime() - cachedData.timestamp) / 1000 / 60) <=
      WIZARDS_THAT_HAVE_LORE_CACHE_STALE_AFTER_MINUTES // For x minutes during a deploy we keep using the file cache for lore
    ) {
      results = cachedData.data;
      console.log("Using cached data for 'wizards that have lore' yay!");
    }
  } catch (e) {
    /* not fatal */
    console.warn(
      "'Wizards that have lore' cache file didn't exist or we couldn't open it"
    );
  }

  if (Object.keys(results).length == 0) {
    try {
      const serverGraphPagesToFetch = 2;
      const graphResults = await Promise.all(
        Array.from({ length: serverGraphPagesToFetch }, (_, i) => client.query({
          query: gql`
            query WizardLore {
                loreTokens(skip: ${
                  i * 999
                }, first: 999, orderBy: tokenId, orderDirection: asc, where: {tokenContract: "${contract}"}) {
                    tokenId
                }
            }`,
          })
        )
      );
      
      console.log(`Got ${graphResults.length} queries worth of results....`);
      for (let i = 0; i < graphResults.length; i++) {
        const loreTokens = graphResults[i]?.data?.loreTokens ?? [];
        for (var token of loreTokens) {
          results[token.tokenId] = true;
        }
      }

      await fs.writeFile(
        cacheFile,
        JSON.stringify({ timestamp: new Date().getTime(), data: results }),
        "utf-8"
      );
    } catch (e) {
      console.error(
        "We couldn't get 'wizards that have lore' from subgraph. Continuing anyway as its non-fatal..."
      );
      console.log(e);
      results = [];
    }
  }

  return results;
}
