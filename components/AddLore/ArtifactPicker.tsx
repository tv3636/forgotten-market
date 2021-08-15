import * as React from "react";
import { useState } from "react";
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

function ArtifactPickerModal({ onRequestClose }: any) {
  return (
    <ArtifactPickerModalElement>
      <h1>Pick an Artifact</h1>
      <ArtifactPickerFormContainer>
        <h2>NFT URL</h2>
        <TextInput placeholder={"Enter an OpenSea or Rarible URL"} />
      </ArtifactPickerFormContainer>
      <Button onClick={onRequestClose}>Done</Button>
    </ArtifactPickerModalElement>
  );
}

type Props = {};

const ArtifactPickerElement = styled.div``;

/**
 * Artifact Picker
 *
 * This component lets the user pick any existing NFT to represent the Artifact attached to this Wizard.
 *
 **/

export default function ArtifactPicker({}: Props) {
  const haveArtifact = false;
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const closeModal = () => setModalIsOpen(false);

  if (!haveArtifact) {
    return (
      <EmptyWell>
        <div>
          <Button onClick={() => setModalIsOpen(!modalIsOpen)}>
            Pick an Artifact NFT
          </Button>
          <StyledModal isOpen={modalIsOpen} onRequestClose={closeModal}>
            <ArtifactPickerModal onRequestClose={closeModal} />
          </StyledModal>
        </div>
      </EmptyWell>
    );
  }

  return <ArtifactPickerElement>hello</ArtifactPickerElement>;
}
