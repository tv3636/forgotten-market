import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import useProvider from "../../hooks/useProvider";
import useUserAddress from "../../hooks/UserAddress";
import { getWizardsContract } from "../../contracts/ForgottenRunesWizardsCultContract";

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
  const injectedProvider = web3Settings.injectedProvider;
  const userAddress = useUserAddress(injectedProvider);

  useEffect(() => {
    const run = async () => {
      const contract = getWizardsContract({ provider: injectedProvider });
      const tokenIndexes = await contract.tokensOfOwner(userAddress);
      console.log("tokenIndexes: ", tokenIndexes);
    };
    if (userAddress) {
      run();
    }
  }, [userAddress]);

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
