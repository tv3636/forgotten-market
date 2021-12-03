import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useMst } from "../store";
import { EmptyWell } from "../components/ui/EmptyWell";
import { ConnectWalletButton } from "../components/web3/ConnectWalletButton";
import { observer } from "mobx-react-lite";
import { Box } from "rebass";
import { useRouter } from "next/router";
import { useEthers } from "@usedapp/core";

const MyNfts = observer(() => {
  const { account, library } = useEthers();
  const router = useRouter();

  useEffect(() => {
    async function fetchTokenData() {
      if (account) {
        router.push(`/address/${account}`);
      }
    }

    fetchTokenData();
  }, [account]);

  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      {!account && (
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
