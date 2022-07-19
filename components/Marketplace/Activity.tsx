import { useEffect, useState } from "react";
import { API_BASE_URL } from "./marketplaceConstants";
import { getURLAttributes, getContract } from "./marketplaceHelpers";
import styled from "@emotion/styled";
import InfiniteScroll from "react-infinite-scroll-component";
import router, { useRouter } from "next/router";
import LoadingCard from "./LoadingCard";
import ActivityRow from "./ActivityRow";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;

  padding-top: var(--sp1);
  padding-bottom: 400px;
`;

const HorizontalLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 100%;
  border-width: 1px;
  margin-top: var(--sp-1);
  margin-bottom: var(--sp-1);

  @media only screen and (max-width: 1250px) {
    border-color: black;
    width: 90%;

    margin-top: var(--sp1) / 2;
    margin-bottom: var(--sp1) / 2;
  }
`;

const ActivityWrapper = styled.div`
  width: 80%;
  max-width: 800px;

  @media only screen and (max-width: 1250px) {
    width: 100%;
  }
`;

export default function Activity({
  contract,
}: {
  contract: string;
}) {
  const [sales, setSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [salesContinuation, setSalesContinuation] = useState('');
  const [listingsContinuation, setListingsContinuation] = useState('');
  const [fetched, setFetched] = useState(false);
  let contractDict = getContract(contract);
  const router = useRouter();

  async function fetchTokens(continued: boolean) {
    if (router.query.activity == 'sales') {
      const recentSales = await fetch(
        API_BASE_URL + `sales/v3?collection=${contract}${salesContinuation != '' && continued 
          ? "&continuation=" + salesContinuation 
          : ''
        }`
        + getURLAttributes(router.query, contractDict.display), 
        { headers: headers }
      );
      const salesJson = await recentSales.json();
      console.log(salesJson);

      if (continued) {
        setSales(sales.concat(salesJson.sales)); 
      } else {
        setSales(salesJson.sales);
      }
      setSalesContinuation(salesJson.continuation);
    }

    if (router.query.activity == 'listings') {
      const recentListings = await fetch(
        API_BASE_URL + `orders/asks/v2?contracts=${contract}${listingsContinuation != '' && continued 
        ? "&continuation=" + listingsContinuation 
        : ''
      }`,
        { headers: headers }
      );
      const listingsJson = await recentListings.json();
      console.log(listingsJson);


      if (continued) {
        setListings(listings.concat(listingsJson.orders));
      } else {
        setListings(listingsJson.orders);
      }

      setListingsContinuation(listingsJson.continuation);
    }

    setFetched(true);
  }

  useEffect(() => {
    setFetched(false);
    fetchTokens(false);
  }, [router.query]);

  return (
    <InfiniteScroll
      dataLength={sales.length}
      next={() => { fetchTokens(true) }}
      hasMore={true}
      loader={null}
      scrollThreshold={0.1}
      height={'100vh'}
      style={{backgroundImage: 'url(/static/img/interior-dark.png)'}}
    >
      { fetched ? 
        <ScrollContainer>
        {(router.query.activity == 'sales' ? sales : listings).map((activity: any, index) => {
          return (activity ?
            <ActivityWrapper key={index}>
              <ActivityRow contract={contract} activity={activity} />
              <HorizontalLine/>
            </ActivityWrapper> :
            null
          );
        })
        }
        <div className="scrim"/>
        </ScrollContainer> :
        <LoadingCard height={'80vh'} background={true}/>
      }
    </InfiniteScroll>
  )
}
