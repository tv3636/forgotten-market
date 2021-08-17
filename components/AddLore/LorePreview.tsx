import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import { ArtifactConfiguration } from "./ArtifactPicker";
import NFTDisplay from "../NFTDisplay";
import LoreMarkdown from "../Lore/LoreMarkdown";
import { WizardConfiguration } from "./WizardPicker";

type Props = {
  currentArtifact: ArtifactConfiguration | null;
  currentStory: string | null;
  currentTitle: string | null;
  currentBgColor?: string | null;
  currentWizard?: WizardConfiguration | null;
};

const LorePreviewElement = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

const EmptyPreviewStyles = styled.div`
  font-size: 24px;
  line-height: 1.6;
  padding: 1em 2em;
`;

const ParchmentBackground = styled.div<{ bgColor: string | null }>`
  font-family: "Alagard";
  word-break: break-word;
  color: #acacac;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${(props) => props.bgColor || "transparent"};

  ::before {
    content: "";
    background-image: url("/static/lore/book/paperTxt01.png");
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.2;
    z-index: -1;
  }
`;

const ParchmentLines = styled.div`
  ::before {
    content: "";
    background-image: url("/static/lore/book/page_border_horizontal.png");
    background-repeat: repeat-x;
    position: absolute;
    top: 4px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.8;
  }
  ::after {
    content: "";
    background-image: url("/static/lore/book/page_border_horizontal.png");
    background-repeat: repeat-x;
    background-position: bottom right;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 4px;
    left: 0px;
    opacity: 0.8;
  }
`;

const LoreStory = styled.div`
  p {
    font-size: 18px;
  }
`;

function ParchmentPage({
  bgColor,
  children
}: {
  bgColor: string | null;
  children: any;
}) {
  return (
    <ParchmentBackground bgColor={bgColor}>
      <ParchmentLines>{children}</ParchmentLines>
    </ParchmentBackground>
  );
}

const LorePreviewLayout = styled.div`
  padding: 1em;
`;

const LoreTitle = styled.h1`
  width: 100%;
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const WizardNameHeader = styled.div`
  position: relative;
  background-image: url("/static/lore/book/page_border_header_top.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 4em;
  color: black;
  margin-top: 4%;
  padding: 0 25%;
  text-align: center;
`;

export default function LorePreview({
  currentArtifact,
  currentTitle,
  currentStory,
  currentBgColor,
  currentWizard
}: Props) {
  const hasContent =
    currentTitle || currentStory || currentArtifact || currentWizard;

  return (
    <LorePreviewElement>
      <ParchmentPage bgColor={currentBgColor}>
        {currentWizard && (
          <WizardNameHeader>
            {currentWizard.name} (#{currentWizard.tokenId})
          </WizardNameHeader>
        )}
        <LorePreviewLayout>
          {!hasContent && (
            <EmptyPreviewStyles>
              Pick a Wizard and Artifact and a preview of your Lore will appear
              here
            </EmptyPreviewStyles>
          )}
          {currentTitle && <LoreTitle>{currentTitle}</LoreTitle>}
          {currentArtifact && (
            <NFTDisplay
              contractAddress={currentArtifact.contractAddress}
              tokenId={currentArtifact.tokenId}
            />
          )}
          {currentStory && (
            <LoreStory>
              <LoreMarkdown>{currentStory}</LoreMarkdown>
            </LoreStory>
          )}
        </LorePreviewLayout>
      </ParchmentPage>
    </LorePreviewElement>
  );
}
