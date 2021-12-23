import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { Box, Flex } from "rebass";
import { DAppProvider, Config, Mainnet, useBlockNumber } from "@usedapp/core";

const config: Config = {
  readOnlyChainId: parseInt(
    process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID as string
  ),
  readOnlyUrls: {
    [parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID as string)]: process
      .env.NEXT_PUBLIC_REACT_APP_NETWORK_URL as string,
  },
};

const CountDownRenderer = () => {
  const blockNumber = useBlockNumber();

  const requiredBlock = 13868980;

  useEffect(() => {
    if (blockNumber && blockNumber >= requiredBlock) {
      window.location.href = "https://ponies.forgottenrunes.com/";
    }
  }, [requiredBlock, blockNumber]);

  return (
    <Flex width={"100%"} flexDirection="column" alignItems={"center"}>
      {!blockNumber && <h1>Loading...</h1>}
      {blockNumber && (
        <>
          <h1
            style={{
              fontSize: "58px",
              textAlign: "center",
              marginTop: "0px",
            }}
          >
            Waiting for block #{requiredBlock}
          </h1>
          <h2
            style={{
              fontSize: "46px",
              textAlign: "center",
              marginTop: "0px",
            }}
          >
            {requiredBlock - blockNumber} to go
          </h2>
        </>
      )}
    </Flex>
  );
};

const Lucky = () => {
  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <Box p={6}>
        <DAppProvider config={config}>
          <CountDownRenderer />
        </DAppProvider>
      </Box>
    </Layout>
  );
};

export default Lucky;
