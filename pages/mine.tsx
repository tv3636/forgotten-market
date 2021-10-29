import React from "react";
import Layout from "../components/Layout";
import { useMst } from "../store";
import { EmptyWell } from "../components/ui/EmptyWell";
import { ConnectWalletButton } from "../components/web3/ConnectWalletButton";
import { observer } from "mobx-react-lite";
import useMyNfts from "../hooks/useMyNfts";
import { Web3Provider } from "@ethersproject/providers";
import NFTDisplay from "../components/NFTDisplay";
import {
  CHARACTER_CONTRACTS,
  WIZARDS_CONTRACT_ADDRESS,
} from "../contracts/ForgottenRunesWizardsCultContract";
import { Box } from "rebass";
import styled from "@emotion/styled";

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

  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <Box p={4}>
        {!walletConnected ? (
          <EmptyWell>
            <ConnectWalletButton />
          </EmptyWell>
        ) : (
          <MyNftsGrid />
        )}
      </Box>
    </Layout>
  );
});

export default MyNfts;
