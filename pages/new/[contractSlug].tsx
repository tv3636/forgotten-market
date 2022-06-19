import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";
import { API_BASE_URL, CONTRACTS } from "../../components/Marketplace/marketplaceConstants";
import { getURLAttributes, LoadingCard } from "../../components/Marketplace/marketplaceHelpers";
import Layout from "../../components/Marketplace/NewLayout";
import CollectionStats from "../../components/Marketplace/CollectionStats";
import MainToggle from "../../components/Marketplace/MainToggle";
import Sidebar from "../../components/Marketplace/NewSidebar";
import InfiniteScroll from "react-infinite-scroll-component";
import TokenDisplay from "../../components/Marketplace/TokenDisplay";
import Image from 'next/image';

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const MidHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-top: -4ch;
  margin-bottom: var(--sp1);
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;

  padding-bottom: 200px;
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

  useEffect(() => {
    setShowActivity(Object.keys(router.query).includes('activity'));
  }, [router.query]);

  useEffect(() => { 
    fetchListings(true);
    getStats();
  }, [contract]);
  

  if (contract) {
    return (
      <Layout
        title={`${CONTRACTS[contract].display} ${ showActivity ? 'Activity' : 'Marketplace'}`}
        description={`Like ${CONTRACTS[contract].singular}, Buy ${CONTRACTS[contract].singular}`}
        image={`/static/img/marketplace/${CONTRACTS[contract].display.toLowerCase()}-banner.png`}
      >
        <MidHeader>
          <CollectionStats items={items} floor={floor} bid={bid} contract={contract} />
          <MainToggle contract={contract} activity={showActivity} />
        </MidHeader>
        <Main>
          <Sidebar 
            contract={contract} 
            activity={showActivity}
            loreChange={null} 
            noLoreChange={null}
            setSource={null}
            selectionChange={null}
          />
          <div style={{width: '65vw'}}>
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
            <LoadingCard height={'82vh'}/>
          )}
        </div>
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