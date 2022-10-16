import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Marketplace/Layout";
import styled from "@emotion/styled";
import { getProvider } from "../../hooks/useProvider";
import { useState, useEffect } from "react";
import AccountSection from "../../components/Marketplace/AccountSection";
import { CONTRACTS, API_BASE_URL, COMMUNITY_CONTRACTS } from "../../components/Marketplace/marketplaceConstants";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const PageWrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 90vh;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const AccountWrapper = styled.div`
  display: flex;
  
  margin: 0 auto;
  max-width: 1500px;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
    justify-content: center;
  }
`;

const AccountInfo = styled.div`
  position: sticky;
  top: 0;
  width: 100%;

  background-color: black;
`;

const Account = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

  margin-left: var(--sp1);
  margin-top: var(--sp3);

  @media only screen and (max-width: 600px) {
    align-content: center;
    align-items: center;
    width: 90%;
  }

`;

const HorizontalLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 50vw;
  margin-left: 0;
  border-width: 1px;
  margin-top: var(--sp-1);
  margin-bottom: 1px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    margin-top: var(--sp-1);
  }
`;

const DesktopLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 50vw;
  border-width: 1px;
  margin-top: var(--sp-1);
  margin-bottom: 1px;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Title = styled.div`
  font-size: var(--sp2);
  font-family: Alagard;
  color: var(--white);

  margin-top: var(--sp-1);

  @media only screen and (max-width: 600px) {
    font-size: 18px;
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SubTitle = styled.div`
  font-family: Terminal;
  text-transform: uppercase;
  color: var(--white);

  margin-bottom: var(--sp1);
  margin-right: var(--sp3);

  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const IconImage = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 20px;

  @media only screen and (max-width: 600px) {
    width: 20px;
    height: 20px;
  }

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }

  transition: all 200ms;
`;

const StatRow = styled.div`
  display: flex;
  text-align: center;

  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;


function sortByKey(array: any, key: any) {
  return array.sort(function(a: any, b: any) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function AccountHeader({ 
  address, 
  ens
}: {
  address: string;
  ens: string;
  }) {
  return (
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
      <Title>{ens ? ens : address}</Title>
        <a
          href={`https://opensea.io/${address}`}
          className="icon-link"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <IconImage src="/static/img/icons/nav/opensea_default.png"/>
        </a>
    </div>
  )
}

export default function Address({
  address,
  tokenData,
  ens,
  valid,
}: {
  address: string;
  tokenData: any;
  ens: string;
  valid: boolean;
}) {
  const [listings, setListings] = useState<any>([]);
  const [offersMade, setOffersMade] = useState<any>([]);
  const [continuation, setContinuation] = useState('');

  async function fetchOrders(orderType: string) {
    var validListings: any = [];
    var iteration = 0;
    var page = null;
    var pageJson: any = {};
    var fetchUrl = `${API_BASE_URL}orders/${orderType == 'sell' ? 'asks' : 'bids'}/v2?maker=${address}`;

    for (var contract of Object.keys(CONTRACTS).concat(Object.keys(COMMUNITY_CONTRACTS))) {
      fetchUrl += `&contracts=${contract}`;
    }
  
    while (iteration == 0 || continuation) {
      page = await fetch(
        fetchUrl,
        { headers: headers }
      );

      pageJson = await page.json();
      validListings = validListings.concat(pageJson.orders);
      setContinuation(pageJson.continuation);

      iteration++;
    }
    
    if (orderType == 'sell') {
      setListings(sortByKey(validListings, 'value'));
    } else {
      setOffersMade(sortByKey(validListings, 'value'));
    }
  }

  useEffect(() => {
    fetchOrders('sell');
    fetchOrders('buy')
  }, []);

  if (valid) {
  return (
    <Layout 
      title="Account Page"
      image={`https://forgotten-market-api.vercel.app/api/og?address=${address}`}
    >
      <PageWrapper>
        <AccountWrapper>
          <Account>
            <AccountInfo>
            <AccountHeader address={address} ens={ens}/>
            <HorizontalLine style={{borderColor: 'var(--mediumGray)'}}/>
            <HorizontalLine />
            <StatRow>
              {Object.keys(tokenData).map((contract: any, index: number) => {
                let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
                return (
                  <SubTitle key={index}>
                    {
                      `${contracts[contract].display}: ${contracts[contract].display == 'Flames' && tokenData[contract][0] ? 
                      tokenData[contract][0].ownership.tokenCount : 
                      tokenData[contract].length
                    }`
                    }
                  </SubTitle>
                );
              })}
            </StatRow>
            </AccountInfo>
            
            <DesktopLine style={{borderColor: 'black'}}/>
            {Object.keys(tokenData).map((contract: any, index: number) => {
                let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
                return tokenData[contract].length > 0 && contracts[contract].display != 'Flames' &&
                  <AccountSection 
                    key={index} 
                    tokens={tokenData[contract]} 
                    contract={contract} 
                    title={contracts[contract].display}
                  />
              })}
            <HorizontalLine />
            { listings.length > 0 && 
              <AccountSection tokens={listings} contract={null} title={'Listings'}/>
            }
            { offersMade.length > 0 && 
              <AccountSection tokens={offersMade} contract={null} title={'Offers Made'}/>
            }
          </Account>
        </AccountWrapper>
      </PageWrapper>
    </Layout>
  )
  } else {
    return (
      <Layout title="Account">
        <AccountWrapper style={{justifyContent: 'center'}}>
          <Account >
            <Title>Invalid address</Title>
          </Account>
        </AccountWrapper>
      </Layout>
    )
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const mainProvider = getProvider(false);
  const address = params?.address as string;
  var tokenData: any = {};
  var ens = '';
  var valid = true;

  try {
    ens = await mainProvider.lookupAddress(address) ?? '';

    for (var contract of Object.keys(CONTRACTS).concat(Object.keys(COMMUNITY_CONTRACTS))) {
      var tokens: any = [];
      var iteration = 0;
      var offset = 20;
      var page = null;
      var pageJson: any = {};
  
      while (iteration == 0 || pageJson.tokens && pageJson.tokens.length == offset) {
        page = await fetch(
          `${API_BASE_URL}users/${address}/tokens/v2?collection=${contract}&offset=${offset * iteration}&limit=20`,
          { headers: headers }
        );
  
        pageJson = await page.json();
        tokens = tokens.concat(pageJson.tokens)

        iteration ++;
      }

      tokenData[contract] = tokens;
    }
    

  } catch (error) {
    valid = false;
    console.error(error);
  }
  
  return {
    props: {
      address: address,
      tokenData: tokenData,
      ens: ens,
      valid: valid,
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
