import styled from "@emotion/styled";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';

TimeAgo.addDefaultLocale(en);

const ExpirationWrapper = styled.div`
text-align: left;
font-size: 14px;
font-family: Roboto Mono;
color: var(--lightGray);
display: flex;
margin-top: 1vh;
align-items: center;

@media only screen and (max-width: 600px) {
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5% 5% 3% 5%;

  font-size: 13px;
}
`;

const OSIcon = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 8px;
  margin-top: 2px;
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
  isOS,
}: {
  timer: any;
  date: any;
  isOS: boolean;
}) {
  if (timer?.days > 1) {
    if (date) {
      return (
        <ExpirationWrapper>
          { isOS && <OSIcon src="/static/img/icons/nav/opensea_default.png" /> }
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
          { isOS && <OSIcon src="/static/img/icons/nav/opensea_default.png" /> }
          <span style={{width: '16ch', alignSelf: 'center'}}>Listing expires </span>
          <ReactTimeAgo style={{alignSelf: 'center'}} date={new Date(date.toLocaleString('en-US'))} locale={'en-US'}/>
        </ExpirationWrapper>
      </div>
    );
  } else {
    return <ExpirationWrapper>Listing expires</ExpirationWrapper>
  }
}
