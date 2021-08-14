import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import Button from "../ui/Button";

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

  if (!haveArtifact) {
    return (
      <EmptyWell>
        <div>
          <Button>Pick an Artifact NFT</Button>
        </div>
      </EmptyWell>
    );
  }

  return <ArtifactPickerElement>hello</ArtifactPickerElement>;
}
