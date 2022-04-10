import Layout from "../components/Layout";
import styled from "@emotion/styled";

const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  min-height: 90vh;
  margin: 0 auto;
  padding: 30px;
  margin-top: 80px;
  max-width: 1000px;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
    margin-top: 50px;
  }
`;

const Title = styled.div`
  font-size: 30px;
  font-family: Alagard;
  color: var(--white);

  margin-top: var(--sp-1);
  margin-bottom: var(--sp-1);

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
  max-width: 600px;
  border-style: dashed;
  border-radius: 10px;
  border-width: 1px;

  padding: 5px;
  text-align: center;
`;

const Row = styled.tr`
  color: var(--white);
  font-size: 15px;

  th, td {
    padding: 10px;
  }

  th, td {
    border-bottom-style: dashed;
    border-bottom-width: 1px;
  }

`;

export default function About({
}: {
}) {
  return (
    <Layout title="About">
      <AboutWrapper>
        <Title>About</Title>
        <Description>Forgotten.market is a cult-created, <a href='https://github.com/tv3636/forgotten-market' target="_blank">open source</a> Forgotten Runes marketplace, powered by&nbsp;
        <a href='https://reservoirprotocol.github.io/' target="_blank">Reservoir Protocol.</a></Description>
        <Description>Listings shown here are a combination of listings aggregated from OpenSea, LooksRare, and listings made natively on Forgotten.market. Listings show an icon to indicate their origin as follows:</Description>
        <HorizontalLine/>
        <Fees>
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
            <td style={{borderStyle: 'none'}}>LooksRare</td>
            <td style={{borderStyle: 'none'}}><OSIcon src="/static/img/icons/nav/looksrare_default.png" /></td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>Fees</Title>
        <Description>Listings and offers created on Forgotten.market will pay out all fees to the Forgotten Runes team and community, as follows:</Description>
        <Description style={{fontWeight: 'bold'}}>NOTE: On July 1, 2022 the Cult DAO Fee will be raised to 1.5%, where it will stay indefinitely.</Description>
        <HorizontalLine/>
        <Fees>
          <Row>
            <th>Collection</th>
            <th>Magic Machine Fee</th>
            <th>Cult DAO Fee</th>
            <th style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Total Fees &nbsp; <OSIcon src="/static/img/icons/nav/native_listing.png" /></th>
          </Row>
          <Row>
            <td>Wizards</td>
            <td>2.5%</td>
            <td>1%</td>
            <td>3.5%</td>
          </Row>
          <Row>
            <td>Souls</td>
            <td>6.66%</td>
            <td>1%</td>
            <td>7.66%</td>
          </Row>
          <Row>
            <td>Ponies</td>
            <td>4.44%</td>
            <td>1%</td>
            <td>5.44%</td>
          </Row>
          <Row>
            <td style={{borderStyle: 'none'}}>Flames</td>
            <td style={{borderStyle: 'none'}}>6.66%</td>
            <td style={{borderStyle: 'none'}}>1%</td>
            <td style={{borderStyle: 'none'}}>7.66%</td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <Description>Listings created on OpenSea will still pay out the same fees as on the OpenSea site, even when filled here:</Description>
        <HorizontalLine/>
        <Fees>
          <Row>
            <th>Collection</th>
            <th>Magic Machine Fee</th>
            <th>OpenSea Fee</th>
            <th style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Total Fees &nbsp; <OSIcon src="/static/img/icons/nav/opensea_default.png" /></th>
          </Row>
          <Row>
            <td>Wizards</td>
            <td>2.5%</td>
            <td>2.5%</td>
            <td>5%</td>
          </Row>
          <Row>
            <td>Souls</td>
            <td>6.66%</td>
            <td>2.5%</td>
            <td>9.16%</td>
          </Row>
          <Row>
            <td>Ponies</td>
            <td>4.44%</td>
            <td>2.5%</td>
            <td>6.94%</td>
          </Row>
          <Row>
            <td style={{borderStyle: 'none'}}>Flames</td>
            <td style={{borderStyle: 'none'}}>6.66%</td>
            <td style={{borderStyle: 'none'}}>2.5%</td>
            <td style={{borderStyle: 'none'}}>9.16%</td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <Description>The same applies to LooksRare listings:</Description>
        <HorizontalLine/>
        <Fees>
          <Row>
            <th>Collection</th>
            <th>Magic Machine Fee</th>
            <th>LooksRare Fee</th>
            <th style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Total Fees &nbsp; <OSIcon src="/static/img/icons/nav/looksrare_default.png" /></th>
          </Row>
          <Row>
            <td>Wizards</td>
            <td>2.5%</td>
            <td>2%</td>
            <td>4.5%</td>
          </Row>
          <Row>
            <td>Souls</td>
            <td>6.66%</td>
            <td>2%</td>
            <td>8.66%</td>
          </Row>
          <Row>
            <td>Ponies</td>
            <td>4.44%</td>
            <td>2%</td>
            <td>6.44%</td>
          </Row>
          <Row>
            <td style={{borderStyle: 'none'}}>Flames</td>
            <td style={{borderStyle: 'none'}}>6.66%</td>
            <td style={{borderStyle: 'none'}}>2%</td>
            <td style={{borderStyle: 'none'}}>8.66%</td>
          </Row>
        </Fees>
      </AboutWrapper>
    </Layout>
  )
}