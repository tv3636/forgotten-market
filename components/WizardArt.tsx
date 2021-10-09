import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import productionWizardData from "../data/nfts-prod.json";
import { ResponsiveImg, ResponsivePixelImg } from "./ResponsivePixelImg";
const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  wizard: string;
  url: string;
  pixelArt?: boolean;
};

const WizardArtWrapper = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${(props) => `#${props.color}`};
  margin: 1em 0;
  width: 100%;
  /* grid-column: 1 / 4; */ /* use this for full bleed */
  border-radius: 5px;
`;

const Original = styled.div`
  padding: 1em;
`;
const Derivative = styled.div`
  padding: 1em;
`;
const SideBySide = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Caption = styled.p`
  display: flex;
  font-size: 0.6em !important;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
`;

export default function WizardArt({ wizard, url, pixelArt = true }: Props) {
  const wd = wizData[wizard];
  const wizardTitle = `${wd.name} (#${wizard})`;
  const wizardImageUrl = `https://nftz.forgottenrunes.com/wizards/${wizard}.png`;
  // console.log("wd.background_color: ", wd.background_color);
  return (
    <WizardArtWrapper color={wd.background_color}>
      <h2>{wizardTitle}</h2>
      <SideBySide>
        <Original>
          <Caption>Original NFT</Caption>
          <ResponsivePixelImg src={wizardImageUrl} />
        </Original>
        <Derivative>
          <Caption>Artist Interpretation</Caption>
          <ResponsiveImg src={url} pixelArt={pixelArt} />
        </Derivative>
      </SideBySide>
    </WizardArtWrapper>
  );
}
