import * as React from "react";
import { useEffect, useState } from "react";
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
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";
import { storyPrompts, titlePrompts } from "./addLoreHelpers";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import { css, keyframes } from "@emotion/react";
import { loreTextStyles } from "../Lore/loreStyles";
import { useExtractColors } from "../../hooks/useExtractColors";
import {
  isSoulsContract,
  isWizardsContract,
} from "../../contracts/ForgottenRunesWizardsCultContract";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

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
  // console.log("mockUpload: ", args);
  return true;
};

const topLevelPlugins = [
  // dragNDropFileUploadPlugin,
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
  onBgColorChanged: (newColor?: string | null | undefined) => void;
  bg: string;
  tokenId: string | undefined;
  tokenAddress: string | undefined;
  isLoading: boolean;
};

const defaultPrompt = "_Please pick a Wizard on the other page_";
export default function AddLoreEditor({
  onChange,
  onBgColorChanged,
  bg,
  tokenId,
  tokenAddress,
  isLoading,
}: Props) {
  // https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
  const [editorState, setEditorState] = useState(
    markdownToDraftState(defaultPrompt)
  );

  const performOnChange = (newEditorState: any) => {
    setEditorState(newEditorState);
    onChange(newEditorState);
  };

  useEffect(() => {
    const titlePrompt = titlePrompts[0];
    const storyPrompt = storyPrompts[0];

    let defaultText = defaultPrompt;

    if (tokenId && tokenAddress && isWizardsContract(tokenAddress)) {
      defaultText = `# ${titlePrompt} ${wizData[tokenId].name}\n${storyPrompt}`;
    } else if (tokenId && tokenAddress && isSoulsContract(tokenAddress)) {
      defaultText = `# ${titlePrompt} ${
        soulsData?.[tokenId]?.name ?? "a Soul"
      }\n${storyPrompt}`;
    }

    const newEditorState = markdownToDraftState(defaultText);

    // lame, I know
    // dirty tracking is hard. ideally we want to update with any new wizard
    // picked, as long as the _user_ didn't type in the Draft field
    const text = editorState.getCurrentContent().getPlainText("\u0001");
    // if (text.match(/Please pick a Wizard/)) {
    performOnChange(newEditorState);
    // }
  }, [tokenId, tokenAddress]);

  // extract the background color of the first image uploaded
  const [firstImageUrl, setFirstImageUrl] = useState<string | undefined>();
  const backgroundColor = useExtractColors(firstImageUrl);
  if (backgroundColor?.bgColor && onBgColorChanged) {
    onBgColorChanged(backgroundColor.bgColor);
  }

  const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: mockUpload,
    // @ts-ignore
    addImage: (
      editorState: EditorState,
      url: string,
      extraData: Record<string, unknown>
    ) => {
      if (!firstImageUrl) {
        setFirstImageUrl(url);
      }
      return imagePlugin.addImage(editorState, url, extraData);
    },
  });

  const plugins = [...topLevelPlugins, dragNDropFileUploadPlugin];

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
    </AddLoreEditorElement>
  );
}
