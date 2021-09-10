import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { EditorState } from "draft-js";
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "@draft-js-plugins/focus";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createDragNDropUploadPlugin from "@draft-js-plugins/drag-n-drop-upload";
import createResizeablePlugin from "@draft-js-plugins/resizeable";

type Props = {};

const AddLoreEditorElement = styled.div`
  color: white;
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

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin();
/*
    {
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage
}
*/

const plugins = [
  dragNDropFileUploadPlugin,
  createMarkdownShortcutsPlugin(),
  blockDndPlugin,
  focusPlugin,
  //   resizeablePlugin,
  imagePlugin
];

export default function AddLoreEditor({}: Props) {
  const [value, setValue] = useState(defaultText);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  return (
    <AddLoreEditorElement>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
      />
    </AddLoreEditorElement>
  );
}
