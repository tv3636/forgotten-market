import * as React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "../ui/Button";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import { LoreNameWrapper } from "./BookSharedComponents";

import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";
import { useEthers } from "@usedapp/core";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { CHARACTER_CONTRACTS } from "../../contracts/ForgottenRunesWizardsCultContract";
import { Flex } from "rebass";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

type Props = {
  loreTokenSlug: "wizards" | "souls";
  tokenId: number;
  nextPageRoute: string | null;
  previousPageRoute: string | null;
  leftPageLoreIndex?: number;
  rightPageLoreIndex?: number;
  leftPageCreator?: string;
  rightPageCreator?: string;
};

const BookOfLoreControlsElement = styled.div`
  position: relative;
  margin: 10px 40px; // this x-margin should match the outer container of Book.tsx
  padding: 10px 10px;
  padding-bottom: 10px;
  display: grid;
  grid-template-columns: 20% 60% 20%;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
const WriteContainer = styled.div`
  //position: absolute;
  //right: 0px;
  //top: 10px;
  //
  //@media (max-width: 768px) {
  //  position: relative;
  //}
  padding-bottom: 12px;
  display: flex;
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
  //position: absolute;
  //left: 0px;
  //top: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;

  //@media (max-width: 768px) {
  //  position: relative;
  //  top: 0;
  //  margin-bottom: 15px;
  //}
`;

export const SocialItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4em;

  a:hover {
    opacity: 0.5;
    transition: all 100ms;
  }

  a:active {
    opacity: 0.3;
  }

  .gm-img {
    height: 30px;
    width: 33px;
  }
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

  const data: any =
    loreTokenSlug == "wizards"
      ? wizData[tokenId.toString()]
      : soulsData?.[tokenId.toString()] ?? {};
  const url = typeof window !== "undefined" ? window?.location?.href : "";

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `The Lore of ${data?.name ?? "a Soul"} (#${tokenId})`
  )}&url=${encodeURIComponent(url)}`;

  const gmUrl = `/scenes/gm/${tokenId}`;
  const downloadUrl = `/api/art/wizards/${tokenId}.zip`;

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
      <SocialItem>
        <a href={gmUrl} className="icon-link gm" target="_blank">
          <ResponsivePixelImg
            src="/static/img/icons/gm.png"
            className="gm-img"
          />
        </a>
      </SocialItem>
      <SocialItem>
        <a href={downloadUrl} className="icon-link" target="_blank">
          <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
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
  leftPageLoreIndex,
  rightPageLoreIndex,
  leftPageCreator,
  rightPageCreator,
}: Props) {
  const router = useRouter();

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

  // const { web3Settings } = useMst();
  // const walletConnected = web3Settings.injectedProvider;
  const { account } = useEthers();
  console.log(
    `creator ${rightPageCreator?.toLowerCase()} ${account?.toLowerCase()}`
  );

  const canEditRightPage =
    account &&
    rightPageLoreIndex &&
    rightPageCreator?.toLowerCase() === account?.toLowerCase();
  const writeNewLoreButton = (
    <Link href="/lore/add" passHref={true}>
      <WriteButton size="medium">Write New Lore</WriteButton>
    </Link>
  );

  return (
    <Flex flexDirection={"column"} pb={4}>
      <BookOfLoreControlsElement>
        <WriteContainer style={{ justifyContent: "flex-start" }}>
          {!leftPageLoreIndex && (
            <LoreSocialContainer
              loreTokenSlug={loreTokenSlug}
              tokenId={tokenId}
            />
          )}
          {account &&
            leftPageLoreIndex &&
            leftPageCreator?.toLowerCase() === account.toLowerCase() && (
              <Link
                href={`/lore/add?tokenId=${tokenId}&tokenAddress=${CHARACTER_CONTRACTS[loreTokenSlug]}&loreIndex=${leftPageLoreIndex}`}
                passHref={true}
              >
                <WriteButton size="medium">Edit Left Page</WriteButton>
              </Link>
            )}
        </WriteContainer>
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
              : loreTokenSlug === "souls"
              ? `${
                  soulsData?.[tokenId.toString()]?.name ?? "Soul"
                }  (#${tokenId})`
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

        <WriteContainer style={{ justifyContent: "flex-end" }}>
          {!account && <ConnectWalletButton />}
          {canEditRightPage && (
            <Link
              href={`/lore/add?tokenId=${tokenId}&tokenAddress=${CHARACTER_CONTRACTS[loreTokenSlug]}&loreIndex=${rightPageLoreIndex}`}
              passHref={true}
            >
              <WriteButton size="medium">Edit Right Page</WriteButton>
            </Link>
          )}
          {account && !canEditRightPage && writeNewLoreButton}
        </WriteContainer>
      </BookOfLoreControlsElement>
      {canEditRightPage && (
        <WriteContainer style={{ alignSelf: "center" }}>
          {writeNewLoreButton}
        </WriteContainer>
      )}
    </Flex>
  );
}
