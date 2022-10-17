import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getWizardsWithLore } from "../components/Lore/loreSubgraphUtils";
import { API_BASE_URL, ORDER_TYPE } from "../components/Marketplace/marketplaceConstants";
import { getContract, getTrait, getTraitValue, getURLAttributes, isTraitOffer } from "../components/Marketplace/marketplaceHelpers";
import Layout from "../components/Marketplace/Layout";
import CollectionStats from "../components/Marketplace/CollectionStats";
import MainToggle from "../components/Marketplace/MainToggle";
import Sidebar from "../components/Marketplace/Sidebar";
import InfiniteScroll from "react-infinite-scroll-component";
import TokenDisplay from "../components/Marketplace/TokenDisplay";
import Image from 'next/image';
import RightBar from "../components/Marketplace/RightBar";
import Order from "../components/Marketplace/Order";
import Filters from "../components/Marketplace/Filters";
import CollectionOfferButton from "../components/Marketplace/CollectionOfferButton";
import MobileOverlay from "../components/Marketplace/MobileOverlay";
import Activity from "../components/Marketplace/Activity";
import FilterHeader from "../components/Marketplace/FilterHeader";
import LoadingCard from "../components/Marketplace/LoadingCard";

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

  margin-left: var(--sp3);
  margin-right: var(--sp3);

  @media only screen and (max-width: 1450px) {
    margin-left: var(--sp0);
    margin-right: var(--sp0);
  }
  
  @media only screen and (max-width: 1250px) { 
    justify-content: center;
  }

  @media only screen and (min-width: 1250px) and (max-height: 700px) {
    margin-left: var(--sp2);
    margin-right: var(--sp2);
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
    margin-top: var(--sp-3);
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
  padding-bottom: 500px;
`;

const BottomScrim = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 0px;
  padding: 0;
`;

const TopScrim = styled(BottomScrim)`
  bottom: auto;
  top: 0;
  
  width: 100%;
  height: 20px;
`;

const FilterContainer = styled.div`
  display: flex;  
  flex-direction: column;

  > * {
    margin-bottom: var(--sp1);
  }
`;

export default function Marketplace({
  wizardsWithLore,
  contract
}: {
  wizardsWithLore: { [key: number]: boolean };
  contract: string;
}) {
  const [showActivity, setShowActivity] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [listings, setListings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasLore, setHasLore] = useState(false);
  const [hasNoLore, setHasNoLore] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [traitsSelected, setTraitsSelected] = useState(0);
  const [continuation, setContinuation] = useState('');
  const [items, setItems] = useState(0);
  const [floor, setFloor] = useState(0);
  const [bid, setBid] = useState(0);
  const router = useRouter();
  let contractDict = getContract(contract);
  let traitOffer = isTraitOffer();

  async function getStats() {
    var stats_url = API_BASE_URL + "stats/v1?" + "collection=" + contract + getURLAttributes(router.query, contractDict.display);
    const statsPage = await fetch(stats_url, { headers: headers });
    const statsJson = await statsPage.json();

    // When showing all wizards, show 10k - soul count because burned tokens are included in default response
    if (contractDict.display == 'Wizards' && !getURLAttributes(router.query, contractDict.display)) {
      var souls_stats_url = API_BASE_URL + "stats/v1?" + "collection=0x251b5f14a825c537ff788604ea1b58e49b70726f";
      const soulsStats = await fetch(souls_stats_url, { headers: headers });
      const soulsJson = await soulsStats.json();

      setItems(10000 - soulsJson.stats.tokenCount);
    } else {
      setItems(statsJson.stats.tokenCount);
    }

    setFloor(statsJson.stats.market.floorAsk.price?.toPrecision(2));
    setBid(statsJson.stats.market.topBid.value?.toPrecision(2));
  }

  async function fetchListings(reset: boolean) {
    var lists: any = [];
    var url = API_BASE_URL + "tokens/details/v4?" + "collection=" + contract;
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
          getURLAttributes(router.query, contractDict.display),
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

  function routerPush() {
    router.push({query: router.query}, undefined, {shallow: true});
  }

  function selectionChange(selected: any, trait: any) {
    if (selected) {
      router.query[trait.toLowerCase()] = selected.map((selection: { value: string; }) => selection.value);
    } else {
      delete router.query[trait.toLowerCase()];
    }

    setTraitsSelected(
      Object.keys(router.query).length 
      - Number('source' in router.query) 
      - Number('activity' in router.query) 
      - Number('contractSlug' in router.query)
    );

    routerPush();
    fetchListings(true);
  }

  function updateSource(source: string) {
    if (source) {
      router.query['source'] = source;
    } else {
      delete router.query['source'];
    }

    routerPush();
  }

  function updateActivityFeed(activityType: string) {
    router.query['activity'] = activityType;
    routerPush();
  }

  useEffect(() => {
    setShowActivity(Object.keys(router.query).includes('activity'));

    // ensure router query is populated before fetching listings/stats
    if (((router.asPath.includes('?') && Object.keys(router.query).length > 1) || !router.asPath.includes('?'))) {
      if (!Object.keys(router.query).includes('activity')) {
        fetchListings(true);
      }
      getStats();

      setTraitsSelected(
        Object.keys(router.query).length 
        - Number('source' in router.query) 
        - Number('activity' in router.query) 
        - Number('contractSlug' in router.query)
      );
    }
  }, [router.query]);

  if (contract) {
    return (
      <Layout
        title={`${contractDict.display} ${ showActivity ? 'Activity' : 'Marketplace'}`}
        image={`https://forgotten.market/static/img/marketplace/${contractDict.display.toLowerCase()}-banner.png`}
        setFilterActive={setFilterActive}
      >
        <Main>
          {showModal &&
            <Order
              contract={contract}
              tokenId={'0'}
              name={contractDict.full}
              collectionWide={true}
              setModal={setShowModal}
              action={ORDER_TYPE.OFFER}
              hash={''}
              offerHash={''}
              trait={traitOffer ? getTrait() : ''}
              traitValue={traitOffer ? getTraitValue() : ''}
              expectedPrice={0}
            />
          }
          <Sidebar />
          <MidContainer>
            <MidHeader>
              <CollectionStats items={items} floor={floor} bid={bid} contract={contract} />
              <MainToggle activity={showActivity} />
            </MidHeader>
            <div>
              { traitsSelected >= 1 && !(router.query.activity == 'listings') && <FilterHeader/> }
              <InfiniteWrapper style={traitsSelected >= 1 && !(router.query.activity == 'listings') ? {marginTop: 0} : {}}>
                { showActivity ? 
                  <Activity contract={contract} /> 
                  : listings.length > 0 || loaded ? 
                  (
                    <>
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
                    </>
                ) : (
                  <LoadingCard height={'100vh'} background={true} />
                )}
                <TopScrim>
                  <Image src='/static/img/scrim-reverse.png' height='20px' width='1155px' layout='responsive' />
                </TopScrim>
              </InfiniteWrapper>
            </div>
            <div className="scrim" />
        </MidContainer> 
        <RightBar  
          contract={contract} 
          loreChange={() => { setHasLore(!hasLore); fetchListings(false); }} 
          noLoreChange={() => setHasNoLore(!hasNoLore)}
          setSource={updateSource}
          selectionChange={selectionChange}
          setShowModal={setShowModal}
          setActivity={updateActivityFeed}
        />
      </Main>
      { filterActive && 
        <MobileOverlay burgerActive={filterActive} setBurgerActive={setFilterActive}>
          <FilterContainer>
            <CollectionOfferButton setShowModal={setShowModal} />
            <Filters
              contract={contract} 
              loreChange={() => { setHasLore(!hasLore); fetchListings(false); }} 
              noLoreChange={() => setHasNoLore(!hasNoLore)}
              setSource={updateSource}
              selectionChange={selectionChange}
              setActivity={updateActivityFeed}
            />
          </FilterContainer>
        </MobileOverlay>
      }
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
