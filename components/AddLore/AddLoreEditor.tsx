import * as React from "react";
import { useMemo, useState } from "react";
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
import { draftToMarkdown } from "markdown-draft-js";
import markdownToDraft from "./customMarkdownToDraft";
import { css, keyframes } from "@emotion/react";
import { loreTextStyles } from "../Lore/loreStyles";
import { useExtractColors } from "../../hooks/useExtractColors";
import { IPFS_SERVER } from "../../constants";

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

export const markdownToDraftState = (text: string) => {
  const rawData = markdownToDraft(text, {
    blockTypes: {
      image: function (item: any) {
        return {
          type: "atomic",
          text: " ",
          entityRanges: [],
          inlineStyleRanges: [],
        };
      },
    },

    blockEntities: {
      image: function (item: any) {
        console.log(item);
        let newSrc: string;
        const src = item.src;
        if (src?.startsWith("ipfs://")) {
          newSrc = src.replace(/^ipfs:\/\//, IPFS_SERVER);
        } else {
          newSrc = src;
        }

        console.log(newSrc);

        return {
          type: "IMAGE",
          mutability: "IMMUTABLE",
          data: {
            src: newSrc,
          },
        };
      },
    },
  });
  console.log(rawData);

  // @ts-ignore
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
  currentEditorState: EditorState;
  setCurrentEditorState: (editorState: EditorState) => void;
  onBgColorChanged: (newColor?: string | null | undefined) => void;
  bg: string;
  isLoading: boolean;
};

export default function AddLoreEditor({
  currentEditorState,
  setCurrentEditorState,
  onBgColorChanged,
  bg,
  isLoading,
}: Props) {
  // extract the background color of the first image uploaded
  const [firstImageUrl, setFirstImageUrl] = useState<string | undefined>();
  const backgroundColor = useExtractColors(firstImageUrl);
  if (backgroundColor?.bgColor && onBgColorChanged) {
    onBgColorChanged(backgroundColor.bgColor);
  }

  const dragNDropFileUploadPlugin = useMemo(
    () =>
      createDragNDropUploadPlugin({
        handleUpload: mockUpload,
        // @ts-ignore
        addImage: (
          editorState: EditorState,
          url: string,
          extraData: Record<string, unknown>
        ) => {
          console.log("imagine");
          if (!firstImageUrl) {
            setFirstImageUrl(url);
          }
          const state = imagePlugin.addImage(editorState, url, extraData);
          console.log(state);
          return state;
        },
      }),
    [setFirstImageUrl]
  );

  const plugins = useMemo(
    () => [...topLevelPlugins, dragNDropFileUploadPlugin],
    [dragNDropFileUploadPlugin]
  );

  return (
    <AddLoreEditorElement bg={bg} isLoading={isLoading}>
      <Editor
        editorKey={"key-here"}
        editorState={currentEditorState}
        // onChange={setEditorState}
        onChange={setCurrentEditorState}
        // userSelect="none"
        // contentEditable={false}
        plugins={plugins}
      />
    </AddLoreEditorElement>
  );
}
