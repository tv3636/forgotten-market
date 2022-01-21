import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import "react-tabs/style/react-tabs.css";
const { Tab, Tabs, TabList, TabPanel } = require("react-tabs");
import InfiniteScroll from "react-infinite-scroll-component";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Select from "react-select";
import { GetStaticPaths, GetStaticProps } from "next";
import { getWizardsWithLore } from "../../components/Lore/loreSubgraphUtils";

const API_BASE_URL: string = "https://indexer-v3-2-mainnet.up.railway.app/";

const IMG_URLS: any = {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": "/api/art/wizards/",
  "0x251b5f14a825c537ff788604ea1b58e49b70726f":
    "https://portal.forgottenrunes.com/api/souls/img/",
  "0xf55b615b479482440135ebf1b907fd4c37ed9420":
    "https://portal.forgottenrunes.com/api/shadowfax/img/",
};

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
  font-family: Arial;
  font-size: 15px;
  color: white;
`;

const FontWrapper = styled.div`
  font-size: 20px;
`;

const FontTraitWrapper = styled.div`
  font-family: Arial;
  color: black;
`;

function getOptions(traits: [any]) {
  var result: any[] = [];

  if (traits.length > 0 && isNaN(traits[0].value))
    traits.sort(function (first, second) {
      return second.count - first.count;
    });

  for (var trait of traits) {
    let option: any = {};
    option.value = trait.value;
    option.label =
      trait.value + (isNaN(trait.value) ? " (" + trait.count + ")" : "");

    result.push(option);
  }
  return result;
}

function LoadingCard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <img
        src="/static/img/marketplace/loading_card.gif"
        style={{ maxWidth: "200px" }}
      />
    </div>
  );
}

function SideBar({
  collection,
  selectionChange,
  loreChange,
  noLoreChange,
}: {
  collection: string;
  selectionChange: any;
  loreChange: any;
  noLoreChange: any;
}) {
  const [traits, setTraits] = useState([]);

  async function fetchTraits() {
    const attributes = await fetch(
      API_BASE_URL + "attributes?" + "collection=" + collection
    );
    const attributeJson = await attributes.json();
    setTraits(attributeJson.attributes);
  }

  useEffect(() => {
    fetchTraits();
  }, []);

  return (
    <ProSidebar style={{ width: "15%", marginLeft: "20px" }}>
      <form
        style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}
      >
        <label style={{ margin: "5px" }}>
          <input type="checkbox" className="hasLore" onClick={loreChange} /> Has
          Lore
        </label>
        <label style={{ margin: "5px" }}>
          <input type="checkbox" onClick={noLoreChange} /> Has No Lore
        </label>
      </form>
      {traits.map((trait: any, index) => (
        <FontTraitWrapper key={index} style={{ marginTop: "30px" }}>
          <Select
            options={getOptions(trait.values)}
            onChange={(e) => selectionChange(e, trait.key)}
            isClearable={true}
            placeholder={trait.key}
          />
        </FontTraitWrapper>
      ))}
    </ProSidebar>
  );
}

function TokenDisplay({
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
  return (
    <a
      href={"marketplace/" + contract + "/" + tokenId}
      style={{ textDecoration: "none" }}
    >
      <ListingDisplay>
        <img
          src={IMG_URLS[contract] + tokenId + ".png"}
          style={{
            borderColor: "white",
            borderStyle: "solid",
            padding: "15px",
            maxHeight: "50vw",
            maxWidth: "50vw",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "50%",
            justifyContent: "flex-start",
          }}
        >
          <MarketText>{name}</MarketText>
          <div
            style={{ fontSize: "18px", fontFamily: "Arial", color: "white" }}
          >
            {price ? (
              <div style={{ display: "flex" }}>
                <img
                  src="/static/img/marketplace/eth.png"
                  style={{
                    height: "20px",
                    marginRight: "8px",
                    marginTop: "5px",
                  }}
                />
                <div>{price}</div>
              </div>
            ) : null}
          </div>
        </div>
      </ListingDisplay>
    </a>
  );
}

function Listings({
  contract,
  collection,
  wizardsWithLore,
}: {
  contract: string;
  collection: string;
  wizardsWithLore: { [key: number]: boolean };
}) {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const [hasLore, setHasLore] = useState(false);
  const [hasNoLore, setHasNoLore] = useState(false);

  console.log(wizardsWithLore);

  async function fetchListings(reset: boolean) {
    var lists: any = [];
    var url = API_BASE_URL + "tokens?" + "contract=" + contract;

    setLoaded(false);
    if (reset) {
      setListings([]);
    }

    for (var filter of Object.keys(filters)) {
      if (filters[filter].length > 0) {
        url =
          url +
          "&attributes[" +
          filter.replace("#", "%23") +
          "]=" +
          filters[filter][0];
      }
    }

    try {
      for (let i = 0; i < 4; i++) {
        var offset = reset ? i * 20 : listings.length + i * 20;
        const page = await fetch(url + "&offset=" + offset);
        const listingsJson = await page.json();

        lists = lists.concat(listingsJson.tokens);
      }
    } catch (error) {
      console.log(error);
      setLoaded(true);
    }

    if (reset) {
      setListings(lists);
    } else {
      setListings(listings.concat(lists));
    }
    setLoaded(true);
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

  function loreChange() {
    setHasLore(!hasLore);
    console.log("sup");
  }

  function noLoreChange() {
    setHasNoLore(!hasNoLore);
    console.log("sup no");
  }

  useEffect(() => {
    fetchListings(false);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "80vh" }}>
      <SideBar
        collection={collection}
        selectionChange={selectionChange}
        loreChange={loreChange}
        noLoreChange={noLoreChange}
      />
      <div style={{ width: "85%" }}>
        {listings.length > 0 || loaded ? (
          <InfiniteScroll
            dataLength={listings.length}
            next={() => fetchListings(false)}
            hasMore={true}
            loader={null}
            scrollThreshold={0.5}
            height={"80vh"}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                marginLeft: "8vw",
                marginRight: "2vw",
                marginTop: "2vw",
                overflow: "hidden",
              }}
            >
              {listings.map((listing: any, index) => {
                return (
                  ((!hasLore && !hasNoLore) ||
                    (hasLore &&
                      !hasNoLore &&
                      wizardsWithLore[listing.tokenId]) ||
                    (!hasLore &&
                      hasNoLore &&
                      !wizardsWithLore[listing.tokenId])) && (
                    <div key={index}>
                      <TokenDisplay
                        contract={contract}
                        tokenId={listing.tokenId}
                        name={listing.name}
                        price={listing.floorSellValue}
                      />
                    </div>
                  )
                );
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <LoadingCard />
        )}
      </div>
    </div>
  );
}

export default function Marketplace({
  wizardsWithLore,
}: {
  wizardsWithLore: { [key: number]: boolean };
}) {
  return (
    <Layout title="Marketplace">
      <FontWrapper>
        <Tabs>
          <TabList>
            <Tab>Wizards</Tab>
            <Tab>Souls</Tab>
            <Tab>Ponies</Tab>
          </TabList>

          <TabPanel>
            <Listings
              collection="forgottenruneswizardscult"
              contract="0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42"
              wizardsWithLore={wizardsWithLore}
            />
          </TabPanel>
          <TabPanel>
            <Listings
              collection="forgottensouls"
              contract="0x251b5f14a825c537ff788604ea1b58e49b70726f"
              wizardsWithLore={wizardsWithLore}
            />
          </TabPanel>
          <TabPanel>
            <Listings
              collection="forgottenrunesponies"
              contract="0xf55b615b479482440135ebf1b907fd4c37ed9420"
              wizardsWithLore={wizardsWithLore}
            />
          </TabPanel>
        </Tabs>
      </FontWrapper>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  return {
    props: {
      wizardsWithLore: await getWizardsWithLore(),
    },
    revalidate: 3 * 60,
  };
};