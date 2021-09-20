import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { motion, AnimateSharedLayout } from "framer-motion";
type Props = {
  children: any;
};

export default function LoreSharedLayout({ children }: Props) {
  return children;
  //   return (
  //     <AnimateSharedLayout>
  //       <motion.div layout>{children}</motion.div>
  //     </AnimateSharedLayout>
  //   );
}
