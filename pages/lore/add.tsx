import Layout from "../../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../components/Lore/Book";
import BookOfLoreControls from "../../components/Lore/BookOfLoreControls";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { ChromePicker } from "react-color";
import productionWizardData from "../../data/nfts-prod.json";
const wizData = productionWizardData as { [wizardId: string]: any };

const AddLoreWrapper = styled.div`
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddLoreLayout = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 1em;
  display: grid;
  grid-template-columns: 3fr 2fr;
  color: white;
`;

const WizardPicker = styled.div``;
const ArtifactPicker = styled.div``;
const FormPanel = styled.div``;
const PreviewPanel = styled.div``;
const HelpTooltip = styled.div`
  display: none;
`;
const BackgroundColorPicker = styled.div``;
const FormField = styled.div``;

const NSFWToggle = ({ ...props }: { name: string }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
      </label>
    </>
  );
};

const TitleField = ({ ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>Title (optional)</label>
      <input className="text-input" {...field} {...props} />
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
      <label htmlFor={props.id || props.name}>
        Story (optional, Markdown supported)
        <HelpTooltip>
          Learn more about the <a href="TODO">markdown syntax here</a>
        </HelpTooltip>
      </label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const AddLorePage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;

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
          <Form>
            <AddLoreLayout>
              <FormPanel>
                <h1>Add Lore</h1>
                <FormField>
                  <h3>Pick a Wizard</h3>
                  <WizardPicker />
                </FormField>
                <FormField>
                  <h3>
                    Pick an Artifact NFT
                    <HelpTooltip>
                      An Artifact can be any NFT that you want to attach to this
                      Wizard
                    </HelpTooltip>
                  </h3>
                  <ArtifactPicker />
                </FormField>
                <FormField>
                  <TitleField
                    label="Title"
                    name="title"
                    type="text"
                    placeholder="The Journey of Wizzy to The Sacred Pillars"
                  />
                </FormField>
                <FormField>
                  <StoryField
                    label="Story"
                    name="story"
                    type="textarea"
                    placeholder="Our hero finds himself wandering, without water..."
                  />
                </FormField>
                <FormField>
                  <h3>Background Color (optional)</h3>
                  {/* https://casesandberg.github.io/react-color/ */}
                  <ChromePicker />
                </FormField>
                <FormField>
                  <h3>
                    nsfw?
                    <HelpTooltip>
                      Assigning nsfw status is a courtesy to let Wizards of all
                      ages and backgrounds to safely enjoy the Lore. A good rule
                      of thumb is nsfw should be enabled if the Lore is
                      inappropriate for minors. If you have questions about when
                      to use this switch, see the Community Guidelines.
                    </HelpTooltip>
                  </h3>
                  <NSFWToggle name="nsfw" />
                </FormField>
                <FormField>
                  <button type="submit">Submit</button>
                </FormField>
              </FormPanel>
              <PreviewPanel>
                <h3>Preview</h3>
              </PreviewPanel>
            </AddLoreLayout>
          </Form>
        </Formik>
      </AddLoreWrapper>
    </Layout>
  );
};
export default AddLorePage;
