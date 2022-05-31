import { useEffect } from "react";
import { CONTRACTS, MARKETS } from "./marketplaceConstants";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import wizards from "../../data/nfts-prod.json";
import warriors from "../../data/warriors.json";
import souls from "../../data/souls.json";
import ponies from "../../data/ponies.json";
import styled from "@emotion/styled";

const wizData = wizards as { [wizardId: string]: any };
const warriorsData = warriors as { [warriorId: string]: any};
const soulsData = souls as { [soulId: string]: any };
const poniesData = ponies as { [ponyId: string]: any };

const ListingDisplay = styled.div`
  width: 250px;
  height: 350px;
  margin: 25px;
  display: flex;
  flex-direction: column;

  border-style: solid;
  border-color: var(--mediumGray);
  border-radius: 18px;
  border-width: 2px;

  background-color: var(--darkGray);

  

  @media only screen and (max-width: 600px) {
    width: 150px;
    max-height: 250px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    margin-top: 5px;
  }

  transition: all 100ms;

`;

const ListingImage = styled.img`
  max-height: 50vw;
  max-width: 50vw;

  min-height: 248px;

  border-radius: 15px;
  border-style: solid;
  border-width: 4px;
  border-color: var(--mediumGray);

  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-width: 6px;

  padding: 15px;

  :hover {
    cursor: pointer;
    border-color: var(--lightGray);
  }

  @media only screen and (max-width: 600px) {
    max-width: 150px;
    max-height: 150px;

    min-height: 150px;

    border-width: 1.5px;
  }

  transition: border-color 300ms;

`;

const TextDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 15px;
  padding-top: 0px;

  @media only screen and (max-width: 600px) {
    padding: 12px;
    padding-top: 0px;
  }

`;

const MarketText = styled.p`
  font-family: Staxblox;
  font-size: 17px;
  font-weight: bold;
  color: white;
  
  line-height: 1.2;
  max-width: 16ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
    max-width: 14ch;
    line-height: 1.2;
  }
`;

const PriceDisplay = styled.div`
  font-family: Bitdaylong;
  font-size: 20px;
  color: var(--white);
  font-weight: bold;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
  }
`;

const MarketIcon = styled.img`
  width: 22px;
  height: 22px;
  margin-top: 2px;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
    margin-top: 0;
  }

`;

const EthSymbol = styled.img`
  height: 16px;
  margin-right: 8px;
  margin-top: 3px;

  @media only screen and (max-width: 600px) {
    margin-top: 1.5px;
    height: 13px;
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
        style={{height: 'auto'}}
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
            style={{background: '#' + wizData[tokenId].background_color}}
          /> : CONTRACTS[contract].display == 'Ponies' && tokenId < 440 ?
          <ListingImage 
            src={image}
            onMouseOver={(e) =>
              { (e.currentTarget.src = pony_turnaround); }
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = image)
            }
            style={{background: tokenId in poniesData ? poniesData[tokenId].background : 'black'}}
          /> :
          <ListingImage 
            src={CONTRACTS[contract].image_url + tokenId + ".png"}
            style={{ 
              background: 
                CONTRACTS[contract].display == 'Warriors' && tokenId in warriorsData ? warriorsData[tokenId].background :
                CONTRACTS[contract].display == 'Souls' && tokenId in soulsData ? soulsData[tokenId].background :
                CONTRACTS[contract].display == 'Ponies' && tokenId in poniesData ? poniesData[tokenId].background :
                'black'
            }}
          />
        }
        <TextDisplay>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <MarketText title={name} style={price ? {} : {maxWidth: '25ch'}}>
              {name}
            </MarketText>
            { source in MARKETS && <MarketIcon src={MARKETS[source].image} title={MARKETS[source].name}/> }
          </div>
          <PriceDisplay>
            {price &&
              <div style={{ display: 'flex' }}>
                <EthSymbol src='/static/img/marketplace/eth.png' />
                <div>{price}</div>
              </div>
            }
            
          </PriceDisplay>
        </TextDisplay>
      </ListingDisplay>
      </SoftLink>
    </Link>
  );
}
