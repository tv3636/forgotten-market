import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import styled from "@emotion/styled";
import { getProvider } from "../../../hooks/useProvider";
import { getTokenDataForAllCollections } from "../../../lib/nftUtilis";
import { useState, useEffect } from "react";
import AccountSection from "../../../components/Marketplace/AccountSection";
import { API_BASE_URL, CONTRACTS } from "../../../components/Marketplace/marketplaceConstants";
import { getInfinityVeilContract, getPoniesContract } from "../../../contracts/ForgottenRunesWizardsCultContract";

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
  font-size: 24px;
  font-family: Alagard;
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
  font-family: Roboto Mono;
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
  const [offers, setOffers] = useState<any>([]);
  const [offersMade, setOffersMade] = useState<any>([]);

  async function fetchOrders(orderType: string) {
    var validListings = [];
    var iteration = 0;
    var offset = 20;
    var page = null;
    var pageJson: any = {};
  
    while (iteration == 0 || pageJson.positions.length == offset) {
      page = await fetch(
        `${API_BASE_URL}users/${address}/positions?side=${orderType}&status=valid&offset=${offset * iteration}`,
        { headers: headers }
      );

      pageJson = await page.json();

      for (var position of pageJson.positions) {
        if (Object.keys(CONTRACTS).includes(position.set.schema.data.contract)) {
          var listingObject = position.set.schema.data;
          listingObject.value = position.primaryOrder.value;
          validListings.push(listingObject);
        }
      }

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
        `${API_BASE_URL}users/${address}/tokens?community=forgottenrunes&hasOffer=true&offset=${offset * iteration}`,
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
            {Object.keys(tokenData.byContract).map((contract: any, index: number) => {
              return (
                <SubTitle key={index}>
                  {`${CONTRACTS[contract].display} Owned: ${tokenData.byContract[contract].length}`}
                </SubTitle>
              );
            })}
            <SubTitle>{`Flames Owned: ${tokenData.flames.length}`}</SubTitle>
          </StatRow>
          <HorizontalLine />
          <DesktopLine style={{borderColor: 'black'}}/>
          {Object.keys(tokenData.byContract).map((contract: any, index: number) => {
              return tokenData.byContract[contract].length > 0 && 
                <AccountSection 
                  key={index} 
                  tokens={tokenData.byContract[contract]} 
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
    tokenData = await getTokenDataForAllCollections(mainProvider, address);
    ens = await mainProvider.lookupAddress(address) ?? '';

    const poniesContract = await getPoniesContract({ provider: mainProvider });
    const veilContract = await getInfinityVeilContract({ provider: mainProvider });
    var ponyCount = await poniesContract.balanceOf(address);
    var ponies = [];
    
    for (var i = 0; i < Number(ponyCount.toString()); i++) {
      var pony = await poniesContract.tokenOfOwnerByIndex(address, i);
      ponies.push([pony.toString()]);
    }

    var flames = await veilContract.balanceOf(address, 0);
    tokenData.flames = new Array(Number(flames.toString()));

  } catch (error) {
    valid = false;
    console.error(error);
  }

  tokenData.byContract = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID) == 1 ? {
    '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42': tokenData.wizards,
    '0x251b5f14a825c537ff788604ea1b58e49b70726f': tokenData.souls,
    '0xf55b615b479482440135ebf1b907fd4c37ed9420': ponies
  } :
  {
    '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42': tokenData.wizards,
    '0x95082b505c0752eef1806aef2b6b2d55eea77e4e': tokenData.souls,
    '0x5020c6460b0b26a69c6c0bb8d99ed314f3c39d9e': ponies
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
