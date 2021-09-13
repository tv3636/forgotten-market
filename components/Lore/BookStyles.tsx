import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { AnimatePresence, motion } from "framer-motion";
import { LorePageData } from "./types";
import { typeSetterV2 } from "./loreUtils";
import productionWizardData from "../../data/nfts-prod.json";
import LoreAnimations from "./LoreAnimations";

export const BookElement = styled(motion.div)``;

export const Carousel = styled(motion.div)`
  box-sizing: border-box;
  position: relative;
  padding: 0 40px;
  @media (max-width: 768px) {
    padding: 0 2px;
  }
`;

export const Spread = styled(motion.div)<{
  layoutId: string;
  bg: string;
  bgL: string;
  bgR: string;
}>`
  display: grid;
  gap: 0px 0px;
  position: relative;

  & > * {
    /* border: 1px solid red; */
  }

  .bg {
    background-color: ${(props) => props.bg};
  }
  .bgL {
    background-color: ${(props) => props.bgL};
  }
  .bgR {
    background-color: ${(props) => props.bgR};
  }

  grid-template-areas:
    "lefttopcorner topborder1 lefttopbinding  righttopbinding  topborder2 righttopcorner"
    "leftborder    pagebody1  leftpagebinding rightpagebinding pagebody2  rightborder"
    "leftbotcorner botborder1 leftbotbinding  rightbotbinding  botborder2 rightbotcorner";

  // the 300px here is the sum of:
  // top nav + top border row + bottom border row + pagination controls + any padding
  grid-template-rows: 78px minmax(0, min(calc(100vh - 350px), 600px)) 80px;
  grid-template-columns: 69px minmax(0, 1fr) 39px 39px minmax(0, 1fr) 69px;

  @media (max-width: 768px) {
    grid-template-areas:
      "lefttopcorner pagebody1 pagebody1 pagebody1  pagebody1 righttopcorner"
      "leftborder    pagebody1  pagebody1 pagebody1 pagebody1  rightborder"
      "leftborder    pagebody2  pagebody2 pagebody2 pagebody2  rightborder"
      "leftbotcorner botborder1 botborder1  botborder1  botborder1 rightbotcorner";

    grid-template-rows: 74px max-content max-content 74px;

    /* grid-template-columns: 71px minmax(0, 1fr) 52px 0px 0px 0px; */
    /* grid-template-rows: 74px minmax(0, calc(100vh - 350px)) 74px; */
  }
`;

export const LeftTopCorner = styled(motion.div)`
  background-image: url("/static/lore/book/slices/corner_top_left.png");
  background-repeat: no-repeat;
  background-position: left top;
  grid-area: lefttopcorner;
  ${(props) => (props.onClick ? "cursor: pointer;" : "")}
`;
export const RightTopCorner = styled(motion.div)`
  background-image: url("/static/lore/book/slices/corner_top_right.png");
  background-repeat: no-repeat;
  background-position: right top;
  grid-area: righttopcorner;
  ${(props) => (props.onClick ? "cursor: pointer;" : "")}
`;
export const LeftBotCorner = styled(motion.div)`
  background-image: url("/static/lore/book/slices/corner_bottom_left.png");
  background-repeat: no-repeat;
  background-position: left top;
  grid-area: leftbotcorner;
  ${(props) => (props.onClick ? "cursor: pointer;" : "")}
`;
export const RightBotCorner = styled(motion.div)`
  background-image: url("/static/lore/book/slices/corner_bottom_right.png");
  background-repeat: no-repeat;
  background-position: right top;
  grid-area: rightbotcorner;
  ${(props) => (props.onClick ? "cursor: pointer;" : "")}
`;

export const LeftBorder = styled(motion.div)`
  background-image: url("/static/lore/book/slices/side_left_tile.png");
  background-repeat: repeat-y;
  background-position: left top;
  grid-area: leftborder;
  ${(props) => (props.onClick ? "cursor: pointer;" : "")}
`;
export const RightBorder = styled(motion.div)`
  background-image: url("/static/lore/book/slices/side_right_tile.png");
  background-repeat: repeat-y;
  background-position: right top;
  grid-area: rightborder;
  ${(props) => (props.onClick ? "cursor: pointer;" : "")}
`;

export const TopBorder1 = styled(motion.div)`
  grid-area: topborder1;
  background-image: url("/static/lore/book/slices/top_left_tile.png");
  background-repeat: repeat-x;
  background-position: left top;
`;
export const TopBorder2 = styled(motion.div)`
  grid-area: topborder2;
  background-image: url("/static/lore/book/slices/top_left_tile.png");
  background-repeat: repeat-x;
  background-position: right top;
`;

export const BotBorder1 = styled(motion.div)`
  background-image: url("/static/lore/book/slices/bottom_left_tile.png");
  background-repeat: repeat-x;
  background-position: left top;
  grid-area: botborder1;
`;
export const BotBorder2 = styled(motion.div)`
  background-image: url("/static/lore/book/slices/bottom_right_tile.png");
  background-repeat: repeat-x;
  background-position: right top;
  grid-area: botborder2;
`;

export const LeftPageBinding = styled(motion.div)`
  background-image: url("/static/lore/book/slices/center_left_tile.png");
  background-position: left top;
  grid-area: leftpagebinding;
`;

export const RightPageBinding = styled(motion.div)`
  background-image: url("/static/lore/book/slices/center_right_tile.png");
  background-position: right top;
  grid-area: rightpagebinding;
`;

export const LeftTopBinding = styled(motion.div)`
  background-image: url("/static/lore/book/slices/center_top_left.png");
  background-position: left top;
  grid-area: lefttopbinding;
  border-top-right-radius: 25%;
`;
export const RightTopBinding = styled(motion.div)`
  background-image: url("/static/lore/book/slices/center_top_right.png");
  background-position: right top;
  grid-area: righttopbinding;
  border-top-left-radius: 25%;
`;

export const LeftBotBinding = styled(motion.div)`
  background-image: url("/static/lore/book/slices/center_bottom_left.png");
  background-position: left top;
  grid-area: leftbotbinding;
  border-bottom-left-radius: 15%;
`;
export const RightBotBinding = styled(motion.div)`
  background-image: url("/static/lore/book/slices/center_bottom_right.png");
  background-position: right top;
  grid-area: rightbotbinding;
  border-bottom-right-radius: 15%;
`;

export const PreviousPageBody = styled(motion.div)`
  position: relative;
`;
export const NextPageBody = styled(motion.div)`
  position: relative;
`;

export const PageBody1 = styled(motion.div)`
  grid-area: pagebody1;
  position: relative;
`;
export const PageBody2 = styled(motion.div)`
  grid-area: pagebody2;
  position: relative;
`;

export const PageBodyFront = styled(motion.div)`
  background-color: green;
`;
export const PageBodyBack = styled(motion.div)`
  background-color: green;
`;
