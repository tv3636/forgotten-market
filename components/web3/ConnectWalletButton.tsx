import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import Button from "../ui/Button";
import { useMst } from "../../store";

type Props = {};

export function ConnectWalletButton() {
  const { web3Settings } = useMst();
  console.log("store: ", web3Settings);
  const connected = web3Settings.connected;

  const setInjectedProvider = (newProvider: any) => {
    console.log("newProvider: ", newProvider);
    web3Settings.setInjectedProvider(newProvider);
  };
  const [web3Modal, loadWeb3Modal, logoutOfWeb3Modal] =
    useWeb3Modal(setInjectedProvider);

  useEffect(() => {
    console.log("checking if we're already connected");
  }, []);

  return (
    <Button onClick={() => loadWeb3Modal()}>
      Connect Your Wallet a [{connected ? "true" : "false"}]
    </Button>
  );
}
