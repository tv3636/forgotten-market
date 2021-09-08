import Layout from "../../components/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import WizardPicker, {
  WizardConfiguration,
} from "../../components/AddLore/WizardPicker";
import ArtifactPicker from "../../components/AddLore/ArtifactPicker";
import { Formik } from "formik";
import productionWizardData from "../../data/nfts-prod.json";
import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  FormField,
  TextAreaAutosizeInput,
  TextInput,
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

// TODO, unify with Button.tsx
const SubmitButton = styled.button`
  display: inline-block;
  text-align: center;
  text-decoration: none;
  padding: 0.8em 1em;
  border-radius: 3px;
  font-family: "Alagard";
  font-size: 20px;
  color: white;
  background-color: #393246;
  border: none;
  &:hover {
    color: #cccccc;
    background-color: #2a2433;
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
          name={props.name}
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
          name={props.name}
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
    tokenId: artifactConfiguration?.tokenId,
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
  const { web3Settings } = useMst();
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
        <Formik
          initialValues={{ isNsfw: false, pixelArt: false }}
          onSubmit={async (values) => {
            console.log(web3Settings.injectedProvider?.getSigner());
            if (
              !currentArtifact?.contractAddress ||
              !currentArtifact?.tokenId ||
              !currentWizard?.tokenId
            ) {
              // TODO: proper error messages for user
              console.error("No artifact or wizard set...");
              return false;
            }

            console.log(JSON.stringify(values, null, 2));

            const loreContract = await getBookOfLoreContract({
              provider: web3Settings.injectedProvider,
            });

            const response = await fetch("/api/lore", {
              method: "post",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                address: currentArtifact.contractAddress,
                token_id: currentArtifact.tokenId,
                title: currentTitle,
                story: currentStory,
                pixel_art: values?.pixelArt ?? false,
                bg_color: currentBgColor,
              }),
            });

            const apiResponse = await response.json();

            if (response.status !== 201 && response.status !== 200) {
              console.error(apiResponse);
              //TODO: user visible error
              return false;
            }

            console.log(apiResponse);

            await loreContract
              //@ts-ignore
              .connect(web3Settings.injectedProvider?.getSigner())
              .addLore(
                currentWizard.tokenId,
                currentArtifact.contractAddress,
                currentArtifact.tokenId,
                0,
                values.isNsfw,
                `ipfs://${apiResponse.hash}`,
                { gasLimit: 300000 } //TODO: actual gas limit
              );

            //TODO: I guess some idea of success to user and/or change page
            //TODO: Note that I am not sure going directly to lore viewing page will work as the GraphQL data may not be instant hmm
            //TODO: One idea is to just have a nice "Lore submitted component, check <here> in a bit to see it live..." - just for first version
            return true;
          }}
        >
          {(form) => (
            <FormStyled onSubmit={form.handleSubmit}>
              <AddLoreLayout>
                <FormPanel>
                  <h1>Add Lore</h1>
                  <FormField>
                    <h2>Pick a Wizard</h2>
                    <WizardPicker onWizardPicked={onWizardPicked} />
                  </FormField>
                  <FormField>
                    <h2>
                      Pick an Artifact NFT (optional)
                      <HelpTooltip>
                        <p>
                          An Artifact can be any NFT that you want to attach to
                          this Wizard.{" "}
                        </p>
                        <p>
                          This is optional though. You can just write a story,
                          if you want to!
                        </p>
                      </HelpTooltip>
                    </h2>
                    <ArtifactPicker onArtifactPicked={onArtifactPicked} />
                  </FormField>
                  <FormField>
                    <BackgroundColorPickerField
                      name="bgColor"
                      artifactConfiguration={currentArtifact}
                      onChange={(color?: string | null) =>
                        setCurrentBgColor(color)
                      }
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
                      tabIndex={2}
                    />
                  </FormField>
                  <FormField>
                    <StoryField
                      label="Story"
                      name="story"
                      type="textarea"
                      placeholder="Our hero finds himself wandering, without water..."
                      onChange={(evt: any) => setCurrentStory(evt.target.value)}
                      tabIndex={3}
                    />
                  </FormField>
                  {/* can we get an eyedropper? */}
                  <FormField>
                    <NSFWField name="isNsfw" />
                  </FormField>
                  <FormField>
                    <SubmitFormField>
                      <SubmitButton type={"submit"}>Submit</SubmitButton>
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
          )}
        </Formik>
      </AddLoreWrapper>
    </Layout>
  );
};
export default AddLorePage;
