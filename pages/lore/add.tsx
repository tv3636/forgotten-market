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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StyledToastContainer from "../../components/StyledToastContainer";
import { AddressZero } from "@ethersproject/constants";
import { GetServerSidePropsContext } from "next";
import client from "../../lib/graphql";
import { gql, useQuery } from "@apollo/client";

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

export type LoreAPISubmitParams = {
  address?: string;
  token_id?: string;
  title: string | null;
  story: string | null;
  pixel_art: boolean;
  bg_color: string | null | undefined;
};

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

  const [currentArtifact, setCurrentArtifact] =
    useState<ArtifactConfiguration | null>(null);

  const onArtifactPicked = (artifactConfiguration: ArtifactConfiguration) => {
    setCurrentArtifact(artifactConfiguration);
  };

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

  return (
    <Layout
      title={`Add Lore | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <AddLoreWrapper>
        <Formik
          initialValues={{ isNsfw: false, pixelArt: false }}
          validate={validate}
          onSubmit={async (values) => {
            console.log("onSubmit", currentWizard);
            setErrorMessage(null);

            if (!currentWizard?.tokenId) {
              toast.error(`Sorry, there was a problem: no wizard selected`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
              });

              console.log("currentWizard?.tokenId: ", currentWizard?.tokenId);
              setErrorMessage(
                "No Wizard selected. Please select a Wizard above"
              );
              setSubmitting(false);
              return false;
            }

            if (
              (currentArtifact?.contractAddress || currentArtifact?.tokenId) &&
              !(currentArtifact?.contractAddress || currentArtifact?.tokenId)
            ) {
              toast.error(
                `Sorry, there was a problem: artifact needs both a contract and a tokenId`,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                }
              );
              setErrorMessage("Artifact needs both a contract and a tokenId");
              return false;
            }

            if (
              (currentStory || currentTitle) &&
              !(currentStory || currentTitle)
            ) {
              toast.error(
                `Sorry, there was a problem: story needs both a title and a story body`,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                }
              );
              setErrorMessage("Story needs both a title and a story body");
              return false;
            }

            if (!currentArtifact?.contractAddress && !currentStory) {
              toast.error(
                `Sorry, there was a problem: need either story or artifact to be present`,
                {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                }
              );
              setErrorMessage("Need either story or artifact to be present");
              return false;
            }

            setSubmitting(true);

            const provider = web3Settings.injectedProvider;
            const loreContract = await getBookOfLoreContract({
              provider: provider,
            });

            console.log("toast.info");
            toast.info("Preparing your Lore", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });

            let loreBody: LoreAPISubmitParams = {
              title: currentTitle,
              story: currentStory,
              pixel_art: values?.pixelArt ?? false,
              bg_color: currentBgColor,
            };

            if (currentArtifact?.contractAddress && currentArtifact?.tokenId) {
              loreBody = {
                ...loreBody,
                address: currentArtifact.contractAddress,
                token_id: currentArtifact.tokenId,
              };
            }

            const response = await fetch("/api/lore", {
              method: "post",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loreBody),
            });

            const apiResponse = await response.json();

            if (response.status !== 201 && response.status !== 200) {
              console.error(apiResponse);

              toast.error(`Sorry, there was a problem with IPFS upload`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
              });
              setSubmitting(false);
              return false;
            }

            console.log(apiResponse);

            try {
              toast.info(
                "Submitting your lore on chain, please don't re-submit!",
                {
                  position: "top-right",
                  autoClose: 20000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  progress: undefined,
                }
              );
              const tx = await loreContract
                //@ts-ignore
                .connect(provider?.getSigner())
                .addLore(
                  currentWizard.tokenId,
                  currentArtifact?.contractAddress
                    ? currentArtifact.contractAddress
                    : AddressZero,
                  currentArtifact?.tokenId ? currentArtifact?.tokenId : 0,
                  0,
                  values.isNsfw,
                  `ipfs://${apiResponse.hash}`,
                  { gasLimit: 300000 } //TODO: actual gas limit
                );

              const receipt = await tx.wait();

              console.log(`receipt: ${JSON.stringify(receipt)}`);

              if (receipt.status === 1) {
                await router.push(
                  `/lore/add?waitForTxHash=${receipt.transactionHash}&wizardId=${currentWizard.tokenId}`
                );
              } else {
                toast.error(
                  `Sorry, it appears your transaction may have failed (?)`,
                  {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                  }
                );
                setSubmitting(false);
                return false;
              }
            } catch (err) {
              console.log("err: ", err);
              toast.error(`Sorry, there was a problem: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
              });
              setSubmitting(false);
              return false;
            }

            setSubmitting(false);
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
                  {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                  <FormField>
                    <SubmitFormField>
                      {!submitting && (
                        <SubmitButton disabled={submitting} type={"submit"}>
                          Submit
                        </SubmitButton>
                      )}
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
                  txHash
              }
          }
      `,
    });

    console.log(data);

    if (data?.lores?.length > 0) {
      return {
        redirect: {
          destination: `/lore/${context?.query?.wizardId}/${
            data?.lores[0].id.match(/^(\d+)-(\d+)$/)[2]
          }`,
        },
      };
    }
  }

  return { props: {} };
}

export default AddLorePage;
