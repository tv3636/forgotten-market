import { useEffect, useState } from "react";
import { API_BASE_URL, CONTRACTS, MARKET_ICONS_BY_NAME } from "./marketplaceConstants";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { SoftLink, LoadingCard } from "./marketplaceHelpers";
import Link from "next/link";
import styled from "@emotion/styled";
import InfiniteScroll from "react-infinite-scroll-component";

TimeAgo.addDefaultLocale(en);
const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

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

const ActivityImage = styled.img`
  border-style: solid;
  border-width: 4px;
  border-color: var(--darkGray);
  border-radius: 10px;

  margin-right: 20px;

  width: 150px;
  height: 150px;

  :hover {
    cursor: pointer;
    border-color: var(--mediumGray);
  }

  @media only screen and (max-width: 600px) {
    width: 100px;
    height: 100px;
    margin-left: 0px;
    margin-right: 10px;
  }

  transition: border-color 100ms;
`;

const TimeText = styled.p`
  font-family: Staxblox;
  font-size: 14px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.8;
  max-width: 25ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const SalesText = styled.div`
  font-family: Ninety;
  font-size: 18px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.3;
  width: 15ch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
    width: 11ch;
  }
`;

const BuyerText = styled.div`
  font-family: Ninety;
  font-size: 17px;
  font-weight: bold;
  color: var(--white);
  
  line-height: 1.5;
  max-width: 15ch;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    max-width: 14ch;
  }
`;

const EthSymbol = styled.img`
  height: 18px;
  margin-right: 6px;
  margin-top: 3px;
  
  @media only screen and (max-width: 600px) {
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

  @media only screen and (max-width: 600px) {
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

  @media only screen and (max-width: 600px) {
    height: 75px;
  }

`;

const SalesDisplay = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
    height: 75px;
  }

`;

const ActivityRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border: solid;
  border-radius: 20px;
  border-color: var(--mediumGray);
  border-width: 4px;
  background: #0d0c16c4;

  padding: 20px;
  margin: 10px;

  @media only screen and (max-width: 600px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const ActivityWrapper = styled.div`
  width: 80%;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    height: 75px;
    display: block;
  }
`;

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;

  @media only screen and (max-width: 600px) {
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

  @media only screen and (max-width: 600px) {
    width: 18px;
    height: 18px;
    margin-right: 7px;
    margin-top: 0;
  }

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
}: {
  contract: string;
}) {
  const [sales, setSales] = useState([]);
  const [continuation, setContinuation] = useState('');
  const [fetched, setFetched] = useState(false);

  async function fetchSales() {
    const recentSales = await fetch(
      API_BASE_URL + `sales/v3?contract=${contract}${continuation != '' ? "&continuation=" + continuation : ''}`, 
      { headers: headers }
    );
    const salesJson = await recentSales.json();
    console.log(salesJson);
    setSales(sales.concat(salesJson.sales));
    setContinuation(salesJson.continuation);
    setFetched(true);
  }

  useEffect(() => {
    fetchSales();
  }, []);

  return (
      <InfiniteScroll
        dataLength={sales.length}
        next={fetchSales}
        hasMore={true}
        loader={null}
        scrollThreshold={0.1}
        height={'80vh'}
      >
        { fetched ? 
          <ScrollContainer>
          {sales.map((sale: any, index) => {
            return (sale && sale.token ?
              <ActivityWrapper key={index}>
                <ActivityRow>
                  <SalesDisplay>
                    <Link
                      href={`/marketplace/${contract}/${sale.token.tokenId}`}
                      passHref={true}
                    >
                      <SoftLink>
                        <ActivityImage 
                          style={CONTRACTS[contract].display == 'Flames' ? {height: '171px'} : {}}
                          src={CONTRACTS[contract].display == 'Wizards' ? 
                            `${CONTRACTS[contract].image_url}${sale.token.tokenId}/${sale.token.tokenId}.png` : 
                            `${CONTRACTS[contract].image_url}${sale.token.tokenId}.png`}
                        /> 
                      </SoftLink>
                    </Link>
                    <SalesTextDisplay>
                      <SalesText style={{color: 'white'}}>{sale.token.name}</SalesText>
                      <div style={{ display: 'flex' }}>
                        <EthSymbol src='/static/img/marketplace/eth.png'/>
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
                      <MarketIcon src={MARKET_ICONS_BY_NAME[sale.orderSource]} style={{marginLeft: '10px'}}/>
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
                </ActivityRow>
                <HorizontalLine/>
              </ActivityWrapper> :
              null
              
            );
          })
          }
          </ScrollContainer> :
          <LoadingCard height={'80vh'}/>
        }
      </InfiniteScroll>
  )
}
