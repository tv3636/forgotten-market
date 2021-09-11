import * as React from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import ReactMarkdown from "react-markdown";
import { WriteButton } from "./BookOfLoreControls";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import useSWR from "swr";
import { find } from "lodash";

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

  h1,h2,h3,h4,h5 {
    margin-top: 0.5em;
  }
`;

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const EmptyLorePage = ({ wizardId }: { wizardId?: number }) => {
  const noMoreLore = wizardId
    ? `No further Lore has been recorded for ${
        wizData[wizardId.toString()].name
      }...`
    : `No further Lore has been recorded...`;

  return (
    <BookOfLorePage bg={"black"}>
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
  loreMetadataURI
}: {
  loreMetadataURI: string;
}) {
  const { data, error } = useSWR(
    `https://cloudflare-ipfs.com/ipfs/${
      loreMetadataURI?.match(/^ipfs:\/\/(.*)$/)?.[1]
    }`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>loading...</div>;

  // {
  //   name: "Such lore",
  //   description: "Much wow",
  //   background_color: "#639b67",
  //   attributes: [
  //     {
  //       trait_type: "Artifact Address",
  //       value: "0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42",
  //     },
  //     { trait_type: "Artifact Token ID", value: "283" },
  //     { trait_type: "Pixel Art", value: false },
  //   ],
  // };

  const bg = data.background_color;
  const story = data?.description || "";
  const title = data?.name || "";
  const artifactAddress: string = find(data?.attributes || [], {
    trait_type: "Artifact Address"
  })?.value;
  const artifactTokenId: string = find(data?.attributes || [], {
    trait_type: "Artifact Token ID"
  })?.value;
  const pixelArt: boolean =
    find(data?.attributes || [], {
      trait_type: "Pixel Art"
    })?.value ?? false;

  // let layoutId = `page-${wizardId}-${loreMetadataURI}`;
  // console.log("lore: ", lore);

  let Inner = <div />;

  if (story) {
    Inner = (
      <TextPage>
        <ReactMarkdown>{title}</ReactMarkdown>
        <ReactMarkdown>{story}</ReactMarkdown>
      </TextPage>
    );
  }

  if (artifactAddress) {
    //TODO:
    Inner = <h1 style={{ color: "white" }}>An artifact lives here</h1>;
  }

  if (!artifactAddress && !story) {
    Inner = (
      <h1 style={{ color: "white" }}>
        This is just bad testing lore that has no story or artifact...
      </h1>
    );
  }

  return <BookOfLorePage bg={bg}>{Inner}</BookOfLorePage>;
}
