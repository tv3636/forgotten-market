import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import React, { useEffect, useState } from "react";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { hydratePageDataFromMetadata } from "../../../components/Lore/markdownUtils";
import IndividualLorePage from "../../../components/Lore/IndividualLorePage";
import Minimap from "../../../components/Marketplace/MiniMap";
import { ListingExpiration, Icons } from "../../../components/Marketplace/marketplaceHelpers";
import { CONTRACTS, API_BASE_URL } from "../../../components/Marketplace/marketplaceConstants";
import { getProvider } from "../../../hooks/useProvider";
import { ConnectWalletButton } from "../../../components/web3/ConnectWalletButton";
import { useEthers } from "@usedapp/core";
import countdown from "countdown";

const LOCATIONS: any = {
  "Cuckoo Land": [5.6, 5.3],
  "Psychic Leap": [5.6, 5.3],
  Veil: [5.1, 2.85],
  Bastion: [4.3, 1.9],
  Realm: [5.3, 0.2],
  "Sacred Pillars": [5.4, -1.85],
  Tower: [3.4, -3.2],
  Salt: [2.1, -6.05],
  Wold: [2.7, -1.2],
  Lake: [3.95, -0.45],
  Wild: [2.91, 1.3],
  Carnival: [1.6, 2.4],
  Marsh: [0.65, 2.8],
  Thorn: [0.5, 5.25],
  Mist: [1.3, 6.6],
  Toadstools: [3.3, 6.15],
  Fey: [3.2, 3.6],
  "Quantum Shadow": [-1.05, 6.59],
  Valley: [-2.2, 6.7],
  "Platonic Shadow": [-3.5, 6.7],
  Obelisk: [-3.9, 5.2],
  Oasis: [-4.9, 6.7],
  Sand: [-5.7, 4.5],
  Havens: [-3.6, 1.9],
  Mountain: [-3, 1.45],
  Riviera: [-3.8, -0.05],
  Surf: [-4.6, -2.2],
  Isle: [-4.5, -4.45],
  Brine: [-3.6, -6.55],
  Citadel: [-1.9, -5.6],
  Capital: [0, -5.75],
  Keep: [-1.9, -2.7],
  Wood: [1, 0.3],
};

const MarketText = styled.div`
  font-family: Alagard;
  font-size: 45px;
  color: white;

  margin: 15px;
`;

const MarketHeader2 = styled.h2`
  font-family: Alagard;
  font-size: 45px;
  color: white;

  margin-top: 12px;
  margin-bottom: 10px;
`;

const MarketHeader4 = styled.h4`
  font-family: Arial;
  font-size: 16px;
  font-weight: normal;
  color: white;

  margin-top: -5px;
  margin-bottom: 40px;
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
  height: 40px;
  image-rendering: pixelated;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 1vh;
  min-width: 400px;

  border-style: dashed;
  border-radius: 3%;
  padding: 15px;
`;

const LoreWrapper  = styled.div`
  margin-top: 8vh;
  min-width: 75%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
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

const Listing = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4vh;
  margin-bottom: 4vh;
`;

const LeftHandDisplay = styled.div`
  text-align: center; 
  max-width: 400px; 
  display: flex; 
  flex-direction: column; 
  align-items: center;

  margin-left: 3vw;

`;

const RightHandDisplay = styled.div`
  text-align: center;
  margin-top: 5vh;
  width: 50%;
  max-width: 800px;
  margin-left: 3vw;

  display: flex;
  flex-direction: column;
  align-items: center;
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
      <div style={{ textAlign: "center", marginTop: "1vh" }}>
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
      </div>
    );
  }
}

function Price({ value }: { value: number }) {
  return (
    <MarketText>
      {value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/static/img/marketplace/eth_alt.png"
            style={{ height: "37px", marginRight: "12px" }}
          />
          <div>{value}</div>
        </div>
      ) : null}
    </MarketText>
  );
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
}

function Owner({
  owner,
  connectedAccount,
  ens,
}: {
  owner: string;
  connectedAccount: string | null | undefined;
  ens: string | null;
}) {
  return (
    <MarketHeader4>
      {"Owner: "}
      <a href={"/address/" + owner} target="_blank" rel="noopener noreferrer">
        {ens
          ? owner?.toLowerCase() != connectedAccount?.toLowerCase()
            ? ens
            : "you"
          : owner.substring(0, 10)}
      </a>
    </MarketHeader4>
  );
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
  const [mapCenter, setMapCenter] = useState<any>([0, 0]);
  const { account } = useEthers();

  setTimeout(
    () => setCountdownTimer(countdown(new Date(listing.validUntil * 1000))),
    1000
  );

  // hacky workaround to grab location until it's added to metadata/stored locally
  function getCenter(name: string) {
    var center = [0, 0];
    var nameParts = name.split(" ");

    if (name && name.length > 1) {
      var firstTry = nameParts[nameParts.length - 1];
      var secondTry =
        nameParts[nameParts.length - 2] + " " + nameParts[nameParts.length - 1];

      if (firstTry in LOCATIONS) {
        center = LOCATIONS[firstTry];
      } else if (secondTry in LOCATIONS) {
        center = LOCATIONS[secondTry];
      }
    }

    return center;
  }

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
        setMapCenter(getCenter(listingsJson.tokens[0].token.name));

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
        <Listing>
          <LeftHandDisplay>
            <img src={CONTRACTS[contractSlug].image_url + tokenId + ".png"} />
            <Icons tokenId={Number(tokenId)} contract={contractSlug} />
            <TraitDisplay attributes={attributes} />
          </LeftHandDisplay>
          <RightHandDisplay>
            <MarketHeader2>{token.name}</MarketHeader2>
            <Price value={listing.value}/>
            { token.owner && <Owner owner={token.owner} connectedAccount={account} ens={ens}/>}
            
            <ButtonWrapper>
              <MarketButtons
                account={account}
                owner={token.owner}
                listValue={listing.value}
              />
            </ButtonWrapper>
            {listing.validUntil ? (
              <ListingExpiration
                timer={countdownTimer}
                dateString={new Date(
                  listing.validUntil * 1000
                ).toLocaleString()}
              />
            ) : null}       
            <LoreWrapper>
              <LoreBlock pages={pages} />
            </LoreWrapper>
            <Minimap center={mapCenter}/>
          </RightHandDisplay>
        </Listing>
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
