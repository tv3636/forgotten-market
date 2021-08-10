import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  wizardId: string;
  page: string;
};

const BookOfLoreControlsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  gap: 0px 0px;
  margin-top: 1em;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function BookOfLorePaginator({}: {}) {}

export default function BookOfLoreControls({ wizardId, page }: Props) {
  const wizardData: any = wizData[wizardId.toString()];

  return (
    <BookOfLoreControlsWrapper>
      <div>{/* Socials */}</div>
      <PaginationWrapper>pages</PaginationWrapper>
      <div>{/* more */}</div>
    </BookOfLoreControlsWrapper>
  );
}
