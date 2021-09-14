import * as React from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import ReactMarkdown, { uriTransformer } from "react-markdown";
import { WriteButton } from "./BookOfLoreControls";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import useSWR from "swr";
import { IPFS_SERVER } from "../../constants";

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
      height: 100%;
      justify-content: center;
      `;
    }
  }}

  h1,h2,h3,h4,h5 {
    margin-top: 0.5em;
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const EmptyLorePage = ({
  wizardId,
  pageNum,
}: {
  wizardId?: number;
  pageNum: number;
}) => {
  const furtherOrAny = pageNum < 1 ? "" : " further";

  const noMoreLore = wizardId
    ? `No${furtherOrAny} Lore has been recorded for ${
        wizData[wizardId.toString()].name
      }...`
    : `No${furtherOrAny} Lore has been recorded...`;

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
  loreMetadataURI,
}: {
  loreMetadataURI: string;
}) {
  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI?.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;
  console.log("ipfsURL: ", ipfsURL);
  const { data, error } = useSWR(ipfsURL, fetcher);

  if (error)
    return (
      <BookOfLorePage bg={"#000000"}>
        <TextPage alignChildren={"center"}>
          Sorry, this page failed to load. Everything might be okay, just
          refresh and try again.
        </TextPage>
      </BookOfLorePage>
    );
  if (!data)
    // TODO: retry here
    return (
      <BookOfLorePage bg={"#000000"}>
        <TextPage alignChildren={"center"}>
          <LoadingPageText>
            Your Lore has been written and is now being indexed. It will show up
            here in a couple of minutes.
          </LoadingPageText>
        </TextPage>
      </BookOfLorePage>
    );

  const bg = data.background_color;
  const story = data?.description || "";
  const title = data?.name || "";

  let Inner = <div />;

  if (story) {
    Inner = (
      <TextPage>
        {title && <ReactMarkdown>{title}</ReactMarkdown>}
        {story && (
          <ReactMarkdown
            transformImageUri={(src: string, alt: string, title) => {
              if (src.startsWith("ipfs://")) {
                src = src.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
              }
              return uriTransformer(src);
            }}
          >
            {story}
          </ReactMarkdown>
        )}
      </TextPage>
    );
  }

  return <BookOfLorePage bg={bg}>{Inner}</BookOfLorePage>;
}
