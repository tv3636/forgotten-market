import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import styled from "@emotion/styled";
import { getProvider } from "../../hooks/useProvider";
import { useState, useEffect } from "react";
import AccountSection from "../../components/Marketplace/AccountSection";
import { PREVIOUS_API_BASE_URL, CONTRACTS, API_BASE_URL } from "../../components/Marketplace/marketplaceConstants";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const AccountWrapper = styled.div`
  display: flex;
  
  min-height: 90vh;
  margin: 0 auto;
  max-width: 1500px;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
    justify-content: center;
  }
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
  font-size: 16px;
  font-family: Phat;
  color: var(--white);

  margin-top: var(--sp-3);

  @media only screen and (max-width: 600px) {
    font-size: 18px;
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SubTitle = styled.div`
  font-size: 15px;
  font-family: Staxblox;
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
    <div style={{display: 'flex', flexDirection: 'row'}}>
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
  const [offers, setOffers] = useState<any>([]);
  const [offersMade, setOffersMade] = useState<any>([]);
  const [continuation, setContinuation] = useState('');

  async function fetchOrders(orderType: string) {
    var validListings: any = [];
    var iteration = 0;
    var page = null;
    var pageJson: any = {};
    var fetchUrl = `${API_BASE_URL}orders/${orderType == 'sell' ? 'asks' : 'bids'}/v2?maker=${address}`;

    for (var contract of Object.keys(CONTRACTS)) {
      fetchUrl += `&contracts=${contract}`;
    }

    console.log(fetchUrl);
  
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

  async function fetchOffers() {
    var activeOffers = [];
    var iteration = 0;
    var offset = 20;
    var page = null;
    var pageJson: any = {};

    while (iteration == 0 || pageJson.tokens.length == offset) {
      page = await fetch(
        `${PREVIOUS_API_BASE_URL}users/${address}/tokens?community=forgottenrunes&hasOffer=true&offset=${offset * iteration}`,
        { headers: headers }
      );

      pageJson = await page.json();

      for (var token of pageJson.tokens) {
        if (token.token.topBuy.schema.kind != 'collection') {
          activeOffers.push(token.token);
        }
      }

      iteration++;
    }

    setOffers(activeOffers);
  }

  useEffect(() => {
    fetchOrders('sell');
    fetchOrders('buy')
    fetchOffers();
  }, []);

  if (valid) {
  return (
    <Layout title="Account">
      <AccountWrapper>
        <Account>
          <AccountHeader address={address} ens={ens}/>
          <HorizontalLine style={{borderColor: 'var(--mediumGray)'}}/>
          <HorizontalLine />
          <StatRow>
            {Object.keys(tokenData).map((contract: any, index: number) => {
              return (
                <SubTitle key={index}>
                  {
                    `${CONTRACTS[contract].display}: ${CONTRACTS[contract].display == 'Flames' && tokenData[contract][0] ? 
                    tokenData[contract][0].ownership.tokenCount : 
                    tokenData[contract].length
                  }`
                  }
                </SubTitle>
              );
            })}
          </StatRow>
          <HorizontalLine />
          <DesktopLine style={{borderColor: 'black'}}/>
          {Object.keys(tokenData).map((contract: any, index: number) => {
              return tokenData[contract].length > 0 && CONTRACTS[contract].display != 'Flames' &&
                <AccountSection 
                  key={index} 
                  tokens={tokenData[contract]} 
                  contract={contract} 
                  title={CONTRACTS[contract].display}
                />
            })}
          <HorizontalLine />
          { listings.length > 0 && 
            <AccountSection tokens={listings} contract={null} title={'Listings'}/>
          }
          { offersMade.length > 0 && 
            <AccountSection tokens={offersMade} contract={null} title={'Offers Made'}/>
          }
           { offers.length > 0 && 
            <AccountSection tokens={offers} contract={null} title={'Offers Received'}/>
          }
        </Account>
      </AccountWrapper>
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

    for (var contract of Object.keys(CONTRACTS)) {
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
