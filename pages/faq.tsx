import Layout from "../components/Marketplace/Layout";
import styled from "@emotion/styled";

const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  min-height: 90vh;
  margin: 0 auto;
  padding: 30px;
  margin-top: 30px;
  max-width: 1500px;

  @media only screen and (max-width: 600px) {
    overflow-x: hidden;
    margin-top: 30px;
  }
`;

const BigTitle = styled.div`
  font-size: 40px;
  font-family: Alagard;
  color: var(--white);

  margin-top: var(--sp-1);
  margin-bottom: var(--sp-1);

  @media only screen and (max-width: 600px) {
    font-size: 28px;
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
  }
`;

const Description = styled.div`
  font-size: 17px;
  font-family: Arial;
  color: var(--white);
  line-height: 1.6em;

  display: flex;

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

const ImageWithBorder = styled.img`
  border-style: dashed;
  border-color: var(--mediumGray);
  border-width: 5px;
`;

export default function FAQ({
}: {
}) {
  return (
    <Layout title="FAQ">
      <AboutWrapper>
        <BigTitle>Frequently Asked Questions</BigTitle>
        <Title>What are affinities?</Title>
        <HorizontalLine/>
        <HorizontalLine/>
        <Description style={{justifyContent: 'center'}}>
          <img src="/static/img/marketplace/faq/affinities.jpg" style={{width: '800px', maxWidth: '75vw', maxHeight: '135vw'}}/>
        </Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>What is a collection offer?</Title>
        <Description>
          Collection offers are offers which apply to every token in a collection. By making a collection offer on wizards,
          for instance, any wizard holder would be able to accept your offer in exchange for a wizard they hold.
        </Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>Is it safe to sign messages from Seaport?</Title>
        <Description style={{display: 'block'}}>
          Forgotten.market utilizes the <a href="https://docs.opensea.io/v2.0/reference/seaport-overview" target="_blank">Seaport Protocol</a>.
          When you list a token for sale or make an offer on a token, you will need to sign a message like the one below:
        </Description>
        <Description style={{justifyContent: 'center'}}>
          <ImageWithBorder src="/static/img/marketplace/faq/sign.png" style={{width: '400px', maxWidth: '75vw', maxHeight: '250vw'}}/>
        </Description>
        <HorizontalLine/>
        <Description style={{display: 'block'}}>
          Signing a message in this format is required to make a listing on Forgotten Market - if you've previously listed on OpenSea, you'll recognize this because OpenSea also uses the Seaport protocol. The only differences between an OpenSea listing and a Forgotten Market listing are the fees (Forgotten Market fees are lower and go to the Community DAO), and the orderbook the listing is posted to (Forgotten Market listings are posted to the Reservoir orderbook, rather than OpenSea's).
        </Description>
        <HorizontalLine/>
        <Title>What does it mean to set approval?</Title>
        <Description style={{display: 'block'}}>
          In order to list tokens on Forgotten.market, you will need to approve the <a href="https://etherscan.io/address/0x1E0049783F008A0085193E00003D00cd54003c71" target="_blank">OpenSea Conduit contract</a> to transfer them. 
          This approval allows tokens to be transferred if a valid listing is filled, and can be revoked at any time.
          Approvals must be done per-contract, so separate approvals are required for Wizards, Souls, and Ponies.
          If you've already listed these tokens on OpenSea you will not need to set any additional approvals on Forgotten.market.
          In Metamask, the prompt to set approval looks like this:
        </Description>
        <Description style={{justifyContent: 'center'}}>
          <ImageWithBorder src="/static/img/marketplace/faq/approval.png" style={{width: '400px', maxWidth: '75vw', maxHeight: '120vw'}}/>
        </Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <HorizontalLine/> 
        <Title>Additional questions?</Title>
        <Description style={{display: 'block'}}>For all additional questions please contact <a href="https://twitter.com/tv3636" target="_blank">@tv</a>.</Description>
        <HorizontalLine/>
        <HorizontalLine/>
      </AboutWrapper>
    </Layout>
  )
}
