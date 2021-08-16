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
import Button from "../ui/Button";
import Modal from "react-modal";
import { ModalDecorator } from "../ui/ModalDecorator";
import StyledModal from "./StyledModal";
import {
  FormField,
  TextInput,
  TextAreaAutosizeInput
} from "../../components/ui/Inputs";
import WizardDiv from "../WizardDiv";
import WizardCard from "../WizardCard";
import productionWizardData from "../../data/nfts-prod.json";

const wizData = productionWizardData as { [wizardId: string]: any };

const WizardPickerModalElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  width: 100%;
  height: 100%;
`;

const WizardPickerFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 1em 0em 1em 0em;
  margin-bottom: 2em;
`;

const ErrorMessage = styled.div`
  color: red;
  padding: 1.5em 0;
`;

const NftDisplayContainer = styled.div`
  width: 100%;
  margin: 2em 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdvancedContainer = styled.div`
  width: 100%;
`;
const TextFieldLayout = styled.div`
  margin: 0.5em 0;
`;

function NotConnected() {
  return (
    <div>
      <ConnectWalletButton />
    </div>
  );
}

function WizardList(props: any) {
  const [wizards, setWizards] = useState([]);

  useEffect(() => {
    async function run() {
      const tokens: any = [];
      try {
        const address = props.injectedProvider.provider.selectedAddress;
        const contract = getWizardsContract({ provider: props.injectedProvider });
        const result = await contract.tokensOfOwner(address);

        result.forEach((element: any) => {
          let thisWiz = wizData[Number(element._hex)];
          thisWiz['id'] = Number(element._hex).toString();
          tokens.push(thisWiz) 
        });
      } catch (err) {
        console.log("err: ", err);
      }
      setWizards(tokens);
    }
    run();
  });
  
  return (
    <WizardDiv wizards={wizards} onClick={props.onClick}/>
  );
}

function WizardPickerModal({ onRequestClose, onWizardPicked, injectedProvider }: any) {
  // onChange, debounce, e
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (tokenId) {
      console.log(tokenId);
    }
  }, [inputUrl]);

  return (
    <WizardPickerModalElement>
      <h1>Pick a Wizard</h1>
      <WizardPickerFormContainer>
        <WizardList injectedProvider={injectedProvider} onClick={onWizardPicked}/>
      </WizardPickerFormContainer>
      <Button onClick={onRequestClose}>Done</Button>
    </WizardPickerModalElement>
  );
}

type Props = {
  onWizardPicked: (WizardConfiguration: WizardConfiguration) => void;
};

const WizardPickerElement = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

/**
 * Wizard Picker
 *
 * This component lets the user pick a Wizard to attach lore to.
 *
 **/

export type WizardConfiguration = {
  tokenId: string;
  name: string;
};

const WizardPicker = observer(({}: Props) => {
  const { web3Settings } = useMst();
  const walletConnected = web3Settings.connected;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);
  const [currentWizard, setCurrentWizard] =
    useState<WizardConfiguration | null>(null);

  const onWizardModalPicked = (
    WizardConfiguration: WizardConfiguration
  ) => {
    setCurrentWizard(WizardConfiguration);
  };

  if (!walletConnected) {
    return (
      <EmptyWell>
        <NotConnected />
      </EmptyWell>
    );
  }

  function wizardPicked(tokenId: string, name: string) {
    onWizardModalPicked({tokenId, name});
  }

  return (
    <WizardPickerElement>
      <EmptyWell solid={currentWizard ? true : false}>
        {currentWizard && (
          <WizardCard
            id={currentWizard.tokenId}
            name={currentWizard.name}
          />
        )}

          <Button onClick={() => setModalIsOpen(!modalIsOpen)}>
            Pick {currentWizard ? "another" : "a"} Wizard
          </Button>
          <StyledModal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <WizardPickerModal
              onRequestClose={closeModal}
              onWizardPicked={wizardPicked}
              injectedProvider={web3Settings.injectedProvider}
            />
          </StyledModal>
      </EmptyWell>
    </WizardPickerElement>
  );
});

export default WizardPicker;
