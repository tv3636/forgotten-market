import * as React from "react";
import { useEffect } from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "../ui/Button";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import { LoreNameWrapper } from "./BookSharedComponents";

const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  loreTokenSlug: string;
  tokenId: number;
  nextPageRoute: string | null;
  previousPageRoute: string | null;
};

const BookOfLoreControlsElement = styled.div`
  position: relative;
  margin: 10px 40px; // this x-margin should match the outer container of Book.tsx
  padding: 10px 10px;
  padding-bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const WriteContainer = styled.div`
  position: absolute;
  right: 0px;
  top: 10px;

  @media (max-width: 768px) {
    position: relative;
  }
`;

const PreviousPageContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 1em;
`;
const NextPageContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
`;

export const WriteButton = styled(Button)`
  background-color: #27222f;
  border-radius: 5px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoPageSpacer = styled.div`
  width: 12px;
  display: block;
`;

const SocialContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 15px;
  }
`;

const SocialItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4em;
`;

const LoreSocialContainer = ({
  loreTokenSlug,
  tokenId,
}: {
  loreTokenSlug: string;
  tokenId: number;
}) => {
  if (loreTokenSlug === "narrative") {
    return null;
  }

  const wizardData: any = wizData[tokenId.toString()];
  const url = typeof window !== "undefined" ? window?.location?.href : "";

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `The Lore of ${wizardData.name} (#${tokenId})`
  )}&url=${encodeURIComponent(url)}`;

  return (
    <SocialContainer>
      <SocialItem>
        <a
          href={`https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/${tokenId}`}
          className="icon-link"
          target="_blank"
        >
          <ResponsivePixelImg src="/static/img/icons/social_opensea_default_w.png" />
        </a>
      </SocialItem>
      <SocialItem>
        <a href={tweetUrl} className="icon-link" target="_blank">
          <ResponsivePixelImg src="/static/img/icons/social_twitter_default_w.png" />
        </a>
      </SocialItem>
    </SocialContainer>
  );
};
export default function BookOfLoreControls({
  loreTokenSlug,
  tokenId,
  nextPageRoute,
  previousPageRoute,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (nextPageRoute) router.prefetch(nextPageRoute);
    if (previousPageRoute) router.prefetch(previousPageRoute);
  }, []);

  useHotkeys(
    "left",
    () => {
      if (previousPageRoute) {
        router.push(previousPageRoute);
      }
      return true;
    },
    [previousPageRoute, router]
  );

  useHotkeys(
    "right",
    () => {
      if (nextPageRoute) {
        router.push(nextPageRoute);
      }
      return true;
    },
    [nextPageRoute, router]
  );

  return (
    <BookOfLoreControlsElement>
      <LoreSocialContainer loreTokenSlug={loreTokenSlug} tokenId={tokenId} />

      <PaginationContainer>
        <PreviousPageContainer>
          {previousPageRoute ? (
            <Link href={previousPageRoute} passHref>
              <a>
                <Image
                  src={"/static/lore/book/arrow_L.png"}
                  width={"12px"}
                  height={"25px"}
                />
              </a>
            </Link>
          ) : (
            <NoPageSpacer />
          )}
        </PreviousPageContainer>
        <LoreNameWrapper layout layoutId="wizardName">
          {loreTokenSlug === "wizards"
            ? `${wizData[tokenId.toString()].name} (#${tokenId})`
            : "Narrative Page"}
        </LoreNameWrapper>
        <NextPageContainer>
          {nextPageRoute ? (
            <Link href={nextPageRoute} passHref>
              <a>
                <Image
                  src={"/static/lore/book/arrow_R.png"}
                  width={"12px"}
                  height={"25px"}
                />
              </a>
            </Link>
          ) : (
            <NoPageSpacer />
          )}
        </NextPageContainer>
      </PaginationContainer>
      <WriteContainer>
        <Link href="/lore/add" passHref={true}>
          <WriteButton size="medium">Write Your Lore</WriteButton>
        </Link>
      </WriteContainer>
    </BookOfLoreControlsElement>
  );
}
