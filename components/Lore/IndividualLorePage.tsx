import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { Lore } from "./types";
import productionWizardData from "../../data/nfts-prod.json";
import ReactMarkdown from "react-markdown";
import { WriteButton } from "./BookOfLoreControls";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
const wizData = productionWizardData as { [wizardId: string]: any };

const TextPage = styled.div<{ alignSelf?: string; alignChildren?: string }>`
  color: #e1decd;
  font-size: 24px;
  overflow: scroll;
  padding: 1em;
  font-family: "Alagard", serif;
  align-self: ${(props) => props.alignSelf || "flex-start"};
  ${(props) => {
    if (props.alignChildren === "center") {
      return `
      display: flex;
      flex-direction: column;
      align-items: center;
      `;
    }
  }}
`;

type BookOfLorePageProps = {
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
`;

export function BookOfLorePage({
  bg,
  wizardId,
  page,
  lore,
  layoutId,
  children
}: BookOfLorePageProps) {
  return (
    <BookOfLorePageWrapper
      bg={bg}
      // layoutId={layoutId}
      // initial={{ rotateY: 0 }}
      // animate={{ rotateY: -180, left: "calc(-100% - 8vw - 4px)" }}
      // transition={{ duration: 1 }}
    >
      {children}
    </BookOfLorePageWrapper>
  );
}

export const CoreWizardPage = ({ wizardId }: { wizardId: string }) => {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  return (
    <BookOfLorePage
      wizardId={wizardId}
      page={0}
      bg={bg}
      // layoutId={`page-${wizardId}-core`}
    >
      <ResponsivePixelImg
        src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
        style={{ maxWidth: "480px" }}
      />
    </BookOfLorePage>
  );
};

type Props = {
  wizardId: number;
  lore?: Lore;
  page: number;
};
export default function IndividualLorePage({ wizardId, lore, page }: Props) {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;
  const text = lore?.story || "";
  let layoutId = `page-${wizardId}-${lore?.id || "x"}`;
  // console.log("lore: ", lore);

  let Inner = <div />;
  if (!lore) {
    layoutId = `page-${wizardId}-${"none"}`;
    const noLore = `No further Lore for ${wizardData.name} has been recorded...`;
    Inner = (
      <TextPage alignSelf="center" alignChildren="center">
        <ReactMarkdown>{noLore}</ReactMarkdown>
        <Link href="/lore/add" passHref={true}>
          <WriteButton size="medium">Write Your Lore</WriteButton>
        </Link>
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
    <BookOfLorePage
      wizardId={wizardId.toString()}
      page={page}
      bg={bg}
      lore={lore}
      // key={layoutId}
      // layoutId={layoutId}
    >
      {Inner}
    </BookOfLorePage>
  );
}
