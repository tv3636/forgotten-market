import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import React, { useEffect, useState } from "react";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { hydratePageDataFromMetadata } from "../../../components/Lore/markdownUtils";
import IndividualLorePage from "../../../components/Lore/IndividualLorePage";
import {
  Icons
} from "../../../components/Marketplace/marketplaceHelpers";
import {
  CONTRACTS,
  API_BASE_URL,
  LOCATIONS,
  OrderType,
} from "../../../components/Marketplace/marketplaceConstants";
import { getProvider } from "../../../hooks/useProvider";
import MarketConnect from "../../../components/Marketplace/MarketConnect"
import { useEthers } from "@usedapp/core";
import countdown from "countdown";
import Link from "next/link";
import InfoTooltip from "../../../components/Marketplace/InfoToolTip";
import Order from "../../../components/Marketplace/Order";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../../../components/Marketplace/MiniMap"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

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

const TopRight = styled.div`
  margin-left: var(--sp3);
  height: 400px;
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
  
  @media only screen and (max-width: 600px) {
    text-align: center;
    flex-wrap: wrap;
    justify-content: center;
    margin: 5% 5% 3% 5%;
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

const SoftLink = styled.a`
  text-decoration: none;
`;

function MarketAction({ 
  modal,
  actionType,
  tokenId,
  contract,
  name,
  setModal
}: {
  modal: boolean;
  actionType: OrderType;
  tokenId: string;
  contract: string;
  name: string;
  setModal: any;
}) {
  if (modal) {
      return (
        <Order tokenId={tokenId} contract={contract} name={name} setModal={setModal} action={actionType} collectionWide={false}/>
      )
    } 

  return null
}

function MarketButton({ 
  type,
  setModal,
  setActionType
 }: { 
   type: OrderType;
   setModal: any;
   setActionType: any;
  }) {
  return (
    <ButtonImage
      src={"/static/img/marketplace/" + type + ".png"}
      onMouseOver={(e) =>
        (e.currentTarget.src = "/static/img/marketplace/" + type + "_hover.png")
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = "/static/img/marketplace/" + type + ".png")
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
  setModal: any;
  setActionType: any;
  highestOffer: boolean;
}) {
  if (!account) {
    return <MarketConnect />;
  }
  if (owner) {
    if (account.toLowerCase() == owner.toLowerCase()) {
      if (listValue) {
        // TODO: replace with MarketButton once drawn
        return (
          <Buttons>
            {hasOffer && <MarketButton type={OrderType.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
            <MarketButton type={OrderType.CANCEL_LISTING} setModal={setModal} setActionType={setActionType} />
          </Buttons>
        )
      } else {
        return (
          <Buttons>
            <MarketButton type={OrderType.SELL} setModal={setModal} setActionType={setActionType} />
            {hasOffer && <MarketButton type={OrderType.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
          </Buttons>
        )
      }
    } else {
      return (
        <Buttons>
          {listValue && <MarketButton type={OrderType.BUY} setModal={setModal} setActionType={setActionType} />}
          <MarketButton type={OrderType.OFFER} setModal={setModal} setActionType={setActionType} />
          {highestOffer && <MarketButton type={OrderType.CANCEL_OFFER} setModal={setModal} setActionType={setActionType} />}
        </Buttons>
      );
    }
  }
  return null;
}

function ListingExpiration({
  timer,
  dateString,
}: {
  timer: any;
  dateString: string;
}) {
  if (timer?.days > 1) {
    if (dateString) {
      return <ExpirationWrapper>Listing expires on {dateString}</ExpirationWrapper>;
    } else {
      return null;
    }
  } else if (timer) {
    return (
      <div>
        <ExpirationWrapper>
          <span style={{width: '18ch'}}>Listing expires in</span>
          {timer?.days > 0 && <span style={{width: '7ch', textAlign: 'right'}}> {timer?.days} {timer?.days && timer.days == 1 ? 'day' : 'days'}, </span>}
          {timer?.hours > 0 && <span style={{width: '10ch', textAlign: 'right'}}> {timer?.hours} {timer?.hours && timer.hours == 1 ? 'hour' : 'hours'}, </span>}
          {timer?.minutes > 0 && <span style={{width: '12ch', textAlign: 'right'}}> {timer?.minutes} {timer?.minutes && timer.minutes == 1 ? 'minute' : 'minutes'}, </span>}
          <span style={{width: '11ch', textAlign: 'right'}}> {timer?.seconds} {timer?.seconds && timer.seconds == 1 ? 'second' : 'seconds'} </span>
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
      <div style={{ textAlign: "center" }}>
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

function Price({ value }: { value: number}) {
  return (
    <PriceStyle>
      {value ? (
        <PriceValue>
          <img
            src="/static/img/marketplace/eth_alt.png"
            style={{ height: "37px", marginRight: "12px" }}
          />
          <div>{value}</div>
        </PriceValue>
      ) : null}
    </PriceStyle>
  );
}

function LoreBlock({ pages }: { pages: [] }) {
  if (pages?.length > 0) {
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
  tokenId,
}: {
  owner: string;
  connectedAccount: string | null | undefined;
  ens: string | null;
  tokenId: string;
}) {
  return (
    <a href={"https://forgottenrunes.com/address/" + owner} target="_blank" rel="noopener noreferrer">
      {owner?.toLowerCase() == connectedAccount?.toLowerCase()
        ? "you" 
        : ens ? ens : owner.substring(0, 10)}
    </a>
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
  const [offer, setOffer] = useState<any>({});
  const [attributes, setAttributes] = useState<any>([]);
  const [pages, setPages] = useState<any>(null);
  const [ens, setEns] = useState<string | null>("");
  const [countdownTimer, setCountdownTimer] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<any>([0, 0]);
  const [modal, setModal] = useState(false);
  const [marketActionType, setMarketActionType] = useState(OrderType.BUY);
  const { account } = useEthers();

  // hacky workaround to grab location until it's added to metadata/stored locally
  function getCenter(name: string) {
    var center = [0, 0];
    var nameParts = name.split(" ");
    
    if((name.indexOf('of') == -1 && name.indexOf('the') == -1) || CONTRACTS[contractSlug].display == 'Ponies') {
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
    let interval: any = null;

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
        setOffer(listingsJson.tokens[0].market.topBuy);
        setAttributes(listingsJson.tokens[0].token.attributes);
        setMapCenter(getCenter(listingsJson.tokens[0].token.name));
        setCountdownTimer(countdown(new Date(listingsJson.tokens[0].market.floorSell.validUntil * 1000)));
        interval = setInterval(
          () => setCountdownTimer(countdown(new Date(listingsJson.tokens[0].market.floorSell.validUntil * 1000))),
          1000
        );

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

    return () => {
      clearInterval(interval);
    }

  }, [modal]);

  return (
    <Layout title={token.name}>
      {Object.keys(listing).length > 0 ? 
        <ListingWrapper>
        {modal && <MarketAction modal={modal} actionType={marketActionType} tokenId={tokenId} contract={contractSlug} name={token.name} setModal={setModal}/>}
        <Listing>
          <TopDisplay>
            <TokenImage src={CONTRACTS[contractSlug].display == 'Wizards' ? CONTRACTS[contractSlug].image_url + tokenId + '/' + tokenId + '.png' : CONTRACTS[contractSlug].image_url + tokenId + ".png"} height={400} width={400} />
            <TopRight>
              <NameDisplay>
                <NameStyle>{token.name}</NameStyle>
                {token.owner && (
                  <OwnerStyle>
                    {`#${tokenId} - Owner: `}
                    <Owner owner={token.owner} connectedAccount={account} ens={ens} tokenId={tokenId}/>
                  </OwnerStyle>
                )}
              </NameDisplay>
              <PriceDisplay>
                <Price value={listing.value} />
                {token.owner != '0x0000000000000000000000000000000000000000' &&
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
                {listing.validUntil ? (
                  <ListingExpiration
                    timer={countdownTimer}
                    dateString={new Date(
                      listing.validUntil * 1000
                    ).toLocaleString()}
                  />
                ) : null}
                {offer.value && 
                  <OfferWrapper>{'Best Offer:  '}
                    <PriceValue>
                      <img
                        src="/static/img/marketplace/eth_alt.png"
                        style={{ height: "17px", marginRight: "5px", marginLeft: "7px" }}
                      />
                      {`${offer.value} from`}&nbsp;
                      <Owner owner={offer.maker} connectedAccount={account} ens={ens} tokenId={tokenId}/>
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
            <a href="https://www.forgottenrunes.com/category/lore" target="_blank">
              <InfoTooltip tooltip={`${CONTRACTS[contractSlug].singular} owners can inscribe lore for their ${CONTRACTS[contractSlug].display.toLowerCase()} on-chain`}/>
            </a>
          </SectionDisplay>
          <BottomDisplay>
            <LoreWrapper>
              <LoreBlock pages={pages} />
            </LoreWrapper>
            <Icons tokenId={Number(tokenId)} contract={contractSlug} />
          </BottomDisplay>
          </SectionWrapper>
          <BottomLine/>
        </Listing>
        </ListingWrapper> :
        <ListingWrapper></ListingWrapper>
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
