import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { getWizardsContract } from "../../contracts/ForgottenRunesWizardsCultContract";
import WizardDiv from "../WizardDiv";
import productionWizardData from "../../data/nfts-prod.json";


type Props = {};

const WizardPickerElement = styled.div``;
const wizData = productionWizardData as { [wizardId: string]: any };

function NotConnected() {
  return (
    <div>
      <ConnectWalletButton />
    </div>
  );
}

async function getWizards(injectedProvider: any) {
    const address = injectedProvider.provider.selectedAddress;
    const contract = getWizardsContract({ provider: injectedProvider });
    const result = await contract.tokensOfOwner(address);
    const tokens: any = [];

    result.forEach((element: any) => {
      let thisWiz = wizData[Number(element._hex)];
      thisWiz['id'] = Number(element._hex).toString();
      tokens.push(thisWiz) 
    });
    
    return tokens;
}

function WizardSelection(props: any) {
  const [wizards, setWizards] = useState([]);

  useEffect(() => {
    async function run() {
      const tokens = await getWizards(props.injectedProvider);
      setWizards(tokens);
    }
    run();
  });
  
  return (
    <WizardDiv wizards={wizards}/>
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

  const injectedProvider = web3Settings.injectedProvider;

  if (injectedProvider) {
    return <WizardPickerElement><WizardSelection injectedProvider={injectedProvider}/></WizardPickerElement>;
  } else {
    return <WizardPickerElement></WizardPickerElement>;
  }
  
});

export default WizardPicker;
