import styled from "@emotion/styled";
import Image from 'next/image';

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;

  margin-left: calc(-1 * var(--sp-1));
  margin-bottom: 0px;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const StatsItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  padding: var(--sp-1);
`;

function EthSymbol({
  weth
}:{
  weth: boolean;
}) {
  return (
    <div style={{marginRight: 'var(--sp-4)', display: 'flex'}}>
      <Image 
        src={weth ? "/static/img/marketplace/weth.png" : "/static/img/marketplace/eth_alt.png"} 
        height='24ex' 
        width='12ch'
      />
    </div>
  )
}

export default function MarketDisplay({
  price,
  bid,
  lastPrice,
  lastSaleWeth,
}:{
  price: string,
  bid: string,
  lastPrice: string,
  lastSaleWeth: boolean;
}) {
  return (
    <StatsWrapper>
    <StatsItem>
      <Price>
        { price && <EthSymbol weth={false}/> }
        <h1>{price ? price : '-'}</h1>
      </Price>
      <div>LIST PRICE</div>
    </StatsItem>
    <StatsItem>
      <Price>
        { bid && <EthSymbol weth={true}/> }
        <h1>{bid? bid : '-'}</h1>
      </Price>
      <div>BEST OFFER</div>
    </StatsItem>
    <StatsItem>
      <Price>
        { lastPrice && <EthSymbol weth={lastSaleWeth}/> }
        <h1>{lastPrice ? lastPrice : '-'}</h1>
      </Price>
      <div>LAST SALE</div>
    </StatsItem>
  </StatsWrapper>
  )
}