import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { AnimatePresence, motion } from "framer-motion";
import { LorePageData } from "./types";
import { typeSetterV2, WizardLorePageRoute } from "./loreUtils";
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
  RightBotCorner,
} from "./BookStyles";
import { useRouter } from "next/router";

export type Props = {
  bg: string;
  bgL: string;
  bgR: string;
  controls?: JSX.Element | JSX.Element[];
  children: JSX.Element[];
  nextPageRoute: WizardLorePageRoute | null;
  previousPageRoute: WizardLorePageRoute | null;
};

/**
 * The children prop is a bit non-standard: the children are treated as a specific array of four elements. The current left and right pages are index 1 and 2 respectively, with the previous and next being 0 and 4
 */

const BookFrame = ({
  bg,
  bgL,
  bgR,
  controls,
  children,
  previousPageRoute,
  nextPageRoute
}: Props) => {
  const prevPageUrl = previousPageRoute?.as;
  const nextPageUrl = nextPageRoute?.as;
  const router = useRouter();

  const goToNextPage = nextPageUrl
    ? () => {
        if (nextPageUrl) {
          router.push(nextPageUrl);
        }
      }
    : undefined;

  const goToPrevPage = prevPageUrl
    ? () => {
        if (prevPageUrl) {
          router.push(prevPageUrl);
        }
      }
    : undefined;

  return (
    <BookElement>
      <Carousel layoutId="bookCarousel">
        <Spread layoutId="bookSpread" bg={bg} bgL={bgL} bgR={bgR}>
          <LeftTopCorner layoutId="bookLeftTopCover" onClick={goToPrevPage} />
          <TopBorder1 layoutId="bookTopBorder1" />
          <LeftTopBinding className="bg bgL" layoutId="bookLeftTopBinding" />
          <RightTopBinding className="bg bgR" layoutId="bookRightTopBinding" />
          <TopBorder2 layoutId="bookTopBorder2" />
          <RightTopCorner
            layoutId="bookRightTopCorner"
            onClick={goToNextPage}
          />

          <LeftBorder layoutId="leftBorder" onClick={goToPrevPage} />
          <PageBody1 layoutId="pageBody1">{children[1]}</PageBody1>
          <LeftPageBinding className="bg bgL" layoutId="leftPageBinding" />
          <RightPageBinding className="bg bgR" layoutId="rightPageBinding" />
          <PageBody2
            // initial={{ rotateY: 0, left: 0 }}
            // exit={{ rotateY: -180, left: "calc(-100% - 8vw - 4px)" }}
            // transition={{ duration: 1 }}
            // key={layoutId}
            // layoutId={layoutId}
            layoutId="pageBody2"
          >
            {children[2]}
          </PageBody2>
          <RightBorder layoutId="rightBorder" onClick={goToNextPage} />

          <LeftBotCorner layoutId="leftBotCorner" onClick={goToPrevPage} />
          <BotBorder1 layoutId="botBorder1" />
          <LeftBotBinding className="bg bgL" layoutId="leftBotBinding" />
          <RightBotBinding className="bg bgR" layoutId="rightBotBinding" />
          <BotBorder2 layoutId="botBorder2" />
          <RightBotCorner layoutId="rightBotCorner" onClick={goToNextPage} />
        </Spread>
      </Carousel>
      {controls}
    </BookElement>
  );
};

export default BookFrame;
