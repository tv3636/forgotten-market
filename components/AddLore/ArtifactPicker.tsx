import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { EmptyWell } from "../ui/EmptyWell";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import Button from "../ui/Button";
import Modal from "react-modal";
import { ModalDecorator } from "../ui/ModalDecorator";
import StyledModal from "./StyledModal";
import {
  FormField,
  TextInput,
  TextAreaAutosizeInput
} from "../../components/ui/Inputs";
import NFTDisplay from "../NFTDisplay";

// TODO: bg color extraction with colorthief
// https://lokeshdhakar.com/projects/color-thief/#getting-started

const ArtifactPickerModalElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  width: 100%;
  height: 100%;
`;

const ArtifactPickerFormContainer = styled.div`
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

// If you're testing, here are some Artifacts to try:
// A poem from Margret
// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/96577616716374093869564910580926487133870015185803080998328868057160295120897
// Magus Devon art from bread
// https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/58811179388067127948312763744960816539054544338312292935514425161264702423041
// Gremplin Remix of Marlo's Alien
// https://rarible.com/token/0x1adaac3daaae37496f9762671281544f912ebf48:10008?tab=details
function ArtifactPickerModal({ onRequestClose, onArtifactPicked }: any) {
  // onChange, debounce, e
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (inputUrl) {
      try {
        const url = new URL(inputUrl);
        const host = url.hostname;
        const path = url.pathname;

        if (host.match(/opensea/)) {
          const [nothing, assets, contractAddress, tokenId, ...rest] =
            path.split("/");
          if (contractAddress?.length > 0 && tokenId?.length > 0) {
            setInputError(null);
            setContractAddress(contractAddress);
            setTokenId(tokenId);
            onArtifactPicked({ contractAddress, tokenId });
          }
        } else if (host.match(/rarible/)) {
          const [nothing, token, contractTokenId, ...rest] = path.split("/");
          const [contractAddress, tokenId] = contractTokenId.split(":");
          if (contractAddress?.length > 0 && tokenId?.length > 0) {
            setInputError(null);
            setContractAddress(contractAddress);
            setTokenId(tokenId);
            onArtifactPicked({ contractAddress, tokenId });
          }
        } else {
          setInputError(`Unknown NFT host ${host}. Try using "advanced"`);
        }
      } catch (err) {
        setInputError("Invalid URL");
      }
    }
  }, [inputUrl]);

  return (
    <ArtifactPickerModalElement>
      <h1>Pick an Artifact</h1>
      <ArtifactPickerFormContainer>
        <h2>NFT URL</h2>
        <TextInput
          placeholder={"Enter an OpenSea or Rarible URL"}
          onChange={(evt) => {
            setInputUrl(evt?.target?.value);
          }}
        />
        <h3 onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? "v " : "> "}
          Advanced
        </h3>
        {showAdvanced && (
          <AdvancedContainer>
            <TextFieldLayout>
              <TextInput
                placeholder={"Enter a Contract Address"}
                value={contractAddress as string}
                onChange={(evt) => {
                  setContractAddress(evt?.target?.value);
                }}
              />
            </TextFieldLayout>
            <TextFieldLayout>
              <TextInput
                placeholder={"... and tokenId"}
                value={tokenId as string}
                onChange={(evt) => {
                  setTokenId(evt?.target?.value);
                }}
              />
            </TextFieldLayout>
          </AdvancedContainer>
        )}

        <NftDisplayContainer>
          {contractAddress && tokenId && (
            <NFTDisplay contractAddress={contractAddress} tokenId={tokenId} />
          )}
        </NftDisplayContainer>
        {inputError && <ErrorMessage>{inputError}</ErrorMessage>}
      </ArtifactPickerFormContainer>
      <Button onClick={onRequestClose}>Done</Button>
    </ArtifactPickerModalElement>
  );
}

type Props = {
  onArtifactPicked: (artifactConfiguration: ArtifactConfiguration) => void;
};

const ArtifactPickerElement = styled.div``;
const ArtifactPickerControls = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * Artifact Picker
 *
 * This component lets the user pick any existing NFT to represent the Artifact attached to this Wizard.
 *
 **/

export type ArtifactConfiguration = {
  contractAddress: string;
  tokenId: string;
};

export default function ArtifactPicker({ onArtifactPicked }: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);
  const [currentArtifact, setCurrentArtifact] =
    useState<ArtifactConfiguration | null>(null);

  const onArtifactModalPicked = (
    artifactConfiguration: ArtifactConfiguration
  ) => {
    setCurrentArtifact(artifactConfiguration);
    onArtifactPicked(artifactConfiguration);
  };

  return (
    <ArtifactPickerElement>
      <EmptyWell solid={currentArtifact ? true : false}>
        {currentArtifact && (
          <NFTDisplay
            contractAddress={currentArtifact.contractAddress}
            tokenId={currentArtifact.tokenId}
          />
        )}

        <ArtifactPickerControls>
          <Button onClick={() => setModalIsOpen(!modalIsOpen)}>
            Pick {currentArtifact ? "another" : "an"} Artifact NFT
          </Button>
          <StyledModal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <ArtifactPickerModal
              onRequestClose={closeModal}
              onArtifactPicked={onArtifactModalPicked}
            />
          </StyledModal>
        </ArtifactPickerControls>
      </EmptyWell>
    </ArtifactPickerElement>
  );
}
