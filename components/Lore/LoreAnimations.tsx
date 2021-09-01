import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { AnimateSharedLayout } from "framer-motion";
type Props = {
  children: any;
};

export default function LoreAnimations({ children }: Props) {
  return <AnimateSharedLayout>{children}</AnimateSharedLayout>;
}
