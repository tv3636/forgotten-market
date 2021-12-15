import React from "react";
import Layout from "../components/Layout";
import { Box, Flex } from "rebass";
import Countdown from "react-countdown";

const zerPad = (n: number) => ("0" + n).slice(-2);
const Lucky = () => {
  const CountDownRenderer = ({
    hours,
    minutes,
    seconds,
    days,
    completed,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    days: number;
    completed: boolean;
  }) => {
    return (
      <Flex width={"100%"} flexDirection="column" alignItems={"center"}>
        <h1
          style={{
            fontSize: "58px",
            textAlign: "center",
            marginTop: "0px",
          }}
        >
          {completed ? "👀" : `${days} days`}
        </h1>
        {!completed && (
          <h1
            style={{
              fontSize: "58px",
              textAlign: "center",
              marginTop: "0px",
            }}
          >
            {zerPad(hours)}:{zerPad(minutes)}:{zerPad(seconds)}
          </h1>
        )}
      </Flex>
    );
  };

  return (
    <Layout title="Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <Box p={6}>
        <Countdown renderer={CountDownRenderer} date={1640361600000} />
      </Box>
    </Layout>
  );
};

export default Lucky;
