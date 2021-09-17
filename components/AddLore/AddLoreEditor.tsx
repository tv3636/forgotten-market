import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "@draft-js-plugins/focus";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createDragNDropUploadPlugin from "@draft-js-plugins/drag-n-drop-upload";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import { getContrast } from "../../lib/colorUtils";
import productionWizardData from "../../data/nfts-prod.json";
import { titlePrompts } from "./addLoreHelpers";
import { sample } from "lodash";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import { css, keyframes } from "@emotion/react";
import { loreTextStyles } from "../Lore/loreStyles";

const wizData = productionWizardData as { [wizardId: string]: any };

const pulse = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% {  opacity: 0.3; }
`;

const AddLoreEditorElement = styled.div<{ bg?: string; isLoading: boolean }>`
  color: ${(props) => getContrast(props.bg || "#000000")};
  font-family: "Alagard";
  height: 100%;
  width: 100%;
  padding: 1em;

  ${loreTextStyles};

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-top: 0.5em;
  }
  .DraftEditor-editorContainer {
    z-index: 0 !important;
  }

  figure {
    margin: 0;

    img {
      width: 100%;
      height: auto;
    }
  }

  ${(props) =>
    props.isLoading
      ? css`
          animation: ${pulse} 3s infinite ease-in-out;
        `
      : ""}
`;

// https://www.draft-js-plugins.com/plugin/mention
const resizeablePlugin = createResizeablePlugin();
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
// https://www.draft-js-plugins.com/plugin/image
const imagePlugin = createImagePlugin({ decorator });

const mockUpload = (...args: any) => {
  // console.log("args: ", args);
  return true;
};

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  // @ts-ignore
  addImage: imagePlugin.addImage,
});

const topLevelPlugins = [
  dragNDropFileUploadPlugin,
  createMarkdownShortcutsPlugin(),
  blockDndPlugin,
  focusPlugin,
  resizeablePlugin,
  imagePlugin,
];

const markdownToDraftState = (text: string) => {
  const rawData = markdownToDraft(text);
  const contentState = convertFromRaw(rawData);
  return EditorState.createWithContent(contentState);
};

// https://github.com/Rosey/markdown-draft-js/pull/49#issuecomment-775247720
export const convertDraftStateToMarkdown = (
  state: EditorState
): { markdown: string; headers: string[] } => {
  const raw = convertToRaw(state.getCurrentContent());
  // console.log("raw: ", raw);

  let headers: string[] = [];

  const markdown = draftToMarkdown(convertToRaw(state.getCurrentContent()), {
    styleItems: {
      "header-one": {
        open: function (entity: any) {
          headers.push(entity.text);
          return "# ";
        },

        close: function () {
          return "";
        },
      },
    },
    entityItems: {
      IMAGE: {
        open: function (entity: any) {
          return "";
        },
        close: function (entity: any) {
          console.log("entity: ", entity);
          // one idea is that we convert this method to async and then upload and replace these URLs right here
          return `![](${entity["data"].src})`;
        },
      },
    },
  });
  return { markdown, headers };
};

type Props = {
  onChange: (editorState: any) => void;
  bg: string;
  wizardId: string | undefined;
  isLoading: boolean;
};

const defaultPrompt = "_Please pick a Wizard on the other page_";
export default function AddLoreEditor({
  onChange,
  bg,
  wizardId,
  isLoading,
}: Props) {
  const ref = useRef<Editor>(null);

  // https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
  const [editorState, setEditorState] = useState(
    markdownToDraftState(defaultPrompt)
  );

  const performOnChange = (newEditorState: any) => {
    setEditorState(newEditorState);
    onChange(newEditorState);
  };

  useEffect(() => {
    const titlePrompt = sample(titlePrompts);
    const defaultText = wizardId
      ? `# ${titlePrompt} ${wizData[wizardId].name}
## Part 1
Our hero finds themselves surrounded by a...`
      : defaultPrompt;
    const newEditorState = markdownToDraftState(defaultText);

    // lame, I know
    // dirty tracking is hard. ideally we want to update with any new wizard
    // picked, as long as the _user_ didn't type in the Draft field
    const text = editorState.getCurrentContent().getPlainText("\u0001");
    if (text.match(/Please pick a Wizard/)) {
      performOnChange(newEditorState);
    }
  }, [wizardId]);

  const plugins = topLevelPlugins;

  // I don't understand why this needs to be in a useMemo, but it's part of the docs
  /*
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);
  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [...topLevelPlugins, mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }: { value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);
  */

  return (
    <AddLoreEditorElement bg={bg} isLoading={isLoading}>
      <Editor
        editorKey={"key-here"}
        editorState={editorState}
        // onChange={setEditorState}
        onChange={performOnChange}
        // userSelect="none"
        // contentEditable={false}
        plugins={plugins}
      />
      {/* <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
      /> */}
    </AddLoreEditorElement>
  );
}
