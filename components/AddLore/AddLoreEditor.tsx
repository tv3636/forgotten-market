import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ContentState, convertFromRaw, EditorState } from "draft-js";
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "@draft-js-plugins/focus";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createDragNDropUploadPlugin from "@draft-js-plugins/drag-n-drop-upload";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import { markdownToDraft } from "markdown-draft-js";
import { getContrast } from "../../lib/colorUtils";

const AddLoreEditorElement = styled.div<{ bg?: string }>`
  color: ${(props) => getContrast(props.bg || "#000000")};
  font-family: "Alagard";
  height: 100%;
  width: 100%;
  padding: 1em;

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
`;

const defaultText = `
Okay **bold** _italic_ Got the typing here.

Here is my story

# Title
## H2
### h3
#### h4

> Blockquote

A [link](https://url.com)
`;

const resizeablePlugin = createResizeablePlugin();
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const mockUpload = () => true;

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage
});

const plugins = [
  dragNDropFileUploadPlugin,
  createMarkdownShortcutsPlugin(),
  blockDndPlugin,
  focusPlugin,
  //   resizeablePlugin,
  imagePlugin
];

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: []
    }
  ]
});

type Props = {
  onChange: (editorState: any) => void;
  bg: string;
};
export default function AddLoreEditor({ onChange, bg }: Props) {
  // https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );

  const performOnChange = (editorState: any) => {
    setEditorState(editorState);
    onChange(editorState);
    //   onChange(editorState.getCurrentContent().getPlainText());
  };

  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText("hi"))
    );
  }, []);

  return (
    <AddLoreEditorElement bg={bg}>
      <Editor
        editorKey={"key-here"}
        editorState={editorState}
        // onChange={setEditorState}
        onChange={performOnChange}
        userSelect="none"
        contentEditable={false}
        plugins={plugins}
      />
    </AddLoreEditorElement>
  );
}
