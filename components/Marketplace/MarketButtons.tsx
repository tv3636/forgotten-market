import { ORDER_TYPE } from "./marketplaceConstants";
import MarketConnect from "./MarketConnect";
import styled from "@emotion/styled";

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;

  gap: var(--sp-1);

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const ButtonDiv = styled.div`
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

  @media only screen and (max-width: 600px) {
    margin-bottom: 10px;
  }

  transition: all 200ms;
`;

function MarketButton({ 
  type,
  setModal,
  setActionType
 }: { 
   type: ORDER_TYPE;
   setModal: (setting: boolean) => void;
   setActionType: (action: ORDER_TYPE) => void;
  }) {
  return (
    <ButtonDiv onClick={(e) => { setModal(true); setActionType(type); }}>
      {type.toUpperCase()}
    </ButtonDiv>
  );
}

export default function MarketButtons({
  account,
  owner,
  listValue,
  hasOffer,
  setModal,
  setActionType,
  highestOffer,
  native,
  tokenType,
  myOffer,
}: {
  account: string | null | undefined;
  owner: string | null | undefined;
  listValue: number | null | undefined;
  hasOffer: boolean;
  setModal: (setting: boolean) => void;
  setActionType: (action: ORDER_TYPE) => void;
  highestOffer: boolean;
  native: boolean;
  tokenType: number;
  myOffer: boolean;
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
              {native ? 
                <MarketButton type={ORDER_TYPE.CANCEL_LISTING} setModal={setModal} setActionType={setActionType} /> :
                <MarketButton type={ORDER_TYPE.SELL} setModal={setModal} setActionType={setActionType} />
              }
              {hasOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
            </Buttons>
          )
        } else {
          return (
            <Buttons>
              <MarketButton type={ORDER_TYPE.SELL} setModal={setModal} setActionType={setActionType} />
              {hasOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
            </Buttons>
          )
        }
      } else {
        return (
          <Buttons>
            {listValue && <MarketButton type={ORDER_TYPE.BUY} setModal={setModal} setActionType={setActionType} />}
            <MarketButton type={ORDER_TYPE.OFFER} setModal={setModal} setActionType={setActionType} />
            {highestOffer ? <MarketButton type={ORDER_TYPE.CANCEL_OFFER} setModal={setModal} setActionType={setActionType} /> : null} 
          </Buttons>
        );
      }
    }
  } else {
    return (
      <Buttons>
        {listValue && <MarketButton type={ORDER_TYPE.BUY} setModal={setModal} setActionType={setActionType} />}
        <MarketButton type={ORDER_TYPE.OFFER} setModal={setModal} setActionType={setActionType} />
        {highestOffer && <MarketButton type={ORDER_TYPE.CANCEL_OFFER} setModal={setModal} setActionType={setActionType} />}
        {native ? 
          <MarketButton type={ORDER_TYPE.CANCEL_LISTING} setModal={setModal} setActionType={setActionType} /> :
          account.toLowerCase() == owner?.toLowerCase() && <MarketButton type={ORDER_TYPE.SELL} setModal={setModal} setActionType={setActionType} />
        }
        {hasOffer && !myOffer && <MarketButton type={ORDER_TYPE.ACCEPT_OFFER} setModal={setModal} setActionType={setActionType} />}
      </Buttons>
    )
  }
  return null;
}
