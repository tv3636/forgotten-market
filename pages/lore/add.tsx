import Layout from "../../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../components/Lore/Book";
import BookOfLoreControls from "../../components/Lore/BookOfLoreControls";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import WizardPicker from "../../components/AddLore/WizardPicker";
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
import { RgbaColorPicker } from "react-colorful";
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
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  grid-column-gap: 20px;
  color: white;
  position: relative;
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

const FormStyled = styled(Form)`
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
  const [field, meta] = useField({ ...props, type: "checkbox" });
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
  const [field, meta] = useField({ ...props, type: "checkbox" });
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

const Swatch = styled.div<{ bgColor: string | null }>`
  width: 42px;
  height: 24px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: ${(props) => props.bgColor || "transparent"};
  display: inline-block;
  cursor: pointer;
`;

const BackgroundColorPickerField = ({
  currentImageUrl,
  ...props
}: {
  currentImageUrl: string;
  name: string;
}) => {
  const [field, meta] = useField({ ...props, type: "string" });
  const { bgColor } = useExtractColors(currentImageUrl);

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
        <Swatch bgColor={bgColor} />
      </label>
    </InlineFieldStyles>
  );
};

const TitleField = ({ ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <>
      <h2>Title (optional)</h2>
      <TextInput {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const StoryField = ({ ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <>
      <h2>
        Story (optional, Markdown supported)
        <HelpTooltip>
          Markdown is a popular syntax for formatting text.
        </HelpTooltip>
      </h2>
      <TextAreaAutosizeInput minRows={4} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const ColorField = ({ ...props }: any) => {
  const [color, setColor] = useState({ r: 200, g: 150, b: 35, a: 1 });
  return (
    <>
      <h2>Background Color (optional)</h2>
      {/* https://github.com/omgovich/react-colorful */}
      <RgbaColorPicker color={color} onChange={setColor} />
    </>
  );
};

const AddLorePage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const debouncedCurrentStory = useDebounce(currentStory, 80);

  const [currentArtifact, setCurrentArtifact] =
    useState<ArtifactConfiguration | null>(null);

  const onArtifactPicked = (artifactConfiguration: ArtifactConfiguration) => {
    setCurrentArtifact(artifactConfiguration);
  };

  // const { bgColor } = useExtractColors(
  //   "https://cloudflare-ipfs.com/ipfs/QmdFQR875GwXP4n4zmQq8YXChQYNQbPJBv1q5eevCB73gw/image.gif"
  // );

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <AddLoreWrapper>
        <Formik
          initialValues={{ nsfw: false }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(JSON.stringify(values, null, 2));
          }}
        >
          <FormStyled>
            <AddLoreLayout>
              <FormPanel>
                {/* <Swatch bgColor={bgColor} /> */}
                <h1>Add Lore</h1>
                <FormField>
                  <h2>Pick a Wizard</h2>
                  <WizardPicker />
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
                  <BackgroundColorPickerField />
                </FormField>
                <FormField>
                  <PixelArtField />
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
                {/* <FormField>
                  <ColorField />
                </FormField> */}
                <FormField>
                  <NSFWField />
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
                  />
                </PreviewStickyPane>
              </PreviewPanel>
            </AddLoreLayout>
          </FormStyled>
        </Formik>
      </AddLoreWrapper>
    </Layout>
  );
};
export default AddLorePage;
