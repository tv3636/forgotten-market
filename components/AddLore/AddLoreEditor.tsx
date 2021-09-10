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

type Props = {};

const AddLoreEditorElement = styled.div`
  color: white; // TODO use the color from the background picker
  font-family: "Alagard";
  height: 100%;
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

export default function AddLoreEditor({}: Props) {
  //   const [editorState, setEditorState] = useState(() =>
  //     EditorState.createEmpty()
  //   );

  // https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(emptyContentState)
  );

  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText("hi"))
    );
  }, []);

  return (
    <AddLoreEditorElement>
      <Editor
        editorKey={"key-here"}
        editorState={editorState}
        // onChange={setEditorState}
        onChange={(editorState) => {
          setEditorState(editorState);
          //   onChange(editorState.getCurrentContent().getPlainText());
        }}
        userSelect="none"
        contentEditable={false}
        plugins={plugins}
      />
    </AddLoreEditorElement>
  );
}
