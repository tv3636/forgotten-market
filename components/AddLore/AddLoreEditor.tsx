import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

import dynamic from "next/dynamic";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

type Props = {};

const AddLoreEditorElement = styled.div`
  .w-md-editor {
    background-color: black;
    color: white;
  }
  .w-md-editor-text-pre,
  .wmde-markdown-color code[class*="language-"] {
    color: white;
    font-family: "Alagard";
  }
  .w-md-editor-text-pre .title,
  .w-md-editor-text-pre .bold {
    color: white !important;
    font-weight: bold;
  }
  .w-md-editor-text-pre .italic {
    color: white !important;
    font-style: italic;
  }
  .wmde-markdown-color code[class*="language-"] .token.operator,
  .wmde-markdown-color code[class*="language-"] .token.entity,
  .wmde-markdown-color code[class*="language-"] .token.url,
  .wmde-markdown-color code[class*="language-"] .token.variable {
    background-color: black;
  }
  .w-md-editor-text-pre .url {
    color: #84a8d2 !important;
  }
  span.token.title.important {
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

export default function AddLoreEditor({}: Props) {
  const [value, setValue] = useState(defaultText);

  return (
    <AddLoreEditorElement>
      <MDEditor
        value={value}
        onChange={setValue}
        hideToolbar={true}
        preview={"edit"}
        height={600}
      />
    </AddLoreEditorElement>
  );
}
