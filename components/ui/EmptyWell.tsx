import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

export const EmptyWell = styled.div<{ solid?: boolean }>`
  border-radius: 5px;
  border: 2px ${(props) => (props.solid ? "solid" : "dashed")}
    rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;

  padding: 10px 20px;
  @media (min-width: 768px) {
    padding: 32px 60px;
  }
`;
