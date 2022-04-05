import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import { GetStaticPaths, GetStaticProps } from "next";
import { getWizardsWithLore } from "../components/Lore/loreSubgraphUtils";
import { getURLAttributes, LoadingCard } from "../components/Marketplace/marketplaceHelpers";
import {
  API_BASE_URL,
  CONTRACTS,
  ORDER_TYPE,
} from "../components/Marketplace/marketplaceConstants";
import { useRouter } from 'next/router';
import Order from "../components/Marketplace/Order";
import MarketTabs from "../components/Marketplace/MarketTabs";
import Activity from "../components/Marketplace/Activity";
import CollectionOfferButton from "../components/Marketplace/CollectionOfferButton";
import TokenDisplay from "../components/Marketplace/TokenDisplay";
import SideBar from "../components/Marketplace/Sidebar";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

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
    margin-top: 1vh;
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
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: center;
    margin-right: 0px;
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

const ScrollWrapper = styled.div`
  width: 83%;

  @media only screen and (max-width: 600px) {
    width: 100%;
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
      { !showActivity && collection != 'infinityveil' && 
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
              height={"100vh"}
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
          <LoadingCard height={'82vh'}/>
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
    <Layout 
      title={`${CONTRACTS[contract].display} ${ showActivity ? 'Activity' : 'Marketplace'}`}
      description={'Like Wizard, Buy Wizard'}
      image={'https://forgotten.market/static/img/OSFeature.png'}
    >
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
            hash={''}
            offerHash={''}
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
    return (
      <Layout title="Marketplace">
        <MarketWrapper></MarketWrapper>
      </Layout>
    )
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

