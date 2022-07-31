import { ORDER_TYPE } from "./marketplaceConstants";
import MarketConnect from "./MarketConnect";
import styled from "@emotion/styled";
import GenericButton from "./GenericButton";

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;

  gap: var(--sp-1);

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

function MarketButton({ 
  type,
  setModal,
  setActionType,
  text = '',
 }: { 
   type: ORDER_TYPE;
   setModal: (setting: boolean) => void;
   setActionType: (action: ORDER_TYPE) => void;
   text?: string;
  }) {
  return (
    <GenericButton onClick={() => { setModal(true); setActionType(type); }} text={ text ? text : type} />
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
              <MarketButton type={ORDER_TYPE.SELL} setModal={setModal} setActionType={setActionType} text={'LOWER LISTING'}/>
              <MarketButton type={ORDER_TYPE.CANCEL_LISTING} setModal={setModal} setActionType={setActionType} />
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
