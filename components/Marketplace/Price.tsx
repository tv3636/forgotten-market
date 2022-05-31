import styled from "@emotion/styled";

const PriceValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PriceStyle = styled.div`
  font-family: Bitdaylong;
  color: var(--white);
  margin-bottom: var(--sp-3);  
  align-self: flex-start;
  
  @media only screen and (max-width: 600px) {
    align-self: center;
  }
`;

export default function Price({ 
  value,
  size
}: { 
  value: number;
  size: number;
}) {
  return (
    <PriceStyle style={{fontSize: `${35 * size}px`}}>
      {value ? (
        <PriceValue>
          <img
            src="/static/img/marketplace/eth_alt.png"
            style={{ height: `${35 * size}px`, marginRight: `${12 * size}px` }}
          />
          <div style={{marginTop: '4px'}}>{value}</div>
        </PriceValue>
      ) : null}
    </PriceStyle>
  );
}
