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

const ArtifactPickerModalElement = styled.div``;

function ArtifactPickerModal({ onRequestClose }: any) {
  return (
    <ArtifactPickerModalElement>
      <h1>Pick an Artifact</h1>
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
