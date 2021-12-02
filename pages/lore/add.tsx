import styled from "@emotion/styled";
import "draft-js/dist/Draft.css";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import AddLoreControls from "../../components/AddLore/AddLoreControls";
import AddLoreEditor, {
  convertDraftStateToMarkdown,
  markdownToDraftState,
} from "../../components/AddLore/AddLoreEditor";
import WizardPicker, {
  WizardConfiguration,
} from "../../components/AddLore/WizardPicker";
import Layout from "../../components/Layout";
import BookFrame from "../../components/Lore/BookFrame";
import { BookOfLorePage } from "../../components/Lore/IndividualLorePage";
import StyledToastContainer from "../../components/StyledToastContainer";
import {
  getPendingLoreTxHashRedirection,
  onSubmitAddLoreForm,
  storyPrompts,
  titlePrompts,
} from "../../components/AddLore/addLoreHelpers";
import LoreSharedLayout from "../../components/Lore/LoreSharedLayout";
import { EditorState } from "draft-js";
import { Flex } from "rebass";
import OgImage from "../../components/OgImage";

import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";

import {
  getBookOfLoreContract,
  isSoulsContract,
  isWizardsContract,
} from "../../contracts/ForgottenRunesWizardsCultContract";
import { fetchFromIpfs } from "../../lib/web3Utils";
import { useEthers } from "@usedapp/core";
import { useTimeoutFn } from "react-use";

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
  useTimeoutFn(() => {
    // @ts-ignore
    window.location = `/lore/add?waitForTxHash=${router.query?.waitForTxHash}&tokenId=${router.query?.tokenId}&tokenAddress=${router.query?.tokenAddress}&waited=true`;
  }, 5 * 1000);

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

const defaultPrompt = "_Please pick a Wizard on the other page_";

const AddLorePage = () => {
  const { library } = useEthers();
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentNsfw, setNsfw] = useState<boolean>(false);
  const [currentBgColor, setCurrentBgColor] = useState<
    string | null | undefined
  >(null);
  const [currentEditorState, setCurrentEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );

  const [currentWizard, setCurrentWizard] = useState<WizardConfiguration>();

  const onWizardPicked = (wizardConfiguration: WizardConfiguration) => {
    setCurrentWizard(wizardConfiguration);
  };

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const loreIndex = router.query?.loreIndex;
  const isEditing = loreIndex !== undefined;

  useEffect(() => {
    if (!isEditing) {
      const titlePrompt = titlePrompts[0];
      const storyPrompt = storyPrompts[0];

      let defaultText = defaultPrompt;

      if (
        currentWizard &&
        currentWizard.tokenAddress &&
        isWizardsContract(currentWizard.tokenAddress)
      ) {
        defaultText = `# ${titlePrompt} ${
          wizData[currentWizard.tokenId].name
        }\n${storyPrompt}`;
      } else if (
        currentWizard &&
        currentWizard.tokenAddress &&
        isSoulsContract(currentWizard.tokenAddress)
      ) {
        defaultText = `# ${titlePrompt} ${
          soulsData?.[currentWizard.tokenId]?.name ?? "a Soul"
        }\n${storyPrompt}`;
      }

      const newEditorState = markdownToDraftState(defaultText);

      setCurrentEditorState(newEditorState);
    }
  }, [isEditing, currentWizard]);

  useEffect(() => {
    async function fetchCurrentLore() {
      console.log("Fetching lore");
      console.log(currentWizard);
      console.log(library);
      if (!currentWizard || !library) return;

      const contract = await getBookOfLoreContract({
        provider: library,
      });

      const loreEntry = await contract.tokenLore(
        currentWizard.tokenAddress,
        currentWizard.tokenId,
        loreIndex
      );
      console.log(loreEntry);
      const loreMetadataURI = loreEntry?.loreMetadataURI;

      if (!loreMetadataURI) return;

      const loreData = await fetchFromIpfs(loreMetadataURI);

      if (loreData && loreData?.description) {
        setCurrentEditorState(markdownToDraftState(loreData?.description));
        setCurrentBgColor(loreData?.background_color ?? "#000000");
      }
    }
    const isEmpty = currentEditorState?.isEmpty;

    if (isEditing && (isEmpty || isEmpty === undefined)) {
      fetchCurrentLore();
    }
  }, [isEditing, currentEditorState?.isEmpty, library]);

  console.log(`isEmpty ${currentEditorState?.isEmpty}`);

  if (
    !currentWizard &&
    router.query?.tokenId &&
    router.query?.tokenAddress &&
    loreIndex
  ) {
    setCurrentWizard({
      tokenId: router.query.tokenId as string,
      tokenAddress: router.query.tokenAddress as string,
      name: isWizardsContract(router.query.tokenAddress as string)
        ? wizData[router.query.tokenId as string].name
        : soulsData[router.query.tokenId as string].name,
    });
  }

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
      loreIndex: isEditing ? loreIndex : undefined,
      setErrorMessage,
      setSubmitting,
      currentStory: _currentStory,
      currentTitle: _currentTitle,
      currentBgColor,
      provider: library,
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
      isEditing={isEditing}
    />
  );

  const currentLeftPage = (
    <BookOfLorePage bg={wizardBg}>
      <WizardPicker
        currentWizard={currentWizard}
        setCurrentWizard={setCurrentWizard}
      />
    </BookOfLorePage>
  );
  const currentRightPage = (
    <BookOfLorePage bg={bg || "#000000"}>
      <AddLoreEditor
        currentEditorState={currentEditorState}
        setCurrentEditorState={setCurrentEditorState}
        onBgColorChanged={onEditorChangedBackgroundColor}
        bg={bg || "#000000"}
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
    console.log("Server side checking pending...");
    const pendingLoreProps = await getPendingLoreTxHashRedirection({
      waitForTxHash: context.query.waitForTxHash as string,
      tokenAddress: context.query?.tokenAddress as string,
      tokenId: context.query?.tokenId as string,
      waitedOneRound: Boolean(context.query?.waited) ?? false,
    });
    return pendingLoreProps;
  }

  return { props: {} };
}

export default AddLorePage;
