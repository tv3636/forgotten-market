import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useMst } from "../store";
import { EmptyWell } from "../components/ui/EmptyWell";
import { ConnectWalletButton } from "../components/web3/ConnectWalletButton";
import { observer } from "mobx-react-lite";
import { Box } from "rebass";
import { useRouter } from "next/router";

const MyNfts = observer(() => {
  const { web3Settings } = useMst();
  const walletConnected = web3Settings.connected;
  const router = useRouter();

  const selectedAddress =
    // @ts-ignore
    web3Settings?.injectedProvider?.provider?.selectedAddress;

  useEffect(() => {
    async function fetchTokenData() {
      if (web3Settings.injectedProvider && selectedAddress) {
        router.push(`/address/${selectedAddress}`);
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
    </Layout>
  );
});

export default MyNfts;
