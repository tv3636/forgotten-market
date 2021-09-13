import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import { AnimatePresence, motion } from "framer-motion";
import { LorePageData } from "./types";
import { typeSetter } from "./loreUtils";
import productionWizardData from "../../data/nfts-prod.json";
import LoreAnimations from "./LoreAnimations";
import BookFrame from "./BookFrame";

const wizData = productionWizardData as { [wizardId: string]: any };

export type Props = {
  wizardId: string;
  page: string;
  lorePageData: LorePageData;
};

const Book = ({ wizardId, page, lorePageData }: Props) => {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  const { components, previousPageRoute, nextPageRoute } = typeSetter({
    wizardId,
    pageNum: parseInt(page),
    lorePageData: lorePageData,
  });

  const { previousPage, currentLeftPage, currentRightPage, nextPage } =
    components;

  const controls = (
    <BookOfLoreControls
      wizardId={wizardId as string}
      page={page as string}
      previousPageRoute={previousPageRoute}
      nextPageRoute={nextPageRoute}
    />
  );

  return (
    <BookFrame
      bg={bg}
      bgL={bg}
      bgR={bg}
      controls={controls}
      previousPageRoute={previousPageRoute}
      nextPageRoute={nextPageRoute}
    >
      {previousPage}
      {currentLeftPage}
      {currentRightPage}
      {nextPage}
    </BookFrame>
  );
};

export default Book;
