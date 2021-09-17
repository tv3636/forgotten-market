import BookOfLoreControls from "./BookOfLoreControls";
import { LorePageData } from "./types";
import { typeSetter } from "./loreUtils";
import productionWizardData from "../../data/nfts-prod.json";
import BookFrame from "./BookFrame";

const wizData = productionWizardData as { [wizardId: string]: any };

export type Props = {
  wizardNum: number;
  lorePageData: LorePageData;
};

const Book = ({ wizardNum, lorePageData }: Props) => {
  const wizardData: any = wizData[wizardNum.toString()];
  const bg = "#" + wizardData.background_color;

  const { components } = typeSetter({
    wizardNum,
    lorePageData,
  });

  const { currentLeftPage, currentRightPage } = components;

  const controls = (
    <BookOfLoreControls
      wizardNum={wizardNum}
      previousPageRoute={lorePageData.previousPageRoute}
      nextPageRoute={lorePageData.nextPageRoute}
    />
  );

  return (
    <BookFrame
      bg={bg}
      bgL={lorePageData.leftPage?.bgColor ?? "#000000"}
      bgR={lorePageData.rightPage?.bgColor ?? "#000000"}
      controls={controls}
      previousPageRoute={lorePageData.previousPageRoute}
      nextPageRoute={lorePageData.nextPageRoute}
    >
      {currentLeftPage}
      {currentRightPage}
    </BookFrame>
  );
};

export default Book;
