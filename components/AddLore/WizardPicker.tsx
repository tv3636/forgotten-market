import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";

type Props = {};

const WizardPickerElement = styled.div``;

function NotConnected() {
  return (
    <div>
      <ConnectWalletButton />
    </div>
  );
}

export default function WizardPicker({}: Props) {
  const walletConnected = false;

  if (!walletConnected) {
    return (
      <EmptyWell>
        <NotConnected />
      </EmptyWell>
    );
  }

  return <WizardPickerElement>hello</WizardPickerElement>;
}
