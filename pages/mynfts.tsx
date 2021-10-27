import React from "react";
import Layout from "../components/Layout";
import { useMst } from "../store";
import { EmptyWell } from "../components/ui/EmptyWell";
import { ConnectWalletButton } from "../components/web3/ConnectWalletButton";
import { observer } from "mobx-react-lite";
import useMyNfts from "../hooks/useMyNfts";
import { Web3Provider } from "@ethersproject/providers";
import NFTDisplay from "../components/NFTDisplay";
import { CHARACTER_CONTRACTS } from "../contracts/ForgottenRunesWizardsCultContract";

const MyNftsGrid = () => {
  const { web3Settings } = useMst();
  const myNfts = useMyNfts(web3Settings.injectedProvider as Web3Provider);
  return (
    <>
      <h1>Hello!</h1>
      {myNfts &&
        Object.entries(myNfts).map(([key, value]) => (
          <React.Fragment key={key}>
            <h1>{key}</h1>
            {value.map((id) => (
              <NFTDisplay
                contractAddress={CHARACTER_CONTRACTS[key] as string}
                tokenId={id}
                pixelArt={true}
              />
            ))}
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
      {!walletConnected ? (
        <EmptyWell>
          <ConnectWalletButton />
        </EmptyWell>
      ) : (
        <MyNftsGrid />
      )}
    </Layout>
  );
});

export default MyNfts;
