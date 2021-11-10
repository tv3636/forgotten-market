import BookOfLoreControls from "./BookOfLoreControls";
import { LorePageData } from "./types";
import { typeSetter } from "./loreUtils";
import productionWizardData from "../../data/nfts-prod.json";
import BookFrame from "./BookFrame";

const wizData = productionWizardData as { [wizardId: string]: any };

export type Props = {
  loreTokenSlug: "wizards" | "souls";
  tokenId: number;
  lorePageData: LorePageData;
};

const Book = ({ loreTokenSlug, tokenId, lorePageData }: Props) => {
  const bg =
    loreTokenSlug === "wizards"
      ? "#" + wizData[tokenId.toString()].background_color
      : "#00000";

  const { components } = typeSetter({
    loreTokenSlug,
    tokenId,
    lorePageData,
  });

  const { currentLeftPage, currentRightPage } = components;

  const controls = (
    <BookOfLoreControls
      loreTokenSlug={loreTokenSlug}
      tokenId={tokenId}
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
