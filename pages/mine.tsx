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

const MyNftsGrid = () => {
  const { web3Settings } = useMst();
  const { wizardsContract, myWizards, soulsContract, mySouls } = useMyNfts(
    web3Settings.injectedProvider as Web3Provider
  );
  return (
    <>
      <h1>Wizards</h1>
      {myWizards &&
        wizardsContract &&
        myWizards.map((value) => (
          <React.Fragment key={value.toNumber()}>
            <NFTDisplay
              contractAddress={wizardsContract}
              tokenId={value.toNumber().toString()}
              pixelArt={true}
            />
          </React.Fragment>
        ))}
      <h1>Souls</h1>
      {mySouls &&
        soulsContract &&
        mySouls.map((value) => (
          <React.Fragment key={value.toNumber()}>
            <NFTDisplay
              contractAddress={soulsContract}
              tokenId={value.toNumber().toString()}
              pixelArt={true}
            />
          </React.Fragment>
        ))}
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
