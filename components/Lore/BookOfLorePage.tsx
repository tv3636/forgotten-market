import * as React from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import PageHorizontalBreak from "../../components/PageHorizontalBreak";
import productionWizardData from "../../data/nfts-prod.json";
import { motion } from "framer-motion";
import { Lore } from "./types";

const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  bg: string;
  wizardId: string;
  page: number;
  children: any;
  layoutId?: string;
  lore?: Lore;
};

// const BookOfLorePageWrapper = styled.div<{ bg?: string }>`
const BookOfLorePageWrapper = styled(motion.div)<{ bg?: string }>`
  background-color: ${(props) => props.bg || "#000000"};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;

  // Ties to Book
  height: calc(100% + 96px);
  margin: -75px -14px 0 -14px;

  @media (max-width: 768px) {
    height: calc(100% + 23px);
    margin: 0px -14px 0 -14px;
  }

  /* padding: 1em 0; */
`;

export default function BookOfLorePage({
  bg,
  wizardId,
  page,
  lore,
  layoutId,
  children
}: Props) {
  console.log("layoutId: ", layoutId);
  return (
    <BookOfLorePageWrapper bg={bg} layoutId={layoutId}>
      {children}
    </BookOfLorePageWrapper>
  );
}
