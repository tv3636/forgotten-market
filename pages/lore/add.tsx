import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import "draft-js/dist/Draft.css";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import AddLoreControls from "../../components/AddLore/AddLoreControls";
import AddLoreEditor from "../../components/AddLore/AddLoreEditor";
import { onSubmitAddLoreForm } from "../../components/AddLore/addLoreHelpers";
import WizardPicker, {
  WizardConfiguration
} from "../../components/AddLore/WizardPicker";
import Layout from "../../components/Layout";
import BookFrame from "../../components/Lore/BookFrame";
import { BookOfLorePage } from "../../components/Lore/IndividualLorePage";
import StyledToastContainer from "../../components/StyledToastContainer";
import productionWizardData from "../../data/nfts-prod.json";
import { useDebounce } from "../../hooks";
import { getContrast } from "../../lib/colorUtils";
import client from "../../lib/graphql";
import { useMst } from "../../store";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import { convertToRaw, EditorState } from "draft-js";

const wizData = productionWizardData as { [wizardId: string]: any };

const AddLoreWrapper = styled.div`
  /* padding: 1em;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #0e0e0e;
  min-height: 90vh;
  padding-bottom: 300px; */
`;

export type LoreAPISubmitParams = {
  address?: string;
  token_id?: string;
  title: string | null;
  story: string | null;
  pixel_art: boolean;
  bg_color: string | null | undefined;
};

const WaitingForGraphPage = () => {
  useEffect(() => {
    let reloadTimer = setTimeout(() => window.location.reload(true), 5 * 1000);

    return () => {
      clearTimeout(reloadTimer);
    };
  }, []);

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <h1>
        This is an amazing waiting animation right here, you just have to
        squint....
      </h1>
    </Layout>
  );
};

// https://github.com/Rosey/markdown-draft-js/pull/49#issuecomment-775247720
export const convertToMD = (state: EditorState): string => {
  return draftToMarkdown(convertToRaw(state.getCurrentContent()), {
    entityItems: {
      image: {
        open: function (entity: any) {
          return "";
        },
        close: function (entity: any) {
          console.log("entity: ", entity);
          return `![](${entity["data"].src})`;
        }
      }
    }
  });
};

const AddLorePage = () => {
  const { web3Settings } = useMst();
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentNsfw, setNsfw] = useState<boolean>(false);
  const [currentBgColor, setCurrentBgColor] = useState<
    string | null | undefined
  >(null);
  const [currentEditorState, setCurrentEditorState] = useState();

  const debouncedCurrentStory = useDebounce(currentStory, 80);

  const [currentWizard, setCurrentWizard] = useState<WizardConfiguration>();

  const onWizardPicked = (wizardConfiguration: WizardConfiguration) => {
    setCurrentWizard(wizardConfiguration);
  };

  const validate = async (values: any): Promise<any> => {
    console.log("values: ", values);
    return null;
  };

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  if (router.query?.waitForTxHash && router.query?.wizardId) {
    return <WaitingForGraphPage />;
  }

  const values = {
    nsfw: false,
    bg_color: "000000"
  };

  const wizardBg = currentWizard?.tokenId
    ? "#" + wizData[currentWizard?.tokenId?.toString()].background_color
    : "black";

  const onSubmit = () => {
    console.log("currentEditorState: ", currentEditorState);
    let _currentStory = currentStory;
    if (currentEditorState) {
      const markdownString = convertToMD(currentEditorState);
      console.log("markdownString: ", markdownString);
      _currentStory = markdownString;
      // extract the title and the story from the markdown
    }

    onSubmitAddLoreForm({
      values,
      currentWizard,
      setErrorMessage,
      setSubmitting,
      currentStory: _currentStory,
      currentTitle,
      currentBgColor,
      web3Settings,
      router
    });
  };

  const onBackgroundColorChanged = (newColor?: string | null | undefined) => {
    if (newColor) {
      setCurrentBgColor(newColor);
    }
  };

  const onNsfwChanged = (newNsfw: boolean) => {
    setNsfw(newNsfw);
  };

  const bg = currentBgColor;
  const controls = (
    <AddLoreControls
      wizardId={currentWizard?.tokenId}
      onSubmit={onSubmit}
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
      <AddLoreEditor onChange={setCurrentEditorState} bg={bg || "#000000"} />
    </BookOfLorePage>
  );

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <AddLoreWrapper>
        <BookFrame bg={bg || "#000000"} controls={controls}>
          <div />
          {currentLeftPage}
          {currentRightPage}
          <div />
        </BookFrame>
      </AddLoreWrapper>
      <StyledToastContainer theme="dark" />
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context.query?.waitForTxHash && context.query?.wizardId) {
    console.log(`txHash: ${context.query?.waitForTxHash}`);
    const { data } = await client.query({
      query: gql`
          query WizardLore{
              lores(where: { struck: false, nsfw: false, txHash: "${context.query?.waitForTxHash}" }) {
                  id
                  index
                  txHash
              }
          }
      `
    });

    console.log(data);

    if (data?.lores?.length > 0) {
      return {
        redirect: {
          destination: `/lore/${context?.query?.wizardId}/${data?.lores[0].index}`
        }
      };
    }
  }

  return { props: {} };
}

export default AddLorePage;
