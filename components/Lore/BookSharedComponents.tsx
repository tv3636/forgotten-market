import * as React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const LoreNameWrapper = styled(motion.div)<{ layoutId: string }>`
  background-image: url("/static/lore/book/page_border_header_top.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 320px;
  min-width: 320px;
  min-height: 60px;
  padding: 12px 20px 12px 26px;
  font-family: "Alagard", serif;
  word-break: break-word;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
