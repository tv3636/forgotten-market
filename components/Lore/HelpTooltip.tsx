import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

type Props = { children: any };

const HelpTooltipElement = styled.div`
  display: inline;
  position: relative;
  margin-left: 0.5em;
`;
const TooltipContent = styled.div<{ visible?: boolean }>`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  left: 42px;
  top: -24px;
  width: 350px;
  background-color: white;
  padding: 1em;
  border-radius: 5px;
  color: black;
  z-index: 10;
`;
const TooltipIcon = styled.a`
  border-radius: 50%;
  background-color: #ffffff1a;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const QuestionImg = styled.img`
  image-rendering: pixelated;
  max-height: 16px;
`;

export default function HelpTooltip({ children }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <HelpTooltipElement
      onMouseOver={() => setIsVisible(true)}
      onMouseOut={() => setIsVisible(false)}
    >
      <TooltipIcon href="#">
        <QuestionImg src="/static/img/icons/questionmark_hover.png" />
      </TooltipIcon>
      <TooltipContent visible={isVisible}>{children}</TooltipContent>
    </HelpTooltipElement>
  );
}
