import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import Button from "../ui/Button";
import { useMst } from "../../store";
import { useEthers } from "@usedapp/core";

type Props = {};

const ConnectButton = styled(Button)`
  background-color: #3f2b20;
  cursor: pointer;
`;

export function ConnectWalletButton() {
  const { web3Settings } = useMst();
  const connected = web3Settings.connected;
  const { activate } = useEthers();

  const setInjectedProvider = (newProvider: any) => {
    web3Settings.setInjectedProvider(newProvider);
    activate(newProvider);
  };

  const [web3Modal, loadWeb3Modal, logoutOfWeb3Modal] =
    useWeb3Modal(setInjectedProvider);

  return (
    <ConnectButton onClick={() => loadWeb3Modal()}>
      Connect Your Wallet
    </ConnectButton>
  );
}
