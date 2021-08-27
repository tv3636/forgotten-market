import * as React from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import PageHorizontalBreak from "../../components/PageHorizontalBreak";
import productionWizardData from "../../data/nfts-prod.json";
import { Box } from "rebass";

const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  bg: string;
  wizardId: string;
  page: string;
  children: any;
};

const BookOfLorePageWrapper = styled.div<{ bg?: string }>`
  background-color: ${(props) => props.bg || "#000000"};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function BookOfLorePage({
  bg,
  wizardId,
  page,
  children
}: Props) {
  return <BookOfLorePageWrapper bg={bg}>{children}</BookOfLorePageWrapper>;
}
