import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

type Props = {
  children?: React.ReactNode;
  size?: string;
  onClick?: any;
  theme?: "light" | "dark";
};

const ButtonElement = styled.a<Props>`
  display: inline-block;
  text-align: center;

  ${(props) => {
    switch (props.size) {
      case "small": {
        return ``;
      }
      case "large": {
        return `
        `;
      }
      case "medium":
      default: {
        return `
        padding: 0.8em 1em;
        border-radius: 3px;
        font-family: "Alagard";
        font-size: 20px;
        `;
      }
    }
  }}

  ${(props) => {
    // we can add more themes like green/primary etc.
    switch (props.theme) {
      case "light": {
        return ``;
      }
      case "dark":
      default: {
        return `
        color: white;
        background-color: #393246;

        &:hover {
          color: #cccccc;
          background-color: #2a2433;
        }
        `;
      }
    }
  }}
`;

export default function Button(props: Props) {
  const { children } = props;
  return <ButtonElement {...props}>{children}</ButtonElement>;
}
