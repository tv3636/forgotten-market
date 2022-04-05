import { useEffect } from "react";
import { CONTRACTS } from "./marketplaceConstants";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import wizards from "../../data/nfts-prod.json";
import styled from "@emotion/styled";

const wizData = wizards as { [wizardId: string]: any };

const ListingDisplay = styled.div`
  width: 250px;
  height: 350px;
  margin: 25px;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 600px) {
    width: 150px;
    max-height: 250px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 5px;
    margin-top: 5px;
  }

`;

const ListingImage = styled.img`
  border-style: solid;
  border-width: 4px;
  border-color: var(--darkGray);
  border-radius: 10px;

  min-width: 250px;
  min-height: 250px;
  max-height: 50vw;
  max-width: 50vw;

  :hover {
    cursor: pointer;
    border-color: var(--mediumGray);
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
  max-width: 25ch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceDisplay = styled.div`
  font-family: Alagard;
  font-size: 17px;
  color: var(--white);
  font-weight: bold;
`;


export default function TokenDisplay({
  contract,
  tokenId,
  name,
  price,
}: {
  contract: string;
  tokenId: number;
  name: string;
  price: number;
}) {
  let image = CONTRACTS[contract].display == 'Wizards' ? 
    `${CONTRACTS[contract].image_url}${tokenId}/${tokenId}.png` : 
    `${CONTRACTS[contract].image_url}${tokenId}.png`;

  let turnaround = `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/${tokenId}-walkcycle-nobg.gif`;

  // Preload turnaround GIFs
  useEffect(() => {
    if (CONTRACTS[contract].display == 'Wizards') {
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
          <MarketText title={name}>{name}</MarketText>
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
