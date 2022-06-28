import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";
import { API_BASE_URL, COMMUNITY_CONTRACTS, CONTRACTS } from "../../components/Marketplace/marketplaceConstants";
import { getURLAttributes, LoadingCard } from "../../components/Marketplace/marketplaceHelpers";
import Layout from "../../components/Marketplace/NewLayout";
import CollectionStats from "../../components/Marketplace/CollectionStats";
import MainToggle from "../../components/Marketplace/MainToggle";
import Sidebar from "../../components/Marketplace/NewSidebar";
import InfiniteScroll from "react-infinite-scroll-component";
import TokenDisplay from "../../components/Marketplace/TokenDisplay";
import Image from 'next/image';
import RightBar from "../../components/Marketplace/RightBar";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const MidHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-top: -8ch;
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;

  padding-top: var(--sp-4);
  padding-bottom: 400px;
`;

const BottomScrim = styled.div`
  position: absolute;
  z-index: 10;
  bottom: -5px;
  max-width: 1050px;
`;

const TopScrim = styled(BottomScrim)`
  bottom: auto;
  top: 130px;
`;

export default function Marketplace({
  wizardsWithLore,
  contract
}: {
  wizardsWithLore: { [key: number]: boolean };
  contract: string;
}) {
  const [showActivity, setShowActivity] = useState(false);
  const [listings, setListings] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasLore, setHasLore] = useState(false);
  const [hasNoLore, setHasNoLore] = useState(false);
  const [continuation, setContinuation] = useState('');
  const [items, setItems] = useState(0);
  const [floor, setFloor] = useState(0);
  const [bid, setBid] = useState(0);
  const router = useRouter();

  let displayName = contract in CONTRACTS ? CONTRACTS[contract].display : COMMUNITY_CONTRACTS[contract].display;
  let singular = contract in CONTRACTS ? CONTRACTS[contract].singular : COMMUNITY_CONTRACTS[contract].singular;

  async function getStats() {
    var stats_url = API_BASE_URL + "stats/v1?" + "collection=" + contract + getURLAttributes(contract, router.query);
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
          getURLAttributes(contract, router.query),
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
    if (
      ((router.asPath.includes('?') && Object.keys(router.query).length > 1) || !router.asPath.includes('?')) &&
      !Object.keys(router.query).includes('activity')
    ) {
      fetchListings(true);
      getStats();
    }
  }, [router.query]);

  if (contract) {
    return (
      <Layout
        title={`${displayName} ${ showActivity ? 'Activity' : 'Marketplace'}`}
        description={`Like ${singular}, Buy ${singular}`}
        image={`/static/img/marketplace/${displayName.toLowerCase()}-banner.png`}
      >
        <Main>
          <Sidebar activity={showActivity} />
          <div style={{width: '1100px'}}>
            <MidHeader>
              <CollectionStats items={items} floor={floor} bid={bid} contract={contract} />
              <MainToggle contract={contract} activity={showActivity} />
            </MidHeader>
            { listings.length > 0 || loaded ? (
                <InfiniteScroll
                  dataLength={listings.length}
                  next={() => fetchListings(false)}
                  hasMore={true}
                  loader={null}
                  scrollThreshold={0.3}
                  height={"100vh"}
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
                    <TopScrim>
                      <Image src='/static/img/scrim-reverse.png' height='20px' width='1155px' />
                    </TopScrim>
                    <BottomScrim>
                      <Image src='/static/img/scrim.png' height='150px' width='1155px' />
                    </BottomScrim>
                  </ScrollContainer>
                </InfiniteScroll>
            ) : (
              <LoadingCard height={'82vh'}/>
            )}
        </div>
        <RightBar 
          contract={contract} 
          loreChange={() => { setHasLore(!hasLore); fetchListings(false); }} 
          noLoreChange={() => setHasNoLore(!hasNoLore)}
          setSource={updateSource}
          selectionChange={selectionChange}
        />
      </Main>
      </Layout>
    )
  } else {
    return (
      <Layout title="Marketplace">
      </Layout>
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