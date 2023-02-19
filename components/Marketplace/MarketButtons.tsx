import { ORDER_TYPE } from "./marketplaceConstants";
import MarketConnect from "./MarketConnect";
import styled from "@emotion/styled";
import GenericButton from "./GenericButton";
import { BuyModal } from '@reservoir0x/reservoir-kit-ui';

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;

  gap: var(--sp-1);

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const StyledButton = styled.button`
  background-color: var(--darkGray);
  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 46 42 46 42;

  box-shadow: 0px 2px var(--darkGray);

  padding: 0 var(--sp1);

  cursor: pointer;
  color: var(--white);

  font-family: Alagard;
  font-size: var(--sp1);

  :hover {
    background-color: var(--mediumGray);
    border-color: var(--lightGray);
    color: white;
  }
  
  transition: all 200ms;
`;

function MarketButton({ 
  type,
  text = '',
 }: { 
   type: ORDER_TYPE;
   text?: string;
  }) {
  return (
    <GenericButton text={ text ? text : type} />
  );
}

export default function MarketButtons({
  account,
  owner,
  listValue,
  hasOffer,
  highestOffer,
  native,
  tokenType,
  myOffer,
  contract,
  tokenId,
}: {
  account: string | null | undefined;
  owner: string | null | undefined;
  listValue: number | null | undefined;
  hasOffer: boolean;
  highestOffer: boolean;
  native: boolean;
  tokenType: number;
  myOffer: boolean;
  contract: string;
  tokenId: string;
}) {
  if (!account) {
    return <MarketConnect />;
  }
  if (tokenType == 721) {
    if (owner) {
      if (account.toLowerCase() == owner.toLowerCase()) {
        if (listValue) {
          return (
            <Buttons>
              <MarketButton type={ORDER_TYPE.SELL} text={'LOWER LISTING'}/>
              <MarketButton type={ORDER_TYPE.CANCEL_LISTING} />
              {hasOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} />}
            </Buttons>
          )
        } else {
          return (
            <Buttons>
              <MarketButton type={ORDER_TYPE.SELL} />
              {hasOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} />}
            </Buttons>
          )
        }
      } else {
        return (
          <Buttons>
            {listValue && 
              <BuyModal
                trigger={<StyledButton>BUY</StyledButton>}
                collectionId={contract}
                tokenId={tokenId}
                onPurchaseComplete={(data) => console.log('Purchase Complete')}
                onPurchaseError={(error, data) => console.log('Transaction Error', error, data)}
                onClose={(data, stepData, currentStep) => console.log('Modal Closed')}
              />
            }
            <MarketButton type={ORDER_TYPE.OFFER} />
            {highestOffer ? <MarketButton type={ORDER_TYPE.CANCEL_OFFER} /> : null} 
          </Buttons>
        );
      }
    }
  } else {
    return (
      <Buttons>
        {listValue && 
          <BuyModal
            trigger={<StyledButton>BUY</StyledButton>}
            collectionId={contract}
            tokenId={tokenId}
            onPurchaseComplete={(data) => console.log('Purchase Complete')}
            onPurchaseError={(error, data) => console.log('Transaction Error', error, data)}
            onClose={(data, stepData, currentStep) => console.log('Modal Closed')}
          />
        }
        <MarketButton type={ORDER_TYPE.OFFER} />
        {highestOffer && <MarketButton type={ORDER_TYPE.CANCEL_OFFER} />}
        {native ? 
          <MarketButton type={ORDER_TYPE.CANCEL_LISTING} /> :
          account.toLowerCase() == owner?.toLowerCase() && <MarketButton type={ORDER_TYPE.SELL} />
        }
        {hasOffer && !myOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} />}
      </Buttons>
    )
  }
  return null;
}
