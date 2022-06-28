import { useEffect } from "react";
import { CONTRACTS, MARKETS } from "./marketplaceConstants";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import wizards from "../../data/wizards.json";
import warriors from "../../data/warriors.json";
import souls from "../../data/souls.json";
import ponies from "../../data/ponies.json";
import styled from "@emotion/styled";

const wizData = wizards as { [wizardId: string]: any };
const warriorsData = warriors as { [warriorId: string]: any};
const soulsData = souls as { [soulId: string]: any };
const poniesData = ponies as { [ponyId: string]: any };

const ListingDisplay = styled.div`
  width: 200px;
  height: auto;
  margin: var(--sp2);
  display: flex;
  flex-direction: column;

  position: relative;
  background-color: black;

  @media only screen and (max-width: 600px) {
    width: 150px;
    max-height: 250px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    margin-top: 5px;
  }

`;

const NewFrame = styled.div`
  width: 200px;
  height: 294px;

  position: absolute;
  z-index: 1;
  border-image-source: url(/static/img/newframe_black.png);
  border-image-slice: 30 35 30;
  border-image-width: 34px;
  border-image-outset: 5 12 10 12;
  border-style: solid;
`;

const ListingImage = styled.img`
  min-width: 200px;
  min-height: 200px;
  max-height: 50vw;
  max-width: 50vw;

  padding: var(--sp1);
  z-index: 2;

  :hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    width: 150px;
    height: 150px;

    min-width: 150px;
    max-width: 150px;

    min-height: 150px;
    max-height: 150px;

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

  margin-bottom: var(--sp-1);

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
  bottom: 12;
  left: 50%;
  transform: translate(-50%);

  z-index: 2;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
    margin-top: 0;
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
  let image = CONTRACTS[contract].display == 'Wizards' ? 
    `${CONTRACTS[contract].image_url}${tokenId}/${tokenId}.png` : 
    `${CONTRACTS[contract].image_url}${tokenId}.png`;

  let turnaround = `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif`;
  let pony_turnaround = `https://runes-turnarounds.s3.amazonaws.com/ponies/${tokenId}.gif`;

  // Preload turnaround GIFs
  useEffect(() => {
    if (CONTRACTS[contract].display == 'Wizards') {
      const img = new Image().src = turnaround;
    }

    if (CONTRACTS[contract].display == 'Ponies') {
      const pony_img = new Image().src = pony_turnaround;
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
          CONTRACTS[contract].display == 'Wizards' && tokenId in wizData ? 
            {
              background: wizData[tokenId].background, 
              
            } :
          CONTRACTS[contract].display == 'Warriors' && tokenId in warriorsData ? 
            {
              background: warriorsData[tokenId].background, 
              
            } :
          CONTRACTS[contract].display == 'Souls' && tokenId in soulsData ? 
            {
              background: soulsData[tokenId].background, 
              
            } :
          CONTRACTS[contract].display == 'Ponies' && tokenId in poniesData ? 
            {
              background: poniesData[tokenId].background, 
              
            } :
          {}
        }
      >
        { CONTRACTS[contract].display == 'Wizards' ?
          <ListingImage 
            src={image}
            onMouseOver={(e) =>
              (e.currentTarget.src = turnaround)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = image)
            }
          /> : CONTRACTS[contract].display == 'Ponies' && tokenId < 440 ?
          <ListingImage 
            src={image}
            onMouseOver={(e) =>
              (e.currentTarget.src = pony_turnaround)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = image)
            }
          /> :
          <ListingImage src={CONTRACTS[contract].image_url + tokenId + ".png"} />
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
