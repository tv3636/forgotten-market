import { ORDER_TYPE } from "./marketplaceConstants";
import MarketConnect from "./MarketConnect";
import styled from "@emotion/styled";
import { 
  BuyModal, 
  ListModal, 
  BidModal, 
  AcceptBidModal, 
  CancelBidModal, 
  CancelListingModal 
} from '@reservoir0x/reservoir-kit-ui';

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

function MarketModal({
  text,
  contract,
  tokenId,
  orderId,
}: {
  text: string;
  contract: string;
  tokenId: string;
  orderId: string;
}) {
  const trigger = <StyledButton>{text}</StyledButton>;

  if (text == 'BUY') {
    return (
      <BuyModal
        trigger={trigger}
        collectionId={contract}
        tokenId={tokenId}
      />
    )
  }

  if (text == 'SELL') {
    return (
      <ListModal
        trigger={trigger}
        collectionId={contract}
        tokenId={tokenId}
      />
    )
  }

  if (text == 'OFFER') {
    return (
      <BidModal
        trigger={trigger}
        collectionId={contract}
        tokenId={tokenId}
      />
    )
  }

  if (text == 'ACCEPT OFFER') {
    return (
      <AcceptBidModal
        trigger={trigger}
        collectionId={contract}
        tokenId={tokenId}
      />
    )
  }

  if (text == 'CANCEL OFFER') {
    return (
      <CancelBidModal
        trigger={trigger}
        bidId={orderId}
      />
    )
  }

  if (text == 'CANCEL LISTING') {
    return (
      <CancelListingModal
        trigger={trigger}
        listingId={orderId}
      />
    )
  }

  return null
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
  hash,
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
  hash: string;
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
              <MarketModal text={'LOWER LISTING'} contract={contract} tokenId={tokenId} orderId={hash}/>
              <MarketModal text={'CANCEL LISTING'} contract={contract} tokenId={tokenId} orderId={hash} />
              {hasOffer && <MarketModal text={'ACCEPT OFFER'} contract={contract} tokenId={tokenId} orderId={hash} />}
            </Buttons>
          )
        } else {
          return (
            <Buttons>
              <MarketModal text={'SELL'} contract={contract} tokenId={tokenId} orderId={hash}/>
              {hasOffer && <MarketModal text={'ACCEPT OFFER'} contract={contract} tokenId={tokenId} orderId={hash} />}
            </Buttons>
          )
        }
      } else {
        return (
          <Buttons>
            {listValue && <MarketModal text={'BUY'} contract={contract} tokenId={tokenId} orderId={hash}/>}
            <MarketModal text={'OFFER'} contract={contract} tokenId={tokenId} orderId={hash} />
            {highestOffer ? <MarketModal text={'CANCEL OFFER'} contract={contract} tokenId={tokenId} orderId={hash} /> : null} 
          </Buttons>
        );
      }
    }
  } else {
    return (
      <Buttons>
        {listValue && <MarketModal text={'BUY'} contract={contract} tokenId={tokenId} orderId={hash}/>}
        <MarketModal text={'OFFER'} contract={contract} tokenId={tokenId} orderId={hash} />
        {highestOffer && <MarketModal text={'CANCEL OFFER'} contract={contract} tokenId={tokenId} orderId={hash} />}
        {native ? 
          <MarketModal text={'CANCEL LISTING'} contract={contract} tokenId={tokenId} orderId={hash} /> :
          account.toLowerCase() == owner?.toLowerCase() && <MarketModal text={'SELL'} contract={contract} tokenId={tokenId} orderId={hash}/>
        }
        {hasOffer && !myOffer && <MarketModal text={'ACCEPT OFFER'} contract={contract} tokenId={tokenId} orderId={hash} />}
      </Buttons>
    )
  }
  return null;
}
