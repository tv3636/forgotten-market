import { useEffect, useState } from "react";
import { API_BASE_URL, COMMUNITY_CONTRACTS, CONTRACTS, MARKET_ICONS_BY_NAME } from "./marketplaceConstants";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { SoftLink, LoadingCard, getURLAttributes } from "./marketplaceHelpers";
import Link from "next/link";
import styled from "@emotion/styled";
import InfiniteScroll from "react-infinite-scroll-component";
import router from "next/router";
import FilterHeader from "./FilterHeader";

TimeAgo.addDefaultLocale(en);
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

const ActivityImage = styled.img`
  border-style: solid;
  border-width: 4px;
  border-color: var(--darkGray);
  border-radius: 10px;

  margin-right: var(--sp0);
  z-index: 2;

  width: 150px;
  height: 150px;

  :hover {
    cursor: pointer;
    border-color: var(--mediumGray);
  }

  @media only screen and (max-width: 1250px) {
    width: 100px;
    height: auto;
    margin-left: 0px;
    margin-right: 10px;
  }

  transition: border-color 100ms;
`;

const TimeText = styled.p`
  font-family: Alagard;
  font-size: 17px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.3;
  max-width: 25ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
  }
`;

const SalesText = styled.div`
  font-family: Alagard;
  font-size: 18px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.3;
  max-width: 20ch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;

  @media only screen and (max-width: 1250px) {
    font-size: 15px;
    width: 10ch;
  }
`;

const BuyerText = styled.div`
  font-family: Alagard;
  font-size: 17px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.5;
  max-width: 18ch;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;

  z-index: 2;

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
    max-width: 13ch;
  }
`;

const EthSymbol = styled.img`
  height: 18px;
  margin-right: 6px;
  margin-top: 3px;
  
  @media only screen and (max-width: 1250px) {
    height: 13px;
    margin-top: 2px;
  }
  
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

const SalesTextDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 125px;

  @media only screen and (max-width: 1250px) {
    height: 75px;
  }

`;

const SalesDisplay = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  z-index: 2;

  @media only screen and (max-width: 1250px) {
    height: 75px;
  }
`;

const ActivityRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;

  background: var(--darkGray);

  padding: var(--sp0);
  margin: var(--sp-2);

  @media only screen and (max-width: 1250px) {
    padding-top: var(--sp1);
  }
`;

const ActivityWrapper = styled.div`
  width: 80%;
  max-width: 800px;

  @media only screen and (max-width: 1250px) {
    width: 100%;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media only screen and (max-width: 1250px) {
    height: 75px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    z-index: 2;
  }
`;

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media only screen and (max-width: 1250px) {
    display: none;
  }
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;

  @media only screen and (max-width: 1250px) {
    width: 15px;
    height: 15px;
  }

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }

  transition: all 100ms;
`;

const MarketIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  margin-top: 2px;
  image-rendering: pixelated;

  z-index: 2;

  @media only screen and (max-width: 1250px) {
    width: 15px;
    height: 15px;
    margin-right: 7px;
    margin-top: 0;
  }

`;

const NewFrame = styled.div`
  width: calc(100% + var(--frameSize));
  height: calc(100% + 0.5 * var(--frameSize));

  position: absolute;
  left: calc(-0.5 * var(--frameSize));
  top: calc(-0.1 * var(--frameSize));
  z-index: 1;
  border-image-source: url(/static/img/newframe_black.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-image-outset: 0;
  border-style: solid;
  border-image-repeat: round;
`;

const Grain = styled.div`
  position: absolute;
  left: 0;
  opacity: 4%;
  
  width: 100%;
  height: 100%;

  background-image: url(/static/img/marketplace/paperTxt03.png);
  background-repeat: repeat;
`;


function BuyerSeller({ 
  buyer, 
  seller 
}: { 
  buyer: string;
  seller: string;
}) {
  return (
    <div>
      <Link href={`/address/${buyer}`} passHref={true}>
        <SoftLink>
          <BuyerText style={{display: 'flex', flexDirection: 'row'}}>{`Buyer:`}&nbsp;
              <BuyerText>{buyer}</BuyerText>
          </BuyerText>
        </SoftLink>
      </Link>
      <Link href={`/address/${seller}`} passHref={true}>
        <SoftLink>
          <BuyerText style={{display: 'flex', flexDirection: 'row'}}>{`Seller:`}&nbsp;
            <BuyerText>{seller}</BuyerText>
          </BuyerText>
        </SoftLink>
      </Link>
    </div>
  )
}

export default function Activity({
  contract,
  traitsSelected,
}: {
  contract: string;
  traitsSelected: number;
}) {
  const [sales, setSales] = useState([]);
  const [continuation, setContinuation] = useState('');
  const [fetched, setFetched] = useState(false);
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;

  async function fetchSales(continued: boolean) {
    const recentSales = await fetch(
      API_BASE_URL + `sales/v3?collection=${contract}${continuation != '' && continued ? "&continuation=" + continuation : ''}`
      + getURLAttributes(router.query), 
      { headers: headers }
    );
    const salesJson = await recentSales.json();
    console.log(salesJson);

    if (continued) {
      setSales(sales.concat(salesJson.sales)); 
    } else {
      setSales(salesJson.sales);
    }
    setContinuation(salesJson.continuation);
    setFetched(true);
  }

  useEffect(() => {
    setFetched(false);
    fetchSales(false);
  }, [router.query]);

  return (
    <>
      { traitsSelected >= 1 && <FilterHeader/> }
      <InfiniteScroll
        dataLength={sales.length}
        next={() => { fetchSales(true) }}
        hasMore={true}
        loader={null}
        scrollThreshold={0.1}
        height={'100vh'}
        style={{backgroundImage: 'url(/static/img/interior-dark.png)'}}
      >
        { fetched ? 
          <ScrollContainer>
          {sales.map((sale: any, index) => {
            return (sale && sale.token ?
              <ActivityWrapper key={index}>
                <ActivityRow>
                  <Grain style={{
                    backgroundImage: `url(/static/img/marketplace/paperTxt0${(sale.token.tokenId % 4) + 1}.png)`,
                    backgroundPosition: `${(sale.token.tokenId % 100)}% ${(sale.token.tokenId % 100)}%`
                  }}/>
                  <SalesDisplay>
                    <Link
                      href={`/marketplace/${contract}/${sale.token.tokenId}`}
                      passHref={true}
                    >
                      <SoftLink>
                        <ActivityImage 
                          src={contracts[contract].display == 'Wizards' ? 
                            `${contracts[contract].image_url}${sale.token.tokenId}/${sale.token.tokenId}.png` : 
                            `${contracts[contract].image_url}${sale.token.tokenId}.png`}
                        /> 
                      </SoftLink>
                    </Link>
                    <SalesTextDisplay>
                      <SalesText>{sale.token.name}</SalesText>
                      <div style={{ display: 'flex' }}>
                        <EthSymbol src={sale.orderSide == 'ask' ? '/static/img/marketplace/eth.png': '/static/img/marketplace/weth.png'}/>
                        <SalesText>{sale.price}</SalesText>
                      </div>
                    </SalesTextDisplay>
                  </SalesDisplay>
                  <MobileWrapper>
                    <BuyerSeller buyer={sale.to} seller={sale.from}/>
                    <SoftLink href={'https://etherscan.io/tx/' + sale.txHash} target="_blank" rel="noopener noreferrer">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <TimeText>
                        <ReactTimeAgo date={new Date(sale.timestamp * 1000)}/>
                      </TimeText>
                      <IconImage src="/static/img/marketplace/share.png"/>
                      </div>
                    </SoftLink>
                  </MobileWrapper>
                  <DesktopWrapper>
                    <BuyerSeller buyer={sale.to} seller={sale.from}/>
                  </DesktopWrapper>
                  <DesktopWrapper>
                    <SoftLink href={'https://etherscan.io/tx/' + sale.txHash} target="_blank" rel="noopener noreferrer">
                      <div style={{display: 'flex', alignItems: 'center'}}>
                      <TimeText>
                        <ReactTimeAgo date={new Date(sale.timestamp * 1000)}/>
                      </TimeText>
                      <MarketIcon src={MARKET_ICONS_BY_NAME[sale.orderSource]} style={{marginLeft: '10px'}}/>
                      </div>
                    </SoftLink>
                  </DesktopWrapper>
                  <NewFrame/>
                </ActivityRow>
                <HorizontalLine/>
              </ActivityWrapper> :
              null
              
            );
          })
          }
          <div className="scrim">
          </div>
          </ScrollContainer> :
          <LoadingCard height={'80vh'} background={true}/>
        }
      </InfiniteScroll>
    </>
  )
}
