import Layout from "../components/Marketplace/Layout";
import styled from "@emotion/styled";

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

const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin: 0 auto;
  padding: var(--sp2);
  margin-top: var(--sp2);
  max-width: 100ch;
  
  a {
    text-decoration: underline;
  }

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
    margin-top: 10px;
  }
`;

const Title = styled.div`
  font-size: 30px;
  font-family: Alagard;
  color: var(--white);

  margin-top: var(--sp-1);
  margin-bottom: var(--sp-4);

  @media only screen and (max-width: 600px) {
    font-size: 22px;
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Description = styled.div`
  font-size: 17px;
  font-family: Arial;
  color: var(--white);
  line-height: 1.5em;

  margin-top: var(--sp-3);
  margin-bottom: var(--sp-1);

  @media only screen and (max-width: 600px) {
    font-size: 14px;
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

const OSIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 2px;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
    margin-right: 4px;
    margin-top: 0;
  }

`;

const Fees = styled.table`
  max-width: 800px;
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;

  padding: 5px;
  text-align: center;
`;

const Row = styled.tr`
  color: var(--white);
  text-transform: uppercase;

  th, td {
    padding: var(--sp-2);
  }

  th, td {
    border-bottom-style: solid;
    border-bottom-color: var(--frameGray);
    border-bottom-width: 4px;
  }

`;

const BorderRight = styled.td`
  border-left: 0px;
  border-top: 0px;
  border-right: 4px;
  border-bottom: 4px;

  border-style: solid;
  border-color: var(--frameGray);
`;

const BorderRightHeader = styled.th`
  border-left: 0px;
  border-top: 0px;
  border-right: 4px;
  border-bottom: 4px;

  border-style: solid;
  border-color: var(--frameGray);
`;

export default function About({}: {}) {
  return (
    <Layout title="About">
      <PageWrapper>
      <AboutWrapper>
        <Title>About</Title>
        <Description>Forgotten.market is a cult-created, <a href='https://github.com/tv3636/forgotten-market' target="_blank">open source</a> Forgotten Runes marketplace, powered by&nbsp;
        <a href='https://reservoirprotocol.github.io/' target="_blank">Reservoir Protocol.</a></Description>
        <Description>Listings shown here are a combination of listings aggregated from OpenSea, LooksRare, X2Y2, and listings made natively on Forgotten.market. Listings show an icon to indicate their origin:</Description>
        <HorizontalLine/>
        <Fees style={{maxWidth: '600px'}}>
          <Row>
            <th>Listing Origin</th>
            <th>Icon</th>
          </Row>
          <Row>
            <td>Forgotten.Market</td>
            <td><OSIcon src="/static/img/icons/nav/native_listing.png" /></td>
          </Row>
          <Row>
            <td>OpenSea</td>
            <td><OSIcon src="/static/img/icons/nav/opensea_default.png" /></td>
          </Row>
          <Row>
            <td>LooksRare</td>
            <td><OSIcon src="/static/img/icons/nav/looksrare_default.png" /></td>
          </Row>
          <Row>
            <td style={{borderStyle: 'none'}}>X2Y2</td>
            <td style={{borderStyle: 'none'}}><OSIcon src="/static/img/icons/nav/x2y2_default.png" /></td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>Fees</Title>
        <Description>Listings and offers created on Forgotten.market pay out all fees to the Forgotten Runes team and community. Listings aggregated from other marketplaces will pay out those marketplace fees as usual:</Description>
        <HorizontalLine/>
        <Fees>
          <Row>
            <th>Listing Origin</th>
            <th>Icon</th>
            <th>Marketplace Fee</th>
          </Row>
          <Row>
            <td>Forgotten.Market</td>
            <td><OSIcon src="/static/img/icons/nav/native_listing.png" /></td>
            <td style={{fontWeight: 'bold'}}>1.5% to <a href='http://thehouseofwizards.com/' target="_blank">Community DAO</a></td>
          </Row>
          <Row>
            <td>OpenSea</td>
            <td><OSIcon src="/static/img/icons/nav/opensea_default.png" /></td>
            <td>2.5% to OpenSea</td>
          </Row>
          <Row>
            <td>LooksRare</td>
            <td><OSIcon src="/static/img/icons/nav/looksrare_default.png" /></td>
            <td>2% to LooksRare</td>
          </Row>
          <Row>
            <td style={{borderStyle: 'none'}}>X2Y2</td>
            <td style={{borderStyle: 'none'}}><OSIcon src="/static/img/icons/nav/x2y2_default.png" /></td>
            <td style={{borderStyle: 'none'}}>0.5% to X2Y2</td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <Description>In addition to the marketplace fee, the standard team fee is applied to all sales:</Description>
        <HorizontalLine/>
        <Fees>
          <Row>
            <BorderRightHeader>Collection</BorderRightHeader>
            <th>Team Fee</th>
          </Row>
          <Row>
            <BorderRight>Wizards</BorderRight>
            <td><b>2.5%</b></td>
          </Row>
          <Row>
            <BorderRight>Warriors</BorderRight>
            <td><b>5%</b></td>
          </Row>
          <Row>
            <BorderRight>Souls</BorderRight>
            <td><b>6.66%</b></td>
          </Row>
          <Row>
            <BorderRight>Ponies</BorderRight>
            <td><b>4.44%</b></td>
          </Row>
          <Row>
            <BorderRight>Flames</BorderRight>
            <td><b>6.66%</b></td>
          </Row>
          <Row>
            <BorderRight>Beasts</BorderRight>
            <td><b>7%</b></td>
          </Row>
          <Row>
            <BorderRight>Locks</BorderRight>
            <td><b>7.77%</b></td>
          </Row>
          <Row>
            <BorderRight style={{borderBottom: 'none'}}>Spawn</BorderRight>
            <BorderRight style={{borderBottom: 'none', borderRight: 'none'}}><b>7%</b></BorderRight>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
      </AboutWrapper>
      </PageWrapper>
    </Layout>
  )
}
