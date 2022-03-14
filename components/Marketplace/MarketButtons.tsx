import { ORDER_TYPE } from "./marketplaceConstants";
import MarketConnect from "./MarketConnect";
import styled from "@emotion/styled";

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

const ButtonImage = styled.img`
  margin-right: var(--sp-3);
  height: 35px;
  image-rendering: pixelated;
  margin-top: 5px;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
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
    <ButtonImage
      src={`/static/img/marketplace/${type}.png`}
      onMouseOver={(e) =>
        (e.currentTarget.src = `/static/img/marketplace/${type}_hover.png`)
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = `/static/img/marketplace/${type}.png`)
      }
      onClick={(e) => { setModal(true); setActionType(type); }}
    />
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
}: {
  account: string | null | undefined;
  owner: string | null | undefined;
  listValue: number | null | undefined;
  hasOffer: boolean;
  setModal: (setting: boolean) => void;
  setActionType: (action: ORDER_TYPE) => void;
  highestOffer: boolean;
  native: boolean;
}) {
  if (!account) {
    return <MarketConnect />;
  }
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
          {highestOffer && <MarketButton type={ORDER_TYPE.CANCEL_OFFER} setModal={setModal} setActionType={setActionType} />}
        </Buttons>
      );
    }
  }
  return null;
}
