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
  width: 200px;
  height: 300px;
  margin: var(--sp2);
  display: flex;
  flex-direction: column;

  border-image-source: url(/static/img/newframe.png);
  border-image-slice: 30;
  border-image-width: 34px;
  border-image-outset: 12;
  border-style: solid;

  @media only screen and (max-width: 600px) {
    width: 150px;
    max-height: 250px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    margin-top: 5px;
  }

`;

const ListingImage = styled.img`
  border-width: 4px;
  border-radius: 30px;

  min-width: 200px;
  min-height: 200px;
  max-height: 50vw;
  max-width: 50vw;

  padding: var(--sp1);

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

const MarketText = styled.p`
  font-family: Alagard;
  font-size: 17px;
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

  @media only screen and (max-width: 600px) {
    max-width: 15ch;
  }
`;

const PriceDisplay = styled.div`
  font-family: Alagard;
  font-size: 17px;
  color: var(--white);
  font-weight: bold;

  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
`;

const MarketIcon = styled.img`
  width: 17px;
  height: 17px;
  margin-top: 2px;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
    margin-top: 0;
  }

`;

//{ source in MARKETS && <MarketIcon src={MARKETS[source].image} title={MARKETS[source].name}/> }

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
              (e.currentTarget.src = pony_turnaround)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = image)
            }
            style={{background: '#' + wizData[tokenId].background_color}}
          /> :
          <ListingImage 
            src={CONTRACTS[contract].image_url + tokenId + ".png"}
          />
        }
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '50%',
            justifyContent: 'flex-start',
          }}
        >
          <div 
            style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <MarketText title={name}>{name}</MarketText>
          </div>
          <PriceDisplay>
            {price &&
              <div style={{ display: 'flex' }}>
                <img
                  src='/static/img/marketplace/eth.png'
                  style={{
                    height: '14px',
                    marginRight: '8px',
                    marginTop: '2px',
                  }}
                />
                <div>{price}</div>
              </div>
            }
            
          </PriceDisplay>
        </div>
      </ListingDisplay>
      </SoftLink>
    </Link>
  );
}
