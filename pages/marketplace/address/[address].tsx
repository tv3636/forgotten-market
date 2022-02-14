import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import styled from "@emotion/styled";
import { getProvider } from "../../../hooks/useProvider";
import { getTokenDataForAllCollections } from "../../../lib/nftUtilis";
import { useState, useEffect } from "react";
import { API_BASE_URL, CONTRACTS } from "../../../components/Marketplace/marketplaceConstants";
import Link from "next/link";
import { getInfinityVeilContract, getPoniesContract } from "../../../contracts/ForgottenRunesWizardsCultContract";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const marketplaceContracts = [
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
  "0x251b5f14a825c537ff788604ea1b58e49b70726f",
  "0xf55b615b479482440135ebf1b907fd4c37ed9420"
]

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
  border-color: var(--mediumGray);
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
  border-color: var(--mediumGray);
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

const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);

  :hover {
    border: 1px dashed var(--mediumGray);
  }

  transition: all 100ms;

  @media only screen and (max-width: 600px) {
    border: 4px solid var(--darkGray);
    max-width: 300px;
    max-height: 300px;
  }
`;

const DisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;

`;

const SoftLink = styled.a`
  text-decoration: none;
`;

const CollectionEthSymbol = styled.img`
  height: 11px;
  margin-right: 5px;
  margin-top: 3px;
`;

function sortByKey(array: any, key: any) {
  return array.sort(function(a: any, b: any) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function OverallDisplay({
  tokens,
  title
}: {
  tokens: any;
  title: string;
}) {
  return (
    <DisplayContainer>
      <Title style={{fontSize: '20px'}}>{title}</Title>
      <HorizontalLine style={{borderColor: 'black'}}/>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {tokens.map((token: any, index: number) => {
          return (
            <div key={index}>
              <Link 
                href={`/marketplace/${token.contract}/${token.tokenId}`} 
                passHref={true}
              >
                <SoftLink>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TokenImage 
                      src={ token.contract == '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42' ? 
                        `${CONTRACTS[token.contract].image_url}${token.tokenId}/${token.tokenId}.png` :
                        `${CONTRACTS[token.contract].image_url}${token.tokenId}.png`
                      }
                      height={100} 
                      width={100} 
                    />
                    <div style={{display: 'flex', fontFamily: 'Roboto Mono', color: 'var(--white)', fontSize: '14px', marginTop: '5px', marginBottom: '10px'}}>
                    <CollectionEthSymbol
                      src="/static/img/marketplace/eth.png"
                    />
                      {token.value}
                    </div>
                  </div>
                </SoftLink>
              </Link>
            </div>
          );
        })}
      </div>
      <HorizontalLine style={{borderColor: 'black'}}/>
    </DisplayContainer>
  )
}

function TokenDisplay({
  tokens,
  contract,
}:{
  tokens: any;
  contract: string;
}) {
  return (
    <DisplayContainer>
      <Title style={{fontSize: '20px'}}>{CONTRACTS[contract].display}</Title>
      <HorizontalLine style={{borderColor: 'black'}}/>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {tokens && tokens.map((token: any, index: number) => {
          return (
            <div key={index}>
              <Link 
                href={`/marketplace/${contract}/${token[0]}`} 
                passHref={true}
              >
                <SoftLink>
                  <TokenImage 
                    src={ contract == '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42' ? 
                      `${CONTRACTS[contract].image_url}${token[0]}/${token[0]}.png` :
                      `${CONTRACTS[contract].image_url}${token[0]}.png`
                    }
                    height={100} 
                    width={100} 
                  />
                </SoftLink>
              </Link>
            </div>
          );
        })}
      </div>
      <HorizontalLine style={{borderColor: 'black'}}/>
    </DisplayContainer>
  )
}

export default function Marketplace({
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
        if (marketplaceContracts.includes(position.set.schema.data.contract)) {
          var listingObject = position.set.schema.data;
          listingObject.value = position.primaryOrder.value;
          validListings.push(listingObject);
        }
      }

      iteration++;
    }
    console.log(validListings);
    
    if (orderType == 'sell') {
      setListings(sortByKey(validListings, 'value'));
    } else {
      setOffers(sortByKey(validListings, 'value'));
    }
  }

  useEffect(() => {
    fetchOrders('sell');
    fetchOrders('buy')
  }, []);

  if (valid) {
  return (
    <Layout title="Account">
      <AccountWrapper>
        <Account>
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
          <HorizontalLine/>
          <HorizontalLine style={{borderColor: 'black'}}/>
          <StatRow>
            <SubTitle>{`Wizards Owned: ${tokenData.wizards.length}`}</SubTitle>
            <SubTitle>{`Souls Owned: ${tokenData.souls.length}`}</SubTitle>
            <SubTitle>{`Ponies Owned: ${tokenData.ponies.length}`}</SubTitle>
            <SubTitle>{`Flames Owned: ${tokenData.flames.length}`}</SubTitle>
          </StatRow>
          <HorizontalLine style={{borderColor: 'black'}}/>
          <DesktopLine style={{borderColor: 'black'}}/>
          { tokenData.wizards.length > 0 && 
            <TokenDisplay tokens={tokenData.wizards} contract={'0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42'}/>
          }
          { tokenData.souls.length > 0 && 
            <TokenDisplay tokens={tokenData.souls} contract={'0x251b5f14a825c537ff788604ea1b58e49b70726f'}/>
          }
          { tokenData.ponies.length > 0 && 
            <TokenDisplay tokens={tokenData.ponies} contract={'0xf55b615b479482440135ebf1b907fd4c37ed9420'}/>
          }
          <HorizontalLine style={{borderColor: 'black'}}/>
          { listings.length > 0 && 
            <OverallDisplay tokens={listings} title={'Listings'}/>
          }
          { offers.length > 0 && 
            <OverallDisplay tokens={offers} title={'Offers Made'}/>
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

    tokenData.ponies = ponies;

    var flames = await veilContract.balanceOf(address, 0);
    tokenData.flames = new Array(Number(flames.toString()));

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