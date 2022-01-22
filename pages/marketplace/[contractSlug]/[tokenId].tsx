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
import dynamic from "next/dynamic";
import { getProvider } from "../../../hooks/useProvider";
import { ConnectWalletButton } from "../../../components/web3/ConnectWalletButton";
import { useEthers } from "@usedapp/core";
const countdown = require("countdown");

const DynamicMap = dynamic(() => import("../../../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

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

const LOCATIONS: any = {
  "Cuckoo Land": [5.6, 5.3],
  "Psychic Leap": [5.6, 5.3],
  Veil: [5.3, 2.85],
  Bastion: [4.3, 1.9],
  Realm: [5.3, 0.2],
  "Sacred Pillars": [5.4, -1.85],
  Tower: [3.4, -3.2],
  Salt: [2.1, -6.05],
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
  border-image: url("/static/img/marketplace/frame_traits.png");
  border-style: solid;
  border-width: 34px;
  border-image-repeat: stretch;
  border-image-slice: 6%;

  display: flex;
  justify-content: center;
`;

const ButtonImage = styled.img`
  margin-left: 0.5vw;
  margin-right: 0.5vw;
  height: 60px;
  image-rendering: pixelated;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
`;

const LoreContainer = styled.div`
  border-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAAAXNSR0IArs4c6QAAAeZJREFUeF7tm9GOgzAQA8v/fzT3ek0lrJUnVzhNX914N4M3QtAeLz8ogQN10+wlUDgEAhUoTAC2M6EChQnAdiZUoDAB2M6EChQmANuZ0LsDPc/z/N3jcRy3umi7+8M3u7vhNlC7+xMoPEECvRvQNEJJb0c4rU/1k578V71OaGoo6dOGp99P9ZM+rSdQ+K5EoN8Gmkak1acjtn6/rZ/Wp/7GCU0FWz01nPS2flqf6gt0uW0S6BKZBKTV8YTSZ1ZqsNV3A/Q+FB5xgQq0G/rHjfz0TO3w9KsT4LbC+LYpFdzdcKqf9N39CfRuj+8c+XcCeELTyP13XaDwFRaoQGECsJ0JFShMALYzoQKFCcB2JlSgMAHYzoQKFCYA25lQgcIEYDsTKlCYAGxnQgUKE4DtTKhAYQKwHZ7Q3a9p2/3v7k+gvkbuMmpCO34fq28PNDWYdJjXGCDdX32GpoaSLtCFQAKWdIEK9DID45FPiWv1NrFt/bQ+9SdQ+CfiAhXo9dClkW11fORXw90Npg0k/a/7G4+8QK8voUC//fduE7o5oVPA6czbraczta1fj7xA3wkI1AfM3VA+buS77T5/NT7yz0fS7UCgHb+P1QIVKEwAtjOhAoUJwHYmVKAwAdjOhAoUJgDbmVAY6A/yaUBzMqS0AwAAAABJRU5ErkJggg==")
    28 / 28px / 0 round;
  border-width: 28px;
  border-style: solid;

  padding: 40px;
  width: 80%;

  font-family: Alagard;
  font-size: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const MapContainer = styled.div`
  margin-top: 2vh;
  max-height: 250px;
`;

const MapStyles = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;

  .leaflet-container {
    background-color: black;
    border-style: dashed;
    border-radius: 50%;
  }
  img.leaflet-image-layer {
    image-rendering: pixelated;
  }
  .leaflet-bar a,
  .leaflet-bar a:hover {
    display: none;
  }
  .leaflet-bar a:hover {
    background-color: #18151e;
  }

  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    border: none;
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
        <div style={{}}>
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
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "1vh" }}
    >
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

function ListingExpires({
  timer,
  dateString,
}: {
  timer: any;
  dateString: string;
}) {
  if (timer?.days > 1) {
    if (dateString) {
      return <div>Listing expires on {dateString}</div>;
    } else {
      return null;
    }
  } else {
    return (
      <div>
        <div>
          Listing expires in{" "}
          {timer?.days > 0 && (
            <span
              style={{ width: "10ch", minWidth: "10ch", textAlign: "right" }}
            >
              {timer?.days} days,{" "}
            </span>
          )}
          <span style={{ width: "10ch", minWidth: "10ch", textAlign: "right" }}>
            {timer?.hours} hours,{" "}
          </span>
          <span style={{ width: "10ch", minWidth: "10ch", textAlign: "right" }}>
            {timer?.minutes} minutes,{" "}
          </span>
          <span style={{ width: "10ch", minWidth: "10ch", textAlign: "right" }}>
            {timer?.seconds} seconds
          </span>
        </div>
      </div>
    );
  }

  return null;
}

function LoreBlock({ pages }: { pages: [] }) {
  if (pages.length > 0) {
    return (
      <LoreContainer>
        {pages.map((page: any, index: number) =>
          page.nsfw ? (
            <div>NSFW Lore Entry not shown</div>
          ) : (
            <div key={index} style={{ marginTop: "6vh" }}>
              <IndividualLorePage bgColor={page.bgColor} story={page.story} />
            </div>
          )
        )}
      </LoreContainer>
    );
  } else {
    return <LoreContainer>No Lore has been recorded...</LoreContainer>;
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
  const [countdownTimer, setCountdownTimer] = useState<any>(null);
  const { account } = useEthers();

  function increment() {
    setCountdownTimer(countdown(new Date(listing.validUntil * 1000)));
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
            marginTop: "4vh",
            marginBottom: "4vh",
          }}
        >
          <div id="lefthand" style={{ textAlign: "center", maxWidth: "500px" }}>
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
              marginTop: "6vh",
              width: "40%",
              maxWidth: "700px",
              marginLeft: "3vw",
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
            <hr style={{ maxWidth: "600px" }} />
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
            <hr style={{ maxWidth: "600px" }} />
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
            {listing.validUntil ? (
              <ListingExpires
                timer={countdownTimer}
                dateString={new Date(
                  listing.validUntil * 1000
                ).toLocaleString()}
              />
            ) : null}

            <MapContainer>
              <MapStyles>
                <DynamicMap
                  center={[3.4, -3.22]}
                  zoom={7}
                  width={"250px"}
                  height={"250px"}
                />
              </MapStyles>
            </MapContainer>
            <div
              style={{
                marginTop: "3vh",
                minWidth: "75%",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
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
