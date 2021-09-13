import {
  BookElement,
  BotBorder1,
  BotBorder2,
  Carousel,
  LeftBorder,
  LeftBotBinding,
  LeftBotCorner,
  LeftPageBinding,
  LeftTopBinding,
  LeftTopCorner,
  PageBody1,
  PageBody2,
  RightBorder,
  RightBotBinding,
  RightBotCorner,
  RightPageBinding,
  RightTopBinding,
  RightTopCorner,
  Spread,
  TopBorder1,
  TopBorder2,
} from "./BookStyles";
import { useRouter } from "next/router";
import { WizardLorePageRoute } from "./loreUtils";

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
  nextPageRoute,
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
