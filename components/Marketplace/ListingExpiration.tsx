import styled from "@emotion/styled";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { MARKET_ICONS } from "./marketplaceConstants";

TimeAgo.addDefaultLocale(en);

const ExpirationWrapper = styled.div`
text-align: left;
font-size: 15px;
font-family: Staxblox;
color: var(--lightGray);
display: flex;
margin-top: 1.5vh;
align-items: center;

@media only screen and (max-width: 600px) {
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5% 5% 3% 5%;

  font-size: 13px;
}
`;

const MarketIcon = styled.img`
  width: 17px;
  height: 17px;
  margin-right: 10px;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 12px;
    height: 12px;
    margin-right: 7px;
    margin-top: 0;
  }

`;

export function ListingExpiration({
  timer,
  date,
  source,
}: {
  timer: any;
  date: any;
  source: string;
}) {
  if (timer?.days > 1) {
    if (date) {
      return (
        <ExpirationWrapper>
          { source in MARKET_ICONS && <MarketIcon src={MARKET_ICONS[source]} /> }
          Listing expires on {date.toLocaleString()}
        </ExpirationWrapper>
      );
    } else {
      return null;
    }
  } else if (timer) {
    return (
      <div>
        <ExpirationWrapper>
          { source in MARKET_ICONS && <MarketIcon src={MARKET_ICONS[source]} /> } 
          <span style={{width: '12.5ch', alignSelf: 'center'}}>Listing expires </span>
          <ReactTimeAgo style={{alignSelf: 'center'}} date={new Date(date.toLocaleString('en-US'))} locale={'en-US'}/>
        </ExpirationWrapper>
      </div>
    );
  } else {
    return <ExpirationWrapper>Listing expires</ExpirationWrapper>
  }
}
