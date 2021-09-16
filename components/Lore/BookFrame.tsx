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
import { useEffect } from "react";

export type Props = {
  bg: string;
  bgL: string;
  bgR: string;
  controls?: JSX.Element | JSX.Element[];
  children: JSX.Element[];
  nextPageRoute: string | null;
  previousPageRoute: string | null;
};

const BookFrame = ({
  bg,
  bgL,
  bgR,
  controls,
  children,
  previousPageRoute,
  nextPageRoute,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    // Prefetch for faster loads hopefully
    if (previousPageRoute) router.prefetch(previousPageRoute);
    if (nextPageRoute) router.prefetch(nextPageRoute);
  }, []);

  const goToNextPage = nextPageRoute
    ? () => router.push(nextPageRoute)
    : undefined;

  const goToPrevPage = previousPageRoute
    ? () => router.push(previousPageRoute)
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
          <PageBody1 layoutId="pageBody1">{children[0]}</PageBody1>
          <LeftPageBinding className="bg bgL" layoutId="leftPageBinding" />
          <RightPageBinding className="bg bgR" layoutId="rightPageBinding" />
          <PageBody2 layoutId="pageBody2">{children[1]}</PageBody2>
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
