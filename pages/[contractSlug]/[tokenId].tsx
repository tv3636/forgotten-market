import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Marketplace/NewLayout";
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
  ORDER_TYPE,
  BURN_ADDRESS,
  COMMUNITY_CONTRACTS,
} from "../../components/Marketplace/marketplaceConstants";
import { getProvider } from "../../hooks/useProvider";
import { useEthers } from "@usedapp/core";
import countdown from "countdown";
import Order from "../../components/Marketplace/Order";
import LoreBlock from "../../components/Marketplace/LoreBlock";
import MarketButtons from "../../components/Marketplace/MarketButtons";
import TraitDisplay from "../../components/Marketplace/TraitDisplay";
import { ListingExpiration } from "../../components/Marketplace/ListingExpiration";
import Carousel from "../../components/Marketplace/MarketCarousel";
import { Owner } from "../../components/Marketplace/OfferDisplay";
import { isOpenSeaBanned } from '@reservoir0x/client-sdk';
import RuneHeader from "../../components/Marketplace/RuneHeader";
import wizards from "../../data/wizards.json";
import warriors from "../../data/warriors.json";
import souls from "../../data/souls.json";
import ponies from "../../data/ponies.json";
import babies from "../../data/babies.json";
import MarketDisplay from "../../components/Marketplace/MarketDisplay";
import MobileOverlay from "../../components/Marketplace/MobileOverlay";
import { MainMenu } from "../../components/Marketplace/NewSiteNav";

const collectionData: any = {
  'Wizards': wizards as { [wizardId: string]: any },
  'Warriors': warriors as { [warriorId: string]: any},
  'Souls': souls as { [soulId: string]: any },
  'Ponies': ponies as { [ponyId: string]: any },
  'Babies': babies as { [babyId: string]: any },
}

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const PageWrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 90vh;

  ::-webkit-scrollbar {
    display: none;
  }

  @media only screen and (max-width: 600px) {
    margin-top: var(--sp1);
    max-height: 80vh;
  }

`;

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
  margin-bottom: var(--sp0);
  max-width: 1300px;

`;

const TopDisplay = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  margin-top: var(--sp-1);

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
  padding-top: 0;
  max-width: calc(100% - 460px - var(--sp3));
  align-self: flex-start;
  display: flex;
  flex-wrap: wrap;
  text-align: center;

  @media only screen and (max-width: 600px) {
    margin-left: 0px;
    justify-content: center;
    max-width: 80%;
    height: auto !important;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;

  align-items: center;
`;

const ImageWrapper = styled.div`
  @media only screen and (max-width: 600px) {
    position: relative;
  }
`;

const TokenImage = styled.img`
  padding: var(--sp1);
  width: 400px;
  height: 400px;

  @media only screen and (max-width: 600px) {
    max-width: 300px;
    max-height: 300px;
  }
`;

const NameDisplay = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
`;

const NameStyle = styled.h1`
  font-size: var(--sp3);
  max-width: 20ch;
  display: inline-block;
  text-shadow: 0px 4px var(--midGray);

  text-align: left;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-block-start: 0px;

  @media only screen and (max-width: 600px) {
    text-align: center;
    font-size: var(--sp2);

    margin-top: var(--sp-3);
  }
`;

const OwnerStyle = styled.h4`
  font-family: Terminal;
  font-size: var(--sp0);
  text-transform: uppercase;
  color: var(--lightGray);

  text-align: left;
  margin-top: var(--sp-4);

  @media only screen and (max-width: 600px) {
    text-align: center;
    margin-top: var(--sp1);
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
    width: 90%;

    margin-top: 0;
    margin-bottom: 0;
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

const MidDisplay = styled.div`
  text-align: center;
  margin-top: var(--sp-1);

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

  margin-top: var(--sp-1);
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
  font-family: Terminal;
  text-transform: uppercase;
  color: red;
  display: flex;
  align-items: center;

  margin-top: var(--sp-3);
  
  @media only screen and (max-width: 600px) {
    justify-content: center;
    font-size: 13px;
    margin-top: 0;
  }
`;

const WarningSymbol = styled.div`
  font-size: 20px;
`;

const NewFrame = styled.div`
  --frameSize: 36px;
  width: calc(100% + 0.85 * var(--frameSize));
  height: calc(100% - 15px);

  position: absolute;
  left: calc(-0.425 * var(--frameSize));
  top: calc(-0.1 * var(--frameSize));
  z-index: 1;
  border-image-source: url(/static/img/newframe_black.png);
  border-image-slice: 35 50;
  border-image-width: var(--frameSize);
  border-image-outset: 0;
  border-style: solid;
  border-image-repeat: round;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 100%;
    left: 0;
  }
`;

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
  const [burgerActive, setBurgerActive] = useState(false);
  const { account } = useEthers();
  let contracts = contractSlug in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;

  const imageUrls: string[] = [
    contracts[contractSlug].display == 'Wizards' ? 
    contracts[contractSlug].image_url + tokenId + '/' + tokenId + '.png' : 
    contracts[contractSlug].image_url + tokenId + ".png",
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-0-front.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-1-left.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-2-back.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-3-right.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif`
  ]
  
  var backgroundColor = contracts[contractSlug].display in collectionData && tokenId in collectionData[contracts[contractSlug].display] ? 
  `${collectionData[contracts[contractSlug].display][tokenId].background}` : '#000000';

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
      if (contracts[contractSlug].display == 'Wizards') {
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
      if (contracts[contractSlug].display == 'Flames') {
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
        contracts[contractSlug].display in collectionData && tokenId in collectionData[contracts[contractSlug].display] ?
        collectionData[contracts[contractSlug].display][tokenId].name :
        `${contracts[contractSlug].singular} #${tokenId}`
      } 
      description={`${contracts[contractSlug].singular} #${tokenId}`}
      image={imageUrls[0]}
      setBurgerActive={setBurgerActive}
    >
      <PageWrapper>
        <RuneHeader>
          {`${contracts[contractSlug].singular.toUpperCase()} #${tokenId}`}
        </RuneHeader>
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
                trait={''}
                traitValue={''}
              />
            }
            <Listing>
              <TopDisplay>
                <TopLeft>
                  <ImageWrapper>
                    <TokenImage 
                      src={imageUrls[keyImage]} 
                      style={{background: backgroundColor}}
                    />
                    <NewFrame/>
                  </ImageWrapper>
                  { contracts[contractSlug].display == 'Wizards' && 
                    <Carousel 
                      keyImage={keyImage}
                      setKeyImage={setKeyImage}
                      imageUrls={imageUrls}
                    />
                  }
                </TopLeft>
                <TopRight
                  style={{height: contracts[contractSlug].display == 'Flames' ? 476 : 420}}
                >
                  <NameDisplay>
                    <NameStyle className='alagard'>{token.name}</NameStyle>
                    {token.owner && (
                      <OwnerStyle>
                        {`Owner: `}
                        <Owner owner={token.owner} connectedAccount={account} ens={ens}/>
                      </OwnerStyle>
                    )}
                  </NameDisplay>
                  <PriceDisplay>
                    <MarketDisplay 
                      price={listing.price} 
                      bid={offer.value} 
                      lastPrice={ token.lastBuy.timestamp > token.lastSell.timestamp ? token.lastBuy.value?.toPrecision(3) : token.lastSell.value?.toPrecision(3) }
                      lastSaleWeth={ token.lastBuy.timestamp > token.lastSell.timestamp }
                    />
                    {token.owner != BURN_ADDRESS &&
                      <ButtonWrapper>
                        <MarketButtons
                          account={account}
                          owner={contracts[contractSlug].display == 'Flames' && flameHolder ? account : token.owner}
                          listValue={listing.price}
                          hasOffer={offer.value != null}
                          setModal={setModal}
                          setActionType={setMarketActionType}
                          highestOffer={offer.value && offer.maker.toLowerCase() == account?.toLowerCase()}
                          native={listing.source.name == 'Forgotten Market'}
                          tokenType={contracts[contractSlug].display == 'Flames' ? 1155 : 721}
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
              <RuneHeader>TRAITS</RuneHeader>
                <MidDisplay>
                  <TraitDisplay 
                    attributes={attributes} 
                    fullAttributes={fullAttributes} 
                    contract={contractSlug} 
                    tokenId={tokenId} 
                  />
                </MidDisplay>
              </SectionWrapper>
              {contracts[contractSlug].display != 'Flames' &&  <HorizontalLine/> }
              {contracts[contractSlug].display != 'Flames' && 
                <SectionWrapper>
                  <RuneHeader>LORE</RuneHeader>
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
      </PageWrapper>
      <MobileOverlay burgerActive={burgerActive} setBurgerActive={setBurgerActive}>
        <RuneHeader>NAVIGATION</RuneHeader>
        <MainMenu className="mobile"/>
      </MobileOverlay>
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
