import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import React, { useEffect, useState } from "react";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { hydratePageDataFromMetadata } from "../../../components/Lore/markdownUtils";
import IndividualLorePage from "../../../components/Lore/IndividualLorePage";
import { SocialItem } from "../../../components/Lore/BookOfLoreControls";
import { ResponsivePixelImg } from "../../../components/ResponsivePixelImg";
import { getProvider } from "../../../hooks/useProvider";
import { ConnectWalletButton } from "../../../components/web3/ConnectWalletButton";
import { useEthers } from "@usedapp/core";
const countdown = require("countdown");

const API_BASE_URL: string = "https://indexer-v3-2-mainnet.up.railway.app/";

const IMG_URLS: any = {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": "/api/art/wizards/",
  "0x251b5f14a825c537ff788604ea1b58e49b70726f":
    "https://portal.forgottenrunes.com/api/souls/img/",
  "0xf55b615b479482440135ebf1b907fd4c37ed9420":
    "https://portal.forgottenrunes.com/api/shadowfax/img/",
};

const COLLECTION_NAMES: any = {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": "wizards",
  "0x251b5f14a825c537ff788604ea1b58e49b70726f": "souls",
  "0xf55b615b479482440135ebf1b907fd4c37ed9420": "ponies",
};

const MarketText = styled.p`
  font-family: Alagard;
  font-size: 32px;
  color: white;

  margin: 15px;
`;

const MarketHeader2 = styled.h2`
  font-family: Alagard;
  font-size: 40px;
  color: white;

  margin-top: 12px;
  margin-bottom: 30px;
`;

const MarketHeader4 = styled.h4`
  font-family: Arial;
  font-size: 18px;
  color: white;

  margin-top: 12px;
`;

const TraitRow = styled.div`
  text-align: start;
  margin-left: 2vw;
  margin-right: 2vw;
  font-size: 18px;
  font-family: Alagard;
`;

const Frame = styled.div`
  background-image: url("/static/img/marketplace/frame_traits.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  display: flex;
  justify-content: center;
`;

const ButtonImage = styled.img`
  margin-left: 0.5vw;
  margin-right: 0.5vw;
  height: 60px;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
`;

function MarketButton({ text }: { text: string }) {
  return (
    <ButtonImage
      src={"/static/img/marketplace/" + text + ".png"}
      onMouseOver={(e) =>
        (e.currentTarget.src = "/static/img/marketplace/" + text + "_hover.png")
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = "/static/img/marketplace/" + text + ".png")
      }
    />
  );
}

function MarketButtons({
  account,
  owner,
  listValue,
}: {
  account: string | null | undefined;
  owner: string | null | undefined;
  listValue: number | null | undefined;
}) {
  if (!account) {
    return <ConnectWalletButton />;
  }

  if (owner) {
    if (account.toLowerCase() == owner.toLowerCase()) {
      if (listValue) {
        return <button>Cancel Listing</button>;
      } else {
        return <MarketButton text={"sell"} />;
      }
    } else {
      return (
        <div>
          {listValue && <MarketButton text={"buy"} />}
          <MarketButton text={"offer"} />
        </div>
      );
    }
  }
  return null;
}

function TraitDisplay({ attributes }: { attributes: [] }) {
  if (attributes.length == 0) {
    return null;
  } else {
    return (
      <Frame>
        <div style={{ marginTop: "50px", marginBottom: "50px", width: "92%" }}>
          {attributes.map((attribute: any, index: number) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: "40px",
                  alignItems: "center",
                }}
              >
                <TraitRow>{attribute.key}:</TraitRow>
                <TraitRow>{attribute.value}</TraitRow>
              </div>
              {index < attributes.length - 1 ? <hr /> : null}
            </div>
          ))}
        </div>
      </Frame>
    );
  }
}

function Icons({
  tokenId,
  collection,
}: {
  tokenId: number;
  collection: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <SocialItem>
        <a
          href={`/scenes/gm/${tokenId}`}
          className="icon-link gm"
          target="_blank"
        >
          <ResponsivePixelImg
            src="/static/img/icons/gm.png"
            className="gm-img"
          />
        </a>
      </SocialItem>
      {COLLECTION_NAMES[collection] == "wizards" && (
        <SocialItem>
          <a
            href={`/api/art/${COLLECTION_NAMES[collection]}/${tokenId}.zip`}
            className="icon-link"
            target="_blank"
          >
            <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
          </a>
        </SocialItem>
      )}
      <SocialItem>
        <a
          href={`/lore/${COLLECTION_NAMES[collection]}/${tokenId}/0`}
          className="icon-link"
        >
          <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
        </a>
      </SocialItem>
    </div>
  );
}

function LoreBlock({ pages }: { pages: [] }) {
  if (pages.length > 0) {
    return (
      <div>
        {pages.map((page: any, index: number) =>
          page.nsfw ? (
            <div>NSFW Lore Entry not shown</div>
          ) : (
            <div key={index}>
              <IndividualLorePage bgColor={page.bgColor} story={page.story} />
            </div>
          )
        )}
      </div>
    );
  } else {
    return <div>No Lore has been recorded...</div>;
  }

  return null;
}

const ListingPage = ({
  contractSlug,
  tokenId,
  lore,
}: {
  contractSlug: string;
  tokenId: string;
  lore: any;
}) => {
  const [token, setToken] = useState<any>({});
  const [listing, setListing] = useState<any>({});
  const [attributes, setAttributes] = useState<any>([]);
  const [pages, setPages] = useState<any>([]);
  const [ens, setEns] = useState<string | null>("");
  const [countdownTimer, setCountdownTimer] = useState<string>("");
  const { account } = useEthers();

  function increment() {
    setCountdownTimer(
      countdown(new Date(listing.validUntil * 1000)).toString()
    );
  }

  setTimeout(increment, 1000);

  useEffect(() => {
    async function run() {
      const page = await fetch(
        API_BASE_URL +
          "tokens/details?" +
          "contract=" +
          contractSlug +
          "&tokenId=" +
          tokenId
      );
      const listingsJson = await page.json();

      if (listingsJson.tokens.length > 0) {
        setToken(listingsJson.tokens[0].token);
        setListing(listingsJson.tokens[0].market.floorSell);
        setAttributes(listingsJson.tokens[0].token.attributes);

        const provider = getProvider();
        var ensName = await provider.lookupAddress(
          listingsJson.tokens[0].token.owner
        );
        setEns(ensName);
      }

      if (lore.length > 0) {
        var newPages = [];
        for (var lorePage of lore) {
          var thisPage = await hydratePageDataFromMetadata(
            lorePage.loreMetadataURI,
            lorePage.createdAtTimestamp,
            lorePage.creator,
            lorePage.tokenId
          );

          if (lorePage.nsfw) {
            newPages.push({ nsfw: true });
          } else {
            newPages.push(thisPage);
          }
        }
        setPages(newPages);
      }
    }

    run();
  }, []);

  return (
    <Layout title={token.name}>
      {Object.keys(listing).length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: "4vh",
          }}
        >
          <div
            id="lefthand"
            style={{
              textAlign: "center",
              marginRight: "5vw",
              maxWidth: "500px",
            }}
          >
            <img src={IMG_URLS[contractSlug] + tokenId + ".png"} />
            <Icons tokenId={Number(tokenId)} collection={contractSlug} />
            <div
              style={{
                textAlign: "center",
                marginTop: "1vh",
              }}
            >
              <TraitDisplay attributes={attributes} />
            </div>
          </div>
          <div
            id="righthand"
            style={{
              textAlign: "center",
              marginLeft: "3vw",
              marginTop: "6vh",
              width: "45%",
              maxWidth: "1000px",
            }}
          >
            <MarketHeader2>{token.name}</MarketHeader2>
            <MarketText>
              {listing.value ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/static/img/marketplace/eth_alt.png"
                    style={{ height: "30px", marginRight: "10px" }}
                  />
                  <div>{listing.value}</div>
                </div>
              ) : null}
            </MarketText>
            <hr />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2vh",
                marginBottom: "2vh",
              }}
            >
              <MarketButtons
                account={account}
                owner={token.owner}
                listValue={listing.value}
              />
            </div>
            <hr />
            {token.owner && (
              <MarketHeader4>
                {"Owner: "}
                <a
                  href={"/address/" + token.owner}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ens
                    ? token.owner?.toLowerCase() != account?.toLowerCase()
                      ? ens
                      : "you"
                    : token.owner.substring(0, 10)}
                </a>
              </MarketHeader4>
            )}
            <p>
              {listing.validUntil
                ? "Listing expires in " + countdownTimer
                : null}
            </p>
            <div
              style={{
                marginTop: "8vh",
                maxWidth: "75%",
                display: "inline-flex",
                flexDirection: "column",
              }}
            >
              <LoreBlock pages={pages} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ListingPage;

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const contractSlug = params?.contractSlug as string;
  const tokenId = params?.tokenId as string;

  try {
    const { data } = await client.query({
      query: gql`
        query WizardLore {
            loreTokens(first: 999, orderBy: tokenId, orderDirection: asc, where: {tokenContract: "${contractSlug}", tokenId: "${tokenId}"}) {
                lore(
                    where: { struck: false }
                    orderBy: id
                    orderDirection: asc
                ) {
                    id
                    index
                    creator
                    tokenContract
                    loreMetadataURI
                    tokenId
                    struck
                    nsfw
                    createdAtTimestamp
                }
            }
        }`,
    });

    var results = data["loreTokens"][0]["lore"];
  } catch (e) {
    console.error("Couldn't fetch lore. Continuing anyway as its non-fatal...");
    results = [];
  }

  return {
    props: {
      contractSlug,
      tokenId: tokenId,
      lore: results,
    },
    revalidate: 3 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async ({}) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
