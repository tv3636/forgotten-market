import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";
import { API_BASE_URL, CONTRACTS } from "../../components/Marketplace/marketplaceConstants";
import { getURLAttributes } from "../../components/Marketplace/marketplaceHelpers";
import Layout from "../../components/Marketplace/NewLayout";
import CollectionStats from "../../components/Marketplace/CollectionStats";
import MainToggle from "../../components/Marketplace/MainToggle";
import Sidebar from "../../components/Marketplace/NewSidebar";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const MidHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function Marketplace({
  wizardsWithLore,
  contract
}: {
  wizardsWithLore: { [key: number]: boolean };
  contract: string;
}) {
  const [showActivity, setShowActivity] = useState(false);
  const [items, setItems] = useState(0);
  const [floor, setFloor] = useState(0);
  const [bid, setBid] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setShowActivity(Object.keys(router.query).includes('activity'));
  }, [router.query]);

  useEffect(() => { 
    async function getStats() {
      var stats_url = API_BASE_URL + "stats/v1?" + "collection=" + contract + getURLAttributes(contract, router.query);
      const statsPage = await fetch(stats_url, { headers: headers });
      const statsJson = await statsPage.json();

      setItems(statsJson.stats.tokenCount);
      setFloor(statsJson.stats.market.floorAsk.price?.toPrecision(2));
      setBid(statsJson.stats.market.topBid.value?.toPrecision(2));
    }
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
      <Sidebar activity={showActivity} />
    </Layout>
  );
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