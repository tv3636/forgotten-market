import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";

type Props = {};

const WizardPickerElement = styled.div``;

function NotConnected() {
  return (
    <div>
      <ConnectWalletButton />
    </div>
  );
}

const WizardPicker = observer(({}: Props) => {
  const { web3Settings } = useMst();

  const walletConnected = web3Settings.connected;

  if (!walletConnected) {
    return (
      <EmptyWell>
        <NotConnected />
      </EmptyWell>
    );
  }

  return <WizardPickerElement>Your wallet is connected</WizardPickerElement>;
});

export default WizardPicker;
