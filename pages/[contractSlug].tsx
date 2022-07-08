import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getWizardsWithLore } from "../components/Lore/loreSubgraphUtils";
import { API_BASE_URL, COMMUNITY_CONTRACTS, CONTRACTS, ORDER_TYPE } from "../components/Marketplace/marketplaceConstants";
import { getTrait, getTraitValue, getURLAttributes, isTraitOffer, LoadingCard, traitFormat } from "../components/Marketplace/marketplaceHelpers";
import Layout from "../components/Marketplace/NewLayout";
import CollectionStats from "../components/Marketplace/CollectionStats";
import MainToggle from "../components/Marketplace/MainToggle";
import Sidebar, { CollectionContainer } from "../components/Marketplace/NewSidebar";
import InfiniteScroll from "react-infinite-scroll-component";
import TokenDisplay from "../components/Marketplace/TokenDisplay";
import Image from 'next/image';
import RightBar from "../components/Marketplace/RightBar";
import Order from "../components/Marketplace/Order";
import Filters from "../components/Marketplace/Filters";
import CollectionOfferButton from "../components/Marketplace/CollectionOfferButton";
import { MainMenu } from "../components/Marketplace/NewSiteNav";
import MobileOverlay from "../components/Marketplace/MobileOverlay";
import Activity from "../components/Marketplace/Activity";
import RuneHeader from "../components/Marketplace/RuneHeader";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const MidHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: fixed;
  left: 50%; 
  top: var(--sp0);

  transform: translate(-50%, 0);
  z-index: 11;

  @media only screen and (max-width: 1250px) { 
    position: relative;
    top: auto;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-height: 100%;
  height: 100%;
  
  @media only screen and (max-width: 1250px) { 
    justify-content: center;
  }
`;

const MidContainer = styled.div`
  width: 1250px;
  position: relative;

  padding-left: var(--sp0);
  padding-right: var(--sp0);

  @media only screen and (max-width: 1250px) { 
    max-width: 100%;
    padding: 0;
  }
`;

const InfiniteWrapper = styled.div`
  position: relative;
  margin-top: var(--sp3);
  height: calc(100% - var(--sp3));

  @media only screen and (max-width: 1250px) { 
    margin-top: 0;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;

  padding-top: var(--sp-4);
  padding-bottom: 250px;
`;

const BottomScrim = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 0px;
  padding: 0;
`;

const TopScrim = styled(BottomScrim)`
  bottom: auto;
  top: 0px;
  
  width: 100%;
  height: 20px;
`;

export default function Marketplace({
  wizardsWithLore,
  contract
}: {
  wizardsWithLore: { [key: number]: boolean };
  contract: string;
}) {
  const [burgerActive, setBurgerActive] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasLore, setHasLore] = useState(false);
  const [hasNoLore, setHasNoLore] = useState(false);
  const [continuation, setContinuation] = useState('');
  const [items, setItems] = useState(0);
  const [floor, setFloor] = useState(0);
  const [bid, setBid] = useState(0);
  const router = useRouter();
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
  let traitOffer = isTraitOffer();

  async function getStats() {
    var stats_url = API_BASE_URL + "stats/v1?" + "collection=" + contract + getURLAttributes(router.query);
    const statsPage = await fetch(stats_url, { headers: headers });
    const statsJson = await statsPage.json();

    setItems(statsJson.stats.tokenCount);
    setFloor(statsJson.stats.market.floorAsk.price?.toPrecision(2));
    setBid(statsJson.stats.market.topBid.value?.toPrecision(2));
  }

  async function fetchListings(reset: boolean) {
    var lists: any = [];
    var url = API_BASE_URL + "tokens/details/v3?" + "collection=" + contract;
    setLoaded(false);

    if (reset) {
      setListings([]);
      setContinuation('');
    }

    try {
      if (reset || continuation != null) {
        const page = await fetch(
          url + '&sortBy=floorAskPrice&limit=50' + 
          (!reset && continuation != '' ? "&continuation=" + continuation : '') +
          (router.query.source ? "&source=" + router.query.source : '') +
          getURLAttributes(router.query),
          { headers: headers }
        );
        const listingsJson = await page.json();
        lists = lists.concat(listingsJson.tokens);
        
        setContinuation(listingsJson.continuation)
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

  function updateSource(source: string) {
    if (source) {
      router.query['source'] = source;
    } else {
      delete router.query['source'];
    }

    router.push({query: router.query}, undefined, {shallow: true});
  }

  useEffect(() => {
    setShowActivity(Object.keys(router.query).includes('activity'));

    // ensure router query is populated before fetching listings/stats
    if (((router.asPath.includes('?') && Object.keys(router.query).length > 1) || !router.asPath.includes('?'))) {
      if (!Object.keys(router.query).includes('activity')) {
        fetchListings(true);
      }
      
      getStats();
    }
  }, [router.query]);

  if (contract) {
    return (
      <Layout
        title={`${contracts[contract].display} ${ showActivity ? 'Activity' : 'Marketplace'}`}
        description={`Like ${contracts[contract].singular}, Buy ${contracts[contract].singular}`}
        image={`/static/img/marketplace/${contracts[contract].display.toLowerCase()}-banner.png`}
        setBurgerActive={setBurgerActive}
      >
        <Main>
          {showModal &&
            <Order
              contract={contract}
              tokenId={'0'}
              name={contracts[contract].full}
              collectionWide={true}
              setModal={setShowModal}
              action={ORDER_TYPE.OFFER}
              hash={''}
              offerHash={''}
              trait={traitOffer ? getTrait() : ''}
              traitValue={traitOffer ? getTraitValue() : ''}
            />
          }
          <Sidebar activity={showActivity} />
          <MidContainer>
            <MidHeader>
              <CollectionStats items={items} floor={floor} bid={bid} contract={contract} />
              <MainToggle activity={showActivity} />
            </MidHeader>
            <InfiniteWrapper>
              { showActivity ? <Activity contract={contract}/> : listings.length > 0 || loaded ? (
                  <InfiniteScroll
                    dataLength={listings.length}
                    next={() => fetchListings(false)}
                    hasMore={true}
                    loader={null}
                    height={"100vh"}
                    scrollThreshold={0.3}
                    endMessage={
                      <Image src='/static/img/marketplace/rune.png' width='28px' height='48px' />
                    }
                    style={{backgroundImage: 'url(/static/img/interior-dark.png)'}}
                  >
                    <ScrollContainer>
                      {listings.map((listing: any, index) => {
                        return (
                          ((!hasLore && !hasNoLore) ||
                            (hasLore &&
                              !hasNoLore &&
                              wizardsWithLore[listing.token.tokenId]) ||
                            (!hasLore &&
                              hasNoLore &&
                              !wizardsWithLore[listing.token.tokenId])) && (
                            <div key={index}>
                              <TokenDisplay
                                contract={contract}
                                tokenId={listing.token.tokenId}
                                name={listing.token.name}
                                price={listing.market.floorAsk.price}
                                source={listing.market.floorAsk.source.id}
                              />
                            </div>
                          )
                        );
                      })}
                     
                    </ScrollContainer>
                  </InfiniteScroll>
              ) : (
                <LoadingCard height={'100vh'}/>
              )}
              <TopScrim>
                <Image src='/static/img/scrim-reverse.png' height='20px' width='1155px' layout='responsive' />
              </TopScrim>
            </InfiniteWrapper>
            <div className="scrim">
              
            </div>
        </MidContainer> 
        <RightBar  
          contract={contract} 
          loreChange={() => { setHasLore(!hasLore); fetchListings(false); }} 
          noLoreChange={() => setHasNoLore(!hasNoLore)}
          setSource={updateSource}
          selectionChange={selectionChange}
          setShowModal={setShowModal}
        />
      </Main>
      <MobileOverlay burgerActive={burgerActive} setBurgerActive={setBurgerActive}>
        <RuneHeader>NAVIGATION</RuneHeader>
        <MainMenu className="mobile"/>
        <CollectionContainer activity={showActivity} />
        <RuneHeader>FILTER</RuneHeader>
        <CollectionOfferButton setShowModal={setShowModal} />
        <Filters
          contract={contract} 
          loreChange={() => { setHasLore(!hasLore); fetchListings(false); }} 
          noLoreChange={() => setHasNoLore(!hasNoLore)}
          setSource={updateSource}
          selectionChange={selectionChange}
        />
      </MobileOverlay>
    </Layout>
    )
  } else {
    return (
      <Layout title="Marketplace" />
    )
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const contractSlug = params?.contractSlug as string;

  return {
    props: {
      wizardsWithLore: await getWizardsWithLore(contractSlug),
      contract: contractSlug.toLowerCase()
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
