import * as React from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import { WriteButton } from "./BookOfLoreControls";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import { IPFS_SERVER } from "../../constants";
import { loreTextStyles } from "./loreStyles";
import { getContrast } from "../../lib/colorUtils";
import { isNumber } from "lodash";

const wizData = productionWizardData as { [wizardId: string]: any };

export const TextPage = styled.div<{
  alignSelf?: string;
  alignChildren?: string;
}>`
  color: #e1decd;
  font-size: 24px;
  overflow: scroll;
  padding: 1em;
  font-family: "Alagard", serif;
  align-self: ${(props) => props.alignSelf || "flex-start"};

  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;

  ${(props) => {
    if (props.alignChildren === "center") {
      return `
      align-items: center;
      /* height: 100%; */
      min-height: 100%;
      justify-content: center;
      `;
    }
  }}

  width: 100%;
  ${loreTextStyles};

  img {
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
`;

const LoadingPageText = styled.div``;

type BookOfLorePageProps = {
  bg: string;
  children: any;
};

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

export function BookOfLorePage({ bg, children }: BookOfLorePageProps) {
  return <BookOfLorePageWrapper bg={bg}>{children}</BookOfLorePageWrapper>;
}

export const CoreWizardPage = ({ wizardId }: { wizardId: string }) => {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  return (
    <BookOfLorePage bg={bg}>
      <ResponsivePixelImg
        src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
        style={{ maxWidth: "480px" }}
      />
    </BookOfLorePage>
  );
};

export const EmptyLorePage = ({
  wizardNum,
  pageNum,
}: {
  wizardNum: number;
  pageNum: number;
}) => {
  const furtherOrAny = pageNum < 1 ? "" : " further";

  const noMoreLore = isNumber(wizardNum)
    ? `No${furtherOrAny} Lore has been recorded for ${
        wizData[wizardNum.toString()].name
      }...`
    : `No${furtherOrAny} Lore has been recorded...`;

  return (
    <BookOfLorePage bg={"#000000"}>
      <TextPage alignSelf="center" alignChildren="center">
        <ReactMarkdown>{noMoreLore}</ReactMarkdown>
        <Link href="/lore/add">
          <WriteButton size="medium">Write Your Lore</WriteButton>
        </Link>
      </TextPage>
    </BookOfLorePage>
  );
};

export default function IndividualLorePage({
  bgColor,
  title,
  story,
}: {
  bgColor: string;
  title?: string;
  story?: string;
}) {
  const textColor = getContrast(bgColor ?? "#000000");
  const Inner = (
    <TextPage style={{ color: textColor }}>
      {story && (
        <ReactMarkdown
          transformImageUri={(src: string, alt: string, title) => {
            if (src.startsWith("ipfs://")) {
              src = src.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
            } else if (src.startsWith("data")) {
              return src;
            }
            return uriTransformer(src);
          }}
        >
          {/* Markdown needs two spaces before a \n for line break but our editor doesn't do this if you c/p content into it... */}
          {story.replace(/[^\s]+\n/gi, "  \n")}
        </ReactMarkdown>
      )}
    </TextPage>
  );

  return <BookOfLorePage bg={bgColor}>{Inner}</BookOfLorePage>;
}
