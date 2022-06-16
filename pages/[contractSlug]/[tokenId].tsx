import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import React, { useEffect, useState } from "react";
import client from "../../lib/graphql";
import { gql } from "@apollo/client";
import { hydratePageDataFromMetadata } from "../../components/Lore/markdownUtils";
import {
  Icons, LoadingCard
} from "../../components/Marketplace/marketplaceHelpers";
import {
  CONTRACTS,
  API_BASE_URL,
  LOCATIONS,
  ORDER_TYPE,
  BURN_ADDRESS,
} from "../../components/Marketplace/marketplaceConstants";
import { getProvider } from "../../hooks/useProvider";
import { useEthers } from "@usedapp/core";
import countdown from "countdown";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import Order from "../../components/Marketplace/Order";
import dynamic from "next/dynamic";
import wizards from "../../data/wizards.json";
import souls from "../../data/souls.json";
import ponies from "../../data/ponies.json";
import warriors from "../../data/warriors.json";
import Price from "../../components/Marketplace/Price";
import LoreBlock from "../../components/Marketplace/LoreBlock";
import MarketButtons from "../../components/Marketplace/MarketButtons";
import TraitDisplay from "../../components/Marketplace/TraitDisplay";
import { ListingExpiration } from "../../components/Marketplace/ListingExpiration";
import Carousel from "../../components/Marketplace/MarketCarousel";
import OfferDisplay, { Owner } from "../../components/Marketplace/OfferDisplay";
import { isOpenSeaBanned } from '@reservoir0x/client-sdk';

const wizData = wizards as { [wizardId: string]: any };
const soulData = souls as { [soulId: string]: any };
const ponyData = ponies as { [ponyId: string]: any };
const warriorsData = warriors as { [warriorId: string]: any };

const DynamicMap = dynamic(() => import("../../components/Marketplace/MiniMap"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const ListingWrapper = styled.div`
  display: flex;
  justify-content: center;

  max-width: 1000px;
  min-height: 90vh;
  margin: 0 auto;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
  }
`;

const Listing = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--sp0);
  margin-bottom: var(--sp0);
  max-width: 1300px;

`;

const TopDisplay = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: var(--sp1);

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const TopLeft = styled.div`
  display: flex;  
  flex-direction: column;
  align-items: center;
  width: 400px;
  position: relative;

  :hover {
    .dropdown {
      opacity: 80%;
    }

    .dropdown-image {
      border-color: var(--lightGray);
    }
  }

  @media only screen and (max-width: 600px) {
    width: 370px;
    align-content: center;
  }
`;

const TopRight = styled.div`
  margin-left: var(--sp3);
  height: 420px;
  padding: var(--sp0);
  max-width: calc(100% - 460px - var(--sp3));
  align-self: flex-start;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  @media only screen and (max-width: 600px) {
    margin-left: 0px;
    justify-content: center;
    max-width: 80%;
    height: auto;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;

  align-items: flex-start;
`;

const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);
  background: #1f0200;

  @media only screen and (max-width: 600px) {
    border: 4px solid var(--darkGray);
    max-width: 300px;
    max-height: 300px;
  }
`;

const NameDisplay = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
`;

const NameStyle = styled.h2`
  font-family: Alagard;
  font-size: 45px;
  max-width: 20ch;
  display: inline-block;
  
  color: white;

  text-align: left;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-block-start: 0px;

  @media only screen and (max-width: 600px) {
    text-align: center;
    font-size: 25px;
  }
`;

const OwnerStyle = styled.h4`
  font-family: Roboto Mono;
  font-size: 14px;
  font-weight: normal;
  color: var(--lightGray);

  text-align: left;
  margin-block-start: 0.5vh;

  @media only screen and (max-width: 600px) {
    text-align: center;
    margin-top: 2vh;
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @media only screen and (max-width: 600px) {
    align-self: flex-start;
    margin-top: 4vh;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-width: 400px;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const HorizontalLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 100%;
  border-width: 1px;
  margin-top: var(--sp2);
  margin-bottom: var(--sp2);

  @media only screen and (max-width: 600px) {
    border-color: var(--mediumGray);
    width: 90%;
  }
`;

const BottomLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 100%;
  border-width: 1px;
  margin-top: var(--sp2);
  margin-bottom: var(--sp2);
`;

const SectionDisplay = styled.div`
  font-family: Alagard;
  font-size: 24px;
  color: var(--white);
  align-self: flex-start;
  margin-bottom: var(--sp-3);
  display: flex;
  align-items: center;

  @media only screen and (max-width: 600px) {
    align-self: center;
  }
`;

const SectionName = styled.div`
  margin-right: var(--sp-1);
`;

const MidDisplay = styled.div`
  text-align: center;
  margin-right: 1.5vw;


  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const BottomDisplay = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LoreWrapper = styled.div`
  min-width: 75%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 600px) {
    margin-left: 40px;
    margin-right: 40px;
  }
`;

const WarningWrapper = styled.div`
  text-align: left;
  font-size: 14px;
  font-family: Roboto Mono;
  color: red;
  display: flex;
  align-items: flex-end;
  
  @media only screen and (max-width: 600px) {
    justify-content: center;
    font-size: 13px;
    margin-top: 0;
  }
`;

const WarningSymbol = styled.div`
  font-size: 20px;
`;

function SectionHeader({
  title,
  link,
  tooltip
}:{
  title: string;
  link: string;
  tooltip: string;
}) {
  return (
    <SectionDisplay>
      <SectionName>{title}</SectionName>
        <a href={link} target="_blank">
          <InfoTooltip tooltip={tooltip}/>
        </a>
    </SectionDisplay>
  )
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
  const [offer, setOffer] = useState<any>({});
  const [attributes, setAttributes] = useState<any>([]);
  const [fullAttributes, setFullAttributes] = useState<any>([]);
  const [pages, setPages] = useState<any>(null);
  const [ens, setEns] = useState<string | null>("");
  const [ownerEns, setOwnerEns] = useState<string | null>("");
  const [countdownTimer, setCountdownTimer] = useState<any>(null);
  const [modal, setModal] = useState(false);
  const [marketActionType, setMarketActionType] = useState(ORDER_TYPE.BUY);
  const [keyImage, setKeyImage] = useState(0);
  const [flameHolder, setFlameHolder] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const { account } = useEthers();

  const imageUrls: string[] = [
    CONTRACTS[contractSlug].display == 'Wizards' ? 
      CONTRACTS[contractSlug].image_url + tokenId + '/' + tokenId + '.png' : 
      CONTRACTS[contractSlug].image_url + tokenId + ".png",
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-0-front.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-1-left.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-2-back.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-3-right.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif`
  ]
  
  var backgroundColor = CONTRACTS[contractSlug].display == 'Wizards' ? `${wizData[tokenId].background}` : '#000000';
  var center = CONTRACTS[contractSlug].display == 'Wizards' && wizData[tokenId].location in LOCATIONS ? 
    LOCATIONS[wizData[tokenId].location] : [0, 0];

  if (CONTRACTS[contractSlug].display != 'Wizards' && 
    CONTRACTS[contractSlug].display != 'Souls') {
    center = [404, 404];
  }

  useEffect(() => {
    async function run() {
      const page = await fetch(
        `${API_BASE_URL}tokens/details/v3?tokens=${contractSlug}:${tokenId}`,
        { headers: headers }
      );
      const listingsJson = await page.json();

      if (listingsJson.tokens.length > 0) {
        setToken(listingsJson.tokens[0].token);
        setListing(listingsJson.tokens[0].market.floorAsk);
        setOffer(listingsJson.tokens[0].market.topBid);
        setAttributes(listingsJson.tokens[0].token.attributes);
        setCountdownTimer(countdown(new Date(listingsJson.tokens[0].market.floorAsk.validUntil * 1000)));

        console.log(listingsJson);

        const traits = await fetch(
          `${API_BASE_URL}collections/${contractSlug}/attributes/all/v1`,
          { headers: headers }
        );
  
        const traitJson = await traits.json();
        setFullAttributes(traitJson.attributes);

        try {
          const provider = getProvider();
          var ensName = await provider.lookupAddress(listingsJson.tokens[0].token.owner);
          setEns(ensName);

          if (listingsJson.tokens[0].market.topBid.maker) {
            var ownerEns = await provider.lookupAddress(listingsJson.tokens[0].market.topBid.maker);
            setOwnerEns(ownerEns);
          }
        } catch (e) {
          console.error("Couldn't get ENS");
        }
      }
      
      // Load lore
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
      
      // Preload turnaround images
      if (CONTRACTS[contractSlug].display == 'Wizards') {
        for (var url of imageUrls) {
          const img = new Image().src = url;
        }
      }
      
      setIsBanned(await isOpenSeaBanned(contractSlug, Number(tokenId)));
    }

    run();
  }, [modal, contractSlug]);

  useEffect(() => {
    async function getFlames() {
      if (CONTRACTS[contractSlug].display == 'Flames') {
        const userFlames = await fetch(
          `${API_BASE_URL}users/${account}/tokens/v2?collection=${contractSlug}&offset=0&limit=20`,
          { headers: headers }
        );

        const flamesJson = await userFlames.json();
        setFlameHolder(flamesJson.tokens.length > 0);
      }
    }
    if (account) {
      getFlames();
    }
  }, [account])

  return (
    <Layout 
      title={
        CONTRACTS[contractSlug].display == 'Wizards' ? wizData[tokenId].name : 
        CONTRACTS[contractSlug].display == 'Souls' && tokenId in soulData ? soulData[tokenId] : 
        CONTRACTS[contractSlug].display == 'Ponies' && tokenId in ponyData ? ponyData[tokenId] :
        CONTRACTS[contractSlug].display == 'Warriors' && tokenId in warriorsData ? warriorsData[tokenId].name :
        `${CONTRACTS[contractSlug].singular} #${tokenId}`
      } 
      description={`${CONTRACTS[contractSlug].singular} #${tokenId}`}
      image={imageUrls[0]}
    >
      {Object.keys(listing).length > 0 && Object.keys(fullAttributes).length > 0 ? 
        <ListingWrapper>
          { modal && 
            <Order 
              tokenId={tokenId} 
              contract={contractSlug} 
              name={token.name} 
              setModal={setModal} 
              action={marketActionType} 
              hash={listing.id} 
              offerHash={offer.id} 
              collectionWide={false}
            />
          }
          <Listing>
            <TopDisplay>
              <TopLeft>
                <TokenImage 
                  src={imageUrls[keyImage]} 
                  height={CONTRACTS[contractSlug].display == 'Flames' ? 456 : 400}
                  width={400}
                  style={{background: backgroundColor}}
                />
                { CONTRACTS[contractSlug].display == 'Wizards' && 
                  <Carousel 
                    keyImage={keyImage}
                    setKeyImage={setKeyImage}
                    imageUrls={imageUrls}
                  />
                }
              </TopLeft>
              <TopRight
                style={{height: CONTRACTS[contractSlug].display == 'Flames' ? 476 : 420}}
              >
                <NameDisplay>
                  <NameStyle>{token.name}</NameStyle>
                  {token.owner && (
                    <OwnerStyle>
                      {`#${tokenId} - Owner: `}
                      <Owner owner={token.owner} connectedAccount={account} ens={ens}/>
                    </OwnerStyle>
                  )}
                </NameDisplay>
                <PriceDisplay>
                  <Price value={listing.price} size={1} />
                  {token.owner != BURN_ADDRESS &&
                    <ButtonWrapper>
                      <MarketButtons
                        account={account}
                        owner={CONTRACTS[contractSlug].display == 'Flames' && flameHolder ? account : token.owner}
                        listValue={listing.price}
                        hasOffer={offer.value != null}
                        setModal={setModal}
                        setActionType={setMarketActionType}
                        highestOffer={offer.value && offer.maker.toLowerCase() == account?.toLowerCase()}
                        native={listing.source.name == 'Forgotten Market'}
                        tokenType={CONTRACTS[contractSlug].display == 'Flames' ? 1155 : 721}
                        myOffer={offer.value && offer.maker?.toLowerCase() == account?.toLowerCase()}
                      />
                    </ButtonWrapper>
                  }
                  {listing.validUntil && 
                    <ListingExpiration
                      timer={countdownTimer}
                      date={new Date(listing.validUntil * 1000)}
                      source={listing.source.id}
                    />
                  }
                  {offer.value ? 
                    <OfferDisplay 
                      value={offer.value}
                      maker={offer.maker}
                      account={account ?? ''}
                      ens={ownerEns ?? ''}
                    /> :
                    null
                  }
                  { isBanned && 
                    <WarningWrapper>
                      <WarningSymbol style={{marginRight: '10px'}}>⚠</WarningSymbol> 
                      Reported as stolen on OpenSea 
                      <WarningSymbol style={{marginLeft: '10px'}}>⚠</WarningSymbol> 
                    </WarningWrapper> 
                  }
                </PriceDisplay>
              </TopRight>
            </TopDisplay>
            <HorizontalLine/>
            <SectionWrapper>
              <SectionHeader 
                title={'Traits'}
                link={'https://www.youtube.com/watch?v=GmL4WBj-36o'}
                tooltip={`Attributes and affinity that define this ${CONTRACTS[contractSlug].singular.toLowerCase()}, encoded on-chain`}
              />
              <MidDisplay>
                <TraitDisplay attributes={attributes} fullAttributes={fullAttributes} contract={contractSlug} tokenId={tokenId} />
                <DynamicMap center={center} />
              </MidDisplay>
            </SectionWrapper>
            {CONTRACTS[contractSlug].display != 'Flames' &&  <HorizontalLine/> }
            {CONTRACTS[contractSlug].display != 'Flames' && 
              <SectionWrapper>
                <SectionDisplay>
                  <SectionHeader
                    title={'Lore'}
                    link={'https://www.forgottenrunes.com/posts/lore-creation'}
                    tooltip={`${CONTRACTS[contractSlug].singular} owners can inscribe lore for their ${CONTRACTS[contractSlug].display.toLowerCase()} on-chain`}
                  />
                </SectionDisplay>
                <BottomDisplay>
                  <LoreWrapper>
                    <LoreBlock 
                      pages={pages} 
                      length={lore.length} 
                      tokenId={tokenId} 
                      contract={contractSlug}
                    />
                  </LoreWrapper>
                  <Icons tokenId={Number(tokenId)} contract={contractSlug} />
                </BottomDisplay>
              </SectionWrapper>
            }
            <BottomLine/>
          </Listing>
        </ListingWrapper> :
        <ListingWrapper>
          <LoadingCard height={'80vh'}/>
        </ListingWrapper>
      }
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
    console.error("Couldn't fetch lore. Continuing anyway as it's non-fatal...");
    results = [];
  }

  return {
    props: {
      contractSlug: contractSlug.toLowerCase(),
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
