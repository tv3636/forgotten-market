import styled from "@emotion/styled";
import { ListingExpiration } from "./ListingExpiration";
import MarketButtons from "./MarketButtons";
import MarketDisplay from "./MarketDisplay";
import { BURN_ADDRESS } from "./marketplaceConstants";

const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;

  @media only screen and (max-width: 1250px) {
    align-items: center;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-width: 400px;

  @media only screen and (max-width: 1250px) {
    margin-top: var(--sp-4);
    justify-content: center;
  }
`;

const WarningWrapper = styled.div`
  text-align: left;
  font-size: 14px;
  font-family: Terminal;
  text-transform: uppercase;
  color: red;
  display: flex;
  align-items: center;

  margin-top: var(--sp-3);
  
  @media only screen and (max-width: 1250px) {
    justify-content: center;
    font-size: 13px;
    margin-top: 0;
  }
`;

const WarningSymbol = styled.div`
  font-size: 20px;
`;

export default function PriceModule({
  listing,
  offer,
  account,
  token,
  isBanned,
  flameHolder,
  contractDisplay,
  contract,
  tokenId,
}: {
  listing: any;
  offer: any;
  account: any;
  token: any;
  isBanned: boolean;
  flameHolder: boolean;
  contractDisplay: string;
  contract: string;
  tokenId: string;
}) {
  return (
    <PriceDisplay>
      <MarketDisplay 
        price={listing.price?.amount.decimal} 
        bid={offer.price?.amount.decimal} 
        lastPrice={ token.lastBuy.timestamp > token.lastSell.timestamp 
          ? token.lastBuy.value?.toPrecision(3) 
          : token.lastSell.value?.toPrecision(3) 
        }
        lastSaleWeth={ token.lastBuy.timestamp > token.lastSell.timestamp }
        contract={contract}
      />
      {token.owner != BURN_ADDRESS &&
        <ButtonWrapper>
          <MarketButtons
            account={account}
            owner={contractDisplay == 'Flames' && flameHolder ? account : token.owner}
            listValue={listing.price?.amount.decimal}
            hasOffer={offer.price?.amount.decimal != null}
            highestOffer={offer.price?.amount.decimal && offer?.maker.toLowerCase() == account?.toLowerCase()}
            native={listing.source.name == 'Forgotten Market'}
            tokenType={contractDisplay == 'Flames' || contractDisplay == 'Treats' ? 1155 : 721}
            myOffer={offer.price?.amount.decimal && offer?.maker?.toLowerCase() == account?.toLowerCase()}
            tokenId={tokenId}
            contract={contract}
            hash={listing.id}
          />
        </ButtonWrapper>
      }
      {listing.validUntil ? 
        <ListingExpiration
          date={new Date(listing.validUntil * 1000)}
          source={listing.source.id}
        />
        : null
      }
      { isBanned && 
        <WarningWrapper>
          <WarningSymbol style={{marginRight: '10px'}}>⚠</WarningSymbol> 
          Reported as stolen on OpenSea 
          <WarningSymbol style={{marginLeft: '10px'}}>⚠</WarningSymbol> 
        </WarningWrapper> 
      }
    </PriceDisplay>
  )
}
