import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import { ArtifactConfiguration } from "./ArtifactPicker";
import NFTDisplay from "../NFTDisplay";
import LoreMarkdown from "../Lore/LoreMarkdown";

type Props = {
  currentArtifact: ArtifactConfiguration | null;
  currentStory: string | null;
  currentTitle: string | null;
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

const ParchmentBackground = styled.div`
  font-family: "Alagard";
  word-break: break-word;
  color: #acacac;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ::before {
    content: "";
    background-image: url("/static/lore/book/paperTxt01.png");
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.2;
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
  }
`;

function ParchmentPage({ children }: { children: any }) {
  return (
    <ParchmentBackground>
      <ParchmentLines>{children}</ParchmentLines>
    </ParchmentBackground>
  );
}

const LorePreviewLayout = styled.div`
  padding: 1em;
`;

export default function LorePreview({
  currentArtifact,
  currentTitle,
  currentStory
}: Props) {
  const hasContent = currentTitle || currentStory || currentArtifact;

  return (
    <LorePreviewElement>
      <ParchmentPage>
        <LorePreviewLayout>
          {!hasContent && (
            <EmptyPreviewStyles>
              Pick a Wizard and Artifact and a preview of your Lore will appear
              here
            </EmptyPreviewStyles>
          )}
          {currentTitle && <h1>{currentTitle}</h1>}
          {currentStory && <LoreMarkdown>{currentStory}</LoreMarkdown>}
          {currentArtifact && (
            <NFTDisplay
              contractAddress={currentArtifact.contractAddress}
              tokenId={currentArtifact.tokenId}
            />
          )}
        </LorePreviewLayout>
      </ParchmentPage>
    </LorePreviewElement>
  );
}
