import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";
import { API_BASE_URL, CONTRACTS } from "../../components/Marketplace/marketplaceConstants";
import { getURLAttributes } from "../../components/Marketplace/marketplaceHelpers";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-left: var(--sp3);
  margin-right: var(--sp3);
  margin-top: var(--sp1);
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MidHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
`;

const StatsItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  padding: var(--sp-1);
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuItem = styled.div`
  padding: var(--sp1);
`;

const Toggle = styled.div`
  display: flex;

  .leftButton {
    border-top-left-radius: var(--sp-2);
    border-bottom-left-radius: var(--sp-2);
  }
  
  .rightButton {
    border-top-right-radius: var(--sp-2);
    border-bottom-right-radius: var(--sp-2);
  }
`;

const ToggleButton = styled.div`
  text-align: center;
  justify-content: center;

  width: 17ch;

  padding-left: var(--sp1);
  padding-right: var(--sp1);
  padding-top: var(--sp-3);
  padding-bottom: var(--sp-3);

  background-color: var(--mediumGray);

  :hover {
    background-color: var(--darkGray);
    cursor: pointer;
  }

  transition: all 200ms;
`;


function numShorten(num: number) {
  return num >= 1000 ? `${(num / 1000).toPrecision(2)}k` : num;
}

function SiteNav({}:{}) {
  const { account } = useEthers();
  
  return (
    <HeaderWrapper>
      <Image src="/static/img/forgotten-runes-logo.png" width="180px" height="59px"/>  
      <Menu>
        <MenuItem>
          <Link href='/about'>HELP</Link>
        </MenuItem>
        <MenuItem>
          {account ? 
              <Link href={`/address/${account}`}>
                ACCOUNT
              </Link> :
            <div>CONNECT</div>
          }
        </MenuItem>
      </Menu>
    </HeaderWrapper>
  )
}

function EthSymbol({
  weth
}:{
  weth: boolean;
}) {
  return (
    <div style={{marginRight: 'var(--sp-4)', display: 'flex'}}>
      <Image 
        src={weth ? "/static/img/marketplace/weth.png" : "/static/img/marketplace/eth_alt.png"} 
        height='21ex' 
        width='11ch'
      />
    </div>
  )
}

function Stats({
  items,
  floor,
  bid,
  contract,
}: { 
  items: number;
  floor: number;
  bid: number;
  contract: string;
}) {
  return (
    <StatsWrapper>
      <StatsItem>
        <h1>{numShorten(items)}</h1>
        <div>{CONTRACTS[contract].display.toUpperCase()}</div>
      </StatsItem>
      <StatsItem>
        <Price>
          <EthSymbol weth={false}/>
          <h1>{floor}</h1>
        </Price>
        <div>FLOOR</div>
      </StatsItem>
      <StatsItem>
        <Price>
          <EthSymbol weth={true}/>
          <h1>{bid? bid : 0}</h1>
        </Price>
        <div>TOP BID</div>
      </StatsItem>
    </StatsWrapper>
  )
}

type Props = {
  children?: ReactNode;
  description?: string;
  title?: string;
  image?: string;
};

const Layout = ({
  children,
  description,
  image = "https://forgotten.market/static/img/OSFeature.png",
  title = "forgotten.market",
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta name="twitter:title" content={title} key="twittertitle" />
      <meta name="twitter:card" content="summary_large_image" key="twcard" />

      {description && (
        <meta property="og:description" content={description} key="ogdesc" />
      )}
      {description && (
        <meta
          name="twitter:description"
          content={description}
          key="twitterdesc"
        />
      )}

      {image ? (
        <meta 
          name="twitter:image" 
          content={image}
          key="twimage"
        />
      ) :
      <meta 
        name="twitter:image" 
        content={"https://forgotten.market/static/img/OSFeature.png"}
        key="twimage"
      />
    }

      {image ? (
      <meta
        property="og:image"
        content={image}
        key="ogimage"
      />
      ) :
      <meta
        property="og:image"
        content={"https://forgotten.market/static/img/OSFeature.png"}
        key="ogimage"
      />
      }
      
      {/* <meta property="og:image" content="image.png" /> */}
    </Head>
    <SiteNav />
    {children}
  </div>
);

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
      setFloor(statsJson.stats.market.floorAsk.price.toPrecision(3));
      setBid(statsJson.stats.market.topBid.value?.toPrecision(3));
    }
    getStats();
  }, []);

  if (contract) {
  return (
    <Layout
      title={`${CONTRACTS[contract].display} ${ showActivity ? 'Activity' : 'Marketplace'}`}
      description={`Like ${CONTRACTS[contract].singular}, Buy ${CONTRACTS[contract].singular}`}
      image={`/static/img/marketplace/${CONTRACTS[contract].display.toLowerCase()}-banner.png`}
    >
      <MidHeader>
        <Stats items={items} floor={floor} bid={bid} contract={contract}/>
        <Toggle>
          <Link href={`/${contract}`}>
            <ToggleButton style={showActivity ? {} : { backgroundColor: 'var(--darkGray)'}} className='leftButton'>
              MARKETPLACE
            </ToggleButton>
          </Link>
          <Link href={`/${contract}?activity=True`}>
            <ToggleButton style={showActivity ? { backgroundColor: 'var(--darkGray)'} : {}} className='rightButton'>
              ACTIVITY
            </ToggleButton>
          </Link>
        </Toggle>
      </MidHeader>
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