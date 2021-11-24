import styled from "@emotion/styled";
import "draft-js/dist/Draft.css";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import AddLoreControls from "../../components/AddLore/AddLoreControls";
import AddLoreEditor, {
  convertDraftStateToMarkdown,
} from "../../components/AddLore/AddLoreEditor";
import WizardPicker, {
  WizardConfiguration,
} from "../../components/AddLore/WizardPicker";
import Layout from "../../components/Layout";
import BookFrame from "../../components/Lore/BookFrame";
import { BookOfLorePage } from "../../components/Lore/IndividualLorePage";
import StyledToastContainer from "../../components/StyledToastContainer";
import { useMst } from "../../store";
import {
  getPendingLoreTxHashRedirection,
  onSubmitAddLoreForm,
} from "../../components/AddLore/addLoreHelpers";
import LoreSharedLayout from "../../components/Lore/LoreSharedLayout";
import { EditorState } from "draft-js";
import { Flex } from "rebass";
import OgImage from "../../components/OgImage";

import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";

import { isWizardsContract } from "../../contracts/ForgottenRunesWizardsCultContract";

const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };
const wizData = productionWizardData as { [wizardId: string]: any };

const AddLoreWrapper = styled.div``;

export type LoreAPISubmitParams = {
  token_address: string;
  token_id: string;
  signature: string;
  title: string | null;
  story: string | null;
  pixel_art: boolean;
  bg_color: string | null | undefined;
};

export const WaitingText = styled.div`
  color: #e1decd;
  font-size: 24px;
  overflow: scroll;
  padding: 1em;
  font-family: "Alagard", serif;
`;
const WaitingForGraphPage = () => {
  const router = useRouter();
  useEffect(() => {
    let reloadTimer: number;

    async function logic() {
      window.setTimeout(
        () =>
          router.push(
            `/lore/add?waitForTxHash=${router.query?.waitForTxHash}&tokenId=${router.query?.tokenId}&tokenAddress=${router.query?.tokenAddress}`
          ),
        1.5 * 1000
      );
    }

    logic();
  }, []);

  return (
    <Flex
      width={"100%"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <WaitingText>Waiting for your lore to be inscribed...</WaitingText>
    </Flex>
  );
};

const AddLorePage = () => {
  const { web3Settings } = useMst();
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentNsfw, setNsfw] = useState<boolean>(false);
  const [currentBgColor, setCurrentBgColor] = useState<
    string | null | undefined
  >(null);
  const [currentEditorState, setCurrentEditorState] = useState<EditorState>();

  const [currentWizard, setCurrentWizard] = useState<WizardConfiguration>();

  const onWizardPicked = (wizardConfiguration: WizardConfiguration) => {
    setCurrentWizard(wizardConfiguration);
  };

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  if (
    (router.query?.waitForTxHash || router.query?.lorePageToPrefetch) &&
    router.query?.tokenId
  ) {
    return <WaitingForGraphPage />;
  }

  const tokenId = currentWizard?.tokenId;
  const wizardBg =
    currentWizard && tokenId
      ? isWizardsContract(currentWizard.tokenAddress)
        ? wizData[tokenId.toString()].background_color
        : soulsData?.[tokenId.toString()]?.background_color ?? "000000"
      : "#000000";

  const onSubmit = async () => {
    console.log("currentEditorState: ", currentEditorState);
    let _currentStory = currentStory;
    let _currentTitle = currentTitle;
    if (currentEditorState) {
      const { markdown, headers } =
        convertDraftStateToMarkdown(currentEditorState);
      // console.log("markdownString: ", markdown);
      _currentStory = markdown;
      _currentTitle = headers[0] ? headers[0] : _currentTitle;
      // extract the title and the story from the markdown
    }

    await onSubmitAddLoreForm({
      values: { bg_color: currentBgColor, nsfw: currentNsfw },
      currentWizard,
      setErrorMessage,
      setSubmitting,
      currentStory: _currentStory,
      currentTitle: _currentTitle,
      currentBgColor,
      web3Settings,
      router,
    });
  };

  const onBackgroundColorChanged = (newColor?: string | null | undefined) => {
    if (newColor) {
      setCurrentBgColor(newColor);
    }
  };

  const onEditorChangedBackgroundColor = (
    newColor?: string | null | undefined
  ) => {
    if (!currentBgColor && newColor) {
      setCurrentBgColor(newColor);
    }
  };

  const onNsfwChanged = (newNsfw: boolean) => {
    setNsfw(newNsfw);
  };

  const bg = currentBgColor;
  const bgL = wizardBg;
  const bgR = currentBgColor;

  const controls = (
    <AddLoreControls
      tokenAddress={currentWizard?.tokenAddress}
      tokenId={currentWizard?.tokenId}
      onSubmit={onSubmit}
      currentBackgroundColor={currentBgColor}
      onBackgroundColorChanged={onBackgroundColorChanged}
      onNsfwChanged={onNsfwChanged}
    />
  );

  const currentLeftPage = (
    <BookOfLorePage bg={wizardBg}>
      <WizardPicker onWizardPicked={onWizardPicked} />
    </BookOfLorePage>
  );
  const currentRightPage = (
    <BookOfLorePage bg={bg || "#000000"}>
      <AddLoreEditor
        onChange={setCurrentEditorState}
        onBgColorChanged={onEditorChangedBackgroundColor}
        bg={bg || "#000000"}
        tokenAddress={currentWizard?.tokenAddress}
        tokenId={currentWizard?.tokenId}
        isLoading={submitting}
      />
    </BookOfLorePage>
  );

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <LoreSharedLayout>
        <OgImage
          title={`Write in The Book of Lore`}
          images={
            "https://www.forgottenrunes.com/static/lore/book/closed_whole.png"
          }
        />
        <AddLoreWrapper>
          <BookFrame
            bg={bg || "#000000"}
            bgL={bgL || "#000000"}
            bgR={bgR || "#000000"}
            controls={controls}
            nextPageRoute={null}
            previousPageRoute={null}
          >
            {currentLeftPage}
            {currentRightPage}
          </BookFrame>
        </AddLoreWrapper>
        <StyledToastContainer theme="dark" />
      </LoreSharedLayout>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (
    context.query?.waitForTxHash &&
    context.query?.tokenId &&
    !context.query?.client
  ) {
    const pendingLoreProps = await getPendingLoreTxHashRedirection({
      waitForTxHash: context.query.waitForTxHash as string,
      tokenAddress: context.query?.tokenAddress as string,
      tokenId: context.query?.tokenId as string,
    });
    return pendingLoreProps;
  }

  return { props: {} };
}

export default AddLorePage;
