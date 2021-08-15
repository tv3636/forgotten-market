import { css } from "@emotion/react";
import styled from "@emotion/styled";
import TextareaAutosize from "react-textarea-autosize";

export const FormField = styled.div`
  padding: 0.5em 0;
`;

export const textInputsCSS = css`
  padding: 0.5em;
  width: 100%;
  border-radius: 3px;
  border: none;
  font-size: 1.2em;
  background-color: #1f1f1f;
  color: white;
  ::placeholder {
    color: #ffffff36;
  }
`;

export const TextInput = styled.input`
  ${textInputsCSS};
`;

export const TextAreaAutosizeInput = styled(TextareaAutosize)`
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  ${textInputsCSS};
`;
