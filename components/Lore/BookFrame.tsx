import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { AnimatePresence, motion } from "framer-motion";
import { LorePageData } from "./types";
import { typeSetterV2 } from "./loreUtils";
import productionWizardData from "../../data/nfts-prod.json";
import LoreAnimations from "./LoreAnimations";
import {
  BookElement,
  Spread,
  Carousel,
  LeftTopCorner,
  TopBorder1,
  LeftTopBinding,
  RightTopBinding,
  TopBorder2,
  RightTopCorner,
  LeftBorder,
  PageBody1,
  LeftPageBinding,
  RightPageBinding,
  PageBody2,
  RightBorder,
  LeftBotCorner,
  BotBorder1,
  LeftBotBinding,
  RightBotBinding,
  BotBorder2,
  RightBotCorner
} from "./BookStyles";

export type Props = {
  bg: string;
  bgL: string;
  bgR: string;
  controls?: JSX.Element | JSX.Element[];
  children: JSX.Element[];
};

/**
 * The children prop is a bit non-standard: the children are treated as a specific array of four elements. The current left and right pages are index 1 and 2 respectively, with the previous and next being 0 and 4
 */

const BookFrame = ({ bg, bgL, bgR, controls, children }: Props) => {
  return (
    <LoreAnimations>
      <BookElement>
        <Carousel>
          <Spread bg={bg} bgL={bgL} bgR={bgR}>
            <LeftTopCorner />
            <TopBorder1 />
            <LeftTopBinding className="bg bgL" />
            <RightTopBinding className="bg bgR" />
            <TopBorder2 />
            <RightTopCorner />

            <LeftBorder />
            <PageBody1>{children[1]}</PageBody1>
            <LeftPageBinding className="bg bgL" />
            <RightPageBinding className="bg bgR" />
            <PageBody2
            // initial={{ rotateY: 0, left: 0 }}
            // exit={{ rotateY: -180, left: "calc(-100% - 8vw - 4px)" }}
            // transition={{ duration: 1 }}
            // key={layoutId}
            // layoutId={layoutId}
            >
              <AnimatePresence>{children[2]}</AnimatePresence>
            </PageBody2>
            <RightBorder />

            <LeftBotCorner />
            <BotBorder1 />
            <LeftBotBinding className="bg bgL" />
            <RightBotBinding className="bg bgR" />
            <BotBorder2 />
            <RightBotCorner />
          </Spread>
        </Carousel>
        {controls}
      </BookElement>
    </LoreAnimations>
  );
};

export default BookFrame;
