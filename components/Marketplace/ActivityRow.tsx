import styled from "@emotion/styled";
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import { getContract, SoftLink } from "./marketplaceHelpers";
import en from 'javascript-time-ago/locale/en.json';
import Link from "next/link";
import { MARKET_ICONS_BY_NAME } from "./marketplaceConstants";

TimeAgo.addDefaultLocale(en);

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

const EthSymbol = styled.img`
  height: 18px;
  margin-right: 6px;
  margin-top: 3px;
  
  @media only screen and (max-width: 1250px) {
    height: 13px;
    margin-top: 2px;
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

const RowContainer = styled.div`
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

const ActivityImage = styled.img`
  border-style: solid;
  border-width: 4px;
  border-color: var(--darkGray);
  border-radius: 10px;

  margin-right: var(--sp0);
  z-index: 2;

  width: 150px;
  min-height: 150px;

  :hover {
    cursor: pointer;
    border-color: var(--mediumGray);
  }

  @media only screen and (max-width: 1250px) {
    width: 100px;
    min-height: auto;
    margin-left: 0px;
    margin-right: 10px;
  }

  transition: border-color 100ms;
`;

function Address({
  address,
  text,
}: {
  address: string;
  text: string;
}) {
  return (
    <Link href={`/address/${address}`} passHref={true}>
      <SoftLink>
        <BuyerText style={{display: 'flex', flexDirection: 'row'}}>{`${text}:`}&nbsp;
          <BuyerText>{address}</BuyerText>
        </BuyerText>
      </SoftLink>
    </Link>
  )
}

export default function ActivityRow({
  contract,
  activity,
}: {
  contract: string;
  activity: any;
}) {
  const contractDict = getContract(contract);
  const tokenId = 'token' in activity ? activity.token.tokenId : activity.tokenSetId.split(':')[2];
  const name = 'token' in activity ? activity.token.name : activity.metadata.data.tokenName;
  const ethOrWeth = 'token' in activity && !(activity.orderSide == 'ask') ? 'weth' : 'eth';
  const timestamp = 'token' in activity ? activity.timestamp : (new Date(activity.createdAt)).getTime() / 1000;
  const source = 'token' in activity ? activity.orderSource : activity.source.name;

  return (
    <RowContainer>
    <Grain style={{
      backgroundImage: `url(/static/img/marketplace/paperTxt0${(tokenId % 4) + 1}.png)`,
      backgroundPosition: `${(tokenId % 100)}% ${(tokenId % 100)}%`
    }}/>
    <SalesDisplay>
      <Link
        href={`/marketplace/${contract}/${tokenId}`}
        passHref={true}
      >
        <SoftLink>
          <ActivityImage 
            src={contractDict.display == 'Wizards' ? 
              `${contractDict.image_url}${tokenId}/${tokenId}.png` : 
              `${contractDict.image_url}${tokenId}.png`}
          /> 
        </SoftLink>
      </Link>
      <SalesTextDisplay>
        <SalesText>{name}</SalesText>
        <div style={{ display: 'flex' }}>
          <EthSymbol src={`/static/img/marketplace/${ethOrWeth}.png`}/>
          <SalesText>{activity.price}</SalesText>
        </div>
      </SalesTextDisplay>
    </SalesDisplay>
    <MobileWrapper>
      <div>
        { 'token' in activity && <Address address={activity.to} text={'Buyer'}/> }
        <Address address={'token' in activity ? activity.from : activity.maker} text={'Seller'} /> 
      </div>
      <SoftLink href={'https://etherscan.io/tx/' + activity.txHash} target="_blank" rel="noopener noreferrer">
      <div style={{display: 'flex', alignItems: 'center'}}>
        <TimeText>
          <ReactTimeAgo date={new Date(timestamp * 1000)}/>
        </TimeText>
        <IconImage src="/static/img/marketplace/share.png"/>
        </div>
      </SoftLink>
    </MobileWrapper>
    <DesktopWrapper>
      <div>
        { 'token' in activity && <Address address={activity.to} text={'Buyer'}/> }
        <Address address={'token' in activity ? activity.from : activity.maker} text={'Seller'} /> 
      </div>
    </DesktopWrapper>
    <DesktopWrapper>
      <SoftLink href={'https://etherscan.io/tx/' + activity.txHash} target="_blank" rel="noopener noreferrer">
        <div style={{display: 'flex', alignItems: 'center'}}>
        <TimeText>
          <ReactTimeAgo date={new Date(timestamp * 1000)}/>
        </TimeText>
        <MarketIcon src={MARKET_ICONS_BY_NAME[source]} style={{marginLeft: '10px'}}/>
        </div>
      </SoftLink>
    </DesktopWrapper>
    <NewFrame/>
  </RowContainer>
  )
}
