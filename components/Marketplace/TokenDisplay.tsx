import { useEffect } from "react";
import { COMMUNITY_CONTRACTS, CONTRACTS, MARKETS } from "./marketplaceConstants";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import styled from "@emotion/styled";
import wizards from "../../data/wizards.json";
import warriors from "../../data/warriors.json";
import souls from "../../data/souls.json";
import ponies from "../../data/ponies.json";
import babies from "../../data/babies.json";

const collectionData: any = {
  'Wizards': wizards as { [wizardId: string]: any },
  'Warriors': warriors as { [warriorId: string]: any},
  'Souls': souls as { [soulId: string]: any },
  'Ponies': ponies as { [ponyId: string]: any },
  'Babies': babies as { [babyId: string]: any },
}

const ListingDisplay = styled.div`
  width: 200px;
  height: auto;
  margin: var(--sp1);
  display: flex;
  flex-direction: column;

  position: relative;
  background-color: black;

  @media only screen and (max-width: 600px) {
    width: 140px;
    max-height: 250px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: var(--sp-2);
  }

`;

const NewFrame = styled.div`
  width: calc(100% + var(--frameSize));
  height: calc(100% + 0.5 * var(--frameSize));

  position: absolute;
  left: calc(-0.5 * var(--frameSize));
  top: calc(-0.1 * var(--frameSize));
  z-index: 1;
  border-image-source: url(/static/img/newframe_black.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-image-outset: 0;
  border-style: solid;
  border-image-repeat: round;
  image-rendering: pixelated;
`;

const ListingImage = styled.img`
  width: 200px;
  min-height: 200px;
  
  padding: var(--sp1);
  z-index: 2;

  :hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    width: 140px;
    min-height: 140px;
    border-width: 1.5px;
  }

  transition: border-color 100ms;

`;

const ListingInfo = styled.div`
  position: relative;
  background-color: var(--frameGray);
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const MarketText = styled.p`
  font-family: Alagard;
  font-size: var(--sp0);
  font-weight: bold;
  color: white;
  text-shadow: 0px 2px var(--midGray);
  
  line-height: 1.3;
  max-width: 20ch;
  min-height: 5ex;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  margin-bottom: var(--sp-1);
  margin-top: var(--sp-2);

  @media only screen and (max-width: 600px) {
    max-width: 15ch;
    padding-left: var(--sp-2);
    padding-right: var(--sp-2)
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PriceDisplay = styled.div`
  font-family: Terminal;
  font-size: var(--sp0);
  color: white;
  font-weight: bold;

  margin-left: -2px;
  margin-right: -2px;

  margin-bottom: var(--sp0);

  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
`;

const EthSymbol = styled.img`
  height: var(--sp-1);
  margin-right: var(--sp-4);
`;

const MarketIcon = styled.img`
  width: 22px;
  height: 22px;
  image-rendering: pixelated;

  position: absolute;
  bottom: calc(-0.65 * var(--frameSize));
  left: 50%;
  transform: translate(-50%, 0%);

  z-index: 2;

  @media only screen and (max-width: 600px) {
    width: 20px;
    height: 20px;
  }
`;

export default function TokenDisplay({
  contract,
  tokenId,
  name,
  price,
  source,
}: {
  contract: string;
  tokenId: number;
  name: string;
  price: number;
  source: string;
}) {
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;

  let image = contracts[contract].display == 'Wizards' ? 
    `${contracts[contract].image_url}${tokenId}/${tokenId}.png` : 
    `${contracts[contract].image_url}${tokenId}.png`;

  let turnaround = contracts[contract].display == 'Wizards' ? 
    `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif` :
    `https://runes-turnarounds.s3.amazonaws.com/ponies/${tokenId}.gif`;

  // Preload turnaround GIFs
  useEffect(() => {
    if (['Wizards', 'Ponies'].includes(contracts[contract].display)) {
      const img = new Image().src = turnaround;
    }
  }, []);

  return (
    <Link
      href={`/${contract}/${tokenId}`}
      passHref={true}
    >
      <SoftLink>
      <ListingDisplay 
        style={
          contracts[contract].display in collectionData && tokenId in collectionData[contracts[contract].display] ? 
            { background: collectionData[contracts[contract].display][tokenId].background } : {}
        }
      >
        { contracts[contract].display == 'Wizards' || contracts[contract].display == 'Ponies' ?
          <ListingImage 
            src={image}
            onMouseOver={(e) =>
              (e.currentTarget.src = turnaround)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = image)
            }
          /> :
          <ListingImage src={contracts[contract].image_url + tokenId + ".png"} />
        }
        <ListingInfo>
          <NameWrapper>
            <MarketText title={name}>{name}</MarketText>
          </NameWrapper>
          <PriceDisplay>
            {price &&
              <PriceWrapper>
                <EthSymbol src='/static/img/marketplace/eth.png' />
                <div>{price}</div>
              </PriceWrapper>
            }
          </PriceDisplay>
          { source in MARKETS && <MarketIcon src={MARKETS[source].image} title={MARKETS[source].name}/> }
        </ListingInfo>
        <NewFrame/>
      </ListingDisplay>
      </SoftLink>
    </Link>
  );
}
