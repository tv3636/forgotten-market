import Layout from "../../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../components/Lore/Book";
import BookOfLoreControls from "../../components/Lore/BookOfLoreControls";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import WizardPicker, {
  WizardConfiguration
} from "../../components/AddLore/WizardPicker";
import ArtifactPicker, {
  ArtifactConfiguration
} from "../../components/AddLore/ArtifactPicker";
import { EmptyWell } from "../../components/ui/EmptyWell";
import Button from "../../components/ui/Button";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { ChromePicker } from "react-color";
import TextareaAutosize from "react-textarea-autosize";
import productionWizardData from "../../data/nfts-prod.json";
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { RgbaColorPicker, HexColorPicker } from "react-colorful";
import {
  FormField,
  TextInput,
  TextAreaAutosizeInput
} from "../../components/ui/Inputs";

import Switch from "react-switch";
import LorePreview from "../../components/AddLore/LorePreview";
import { useDebounce } from "../../hooks";
import HelpTooltip from "../../components/Lore/HelpTooltip";
import { useExtractColors } from "../../hooks/useExtractColors";
import { useNFTInfo } from "../../components/NFTDisplay";
import convert from "color-convert";

const wizData = productionWizardData as { [wizardId: string]: any };

const AddLoreWrapper = styled.div`
  padding: 1em;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #0e0e0e;
  min-height: 90vh;
  padding-bottom: 300px;
`;

const AddLoreLayout = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 1em;
  color: white;
  position: relative;

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

const InlineFieldStyles = styled.div`
  h3 {
    display: inline-block;
  }
  label {
    position: relative;
    margin-left: 14px;
    top: 4px;
  }
`;

const NSFWField = ({ ...props }: { name: string }) => {
  // const [field, meta] = useField({ ...props, type: "checkbox" });
  const [checked, setChecked] = useState(false);

  // TODO how to useField with Switch?
  return (
    <InlineFieldStyles>
      <h3>
        nsfw?
        <HelpTooltip>
          <p>
            Assigning nsfw status is a courtesy to let Wizards of all ages and
            backgrounds to safely enjoy the Lore.
          </p>
          <p>
            A good rule of thumb is nsfw should be enabled if the Lore is
            inappropriate for minors.
          </p>
        </HelpTooltip>
      </h3>
      <label className="checkbox-input">
        {/* <input type="checkbox" {...field} {...props} /> */}
        <Switch
          onChange={() => setChecked(!checked)}
          checked={checked}
          uncheckedIcon={false}
          width={40}
          height={22}
          offColor={"#494949"}
          onColor={"#8e0606"}
          offHandleColor={"#a7a7a7"}
          // {...field}
          // {...props}
        />
      </label>
    </InlineFieldStyles>
  );
};

const PixelArtField = ({ ...props }: { name: string }) => {
  // const [field, meta] = useField({ ...props, type: "checkbox" });
  const [checked, setChecked] = useState(false);

  return (
    <InlineFieldStyles>
      <h3>
        Pixel Art?
        <HelpTooltip>
          Pixel Art requires a special style of rendering for sharp edges. Check
          this box if your Artifact is pixel art
        </HelpTooltip>
      </h3>
      <label className="checkbox-input">
        {/* <input type="checkbox" {...field} {...props} /> */}
        <Switch
          onChange={() => setChecked(!checked)}
          checked={checked}
          uncheckedIcon={false}
          width={40}
          height={22}
          offColor={"#494949"}
          onColor={"#65D36E"}
          offHandleColor={"#a7a7a7"}
          // {...field}
          // {...props}
        />
      </label>
    </InlineFieldStyles>
  );
};

const Swatch = styled.div<{ bgColor?: string | null }>`
  width: 42px;
  height: 24px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: ${(props) => props.bgColor || "transparent"};
  display: inline-block;
  cursor: pointer;
`;

const BackgroundColorPickerField = ({
  artifactConfiguration,
  onChange,
  ...props
}: {
  artifactConfiguration: ArtifactConfiguration | null;
  onChange: (color?: string | null) => void;
  name: string;
}) => {
  // const [field, meta] = useField({ ...props, type: "string" });

  const { loading, nftData, error } = useNFTInfo({
    contractAddress: artifactConfiguration?.contractAddress,
    tokenId: artifactConfiguration?.tokenId
  });

  const [localBgColor, setLocalBgColor] = useState<string>();
  const [bigPickerShowing, setBigPickerShowing] = useState<boolean>(false);

  const { bgColor: detectedBgColor } = useExtractColors(nftData?.image);

  const setColor = (newColor: string) => {
    onChange(newColor);
    setLocalBgColor(newColor);
  };

  useEffect(() => {
    if (detectedBgColor) setColor(detectedBgColor);
  }, [detectedBgColor]);

  return (
    <InlineFieldStyles>
      <h3>
        BG Color
        <HelpTooltip>
          Background color for the page. Helps some images fit better on the
          page.
        </HelpTooltip>
      </h3>
      <label className="checkbox-input">
        {/* <input type="checkbox" {...field} {...props} /> */}
        <Swatch
          bgColor={localBgColor}
          onClick={() => setBigPickerShowing(!bigPickerShowing)}
        />
        {bigPickerShowing && (
          <HexColorPicker
            color={localBgColor}
            onChange={(hex) => setColor(hex)}
          />
        )}
      </label>
    </InlineFieldStyles>
  );
};

const TitleField = ({ ...props }: any) => {
  // const [field, meta] = useField(props);

  const field = {};
  return (
    <>
      <h2>Title (optional)</h2>
      <TextInput {...field} {...props} />
      {/* {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null} */}
    </>
  );
};

const StoryField = ({ ...props }: any) => {
  // const [field, meta] = useField(props);
  const field = {};
  return (
    <>
      <h2>
        Story (optional, Markdown supported)
        <HelpTooltip>
          Markdown is a popular syntax for formatting text.
        </HelpTooltip>
      </h2>
      <TextAreaAutosizeInput minRows={4} {...field} {...props} />
      {/* {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null} */}
    </>
  );
};

const AddLorePage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentBgColor, setCurrentBgColor] = useState<
    string | null | undefined
  >(null);

  const debouncedCurrentStory = useDebounce(currentStory, 80);

  const [currentArtifact, setCurrentArtifact] =
    useState<ArtifactConfiguration | null>(null);

  const onArtifactPicked = (artifactConfiguration: ArtifactConfiguration) => {
    setCurrentArtifact(artifactConfiguration);
  };

  const [currentWizard, setCurrentWizard] = useState<WizardConfiguration>();

  const onWizardPicked = (wizardConfiguration: WizardConfiguration) => {
    setCurrentWizard(wizardConfiguration);
  };

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <AddLoreWrapper>
        {/* <Formik
          initialValues={{ nsfw: false }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(JSON.stringify(values, null, 2));
          }}
        > */}
        <FormStyled>
          <AddLoreLayout>
            <FormPanel>
              <h1>Add Lore</h1>
              <FormField>
                <h2>Pick a Wizard</h2>
                <WizardPicker onWizardPicked={onWizardPicked} />
              </FormField>
              <FormField>
                <h2>
                  Pick an Artifact NFT
                  <HelpTooltip>
                    An Artifact can be any NFT that you want to attach to this
                    Wizard
                  </HelpTooltip>
                </h2>
                <ArtifactPicker onArtifactPicked={onArtifactPicked} />
              </FormField>
              <FormField>
                <BackgroundColorPickerField
                  name="bgColor"
                  artifactConfiguration={currentArtifact}
                  onChange={(color?: string | null) => setCurrentBgColor(color)}
                />
              </FormField>
              <FormField>
                <PixelArtField name="pixelArt" />
              </FormField>
              <FormField>
                <TitleField
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="The Journey of Wizzy to The Sacred Pillars"
                  onChange={(evt: any) => setCurrentTitle(evt.target.value)}
                />
              </FormField>
              <FormField>
                <StoryField
                  label="Story"
                  name="story"
                  type="textarea"
                  placeholder="Our hero finds himself wandering, without water..."
                  onChange={(evt: any) => setCurrentStory(evt.target.value)}
                />
              </FormField>
              {/* can we get an eyedropper? */}
              <FormField>
                <NSFWField name="isNsfw" />
              </FormField>
              <FormField>
                <SubmitFormField>
                  <Button>Submit</Button>
                </SubmitFormField>
              </FormField>
            </FormPanel>
            <PreviewPanel>
              <PreviewStickyPane>
                <h1>Preview</h1>
                <LorePreview
                  currentArtifact={currentArtifact}
                  currentTitle={currentTitle}
                  currentStory={debouncedCurrentStory}
                  currentBgColor={currentBgColor}
                  currentWizard={currentWizard}
                />
              </PreviewStickyPane>
            </PreviewPanel>
          </AddLoreLayout>
        </FormStyled>
        {/* </Formik> */}
      </AddLoreWrapper>
    </Layout>
  );
};
export default AddLorePage;
