import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Marketplace/Layout";
import React, { useEffect, useState } from "react";
import client from "../../lib/graphql";
import { gql } from "@apollo/client";
import { getContract, getImage, getPages, getValue } from "../../components/Marketplace/marketplaceHelpers";
import { API_BASE_URL, ITEM_CONTRACTS } from "../../components/Marketplace/marketplaceConstants";
import { getProvider } from "../../hooks/useProvider";
import LoreBlock from "../../components/Marketplace/LoreBlock";
import TraitDisplay from "../../components/Marketplace/TraitDisplay";
import Carousel from "../../components/Marketplace/MarketCarousel";
import { Owner } from "../../components/Marketplace/OfferDisplay";
//import { isOpenSeaBanned } from '@reservoir0x/client-sdk';
import RuneHeader from "../../components/Marketplace/RuneHeader";
import wizards from "../../data/wizards.json";
import warriors from "../../data/warriors.json";
import souls from "../../data/souls.json";
import ponies from "../../data/ponies.json";
import babies from "../../data/babies.json";
import ImageWithTraits from "../../components/Marketplace/ImageWithTraits";
import Affinity from "../../components/Marketplace/Affinity";
import PriceModule from "../../components/Marketplace/PriceModule";
import Bio from "../../components/Marketplace/Bio";
import BaseModule from "../../components/Marketplace/BaseModule";
import LoadingCard from "../../components/Marketplace/LoadingCard";
import Icons from "../../components/Marketplace/Icons";
import { useAccount } from "wagmi";

const collectionData: any = {
  'Wizards': wizards as { [wizardId: string]: any },
  'Warriors': warriors as { [warriorId: string]: any},
  'Souls': souls as { [soulId: string]: any },
  'Ponies': ponies as { [ponyId: string]: any },
  'Babies': babies as { [babyId: string]: any },
}

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

  @media only screen and (max-width: 1250px) {
    margin-top: var(--sp1);
    max-height: 80vh;
  }
`;

const ListingWrapper = styled.div`
  display: flex;
  justify-content: center;

  background-image: url('/static/img/interior-dark.png');
  background-position: -58% 10%;

  max-width: 1000px;
  min-height: 90vh;
  margin: 0 auto;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;

    background-position: 20% 10%;
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

  @media only screen and (max-width: 1250px) {
    justify-content: center;
    margin-bottom: var(--sp-1);
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

  @media only screen and (max-width: 1250px) {
    width: 75%;
    align-content: center;
  }
`;

const TopRight = styled.div`
  margin-left: var(--sp3);
  padding: var(--sp0);
  padding-top: 0;
  max-width: calc(100% - 460px - var(--sp3));
  align-self: flex-start;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-content: space-between;

  background-color: black;

  @media only screen and (max-width: 1250px) {
    margin-left: 0px;
    align-items: center;
    align-content: center;
    flex-direction: column;
    flex-wrap: nowrap;

    max-width: 95%;
    height: auto !important;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1000px;
  width: 100%;

  gap: var(--sp1);
  align-items: flex-start;
  justify-content: space-between;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    gap: 0;
    > *:not(:last-child) {
      margin-bottom: var(--sp1);
    }
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

  @media only screen and (max-width: 1250px) {
    text-align: center;
    font-size: var(--sp2);
    text-shadow: 0px 2px var(--midGray);

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

  @media only screen and (max-width: 1250px) {
    text-align: center;
    margin-top: var(--sp-1);
  }
`;

const HorizontalLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 100%;
  border-width: 1px;
  margin-top: var(--sp0);
  margin-bottom: var(--sp0);

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

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  gap: var(--sp1);
  flex-grow: 1;
  flex-basis: min-content;
  justify-content: space-between;

  @media only screen and (max-width: 600px) {
    height: auto;

    margin-bottom: var(--sp0);
    align-items: center;
    gap: 0;

    > * {
      margin-bottom: var(--sp1);
    }
  }
`;

const Module = styled.div`
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;

  padding: var(--sp1);

  width: 100%;
  margin-bottom: var(--sp0);

  background-color: var(--darkGray);

  @media only screen and (max-width: 600px) {
   max-width: 80%;
  }
`;

const Banner = styled.div`
  font-family: Alagard;
  font-size: var(--sp1);
  color: var(--white);

  display: flex;
  justify-content: center;
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
  const [loaded, setLoaded] = useState(false);
  const [pages, setPages] = useState<any>(null);
  const [ens, setEns] = useState<string | null>("");
  const [countdownTimer, setCountdownTimer] = useState<any>(null);
  const [keyImage, setKeyImage] = useState(0);
  const [flameHolder, setFlameHolder] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [traitHover, setTraitHover] = useState('');
  const { address, isConnected } = useAccount();
  let contractDict = getContract(contractSlug);

  let imageUrls: string[] = [
    getImage(contractSlug, tokenId),
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-0-front.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-1-left.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-2-back.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-3-right.png`,
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif`
  ]

  if (contractDict.display == 'Souls' || contractDict.display == 'Warriors') {
    let collection = contractDict.display.toLowerCase();
    imageUrls = [
      getImage(contractSlug, tokenId),
      `https://runes-turnarounds.s3.amazonaws.com/${collection}/${tokenId}/${collection}-${tokenId}-0-front.png`,
      `https://runes-turnarounds.s3.amazonaws.com/${collection}/${tokenId}/${collection}-${tokenId}-1-left.png`,
      `https://runes-turnarounds.s3.amazonaws.com/${collection}/${tokenId}/${collection}-${tokenId}-2-back.png`,
      `https://runes-turnarounds.s3.amazonaws.com/${collection}/${tokenId}/${collection}-${tokenId}-3-right.png`,
      `https://runes-turnarounds.s3.amazonaws.com/${collection}/${tokenId}/${tokenId}-walkcycle-nobg.gif`
    ]
  }

  var backgroundColor = contractDict.display in collectionData && tokenId in collectionData[contractDict.display] ? 
  `${collectionData[contractDict.display][tokenId].background}` : '#000000';

  // TODO: update on completed modal
  useEffect(() => {
    async function run() {
      const page = await fetch(`${API_BASE_URL}tokens/v5?tokens=${contractSlug}:${tokenId}&includeAttributes=true&normalizeRoyalties=true&includeTopBid=true`);
      const listingsJson = await page.json();

      if (listingsJson.tokens.length > 0) {
        setToken(listingsJson.tokens[0].token);
        setListing(listingsJson.tokens[0].market.floorAsk);
        setOffer(listingsJson.tokens[0].market.topBid);
        setAttributes(listingsJson.tokens[0].token.attributes);
        //setCountdownTimer(countdown(new Date(listingsJson.tokens[0].market.floorAsk.validUntil * 1000)));

        console.log(listingsJson);

        // TODO: improve performance
        const traits = await fetch(`${API_BASE_URL}collections/${contractSlug}/attributes/all/v1`);
  
        const traitJson = await traits.json();
        setFullAttributes(traitJson.attributes);        

        console.log(traitJson);

        setLoaded(true);

        try {
          const provider = getProvider();
          var ensName = await provider.lookupAddress(listingsJson.tokens[0].token.owner);
          setEns(ensName);
        } catch (e) {
          console.error("Couldn't get ENS");
        }
      }
      
      setPages(await getPages(lore, tokenId));
      
      // Preload turnaround images
      if (contractDict.display == 'Wizards') {
        for (var url of imageUrls) {
          const img = new Image().src = url;
        }
      }
      
      // TO-DO: add back
      //setIsBanned(await isOpenSeaBanned(contractSlug, Number(tokenId)));
    }

    run();
  }, [contractSlug]);

  useEffect(() => {
    async function getFlames() {
      if (contractDict.display == 'Flames') {
        const userFlames = await fetch(`${API_BASE_URL}users/${address}/tokens/v2?collection=${contractSlug}&offset=0&limit=20`);

        const flamesJson = await userFlames.json();
        setFlameHolder(flamesJson.tokens.length > 0);
      }
    }
    if (address) {
      getFlames();
    }
  }, [address])

  return (
    <Layout 
      title={
        contractDict.display in collectionData && tokenId in collectionData[contractDict.display] ?
        collectionData[contractDict.display][tokenId].name :
        `${contractDict.singular} #${tokenId}`
      } 
      image={imageUrls[0]}
    >
      <PageWrapper>
        {loaded ? 
          <ListingWrapper>
            <Listing>
              <RuneHeader plaintext={false} home={false}>
                {`${contractDict.singular.toUpperCase()} #${tokenId}`}
              </RuneHeader>
                <TopDisplay>
                  <TopLeft>
                    <ImageWithTraits
                        source={
                          contractSlug in ITEM_CONTRACTS || contractSlug == '0x4715be0c5e9bcfe1382da60cff69096af4c4eef4' ? 
                            token.image : 
                            imageUrls[keyImage]
                          }
                        background={backgroundColor}
                        traitHover={traitHover}
                        attributes={attributes}
                        contract={contractSlug}
                        keyImage={keyImage}
                    />
                    { ['Wizards', 'Souls', 'Warriors'].includes(contractDict.display) && 
                      <Carousel 
                        keyImage={keyImage}
                        setKeyImage={setKeyImage}
                        imageUrls={imageUrls}
                      />
                    }
                  </TopLeft>
                  <TopRight
                    style={{height: contractDict.display == 'Flames' ? 476 : 420}}
                  >
                    <NameDisplay>
                      <NameStyle className='alagard'>{token.name}</NameStyle>
                      {token.owner && (
                        <OwnerStyle>
                          {`Owner: `}
                          <Owner owner={token.owner} connectedAccount={address} ens={ens}/>
                        </OwnerStyle>
                      )}
                    </NameDisplay>
                    <PriceModule
                      listing={listing}
                      offer={offer}
                      account={address}
                      token={token}
                      contractDisplay={contractDict.display}
                      flameHolder={flameHolder}
                      isBanned={isBanned}
                      countdownTimer={countdownTimer}
                      contract={contractSlug}
                      tokenId={tokenId}
                    />
                  </TopRight>
                </TopDisplay>
              <HorizontalLine/>              
              <SectionWrapper>
                { attributes.length > 0 &&
                  <BaseModule traitModule={true}>
                    <RuneHeader plaintext={false} home={false}>
                      TRAITS
                    </RuneHeader>
                    <TraitDisplay 
                      attributes={attributes} 
                      fullAttributes={fullAttributes} 
                      contract={contractSlug} 
                      setHover={setTraitHover}
                      filters={contractDict.coreTraits}
                      showAll={['Wizards', 'Souls', 'Warriors'].includes(contractDict.display)}
                    />
                  </BaseModule>
                }
                { ['Wizards', 'Souls', 'Warriors'].includes(contractDict.display) && 
                  !getValue(attributes, 'Undesirable') &&                  
                  <Column style={contractDict.display == 'Warriors' ? {justifyContent: 'flex-start'} : {}}>
                    { getValue(attributes, 'Affinity') &&
                      <BaseModule traitModule={false}>
                        <RuneHeader plaintext={false} home={false}>AFFINITY</RuneHeader>
                        <Affinity attributes={attributes} fullAttributes={fullAttributes} />
                      </BaseModule>
                    }
                    <BaseModule traitModule={false}>
                      <RuneHeader plaintext={false} home={false}>BIO</RuneHeader>
                      <Bio 
                        attributes={attributes} 
                        fullAttributes={fullAttributes}
                        collection={contractDict.display}
                      />
                    </BaseModule>
                  </Column>
                }
              </SectionWrapper>
              {contractDict.display != 'Flames' &&  <HorizontalLine/> }
              {contractDict.display != 'Flames' && 
                <SectionWrapper>
                  <BottomDisplay>
                    <LoreWrapper>
                    <RuneHeader plaintext={false} home={false}>LORE</RuneHeader>
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
            <LoadingCard height={'80vh'} background={true} />
          </ListingWrapper>
        }
      </PageWrapper>
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
        query Query{
          Lore(where: {struck: {_eq: false}, token: {tokenId: {_eq: ${tokenId}}, tokenContract: {_eq: "${contractSlug}"}}}) {
            id
            index
            creator
            token {
              wizard {
              id
              }
            }
            nsfw
            createdAt
            markdownText
            rawContent
            loreMetadataURI
          }
        }`,
    });

    var results = data.Lore;
  } catch (e) {
    console.error(e);
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
