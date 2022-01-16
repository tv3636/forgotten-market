import styled from "@emotion/styled";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import React, { useEffect, useState } from "react";

const API_BASE_URL: string = 'https://indexer-v31-mainnet.up.railway.app/';

const IMG_URLS: any = {
    '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42': '/api/art/wizards/',
    '0x251b5f14a825c537ff788604ea1b58e49b70726f': 'https://portal.forgottenrunes.com/api/souls/img/',
    '0xf55b615b479482440135ebf1b907fd4c37ed9420': 'https://portal.forgottenrunes.com/api/shadowfax/img/'
}

const FontWrapper = styled.div`
    @font-face {
        font-family: "Swis721";
        src: url("../../static/game/wizards/Swis721.ttf") format("truetype");
    } 
`;

const MarketText = styled.p`
    font-family: Swis721;
    font-size: 32px;
    color: white;

    margin: 15px;
`;

const MarketButton = styled.button`
    font-family: Swis721;
    font-size: 32px;
    color: black;
    
    margin: 5px;
`;

const MarketHeader2 = styled.h2`
    font-family: Swis721;
    font-size: 28px;
    color: white;

    margin-top: 8px;
    margin-bottom: 30px;
`;

const MarketHeader4 = styled.h4`
    font-family: Swis721;
    font-size: 18px;
    color: white;

    margin-top: 12px;
`;

function TraitDisplay({
    attributes
}: {
    attributes: []
}) {
    if (attributes.length == 0) {
        return (null)
    } else {
        return (
            <div>
                {attributes.map((attribute: any, index: number) => (
                    <div>  
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <p style={{textAlign: 'start', marginLeft: '1vw', fontSize: '20px'}}>{attribute.key}:</p>
                            <p style={{textAlign: 'start', marginRight: '1vw', fontSize: '20px'}}>{attribute.value}</p>
                        </div>
                        {index < attributes.length - 1 ? <hr/> : null}
                    </div>
                ))}
            </div>
        )
    }
}

const ListingPage = ({
  contractSlug,
  tokenId,
}: {
  contractSlug: string;
  tokenId: string;
}) => {
    const [token, setToken] = useState<any>({});
    const [listing, setListing] = useState<any>({});
    const [attributes, setAttributes] = useState<any>([]);

    useEffect(() => {
        async function run() {
            const page = await fetch(API_BASE_URL + 'tokens/details?' + 'contract=' + contractSlug + '&tokenId=' + tokenId);
            const listingsJson = await page.json();

            setToken(listingsJson.tokens[0].token);
            setListing(listingsJson.tokens[0].market.floorSell);
            setAttributes(listingsJson.tokens[0].token.attributes)
        }
        
        run();
      }, []);

  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
        {Object.keys(listing).length > 0 &&
            <FontWrapper style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '5vh'}}>
                <div id='lefthand' style={{textAlign: 'center', marginRight: '5vw'}}>
                    <img 
                        src={IMG_URLS[contractSlug] + tokenId + '.png'}
                    />
                    <MarketHeader2>{token.name}</MarketHeader2>

                    <div style={{textAlign: 'center', borderColor: 'white', borderStyle: 'solid'}}>
                        <TraitDisplay attributes={attributes}/>
                    </div>
                    
                </div>
                <div id='righthand' style={{textAlign: 'center', marginLeft: '3vw', marginTop: '10vh'}}>
                    <MarketText>{listing.value ? listing.value + ' Ξ': null}</MarketText>
                    <hr/>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        {listing.value && <MarketButton>Buy Now</MarketButton>}
                        <MarketButton>Make Offer</MarketButton>
                    </div>
                    <hr/>
                    <MarketHeader4>{token.owner ? 'Owner: ' + token.owner.substring(0,10): null}</MarketHeader4>
                    <p>{listing.validUntil ? "Listing expires " + String(new Date(listing.validUntil * 1000).toLocaleDateString()): null}</p>
                </div>
            </FontWrapper>
        }
    </Layout>
  );
};

export default ListingPage;

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  
    const contractSlug = params?.contractSlug as string;
    const tokenId = params?.tokenId as string;
  
    return {
      props: {
        contractSlug,
        tokenId: tokenId,
      },
      revalidate: 3 * 60,
    };
  };
  
  export const getStaticPaths: GetStaticPaths = async ({}) => {
    return {
      paths: [],
      fallback: "blocking",
    };
  };
  