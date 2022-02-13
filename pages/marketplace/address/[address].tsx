import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import styled from "@emotion/styled";
import { getProvider } from "../../../hooks/useProvider";
import { getTokenDataForAllCollections } from "../../../lib/nftUtilis";
import { useState } from "react";
import { useEffect } from "styled-components/node_modules/@types/react";
import { CONTRACTS } from "../../../components/Marketplace/marketplaceConstants";
import Link from "next/link";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');
TimeAgo.addLocale(en);

const AccountWrapper = styled.div`
  display: flex;
  
  min-height: 90vh;
  margin: 0 auto;
  max-width: 1500px;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
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
  }

`;

const HorizontalLine = styled.hr`
  border-color: var(--mediumGray);
  border-style: dashed;
  width: 50vw;
  border-width: 1px;
  margin-top: var(--sp-1);
  margin-bottom: 1px;

  @media only screen and (max-width: 600px) {
    width: 100%;

    margin-top: var(--sp1) / 2;
    margin-bottom: var(--sp1) / 2;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-family: Alagard;
  color: var(--white);

  margin-top: var(--sp-3);

  @media only screen and (max-width: 600px) {
    font-size: 18px;
  }
`;

const SubTitle = styled.div`
  font-size: 15px;
  font-family: Roboto Mono;
  color: var(--white);

  margin-bottom: var(--sp1);
  margin-right: var(--sp3);

  @media only screen and (max-width: 600px) {
    font-size: 15px;
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
  }

  transition: all 200ms;
`;

const StatRow = styled.div`
  display: flex;
  text-align: center;
`;

const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);

  @media only screen and (max-width: 600px) {
    border: 4px solid var(--darkGray);
    max-width: 300px;
    max-height: 300px;
  }
`;

const SoftLink = styled.a`
  text-decoration: none;
`;

function TokenDisplay({
  tokens,
  contract,
}:{
  tokens: any;
  contract: string;
}) {
  return (
    <div>
      <Title style={{fontSize: '20px'}}>{CONTRACTS[contract].display}</Title>
      <HorizontalLine style={{borderColor: 'black'}}/>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {tokens && tokens.map((wizard: any, index: number) => {
          return (
            <div>
              <Link 
                href={`/marketplace/${contract}/${wizard[0]}`} 
                passHref={true}
              >
                <SoftLink>
                  <TokenImage 
                    src={ contract == '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42' ? 
                      `${CONTRACTS[contract].image_url}${wizard[0]}/${wizard[0]}.png` :
                      `${CONTRACTS[contract].image_url}${wizard[0]}.png`
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
    </div>
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
            <SubTitle>{`Wizards Owned: ${tokenData.wizards ? tokenData.wizards.length : 0}`}</SubTitle>
            <SubTitle>{`Souls Owned: ${tokenData.souls ? tokenData.souls.length: 0 }`}</SubTitle>
            <SubTitle>{`Ponies Owned: ${tokenData.ponies ? tokenData.ponies.length: 0}`}</SubTitle>
          </StatRow>
          <HorizontalLine style={{borderColor: 'black'}}/>
          <HorizontalLine style={{borderColor: 'black'}}/>
          <TokenDisplay tokens={tokenData.wizards} contract={'0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42'}/>
          <TokenDisplay tokens={tokenData.souls} contract={'0x251b5f14a825c537ff788604ea1b58e49b70726f'}/>
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