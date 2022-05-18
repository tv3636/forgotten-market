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
    margin-top: 10px;
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
  max-width: 800px;
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

const DoubleHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BorderRight = styled.td`
  border-left: 0px;
  border-top: 0px;

  border-style: dashed;
`;

const BorderRightHeader = styled.th`
  border-left: 0px;
  border-top: 0px;

  border-style: dashed;
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
        <Description>Listings shown here are a combination of listings aggregated from OpenSea, LooksRare, and listings made natively on Forgotten.market. Listings show an icon to indicate their origin:</Description>
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
            <td style={{borderStyle: 'none'}}>LooksRare</td>
            <td style={{borderStyle: 'none'}}><OSIcon src="/static/img/icons/nav/looksrare_default.png" /></td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>Fees</Title>
        <Description>Listings and offers created on Forgotten.market will pay out all fees to the Forgotten Runes team and community. Listings aggregated from other marketplaces will pay out those marketplace fees as usual:</Description>
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
            <td style={{fontWeight: 'bold'}}>1% to <a href='http://thehouseofwizards.com/' target="_blank">Community DAO</a></td>
          </Row>
          <Row>
            <td>OpenSea</td>
            <td><OSIcon src="/static/img/icons/nav/opensea_default.png" /></td>
            <td>2.5% to OpenSea</td>
          </Row>
          <Row>
            <td style={{borderStyle: 'none'}}>LooksRare</td>
            <td style={{borderStyle: 'none'}}><OSIcon src="/static/img/icons/nav/looksrare_default.png" /></td>
            <td style={{borderStyle: 'none'}}>2% to LooksRare</td>
          </Row>
        </Fees>
        <HorizontalLine/>
        <HorizontalLine/>
        <Description>Additionally, the standard team fee is applied to all sales, resulting in the following total fees per collection/listing origin:</Description>
        <HorizontalLine/>
        <div style={{overflowX: 'scroll'}}>
        <Fees>
          <Row>
            <BorderRightHeader>Collection</BorderRightHeader>
            <BorderRightHeader>Magic Machine Fee</BorderRightHeader>
            <BorderRightHeader>
              <DoubleHeader>
                <OSIcon src="/static/img/icons/nav/opensea_default.png"/><div>&nbsp;&nbsp;Total Fee</div>
              </DoubleHeader>
            </BorderRightHeader>
            <BorderRightHeader>
              <DoubleHeader>
                <OSIcon src="/static/img/icons/nav/looksrare_default.png"/><div>&nbsp;&nbsp;Total Fee</div>
              </DoubleHeader>
            </BorderRightHeader>
            <th>
              <DoubleHeader>
                <OSIcon src="/static/img/icons/nav/native_listing.png"/><div>&nbsp;&nbsp;Total Fee</div>
              </DoubleHeader>
            </th>
          </Row>
          <Row>
            <BorderRight>Wizards</BorderRight>
            <BorderRight>2.5%</BorderRight>
            <BorderRight>5%</BorderRight>
            <BorderRight>4.5%</BorderRight>
            <td><b>3.5%</b></td>
          </Row>
          <Row>
            <BorderRight>Warriors</BorderRight>
            <BorderRight>5%</BorderRight>
            <BorderRight>7.5%</BorderRight>
            <BorderRight>7%</BorderRight>
            <td><b>6%</b></td>
          </Row>
          <Row>
            <BorderRight>Souls</BorderRight>
            <BorderRight>6.66%</BorderRight>
            <BorderRight>9.16%</BorderRight>
            <BorderRight>8.66%</BorderRight>
            <td><b>7.66%</b></td>
          </Row>
          <Row>
            <BorderRight>Ponies</BorderRight>
            <BorderRight>4.44%</BorderRight>
            <BorderRight>6.94%</BorderRight>
            <BorderRight>6.44%</BorderRight>
            <td><b>5.44%</b></td>
          </Row>
          <Row>
            <BorderRight>Flames</BorderRight>
            <BorderRight>6.66%</BorderRight>
            <BorderRight>9.16%</BorderRight>
            <BorderRight>8.66%</BorderRight>
            <td><b>7.66%</b></td>
          </Row>
          <Row>
            <BorderRight>Beasts</BorderRight>
            <BorderRight>7%</BorderRight>
            <BorderRight>9.5%</BorderRight>
            <BorderRight>9%</BorderRight>
            <td><b>*7%</b></td>
          </Row>
          <Row>
            <BorderRight>Locks</BorderRight>
            <BorderRight>7.77%</BorderRight>
            <BorderRight>10.27%</BorderRight>
            <BorderRight>9.77%</BorderRight>
            <td><b>*7.77%</b></td>
          </Row>
          <Row>
            <BorderRight style={{borderBottom: 'none'}}>Spawn</BorderRight>
            <BorderRight style={{borderBottom: 'none'}}>7%</BorderRight>
            <BorderRight style={{borderBottom: 'none'}}>9.5%</BorderRight>
            <BorderRight style={{borderBottom: 'none'}}>9%</BorderRight>
            <BorderRight style={{borderBottom: 'none', borderRight: 'none'}}><b>*7%</b></BorderRight>
          </Row>
        </Fees>
        </div>
        <HorizontalLine/>
        <HorizontalLine/>
        <Description>* Fees for the Beasts, Locks, and Spawn collections are split 50/50 between Magic Machine and the Community DAO, so the 1% FM fee does not apply.</Description>
        <Description style={{fontWeight: 'bold'}}>NOTE: On July 1, 2022 the Forgotten Market Fee will be raised to 1.5%, where it will stay indefinitely.</Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/>
      </AboutWrapper>
    </Layout>
  )
}
