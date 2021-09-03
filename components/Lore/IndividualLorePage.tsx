import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { Lore } from "./types";
import productionWizardData from "../../data/nfts-prod.json";
import BookOfLorePage from "./BookOfLorePage";
import ReactMarkdown from "react-markdown";
const wizData = productionWizardData as { [wizardId: string]: any };

const TextPage = styled.div`
  color: #e1decd;
  font-size: 24px;
  overflow: scroll;
  padding: 1em;
  font-family: "Alagard", serif;
  align-self: flex-start;
`;

const IndividualLorePageWrapper = styled.div``;

type Props = {
  wizardId: number;
  lore?: Lore;
};
export default function IndividualLorePage({ wizardId, lore }: Props) {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;
  const text = lore?.story || "";
  console.log("lore: ", lore);

  let Inner = <div />;
  if (!lore) {
    const noLore = `No further Lore for ${wizardData.name} has been recorded. Write The Lore button`;
    Inner = (
      <TextPage>
        <ReactMarkdown>{noLore}</ReactMarkdown>
      </TextPage>
    );
  }

  if (text) {
    Inner = (
      <TextPage>
        <ReactMarkdown>{text}</ReactMarkdown>
      </TextPage>
    );
  }

  return (
    <BookOfLorePage wizardId={wizardId.toString()} page={0} bg={bg}>
      {Inner}
    </BookOfLorePage>
  );
}
