import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import 'react-tabs/style/react-tabs.css';
const { Tab, Tabs, TabList, TabPanel } = require('react-tabs');
import InfiniteScroll from "react-infinite-scroll-component";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Select from 'react-select';

const API_BASE_URL: string = 'https://indexer-v31-mainnet.up.railway.app/';

const IMG_URLS: any = {
    '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42': '/api/art/wizards/',
    '0x251b5f14a825c537ff788604ea1b58e49b70726f': 'https://portal.forgottenrunes.com/api/souls/img/',
    '0xf55b615b479482440135ebf1b907fd4c37ed9420': 'https://portal.forgottenrunes.com/api/shadowfax/img/'
}

const ListingDisplay = styled.div`
    width: 250px;
    height: 350px;
    margin: 25px;
    display: flex;
    flex-direction: column;

    max-width: 50vw;
    max-height: 40vh;
`;

const MarketText = styled.p`
    @font-face {
        font-family: "Swis721";
        src: url("static/game/wizards/Swis721.ttf") format("truetype");
    } 

    font-family: Swis721;
    font-size: 15px;
    color: white;
`;

const FontWrapper = styled.div`
    font-size: 20px;
`;

const FontTraitWrapper = styled.div`
    @font-face {
        font-family: "Swis721";
        src: url("static/game/wizards/Swis721.ttf") format("truetype");
    } 

    font-family: Swis721;
    color: black;
`

function getOptions(traits: [any]) {
    var result: any[] = [];
    for (var trait of traits) {
        let option: any = {};
        option.value = trait.value;
        option.label = trait.value;

        result.push(option);
    }
    return result;
}

function SideBar({
    collection,
    selectionChange
}: {
    collection: string,
    selectionChange: any
}) {
    const [traits, setTraits] = useState([]);

    async function fetchTraits() {
        const attributes = await fetch(API_BASE_URL + 'attributes?' + 'collection=' + collection);
        const attributeJson = await attributes.json();
        setTraits(attributeJson.attributes);
    }

    useEffect(() => {
        fetchTraits();
      }, []);

    return (
        <ProSidebar style={{width: '15%', marginLeft: '20px'}}>
            {traits.map((trait: any, index) => (
                <FontTraitWrapper key={index} style={{marginTop: '35px'}}>
                    <Select options={getOptions(trait.values)} onChange={e => selectionChange(e, trait.key)} isClearable={true} placeholder={trait.key}/>
                </FontTraitWrapper>
            ))}
        </ProSidebar>
    )
}

function TokenDisplay({
    contract,
    tokenId,
    name,
    price
    
}: {
    contract: string,
    tokenId: number,
    name: string,
    price: number
}) {

    return (
        <a href={'marketplace/'  + contract + '/' + tokenId} style={{textDecoration: 'none'}}>
        <ListingDisplay>
            <img 
                src={IMG_URLS[contract] + tokenId + '.png'}
                style={{
                    borderColor: "white",
                    borderStyle: "solid",
                    padding: "15px",
                    maxHeight: "50vw",
                    maxWidth: "50vw"
                }}
            />
            <div style={{display: 'flex', flexDirection: 'column', height: '50%', justifyContent: 'flex-start'}}>
                <MarketText>{name}</MarketText>
                <MarketText style={{fontSize:'18px'}}>{price}</MarketText>
            </div>
        </ListingDisplay>
        </a>
    )
}

function Listings({
    contract,
    collection
}: {
    contract: string,
    collection: string
}) {
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState<any>({});

    async function fetchListings(reset: boolean) {
        var lists: any = [];
        var url = API_BASE_URL + 'tokens?' + 'contract=' + contract;

        for (var filter of Object.keys(filters)) {
            if (filters[filter].length > 0) {
                url = url + '&attributes[' + filter.replace('#', '%23') + ']=' + filters[filter][0]
            }
        }

        for (let i = 0; i < 4; i++) {
            var offset = reset ? i*20: listings.length + (i * 20);
            const page = await fetch(url + '&offset=' + offset);
            const listingsJson = await page.json();

            lists = lists.concat(listingsJson.tokens);
        }
        if (reset) {
            setListings(lists);
        } else {
            setListings(listings.concat(lists));
        }
    }

    function selectionChange(selected: any, trait: any) {
        var newFilters = filters;
        newFilters[trait] = [];
        
        if (selected) {
            newFilters[trait].push(selected.value);
        }

        setFilters(newFilters);
        fetchListings(true);
    }

    useEffect(() => {
        fetchListings(false);
      }, []);

    return (
        <div style={{display: 'flex', flexDirection: 'row', height: '80vh'}}>
            <SideBar collection={collection} selectionChange={selectionChange}/>
            <div style={{width: '85%'}}>
                <InfiniteScroll
                    dataLength={listings.length}
                    next={() => fetchListings(false)}
                    hasMore={true}
                    loader={null}
                    scrollThreshold={.5}
                    height={'80vh'}
                >
                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginLeft: "8vw", marginRight: "2vw", marginTop: "2vw", overflow: "hidden"}}>
                        {listings.map((listing: any, index) => (
                            <div key={index}>  
                                <TokenDisplay 
                                    contract={contract}  
                                    tokenId={listing.tokenId}
                                    name={listing.name}
                                    price={listing.floorSellValue}
                                />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default function Marketplace() {

    return (
        <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
            <FontWrapper>
                <Tabs>
                    <TabList>
                        <Tab>Wizards</Tab>
                        <Tab>Souls</Tab>
                        <Tab>Ponies</Tab>
                    </TabList>

                    <TabPanel>
                        <Listings collection='forgottenruneswizardscult' contract='0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42'/>
                    </TabPanel>
                    <TabPanel>
                        <Listings collection='forgottensouls' contract='0x251b5f14a825c537ff788604ea1b58e49b70726f'/>
                    </TabPanel>
                    <TabPanel>
                        <Listings collection='forgottenrunesponies' contract='0xf55b615b479482440135ebf1b907fd4c37ed9420'/>
                    </TabPanel>
                </Tabs>
            </FontWrapper>
        </Layout>
    )
};
