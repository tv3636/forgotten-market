import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import { GetStaticPaths, GetStaticProps } from "next";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";
import { getOptions, getURLAttributes } from "../../components/Marketplace/marketplaceHelpers";
import {
  API_BASE_URL,
  CONTRACTS,
  OrderType,
} from "../../components/Marketplace/marketplaceConstants";
import Link from "next/link";
import { useRouter } from 'next/router';
import Order from "../../components/Marketplace/Order";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);
const marketplaceContracts = [
  chainId == 1 ? "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42" : "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
  chainId == 1 ? "0x251b5f14a825c537ff788604ea1b58e49b70726f" : "0x95082b505c0752eef1806aef2b6b2d55eea77e4e",
  chainId == 1 ? "0xf55b615b479482440135ebf1b907fd4c37ed9420": "0x5020c6460b0b26a69c6c0bb8d99ed314f3c39d9e"
]


const MarketWrapper = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2vh;
  flex-wrap: wrap;

  @media only screen and (max-width: 600px) {
    flex-direction: row;
    align-content: center;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 1200px;
  margin-right: 100px;
  margin-bottom: 5px;

  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;
    margin-right: 0px;
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  align-self: flex-start;
  margin-left: 20px;

  @media only screen and (max-width: 600px) {
    margin-left: 0px;
  }

`;

const Tab  = styled.div`
  background: var(--darkGray);
  border-style: dashed;
  border-radius: 10px 10px 0px 0px;
  border-color: var(--mediumGray);
  border-width: 1px;
  border-bottom: none;

  font-family: Alagard;
  font-size: 24px;
  color: var(--lightGray);

  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }


  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`;

const TabSelected  = styled.div`
  background: var(--darkGray);
  border-style: dashed;
  border-radius: 10px 10px 0px 0px;
  border-color: var(--lightGray);
  border-width: 1px;
  border-bottom: none;

  font-family: Alagard;
  font-size: 24px;
  color: var(--white);

  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    max-height: 100%;
  }
`;

const CollectionOffer = styled.div`
  background: var(--darkGray);
  border-style: dashed;
  border-radius: 10px;
  border-color: var(--mediumGray);
  border-width: 1px;

  font-family: Alagard;
  font-size: 20px;
  color: var(--lightGray);

  padding: 10px;
  margin-right: 10px;


  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }

`;

const ScrollWrapper = styled.div`
  width: 83%;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-bottom: 30px;
  
  border: dashed;
  padding: 10px;
  border-width: 2px;
  border-color: var(--mediumGray);
  background-color: var(--darkGray);

  :hover {
    border-color: var(--lightGray);
    background-color: var(--mediumGray);
  }

  @media only screen and (max-width: 600px) {
    flex-direction: row;
  }
`;

const Label = styled.label`
  margin: 5px;
  font-family: Alagard;
  font-size: 18px;

  color: var(--lightGray);

  @media only screen and (max-width: 600px) {
    font-size: 15px;
  }
`;

const FilterWrapper = styled.div`
  width: 15%;
  max-width: 200px;
  margin-left: 20px;

  @media only screen and (max-width: 600px) {
    width: auto;
    max-width: 1000px;
    margin-left: 0px;
  }
`;

const FilterStyle = styled.div`
  display: flex;
  flex-direction: column;
  
  @media only screen and (max-width: 600px) {
    min-width: 90%;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    margin-left: 5vw;
    margin-right: 5vw;
    display: none;
  }
`;


const ListingDisplay = styled.div`
  width: 250px;
  height: 350px;
  margin: 25px;
  display: flex;
  flex-direction: column;


`;

const ListingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 1vw;
  margin-right: 2vw;
  margin-top: 2vw;
  overflow: hidden;
  
`;

const ListingImage = styled.img`
  border-style: dashed;
  border-width: 3px;
  border-color: var(--mediumGray);
  border-radius: 10px;

  min-width: 250px;
  min-height: 250px;
  max-height: 50vw;
  max-width: 50vw;

  :hover {
    cursor: pointer;
    border-color: var(--lightGray);
  }

`;

const MarketText = styled.p`
  font-family: Alagard;
  font-size: 16px;
  font-weight: bold;
  color: white;
  
  line-height: 1.3;
  max-width: 25ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FontTraitWrapper = styled.div`
  font-family: Arial;
  color: black;
`;

const SoftLink = styled.a`
  text-decoration: none;
`;

const ExpandButton = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 10px;
  }
`;

function MarketTabs() {
  var router = useRouter();
  return (
    <Tabs>
      {
      marketplaceContracts.map((contract: string, index) => (
        <Link 
          href={"/marketplace/" + contract}
          key={index}
        >
        {contract == router.query.contractSlug ? 
          <TabSelected>{CONTRACTS[contract].display}</TabSelected> : 
          <Tab>{CONTRACTS[contract].display}</Tab>
        }
        </Link>
      ))}
    </Tabs>
  )
}

function LoadingCard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <img
        src="/static/img/marketplace/loading_card.gif"
        style={{ maxWidth: "200px" }}
      />
    </div>
  );
}

function SideBar({
  collection,
  selectionChange,
  loreChange,
  noLoreChange,
}: {
  collection: string;
  selectionChange: any;
  loreChange: any;
  noLoreChange: any;
}) {
  const [traits, setTraits] = useState([]);
  const [isOpen, setIsOpen] = useState<any>(null);
  const toggleIsOpen = () => {
    if (isOpen == null) {
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  }
  const router = useRouter();

  async function fetchTraits() {
    const attributes = await fetch(
      API_BASE_URL + "attributes?" + "collection=" + collection
    );
    const attributeJson = await attributes.json();
    setTraits(attributeJson.attributes);
  }

  useEffect(() => {
    fetchTraits();
  }, []);

  // Only add style on mobile if toggle is used
  var testStyle = isOpen == null ? {} : {display: isOpen ? 'flex' : 'none'};

  return (
    <FilterWrapper>
      <ExpandButton>
        <a onClick={() => toggleIsOpen()}>
          <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
        </a>
      </ExpandButton>
      <FilterStyle style={testStyle}>
        {traits.map((trait: any, index) => (
          <FontTraitWrapper key={index} style={{ marginTop: "30px" }}>
            <Select
              options={getOptions(trait.values)}
              onChange={(e) => selectionChange(e, trait.key)}
              isClearable={true}
              placeholder={trait.key}
              value={trait.key.toLowerCase() in router.query ? {label: router.query[trait.key.toLowerCase()]} : null}
              classNamePrefix='select'
            />
          </FontTraitWrapper>
        ))}
        <Form>
          <Label>
            <input type="checkbox" onClick={loreChange} /> Has Lore
          </Label>
          <Label>
            <input type="checkbox" onClick={noLoreChange} /> Has No Lore
          </Label>
        </Form>
        
      </FilterStyle>
    </FilterWrapper>
  );
}

function TokenDisplay({
  contract,
  tokenId,
  name,
  price,
}: {
  contract: string;
  tokenId: number;
  name: string;
  price: number;
}) {
  return (
    <Link
      href={"/marketplace/" + contract + "/" + tokenId}
      passHref={true}
    >
      <SoftLink>
      <ListingDisplay>
        { CONTRACTS[contract].display == 'Wizards' ?
          <ListingImage 
            src={CONTRACTS[contract].display == 'Wizards' ? CONTRACTS[contract].image_url + tokenId + '/' + tokenId + '.png' : CONTRACTS[contract].image_url + tokenId + ".png"}
            onMouseOver={(e) =>
              (e.currentTarget.src = `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle.gif`)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src =  CONTRACTS[contract].display == 'Wizards' ? `${CONTRACTS[contract].image_url}${tokenId}/${tokenId}.png` : `${CONTRACTS[contract].image_url}${tokenId}.png`)
            } 
          /> :
          <ListingImage 
            src={CONTRACTS[contract].image_url + tokenId + ".png"}
          />
        }
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "50%",
            justifyContent: "flex-start",
          }}
        >
          <MarketText>{name}</MarketText>
          <div
            style={{ fontSize: "16px", fontFamily: "Alagard", color: "var(--white)", fontWeight: 'bold', justifySelf: 'flex-end' }}
          >
            {price ? (
              <div style={{ display: "flex" }}>
                <img
                  src="/static/img/marketplace/eth.png"
                  style={{
                    height: "14px",
                    marginRight: "8px",
                    marginTop: "2px",
                  }}
                />
                <div>{price}</div>
              </div>
            ) : null}
          </div>
        </div>
      </ListingDisplay>
      </SoftLink>
    </Link>
  );
}

function Listings({
  contract,
  collection,
  wizardsWithLore,
}: {
  contract: string;
  collection: string;
  wizardsWithLore: { [key: number]: boolean };
}) {
  const [listings, setListings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasLore, setHasLore] = useState(false);
  const [hasNoLore, setHasNoLore] = useState(false);
  const router = useRouter();

  async function fetchListings(reset: boolean) {
    var lists: any = [];
    var url = API_BASE_URL + "tokens?" + "contract=" + contract;
    setLoaded(false);

    if (reset) {
      setListings([]);
    }

    try {
      for (let i = 0; i < 4; i++) {
        var offset = reset ? i * 20 : listings.length + i * 20;
        const page = await fetch(url + "&offset=" + offset + getURLAttributes(router.query));
        const listingsJson = await page.json();

        lists = lists.concat(listingsJson.tokens);
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }

    if (reset) {
      setListings(lists);
    } else {
      setListings(listings.concat(lists));
    }
    setLoaded(true);
  }

  function selectionChange(selected: any, trait: any) {
    if (selected) {
      router.query[trait.toLowerCase()] = selected.value
    } else {
      delete router.query[trait.toLowerCase()]
    }

    var newPath = "";
    for (var routerTrait of Object.keys(router.query)) {
        newPath += `&${routerTrait}=${router.query[routerTrait]}`.replace('#', '%23');
    }

    if (newPath.length > 0) {
      router.push('?' + newPath, undefined, { shallow: true });
    } else {
      router.push('', undefined, {shallow: true});
    }
    fetchListings(true);
  }

  useEffect(() => {
    // ensure router query is populated before fetching listings
    if ((router.asPath.includes('?') && Object.keys(router.query).length > 1) || !router.asPath.includes('?')) {
      fetchListings(false);
    }
  }, [router.query]);

  return (
    <TabWrapper>
      <SideBar
        collection={collection}
        selectionChange={selectionChange}
        loreChange={() => setHasLore(!hasLore)}
        noLoreChange={() => setHasNoLore(!hasNoLore)}
      />
      <ScrollWrapper>
        {listings.length > 0 || loaded ? (
          <InfiniteScroll
            dataLength={listings.length}
            next={() => fetchListings(false)}
            hasMore={true}
            loader={null}
            scrollThreshold={0.5}
            height={"80vh"}
          >
            <ListingContainer>
              {listings.map((listing: any, index) => {
                return (
                  ((!hasLore && !hasNoLore) ||
                    (hasLore &&
                      !hasNoLore &&
                      wizardsWithLore[listing.tokenId]) ||
                    (!hasLore &&
                      hasNoLore &&
                      !wizardsWithLore[listing.tokenId])) && (
                    <div key={index}>
                      <TokenDisplay
                        contract={contract}
                        tokenId={listing.tokenId}
                        name={listing.name}
                        price={listing.floorSellValue}
                      />
                    </div>
                  )
                );
              })}
            </ListingContainer>
          </InfiniteScroll>
        ) : (
          <LoadingCard />
        )}
      </ScrollWrapper>
    </TabWrapper>
  );
}

export default function Marketplace({
  wizardsWithLore,
  contract
}: {
  wizardsWithLore: { [key: number]: boolean };
  contract: string;
}) {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getCollectionOffer() {
      const collection = await fetch(API_BASE_URL + "collections/" + CONTRACTS[contract].collection);
      const collectionJson = await collection.json();

      if (collectionJson.collection) {
        setCurrentOffer(collectionJson.collection.set.market.topBuy.value);
      }
    }

    getCollectionOffer();
  }, [contract]);

  if (contract) {
  return (
    <Layout title="Marketplace">
      <MarketWrapper>
        <Header>
        <MarketTabs/>
        <CollectionOffer onClick={() => setShowModal(true)}>Collection Offer: <img
                  src="/static/img/marketplace/eth.png"
                  style={{
                    height: "14px",
                    marginLeft: "8px",
                    marginTop: "2px",
                  }}
                />{currentOffer ? ` ${currentOffer}`: null}</CollectionOffer>
        </Header>
        {showModal && 
        <Order 
          contract={contract} 
          tokenId={'0'} 
          name={CONTRACTS[contract].full} 
          collectionWide={true} 
          setModal={setShowModal}
          action={OrderType.OFFER}
        />
        }
        <div style={{width: '1300px'}}>
          <Listings
            collection={CONTRACTS[contract].collection}
            contract={contract}
            wizardsWithLore={wizardsWithLore}
            key={contract}
          />
        </div>
      </MarketWrapper>
    </Layout>
  );
  } else {
    return <Layout title="Marketplace">
      <MarketWrapper></MarketWrapper>
    </Layout>
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const contractSlug = params?.contractSlug as string;
  
  return {
    props: {
      wizardsWithLore: await getWizardsWithLore(contractSlug),
      contract: contractSlug
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

