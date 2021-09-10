import Layout from "../../components/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import WizardPicker, {
  WizardConfiguration
} from "../../components/AddLore/WizardPicker";
import ArtifactPicker from "../../components/AddLore/ArtifactPicker";
import { Formik } from "formik";
import productionWizardData from "../../data/nfts-prod.json";
import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  FormField,
  TextAreaAutosizeInput,
  TextInput
} from "../../components/ui/Inputs";

import Switch from "react-switch";
import LorePreview from "../../components/AddLore/LorePreview";
import { useDebounce } from "../../hooks";
import HelpTooltip from "../../components/Lore/HelpTooltip";
import { useExtractColors } from "../../hooks/useExtractColors";
import { useNFTInfo } from "../../components/NFTDisplay";
import { ArtifactConfiguration } from "../../components/Lore/types";
import { useMst } from "../../store";
import { getBookOfLoreContract } from "../../contracts/ForgottenRunesWizardsCultContract";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StyledToastContainer from "../../components/StyledToastContainer";
import { AddressZero } from "@ethersproject/constants";
import { GetServerSidePropsContext } from "next";
import client from "../../lib/graphql";
import { gql, useQuery } from "@apollo/client";
import {
  BackgroundColorPickerField,
  NSFWField,
  PixelArtField
} from "../../components/AddLore/AddLoreFields";
import BookFrame from "../../components/Lore/BookFrame";
import AddLoreEditor from "../../components/AddLore/AddLoreEditor";
import "draft-js/dist/Draft.css";
import AddLoreControls from "../../components/AddLore/AddLoreControls";

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

const AddLoreLayout = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 1em;
  color: white;
  position: relative;
  margin: 0 auto;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    grid-column-gap: 20px;
  }
`;

const SubmitFormField = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FormPanel = styled.div``;
const PreviewPanel = styled.div`
  width: 100%;
`;

const PreviewStickyPane = styled.div`
  position: sticky;
  top: 20px;
`;

// const FormStyled = styled(Form)`
const FormStyled = styled.form`
  width: 100%;
`;

// TODO, unify with Button.tsx
const SubmitButton = styled.button`
  display: inline-block;
  text-align: center;
  text-decoration: none;
  padding: 0.8em 1em;
  border-radius: 3px;
  font-family: "Alagard", fantasy;
  font-size: 20px;
  color: white;
  background-color: #393246;
  border: none;
  &:hover {
    color: #cccccc;
    background-color: #2a2433;
  }
`;

const ErrorMessage = styled.div`
  color: red;
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

const AddLorePage = () => {
  const { web3Settings } = useMst();
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentBgColor, setCurrentBgColor] = useState<
    string | null | undefined
  >(null);

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

  const bg = "0000";
  const controls = <AddLoreControls wizardId={currentWizard?.tokenId} />;

  const currentLeftPage = (
    <div>
      <WizardPicker onWizardPicked={onWizardPicked} />
    </div>
  );
  const currentRightPage = <AddLoreEditor />;

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <AddLoreWrapper>
        <BookFrame bg={bg} controls={controls}>
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
