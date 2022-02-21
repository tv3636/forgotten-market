import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import { GetStaticPaths, GetStaticProps } from "next";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";
import { getOptions, getURLAttributes, LoadingCard } from "../../components/Marketplace/marketplaceHelpers";
import {
  API_BASE_URL,
  CONTRACTS,
  ORDER_TYPE,
} from "../../components/Marketplace/marketplaceConstants";
import Link from "next/link";
import { useRouter } from 'next/router';
import Order from "../../components/Marketplace/Order";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import wizards from "../../data/nfts-prod.json";

const wizData = wizards as { [wizardId: string]: any };
const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');
TimeAgo.addDefaultLocale(en);

const MarketWrapper = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 4vh;
  flex-wrap: wrap;
  overflow-x: hidden;

  @media only screen and (max-width: 600px) {
    flex-direction: row;
    align-content: center;
  }
`;

const DesktopHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const MobileHeader = styled.div`
  display: none;
  flex-direction: row;
  justify-content: space-between;
  width: 1200px;
  margin-right: 100px;
  margin-bottom: 5px;

  @media only screen and (max-width: 600px) {
    display: flex;
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

  @media only screen and (max-width: 600px) {
    margin-left: 0px;
  }

`;

const Tab  = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--mediumGray);
  border-width: 1px;

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

  transition: border-color 300ms;

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`;

const TabSelected  = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--lightGray);
  border-width: 1px;

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
  justify-content: center;
  
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

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin-right: 0px;
  }

  transition: border-color 100ms;

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

  transition: all 100ms;
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
  width: 19%;
  min-width: 150px;
  margin-right: 3%;

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

  @media only screen and (max-width: 600px) {
    width: 150px;
    max-height: 250px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 5px;
    margin-top: 5px;
  }

`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2vw;
  margin-left: 1vw;
  margin-right: 1vw;
  overflow: hidden;
  
`;

const ListingImage = styled.img`
  border-style: solid;
  border-width: 4px;
  border-color: var(--darkGray);
  border-radius: 10px;

  min-width: 250px;
  min-height: 250px;
  max-height: 50vw;
  max-width: 50vw;

  :hover {
    cursor: pointer;
    border-color: var(--mediumGray);
  }

  @media only screen and (max-width: 600px) {
    width: 150px;
    height: 150px;

    min-width: 150px;
    max-width: 150px;

    min-height: 150px;
    max-height: 150px;

    border-width: 1.5px;
  }

  transition: border-color 100ms;

`;

const ActivityImage = styled.img`
  border-style: solid;
  border-width: 4px;
  border-color: var(--darkGray);
  border-radius: 10px;

  margin-right: 20px;

  width: 150px;
  height: 150px;

  :hover {
    cursor: pointer;
    border-color: var(--mediumGray);
  }

  @media only screen and (max-width: 600px) {
    width: 100px;
    height: 100px;
    margin-left: 0px;
    margin-right: 10px;
  }

  transition: border-color 100ms;
`;

const MarketText = styled.p`
  font-family: Alagard;
  font-size: 17px;
  font-weight: bold;
  color: white;
  
  line-height: 1.3;
  max-width: 25ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TimeText = styled.p`
  font-family: Alagard;
  font-size: 17px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.3;
  max-width: 25ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const SalesText = styled.div`
  font-family: Alagard;
  font-size: 18px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.3;
  width: 20ch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
    width: 11ch;
  }
`;

const BuyerText = styled.div`
  font-family: Alagard;
  font-size: 17px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.5;
  max-width: 20ch;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    max-width: 14ch;
  }
`;

const FontTraitWrapper = styled.div`
  font-family: Arial;
  color: black;
`;

const SoftLink = styled.a`
  text-decoration: none;
`;

const EthSymbol = styled.img`
  height: 18px;
  margin-right: 6px;
  margin-top: 3px;
  
  @media only screen and (max-width: 600px) {
    height: 13px;
    margin-top: 2px;
  }
  
`;

const CollectionEthSymbol = styled.img`
  height: 14px;
  margin-left: 8px;
  margin-top: 3px;

  @media only screen and (max-width: 600px) {
    height: 10px;
  }
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

const HorizontalLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 100%;
  border-width: 1px;
  margin-top: var(--sp-1);
  margin-bottom: var(--sp-1);

  @media only screen and (max-width: 600px) {
    border-color: black;
    width: 90%;

    margin-top: var(--sp1) / 2;
    margin-bottom: var(--sp1) / 2;
  }
`;

const SalesTextDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 125px;

  @media only screen and (max-width: 600px) {
    height: 75px;
  }

`;

const SalesDisplay = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
    height: 75px;
  }

`;

const ActivityRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border: dashed;
  border-radius: 20px;
  border-color: var(--mediumGray);
  background: #0d0c16c4;

  padding: 20px;
  margin: 10px;

  @media only screen and (max-width: 600px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const ActivityWrapper = styled.div`
  width: 80%;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    height: 75px;
    display: block;
  }
`;

const DesktopWrapper = styled.div`
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
  }

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }

  transition: all 100ms;
`;

function MarketTabs() {
  var router = useRouter();
  return (
    <Tabs>
      {
      Object.keys(CONTRACTS).map((contract: string, index) => (
        <Link 
          href={`/marketplace/${contract}${'activity' in router.query ? '?activity=True' : ''}`}
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

export function CollectionOfferButton({ 
  contract,
  setShowModal,
}: { 
  contract: string; 
  setShowModal: (show: boolean) => void;
}) {
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    async function getCollectionOffer() {
      const collection = await fetch(
        API_BASE_URL + "collections/" + CONTRACTS[contract].collection,
        {headers: headers}
      );
      const collectionJson = await collection.json();

      if (collectionJson.collection) {
        setCurrentOffer(collectionJson.collection.set.market.topBuy.value);
      }
    }

    getCollectionOffer();
  }, [contract]);

  return (
    <CollectionOffer onClick={() => setShowModal(true)}>
      {"Collection Offer: "}
      <CollectionEthSymbol src="/static/img/marketplace/eth.png" />
      {currentOffer && ` ${currentOffer}`}
    </CollectionOffer>
  )
}

function BuyerSeller({ 
  buyer, 
  seller 
}: { 
  buyer: string;
  seller: string;
}) {
  return (
    <div>
      <Link href={`/marketplace/address/${buyer}`} passHref={true}>
        <SoftLink>
          <BuyerText style={{display: 'flex', flexDirection: 'row'}}>{`Buyer:`}&nbsp;
              <BuyerText>{buyer}</BuyerText>
          </BuyerText>
        </SoftLink>
      </Link>
      <Link href={`/marketplace/address/${seller}`} passHref={true}>
        <SoftLink>
          <BuyerText style={{display: 'flex', flexDirection: 'row'}}>{`Seller:`}&nbsp;
            <BuyerText>{seller}</BuyerText>
          </BuyerText>
        </SoftLink>
      </Link>
    </div>
  )
}

function Activity({
  contract,
}: {
  contract: string;
}) {
  const [sales, setSales] = useState([]);

  async function fetchSales() {
    const recentSales = await fetch(
      API_BASE_URL + `sales?collection=${CONTRACTS[contract].collection}&offset=${sales.length}`, 
      { headers: headers }
    );
    const salesJson = await recentSales.json();
    setSales(sales.concat(salesJson.sales));
  }

  useEffect(() => {
    fetchSales();
  }, []);

  return (
      <InfiniteScroll
        dataLength={sales.length}
        next={fetchSales}
        hasMore={true}
        loader={null}
        scrollThreshold={0.1}
        height={'80vh'}
      >
        { sales.length > 0 ? 
          <ScrollContainer>
          {sales.map((sale: any, index) => {
            return (sale.token ?
              <ActivityWrapper key={index}>
                <ActivityRow>
                  <SalesDisplay>
                    <Link
                      href={`/marketplace/${contract}/${sale.token.tokenId}`}
                      passHref={true}
                    >
                      <SoftLink>
                        <ActivityImage src={CONTRACTS[contract].display == 'Wizards' ? 
                        `${CONTRACTS[contract].image_url}${sale.token.tokenId}/${sale.token.tokenId}.png` : 
                        `${CONTRACTS[contract].image_url}${sale.token.tokenId}.png`}/> 
                      </SoftLink>
                    </Link>
                    <SalesTextDisplay>
                      <SalesText style={{color: 'white'}}>{sale.token.name}</SalesText>
                      <div style={{ display: 'flex' }}>
                        <EthSymbol src='/static/img/marketplace/eth.png'/>
                        <SalesText>{sale.price}</SalesText>
                      </div>
                    </SalesTextDisplay>
                  </SalesDisplay>
                  <MobileWrapper>
                    <BuyerSeller buyer={sale.to} seller={sale.from}/>
                    <SoftLink href={'https://etherscan.io/tx/' + sale.txHash} target="_blank" rel="noopener noreferrer">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <TimeText>
                        <ReactTimeAgo date={new Date(sale.timestamp * 1000)}/>
                      </TimeText>
                      <IconImage src="/static/img/marketplace/share.png"/>
                      </div>
                    </SoftLink>
                  </MobileWrapper>
                  <DesktopWrapper>
                    <BuyerSeller buyer={sale.to} seller={sale.from}/>
                  </DesktopWrapper>
                  <DesktopWrapper>
                    <SoftLink href={'https://etherscan.io/tx/' + sale.txHash} target="_blank" rel="noopener noreferrer">
                      <div style={{display: 'flex', alignItems: 'center'}}>
                      <TimeText>
                        <ReactTimeAgo date={new Date(sale.timestamp * 1000)}/>
                      </TimeText>
                      <IconImage src="/static/img/marketplace/share.png"/>
                      </div>
                    </SoftLink>
                  </DesktopWrapper>
                </ActivityRow>
                <HorizontalLine/>
              </ActivityWrapper> :
              null
              
            );
          })
          }
          </ScrollContainer> :
          <LoadingCard height={'80vh'}/>
        }
      </InfiniteScroll>
  )
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
      `${API_BASE_URL}attributes?collection=${collection}`,
      { headers: headers }
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
          <ResponsivePixelImg src='/static/img/icons/social_link_marketplace.png' />
        </a>
      </ExpandButton>
      <FilterStyle style={testStyle}>
        {traits.map((trait: any, index) => (
          <FontTraitWrapper key={index} style={{ marginTop: '30px' }}>
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
            <input type='checkbox' onClick={loreChange} /> Has Lore
          </Label>
          <Label>
            <input type='checkbox' onClick={noLoreChange} /> Has No Lore
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
  let image = CONTRACTS[contract].display == 'Wizards' ? 
    `${CONTRACTS[contract].image_url}${tokenId}/${tokenId}.png` : 
    `${CONTRACTS[contract].image_url}${tokenId}.png`;

  let turnaround = `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif`;

  // Preload turnaround GIFs
  useEffect(() => {
    if (CONTRACTS[contract].display == 'Wizards') {
      const img = new Image().src = turnaround;
    }
  }, []);

  var backgroundColor = '#' + wizData[tokenId].background_color;
  console.log(backgroundColor);

  return (
    <Link
      href={`/marketplace/${contract}/${tokenId}`}
      passHref={true}
    >
      <SoftLink>
      <ListingDisplay>
        { CONTRACTS[contract].display == 'Wizards' ?
          <ListingImage 
            src={image}
            onMouseOver={(e) =>
              (e.currentTarget.src = turnaround)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = image)
            }
            style={{background: backgroundColor}}
          /> :
          <ListingImage 
            src={CONTRACTS[contract].image_url + tokenId + ".png"}
          />
        }
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '50%',
            justifyContent: 'flex-start',
          }}
        >
          <MarketText title={name}>{name}</MarketText>
          <div
            style={{ fontSize: '17px', fontFamily: 'Alagard', color: 'var(--white)', fontWeight: 'bold', justifySelf: 'flex-end' }}
          >
            {price &&
              <div style={{ display: 'flex' }}>
                <img
                  src='/static/img/marketplace/eth.png'
                  style={{
                    height: '14px',
                    marginRight: '8px',
                    marginTop: '2px',
                  }}
                />
                <div>{price}</div>
              </div>
            }
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
  showActivity,
}: {
  contract: string;
  collection: string;
  wizardsWithLore: { [key: number]: boolean };
  showActivity: boolean;
}) {
  const [listings, setListings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasLore, setHasLore] = useState(false);
  const [hasNoLore, setHasNoLore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
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
        const page = await fetch(
          url + "&offset=" + offset + getURLAttributes(router.query),
          { headers: headers }
        );
        const listingsJson = await page.json();
        lists = lists.concat(listingsJson.tokens);

        setListings(reset ? lists: listings.concat(lists));
      }
    } catch (error) {
      console.error(error);
      setLoaded(true);
    }
    setLoaded(true);
  }

  function selectionChange(selected: any, trait: any) {
    if (selected) {
      router.query[trait.toLowerCase()] = selected.value;
    } else {
      delete router.query[trait.toLowerCase()];
    }

    router.push({query: router.query}, undefined, {shallow: true});
    fetchListings(true);
  }

  useEffect(() => {
    // ensure router query is populated before fetching listings, only on initial load
    if (
      ((router.asPath.includes('?') && Object.keys(router.query).length > 1) || !router.asPath.includes('?')) &&
      !Object.keys(router.query).includes('activity') &&
      initialLoad
    ) {
      fetchListings(false);
      setInitialLoad(false);
    }
  }, [router.query]);

  return (
    <TabWrapper>
      { !showActivity && 
        <SideBar
          collection={collection}
          selectionChange={selectionChange}
          loreChange={() => { setHasLore(!hasLore); fetchListings(false); }}
          noLoreChange={() => setHasNoLore(!hasNoLore)}
        />
      }
      <ScrollWrapper>
        { showActivity ? <Activity contract={contract}/> :
        listings.length > 0 || loaded ? (
            <InfiniteScroll
              dataLength={listings.length}
              next={() => fetchListings(false)}
              hasMore={true}
              loader={null}
              scrollThreshold={0.5}
              height={"80vh"}
            >
              <ScrollContainer>
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
              </ScrollContainer>
            </InfiniteScroll>
        ) : (
          <LoadingCard height={'80vh'}/>
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
  const [showModal, setShowModal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowActivity(Object.keys(router.query).includes('activity'));
  }, [router.query]);

  if (contract) {
  return (
    <Layout title="Marketplace">
      <MarketWrapper>
      <MobileHeader>
          <MarketTabs/>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <CollectionOfferButton contract={contract} setShowModal={setShowModal}/>
          </div>
        </MobileHeader>
        {showModal && 
        <Order 
          contract={contract} 
          tokenId={'0'} 
          name={CONTRACTS[contract].full} 
          collectionWide={true} 
          setModal={setShowModal}
          action={ORDER_TYPE.OFFER}
          hash={null}
          offerHash={null}
        />
        }
        <div style={{width: '1300px', maxWidth: '95%'}}>
        <DesktopHeader>
          <MarketTabs/>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <CollectionOfferButton contract={contract} setShowModal={setShowModal}/>
          </div>
        </DesktopHeader>
          <Listings
            collection={CONTRACTS[contract].collection}
            contract={contract}
            wizardsWithLore={wizardsWithLore}
            key={contract}
            showActivity={showActivity}
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

