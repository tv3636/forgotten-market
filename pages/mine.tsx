import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useMst } from "../store";
import { EmptyWell } from "../components/ui/EmptyWell";
import { ConnectWalletButton } from "../components/web3/ConnectWalletButton";
import { observer } from "mobx-react-lite";
import useMyNfts from "../hooks/useMyNfts";
import { Web3Provider } from "@ethersproject/providers";
import NFTDisplay, { HoldingsGrid } from "../components/NFTDisplay";
import { Box } from "rebass";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { getTokenDataForAllCollections } from "../lib/nftUtilis";

const NFTGrid = styled.div`
  display: grid;
  grid-auto-columns: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
`;
const NFTItem = styled.div``;

const MyNftsGrid = () => {
  const { web3Settings } = useMst();
  const { wizardsContract, myWizards, soulsContract, mySouls } = useMyNfts(
    web3Settings.injectedProvider as Web3Provider
  );
  return (
    <>
      <h1>Wizards</h1>
      <NFTGrid>
        {myWizards &&
          wizardsContract &&
          myWizards.map((value) => (
            <NFTItem key={value.toNumber()}>
              <NFTDisplay
                contractAddress={wizardsContract}
                tokenId={value.toNumber().toString()}
                pixelArt={true}
              />
            </NFTItem>
          ))}
      </NFTGrid>
      <h1>Souls</h1>
      <NFTGrid>
        {mySouls &&
          soulsContract &&
          mySouls.map((value) => (
            <NFTItem key={value.toNumber()}>
              <NFTDisplay
                contractAddress={soulsContract}
                tokenId={value.toNumber().toString()}
                pixelArt={true}
              />
            </NFTItem>
          ))}
      </NFTGrid>
    </>
  );
};

const MyNfts = observer(() => {
  const { web3Settings } = useMst();
  const walletConnected = web3Settings.connected;
  const [tokenData, setTokenData] = useState<any>();
  const router = useRouter();

  const selectedAddress =
    // @ts-ignore
    web3Settings?.injectedProvider?.provider?.selectedAddress;

  useEffect(() => {
    async function fetchTokenData() {
      if (web3Settings.injectedProvider && selectedAddress) {
        router.push(`/address/${selectedAddress}`);
        // setTokenData(
        //   await getTokenDataForAllCollections(
        //     web3Settings.injectedProvider,
        //     selectedAddress
        //   )
        // );
      }
    }

    fetchTokenData();
  }, [web3Settings.injectedProvider, selectedAddress]);

  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      {!walletConnected && (
        <Box p={4}>
          <EmptyWell>
            <ConnectWalletButton />
          </EmptyWell>
        </Box>
      )}
      {/*{tokenData && (*/}
      {/*  <HoldingsGrid address={selectedAddress} tokenData={tokenData} />*/}
      {/*)}*/}
    </Layout>
  );
});

export default MyNfts;
