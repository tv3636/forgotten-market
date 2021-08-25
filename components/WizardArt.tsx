import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import productionWizardData from "../data/nfts-prod.json";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  wizard: string;
  url: string;
};

const WizardArtWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Original = styled.div`
  padding: 1em;
`;
const Derivative = styled.div`
  padding: 1em;
`;
const SideBySide = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export default function WizardArt({ wizard, url }: Props) {
  const wd = wizData[wizard];
  const wizardTitle = `${wd.name} (#${wizard})`;
  const wizardImageUrl = `https://nftz.forgottenrunes.com/wizards/${wizard}.png`;
  return (
    <WizardArtWrapper>
      <h2>{wizardTitle}</h2>
      <SideBySide>
        <Original>
          <ResponsivePixelImg src={wizardImageUrl} />
        </Original>
        <Derivative>
          <ResponsivePixelImg src={url} />
        </Derivative>
      </SideBySide>
    </WizardArtWrapper>
  );
}
