import styled from "@emotion/styled";
import Image from 'next/image';
import { COMMUNITY_CONTRACTS, CONTRACTS } from "./marketplaceConstants";
import { numShorten } from "./marketplaceHelpers";

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
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
        height='21ex' 
        width='11ch'
      />
    </div>
  )
}

export default function CollectionStats({
  items,
  floor,
  bid,
  contract,
}: { 
  items: number;
  floor: number;
  bid: number;
  contract: string;
}) {
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;

  return (
    <StatsWrapper>
      <StatsItem>
        <h1>{numShorten(items)}</h1>
        <div>{items == 1 ? contracts[contract].singular.toUpperCase() : contracts[contract].display.toUpperCase()}</div>
      </StatsItem>
      <StatsItem>
        <Price>
          <EthSymbol weth={false}/>
          <h1>{floor? floor : '∞'}</h1>
        </Price>
        <div>FLOOR</div>
      </StatsItem>
      <StatsItem>
        <Price>
          <EthSymbol weth={true}/>
          <h1>{bid? bid : 0}</h1>
        </Price>
        <div>TOP BID</div>
      </StatsItem>
    </StatsWrapper>
  )
}