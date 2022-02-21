import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import React, { useEffect, useState } from "react";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { hydratePageDataFromMetadata } from "../../../components/Lore/markdownUtils";
import IndividualLorePage from "../../../components/Lore/IndividualLorePage";
import {
  Icons, LoadingCard
} from "../../../components/Marketplace/marketplaceHelpers";
import {
  CONTRACTS,
  API_BASE_URL,
  LOCATIONS,
  ORDER_TYPE,
  BURN_ADDRESS,
  OS_WALLET,
  BACKGROUND
} from "../../../components/Marketplace/marketplaceConstants";
import { getProvider } from "../../../hooks/useProvider";
import MarketConnect from "../../../components/Marketplace/MarketConnect"
import { useEthers } from "@usedapp/core";
import countdown from "countdown";
import Link from "next/link";
import InfoTooltip from "../../../components/Marketplace/InfoToolTip";
import Order from "../../../components/Marketplace/Order";
import dynamic from "next/dynamic";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';

const DynamicMap = dynamic(() => import("../../../components/Marketplace/MiniMap"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

TimeAgo.addDefaultLocale(en);
const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const ListingWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;

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

const Arrows = styled.div`
  opacity: 30%;
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  top: 99%;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 100%;
    top: auto;
    opacity: 50%;
    margin-left: 0px;
    margin-right: 0px;
  }

  transition: all 200ms;
`;

const ArrowImage = styled.img`
  height: 25px;
  width: 25px;
  cursor: pointer;
  padding: 7px;

  background: var(--mediumGray);
  border-radius: 30px;
  border-style: dashed;
  border-width: 1px;
  border-color: var(--darkGray);
  
  @media only screen and (max-width: 600px) {
    height: 20px;
    width: 20px;
    padding: 5px;
  }

  transition: all 200ms;
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

const PriceValue = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const PriceStyle = styled.div`
  font-family: Alagard;
  font-size: 35px;
  color: var(--white);
  margin-bottom: var(--sp-3)
;  align-self: flex-start;
  @media only screen and (max-width: 600px) {
    align-self: center;
  }
  
`;

const ButtonImage = styled.img`
  margin-right: var(--sp-3);
  height: 35px;
  image-rendering: pixelated;
  margin-top: 5px;

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
  justify-content: flex-start;
  min-width: 400px;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const ExpirationWrapper = styled.div`
  text-align: left;
  font-size: 14px;
  font-family: Roboto Mono;
  color: var(--lightGray);
  display: flex;
  margin-top: 1vh;
  align-items: center;
  
  @media only screen and (max-width: 600px) {
    text-align: center;
    flex-wrap: wrap;
    justify-content: center;
    margin: 5% 5% 3% 5%;

    font-size: 13px;
  }
`;

const OfferWrapper = styled.div`
  text-align: left;
  font-size: 14px;
  font-family: Roboto Mono;
  color: var(--lightGray);
  display: flex;
  margin-top: 1vh;
  
  
  @media only screen and (max-width: 600px) {
    justify-content: center;
    font-size: 13px;
    margin-top: 0;
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

const TraitItem = styled.div`
  text-align: start;
  margin-left: 1vw;
  margin-right: 1vw;
  font-size: 24px;
  font-family: Alagard;
`;

const TraitRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 50px;
  align-items: center;
  
  font-family: Roboto Mono;
  background: var(--darkGray);
  color: var(--lightGray);
  border: 2px dashed var(--mediumGray);
  border-radius: 4px;

  margin: var(--sp-4);
  padding: var(--sp1) var(--sp0);

  :hover {
    cursor: pointer;
    background: var(--mediumGray);
    border-color: var(--lightGray);
  }

  transition: all 100ms;
`;

const TraitType = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
`;

const TraitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    padding: 20px;
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

const LoreContainer = styled.div`

  border: 2px dashed var(--mediumGray);
  border-radius: 4px;
  background: var(--darkGray);
  color: var(--lightGray);

  padding: 40px;
  width: 100%;

  font-family: Alagard;
  font-size: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const OSIcon = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 8px;
  margin-top: 2px;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 12px;
    height: 12px;
    margin-right: 4px;
    margin-top: 0;
  }

`;

const SoftLink = styled.a`
  text-decoration: none;
`;

function MarketAction({ 
  modal,
  actionType,
  tokenId,
  contract,
  name,
  hash,
  offerHash,
  setModal
}: {
  modal: boolean;
  actionType: ORDER_TYPE;
  tokenId: string;
  contract: string;
  name: string;
  hash: string;
  offerHash: string;
  setModal: (setting: boolean) => void;
}) {
  if (modal) {
      return (
        <Order 
          tokenId={tokenId} 
          contract={contract} 
          name={name} 
          setModal={setModal} 
          action={actionType} 
          hash={hash} 
          offerHash={offerHash} 
          collectionWide={false}
        />
      )
    } 

  return null
}

function MarketButton({ 
  type,
  setModal,
  setActionType
 }: { 
   type: ORDER_TYPE;
   setModal: (setting: boolean) => void;
   setActionType: (action: ORDER_TYPE) => void;
  }) {
  return (
    <ButtonImage
      src={`/static/img/marketplace/${type}.png`}
      onMouseOver={(e) =>
        (e.currentTarget.src = `/static/img/marketplace/${type}_hover.png`)
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = `/static/img/marketplace/${type}.png`)
      }
      onClick={(e) => { setModal(true); setActionType(type); }}
    />
  );
}

function MarketButtons({
  account,
  owner,
  listValue,
  hasOffer,
  setModal,
  setActionType,
  highestOffer,
}: {
  account: string | null | undefined;
  owner: string | null | undefined;
  listValue: number | null | undefined;
  hasOffer: boolean;
  setModal: (setting: boolean) => void;
  setActionType: (action: ORDER_TYPE) => void;
  highestOffer: boolean;
}) {
  if (!account) {
    return <MarketConnect />;
  }
  if (owner) {
    if (account.toLowerCase() == owner.toLowerCase()) {
      if (listValue) {
        return (
          <Buttons>
            {hasOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
            <MarketButton type={ORDER_TYPE.CANCEL_LISTING} setModal={setModal} setActionType={setActionType} />
          </Buttons>
        )
      } else {
        return (
          <Buttons>
            <MarketButton type={ORDER_TYPE.SELL} setModal={setModal} setActionType={setActionType} />
            {hasOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
          </Buttons>
        )
      }
    } else {
      return (
        <Buttons>
          {listValue && <MarketButton type={ORDER_TYPE.BUY} setModal={setModal} setActionType={setActionType} />}
          <MarketButton type={ORDER_TYPE.OFFER} setModal={setModal} setActionType={setActionType} />
          {highestOffer && <MarketButton type={ORDER_TYPE.CANCEL_OFFER} setModal={setModal} setActionType={setActionType} />}
        </Buttons>
      );
    }
  }
  return null;
}

function ListingExpiration({
  timer,
  date,
  isOS,
}: {
  timer: any;
  date: any;
  isOS: boolean;
}) {
  if (timer?.days > 1) {
    if (date) {
      return (
        <ExpirationWrapper>
          { isOS && <OSIcon src="/static/img/icons/nav/opensea_default.png" /> }
          Listing expires on {date.toLocaleString()}
        </ExpirationWrapper>
      );
    } else {
      return null;
    }
  } else if (timer) {
    return (
      <div>
        <ExpirationWrapper>
          { isOS && <OSIcon src="/static/img/icons/nav/opensea_default.png" /> }
          <span style={{width: '16ch', alignSelf: 'center'}}>Listing expires </span>
          <ReactTimeAgo style={{alignSelf: 'center'}} date={new Date(date.toLocaleString('en-US'))} locale={'en-US'}/>
        </ExpirationWrapper>
      </div>
    );
  } else {
    return <ExpirationWrapper>Listing expires</ExpirationWrapper>;
  }
}

function TraitDisplay({ 
  attributes,
  contract 
}: { 
  attributes: [];
  contract: string;
}) {
  if (attributes.length == 0) {
    return null;
  } else {
    return (
      <div style={{ textAlign: 'center' }}>
          <TraitWrapper>
            {attributes.map((attribute: any, index: number) => (
              <div key={index}>
                <Link 
                  href={`/marketplace/${contract}?${attribute.key.toLowerCase().replace('#', '%23')}=${attribute.value}`} 
                  passHref={true}
                >
                  <SoftLink>
                  <TraitRow>
                    <TraitType>{attribute.key}</TraitType>
                    <TraitItem>{attribute.value}</TraitItem>
                  </TraitRow>
                  </SoftLink>
                </Link>
              </div>
            ))}
          </TraitWrapper>
      </div>
    );
  }
}

function Price({ 
  value
}: { 
  value: number;
}) {
  return (
    <PriceStyle>
      {value ? (
        <PriceValue>
          <img
            src="/static/img/marketplace/eth_alt.png"
            style={{ height: '35px', marginRight: '12px' }}
          />
          <div>{value}</div>
        </PriceValue>
      ) : null}
    </PriceStyle>
  );
}

function LoreBlock({ 
  pages,
  length 
}: { 
  pages: [];
  length: number;
}) {
  if (pages?.length > 0) {
    return (
      <LoreContainer>
        {pages.map((page: any, index: number) =>
          page.nsfw ? (
            <div>NSFW Lore Entry not shown</div>
          ) : (
            <div key={index} style={{ marginTop: '6vh' }}>
              <IndividualLorePage bgColor={page.bgColor} story={page.story} />
            </div>
          )
        )}
      </LoreContainer>
    );
  } else if (length > 0) {
    return <LoreContainer><LoadingCard height={'auto'}/></LoreContainer>
  } else {
    return <LoreContainer>No Lore has been recorded...</LoreContainer>
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
    <Link href={`/marketplace/address/${owner}`}>
      {owner?.toLowerCase() == connectedAccount?.toLowerCase()
        ? "you" 
        : ens ? ens : owner.substring(0, 10)}
    </Link>
  );
}

const ListingPage = ({
  contractSlug,
  tokenId,
  lore,
  osListing,
}: {
  contractSlug: string;
  tokenId: string;
  lore: any;
  osListing: boolean;
}) => {
  const [token, setToken] = useState<any>({});
  const [listing, setListing] = useState<any>({});
  const [offer, setOffer] = useState<any>({});
  const [attributes, setAttributes] = useState<any>([]);
  const [pages, setPages] = useState<any>(null);
  const [ens, setEns] = useState<string | null>("");
  const [ownerEns, setOwnerEns] = useState<string | null>("");
  const [countdownTimer, setCountdownTimer] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<any>([0, 0]);
  const [modal, setModal] = useState(false);
  const [marketActionType, setMarketActionType] = useState(ORDER_TYPE.BUY);
  const [backgroundColor, setBackGroundColor] = useState(BACKGROUND.Black);
  const [keyImage, setKeyImage] = useState(0);
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

  // hacky workaround to grab location until it's added to metadata/stored locally
  function getCenter(name: string) {
    var center = [0, 0];
    var nameParts = name.split(" ");
    
    if((name.indexOf("of") == -1 && name.indexOf("the") == -1) || CONTRACTS[contractSlug].display == "Ponies") {
      return [404, 404]; // no location
    }

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
        `${API_BASE_URL}tokens/details?contract=${contractSlug}&tokenId=${tokenId}`,
        { headers: headers }
      );
      const listingsJson = await page.json();

      if (listingsJson.tokens.length > 0) {
        setToken(listingsJson.tokens[0].token);
        setListing(listingsJson.tokens[0].market.floorSell);
        setOffer(listingsJson.tokens[0].market.topBuy);
        setAttributes(listingsJson.tokens[0].token.attributes);
        setMapCenter(getCenter(listingsJson.tokens[0].token.name));
        setCountdownTimer(countdown(new Date(listingsJson.tokens[0].market.floorSell.validUntil * 1000)));

        const provider = getProvider();
        var ensName = await provider.lookupAddress(
          listingsJson.tokens[0].token.owner
        );

        setEns(ensName);

        if (listingsJson.tokens[0].market.topBuy.maker) {
          var ownerEns = await provider.lookupAddress(
            listingsJson.tokens[0].market.topBuy.maker
          );

          setOwnerEns(ownerEns);
        }

        for (var trait of listingsJson.tokens[0].token.attributes) {
          if (trait.key == 'Background') {
            setBackGroundColor(BACKGROUND[trait.value]);
          }
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
      
    }

    run();
  }, [modal]);

  return (
    <Layout title={token.name}>
      {Object.keys(listing).length > 0 ? 
        <ListingWrapper>
          { modal && 
            <MarketAction 
              modal={modal} 
              actionType={marketActionType} 
              tokenId={tokenId} 
              contract={contractSlug} 
              name={token.name} 
              hash={listing.hash} 
              offerHash={offer.hash} 
              setModal={setModal}
            />
          }
          <Listing>
            <TopDisplay>
              <TopLeft>
              <TokenImage 
                src={imageUrls[keyImage]} 
                height={400} 
                width={400}
                style={{background: backgroundColor}}
              />
              { CONTRACTS[contractSlug].display == 'Wizards' && 
                <Arrows className={'dropdown'}>
                  <ArrowImage className={'dropdown-image'} 
                    src='/static/img/marketplace/arrow_left.png'
                    onClick={()=> setKeyImage((keyImage - 1 + imageUrls.length) % imageUrls.length)}
                  />
                  <ArrowImage className={'dropdown-image'} 
                    src='/static/img/marketplace/arrow_right.png' 
                    onClick={()=> setKeyImage((keyImage + 1) % imageUrls.length)}
                  />
                </Arrows>
              }
              </TopLeft>
              <TopRight>
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
                  <Price value={listing.value} />
                  {token.owner != BURN_ADDRESS &&
                    <ButtonWrapper>
                      <MarketButtons
                        account={account}
                        owner={token.owner}
                        listValue={listing.value}
                        hasOffer={offer.value != null}
                        setModal={setModal}
                        setActionType={setMarketActionType}
                        highestOffer={offer.value && offer.maker.toLowerCase() == account?.toLowerCase()}
                      />
                    </ButtonWrapper>
                  }
                  {listing.validUntil && 
                    <ListingExpiration
                      timer={countdownTimer}
                      date={new Date(listing.validUntil * 1000)}
                      isOS={osListing}
                    />
                  }
                  {offer.value && 
                    <OfferWrapper>{'Best Offer:  '}
                      <PriceValue>
                        <img
                          src="/static/img/marketplace/eth_alt.png"
                          style={{ height: "15px", marginRight: "5px", marginLeft: "7px", marginTop: "1px" }}
                        />
                        {`${offer.value} from`}&nbsp;
                        <Owner owner={offer.maker} connectedAccount={account} ens={ownerEns}/>
                      </PriceValue>
                    </OfferWrapper>
                  }
                </PriceDisplay>
              </TopRight>
            </TopDisplay>
            <HorizontalLine/>
            <SectionWrapper>
            <SectionDisplay>
              <SectionName>Traits</SectionName>
              <a href="https://www.youtube.com/watch?v=GmL4WBj-36o" target="_blank">
                <InfoTooltip tooltip={`Attributes and affinity that define this ${CONTRACTS[contractSlug].singular.toLowerCase()}, encoded on-chain`}/>
              </a>
              </SectionDisplay>
            <MidDisplay>
              <TraitDisplay attributes={attributes} contract={contractSlug} />
              <DynamicMap center={mapCenter} />
            </MidDisplay>
            </SectionWrapper>
            <HorizontalLine/>
            <SectionWrapper>
            <SectionDisplay>
              <SectionName>Lore</SectionName>
              <a href="https://www.forgottenrunes.com/posts/lore-creation" target="_blank">
                <InfoTooltip tooltip={`${CONTRACTS[contractSlug].singular} owners can inscribe lore for their ${CONTRACTS[contractSlug].display.toLowerCase()} on-chain`}/>
              </a>
            </SectionDisplay>
            <BottomDisplay>
              <LoreWrapper>
                <LoreBlock pages={pages} length={lore.length}/>
              </LoreWrapper>
              <Icons tokenId={Number(tokenId)} contract={contractSlug} />
            </BottomDisplay>
            </SectionWrapper>
            <BottomLine/>
          </Listing>
        </ListingWrapper> :
        <ListingWrapper><LoadingCard height={'80vh'}/></ListingWrapper>
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

  // Workaround to determine listing origin
  try {
      const orderPage = await fetch(
        `${API_BASE_URL}orders/fill?contract=${contractSlug}&tokenId=${tokenId}`,
        { headers: headers }
      );
      const orderJson = await orderPage.json();
      console.log(`${API_BASE_URL}orders/fill?contract=${contractSlug}&tokenId=${tokenId}`);
      var osListing = orderJson.order.params.feeRecipient == OS_WALLET;
      
  } catch(e) {
    console.error("Could not determine listing origin")
    osListing = false;
  }

  return {
    props: {
      contractSlug,
      tokenId: tokenId,
      lore: results,
      osListing: osListing,
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
