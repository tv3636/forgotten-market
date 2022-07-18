import styled from "@emotion/styled";
import Image from 'next/image';
import AnimatedNumber from "animated-number-react";
import { getContract, getDisplayBid } from "./marketplaceHelpers";

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

  width: 10ch;

  padding-top: var(--sp-1);
  padding-bottom: var(--sp-1);

  @media only screen and (max-width: 600px) {
    padding-bottom: var(--sp-2);
    font-size: var(--sp-1);
  }
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
  let contractDict = getContract(contract);
  let animationDuration = 350;

  return (
    <StatsWrapper>
      <StatsItem>
        <h1>
          <AnimatedNumber 
            value={items}
            formatValue={(value: number) => value > 1000 ? (value / 1000).toPrecision(2) : value.toFixed(0)}
            duration={animationDuration}
          />
          {items > 1000 && `k`}
        </h1>
        <div>{items == 1 ? contractDict.singular.toUpperCase() : contractDict.display.toUpperCase()}</div>
      </StatsItem>
      <StatsItem>
        <Price>
          <EthSymbol weth={false}/>
          <h1>
            {floor ? 
              <AnimatedNumber 
                value={floor}
                formatValue={(value: number) => value.toPrecision(2)}
                duration={animationDuration}
              /> 
              : '∞'
            }
          </h1>
        </Price>
        <div>FLOOR</div>
      </StatsItem>
      <StatsItem>
        <Price>
          <EthSymbol weth={true}/>
          <h1>
            { bid ? 
              <AnimatedNumber 
                value={bid? getDisplayBid(bid, contract) : 0}
                formatValue={(value: number) => value.toPrecision(2)}
                duration={animationDuration}
              /> :
              `-`
            }
          </h1>
        </Price>
        <div>TOP BID</div>
      </StatsItem>
    </StatsWrapper>
  )
}
