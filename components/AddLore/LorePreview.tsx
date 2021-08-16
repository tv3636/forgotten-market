import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EmptyWell } from "../ui/EmptyWell";
import { ArtifactConfiguration } from "./ArtifactPicker";

type Props = { currentArtifact: ArtifactConfiguration };

const LorePreviewElement = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;

const EmptyPreviewStyles = styled.div`
  font-family: "Alagard";
  color: #acacac;
  font-size: 24px;
  line-height: 1.6;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 60px;
  flex-direction: column;
`;

const ParchmentBackground = styled.div`
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
    top: 0px;
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
    bottom: 0px;
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

export default function LorePreview({ currentArtifact }: Props) {
  return (
    <LorePreviewElement>
      <ParchmentPage>
        <EmptyPreviewStyles>
          Pick a Wizard and Artifact and a preview of your Lore will appear here
        </EmptyPreviewStyles>
      </ParchmentPage>
    </LorePreviewElement>
  );
}
