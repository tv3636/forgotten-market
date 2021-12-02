import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import {
  CHARACTER_CONTRACTS,
  getSoulsContract,
  getWizardsContract,
} from "../../contracts/ForgottenRunesWizardsCultContract";
import Button from "../ui/Button";
import StyledModal from "./StyledModal";
import WizardCard from "../WizardCard";
import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";

import { BigNumber } from "ethers";
import { useEthers } from "@usedapp/core";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

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

function NotConnected() {
  return (
    <div>
      <ConnectWalletButton />
    </div>
  );
}

const WizardGridElement = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const WizardGridLayout = styled.div`
  display: grid;
  grid-gap: 5px;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  font-size: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    font-size: 10px;
  }
`;

const NoWizards = styled.div`
  font-family: "Alagard";
  font-size: 1.5em;
`;

export type onWizardPickedFn = (
  wizardConfiguration: WizardConfiguration
) => void;

function WizardGrid({
  tokens,
  onWizardPicked,
}: {
  tokens: { [tokenAddress: string]: any[] };
  onWizardPicked: onWizardPickedFn;
}) {
  console.log(tokens);
  console.log(CHARACTER_CONTRACTS);
  return (
    <WizardGridElement>
      <WizardGridLayout>
        {(tokens?.[CHARACTER_CONTRACTS.wizards] ?? []).map((token: any) => {
          return (
            <WizardCard
              key={"wizards-" + token.id}
              tokenAddress={CHARACTER_CONTRACTS.wizards}
              id={token.id}
              name={token.name}
              onWizardPicked={onWizardPicked}
            />
          );
        })}
        {(tokens?.[CHARACTER_CONTRACTS.souls] ?? []).map((token: any) => {
          return (
            <WizardCard
              key={"souls-" + token.id}
              tokenAddress={CHARACTER_CONTRACTS.souls}
              id={token.id}
              name={token?.name ?? token.id}
              onWizardPicked={onWizardPicked}
            />
          );
        })}
      </WizardGridLayout>
      {tokens?.[CHARACTER_CONTRACTS.souls]?.length === 0 &&
        tokens?.[CHARACTER_CONTRACTS.wizards]?.length === 0 && (
          <NoWizards>
            The connected wallet doesn't hold any Wizards or Souls. Perhaps try
            another wallet?
          </NoWizards>
        )}
    </WizardGridElement>
  );
}

function WizardList({
  injectedProvider,
  onWizardPicked,
}: {
  injectedProvider: any;
  onWizardPicked: onWizardPickedFn;
}) {
  const [tokens, setTokens] = useState<{ [tokenAddress: string]: any[] }>({});

  useEffect(() => {
    async function run() {
      console.log("getting characters");
      try {
        const address = injectedProvider.provider.selectedAddress;
        const wizardsContract = await getWizardsContract({
          provider: injectedProvider,
        });
        const wizardTokens = await wizardsContract.tokensOfOwner(address);

        const soulsContract = await getSoulsContract({
          provider: injectedProvider,
        });

        const soulsTokens = await soulsContract.tokensOfOwner(address);

        setTokens({
          [wizardsContract.address.toLowerCase()]: wizardTokens.map(
            (id: BigNumber) => ({
              ...wizData[id.toNumber()],
              ["id"]: id.toNumber().toString(),
            })
          ),
          [soulsContract.address.toLowerCase()]: soulsTokens.map(
            (id: BigNumber) => ({
              ...soulsData[id.toNumber()],
              id: id.toNumber().toString(),
            })
          ),
        });
      } catch (err) {
        console.log("err: ", err);
      }
    }
    run();
  });

  return <WizardGrid tokens={tokens} onWizardPicked={onWizardPicked} />;
}

function WizardPickerModal({
  onRequestClose,
  onWizardPicked,
  injectedProvider,
}: any) {
  return (
    <WizardPickerModalElement>
      <h1>Pick a Character</h1>
      <WizardPickerFormContainer>
        <WizardList
          injectedProvider={injectedProvider}
          onWizardPicked={onWizardPicked}
        />
      </WizardPickerFormContainer>
      <Button onClick={onRequestClose}>Done</Button>
    </WizardPickerModalElement>
  );
}

type Props = {
  currentWizard?: WizardConfiguration;
  setCurrentWizard: (WizardConfiguration: WizardConfiguration) => void;
};

const WizardPickerElement = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-height: 100%;
`;

const StyledPickWizardButton = styled(Button)`
  margin-top: 1em;
  cursor: pointer;
`;

/**
 * Wizard Picker
 *
 * This component lets the user pick a Wizard to attach lore to.
 *
 **/

export type WizardConfiguration = {
  tokenAddress: string;
  tokenId: string;
  name: string;
};

const WizardPicker = ({ currentWizard, setCurrentWizard }: Props) => {
  const { library, account } = useEthers();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);

  const onWizardModalPicked = (wizardConfiguration: WizardConfiguration) => {
    setCurrentWizard(wizardConfiguration);
  };

  if (!account) {
    return (
      <EmptyWell>
        <NotConnected />
      </EmptyWell>
    );
  }

  function wizardPicked(wizardConfiguration: WizardConfiguration) {
    onWizardModalPicked(wizardConfiguration);
    closeModal();
  }

  return (
    <WizardPickerElement>
      <EmptyWell noBorder={currentWizard ? true : false}>
        {currentWizard && (
          <WizardCard
            tokenAddress={currentWizard.tokenAddress}
            id={currentWizard.tokenId}
            name={currentWizard.name}
          />
        )}
        {!currentWizard && (
          <StyledPickWizardButton onClick={() => setModalIsOpen(!modalIsOpen)}>
            Pick {currentWizard ? "another" : "a"} character
          </StyledPickWizardButton>
        )}
        <StyledModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
        >
          <WizardPickerModal
            onRequestClose={closeModal}
            onWizardPicked={wizardPicked}
            injectedProvider={library}
          />
        </StyledModal>
      </EmptyWell>
    </WizardPickerElement>
  );
};

export default WizardPicker;
