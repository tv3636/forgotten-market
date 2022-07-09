import * as React from "react";
import styled from "@emotion/styled";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import Button from "../ui/Button";
import { useMst } from "../../store";
import { useEthers } from "@usedapp/core";

type Props = {};

const ConnectButton = styled(Button)`
  background-color: var(--darkGray);
  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 46 42 46 42;

  padding: var(--sp-4);

  cursor: pointer;
  color: var(--lightGray);

  :hover {
    background-color: var(--mediumGray);
    border-color: var(--lightGray);
  }

  @media only screen and (max-width: 600px) {
    margin-bottom: 10px;
  }
  
  transition: all 200ms;
`;

export default function MarketConnect() {
  const { web3Settings } = useMst();
  const connected = web3Settings.connected;
  const { activate } = useEthers();

  const setInjectedProvider = (newProvider: any) => {
    web3Settings.setInjectedProvider(newProvider);
    activate(newProvider);

    // workaround to reload page after wallet is connected
    window.location.reload();
  };

  const [web3Modal, loadWeb3Modal, logoutOfWeb3Modal] =
    useWeb3Modal(setInjectedProvider);

  return (
    <ConnectButton onClick={() => loadWeb3Modal()}>
      CONNECT YOUR WALLET
    </ConnectButton>
  );
}
