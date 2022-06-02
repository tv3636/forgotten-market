import Layout from "../components/Layout";
import styled from "@emotion/styled";
import Image from 'next/image';

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
  font-family: Bitdaylong;
  color: var(--white);

  margin-top: var(--sp-1);
  margin-bottom: var(--sp-1);

  @media only screen and (max-width: 600px) {
    font-size: 28px;
  }

`;

const Title = styled.div`
  font-size: 30px;
  font-family: Bitdaylong;
  color: var(--white);

  margin-top: var(--sp-1);
  margin-bottom: var(--sp-1);

  @media only screen and (max-width: 600px) {
    font-size: 22px;
  }
`;

const Description = styled.div`
  font-size: 15px;
  font-family: Quadrunde;
  color: var(--white);
  line-height: 2em;

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
          <Image src="/static/img/marketplace/faq/affinities.jpg" width='800px' height='1400px'/>
        </Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>What is a collection offer?</Title>
        <Description style={{maxWidth: '80%'}}>
          Collection offers are offers which apply to every token in a collection. By making a collection offer on wizards,
          for instance, any wizard holder would be able to accept your offer in exchange for a wizard they hold.
        </Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>Is it safe to sign messages from Wyvern Exchange Contract?</Title>
        <Description style={{display: 'block', maxWidth: '80%'}}>
          Forgotten.market utilizes the <a href="https://wyvernprotocol.com/" target="_blank">Wyvern Protocol</a>.
          When you list a token for sale or make an offer on a token, you will need to sign a message like the one below:
        </Description>
        <Description style={{justifyContent: 'center'}}>
          <Image src="/static/img/marketplace/faq/sign.png" width='514px' height='1752'/>
        </Description>
        <HorizontalLine/>
        <Description style={{display: 'block', maxWidth: '80%'}}>
          In this example, a wizard is being listed for Ξ10. The 'basePrice' value (towards the bottom) is displayed in wei, which is the ether
          value * 10^18. The exchange contract is the&nbsp; 
          <a href="https://etherscan.io/address/0x7f268357a8c2552623316e2562d90e642bb538e5" target="_blank">Wyvern Exchange Contract</a>.
          The 'maker' address will be your own, while the 'taker' address will be the null address, indicating a public listing. <br/>It is best practice
           to double check messages before you sign them to confirm their intent.
        </Description>
        <HorizontalLine/>
        <Title>What is proxy registration?</Title>
        <Description style={{display: 'block', maxWidth: '80%'}}>
          Wyvern Protocol creates a personal proxy contract for each address to enable trading. If you've listed on OpenSea before, 
          your wallet already has a proxy contract created. However, if this is your first time listing 
          tokens for a particular wallet, you will be prompted to register a proxy contract before listing a token. 
          In Metamask, the prompt will look like this:
        </Description>
        <Description style={{justifyContent: 'center'}}>
          <Image src="/static/img/marketplace/faq/proxy.png" width='527px' height='876px'/>
        </Description>
        <HorizontalLine/>
        <Description style={{display: 'block', maxWidth: '80%'}}>
          Note the address in the top right is the <a href="https://etherscan.io/address/0xa5409ec958C83C3f309868babACA7c86DCB077c1" target="_blank">Project Wyvern Proxy Registry</a>.
        </Description>
        <HorizontalLine/>
        <HorizontalLine/>
        <Title>What does it mean to set approval?</Title>
        <Description style={{maxWidth: '80%'}}>
          In order to list tokens on Forgotten.market, you will need to approve your proxy contract to transfer them. 
          This approval allows tokens to be transferred if a valid listing is filled, and can be revoked at any time.
          Approvals must be done per-contract, so separate approvals are required for Wizards, Souls, and Ponies.
          If you've already listed these tokens on OpenSea you will not need to set any additional approvals on Forgotten.market.
          In Metamask, the prompt to set approval looks like this:
        </Description>
        <Description style={{justifyContent: 'center'}}>
          <Image src="/static/img/marketplace/faq/approval.png" width='554px' height='876px'/>
        </Description>
        <HorizontalLine/>
        <Description style={{display: 'block', maxWidth: '80%'}}>
          Note the address in the top right is the contract of the token you're approving (in this case,&nbsp; 
          <a href="https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42" target="_blank">wizards</a>).
          The operator address, passed as a parameter in the contract call, will be the address of the proxy contract 
          you've registered for your wallet.
        </Description>
        <HorizontalLine/>
        <HorizontalLine/> 
        <Title>Additional questions?</Title>
        <Description style={{display: 'block', maxWidth: '80%'}}>For all additional questions please contact <a href="https://twitter.com/tv3636" target="_blank">@tv</a>.</Description>
        <HorizontalLine/>
        <HorizontalLine/>
      </AboutWrapper>
    </Layout>
  )
}
