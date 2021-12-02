import BookOfLoreControls from "./BookOfLoreControls";
import { LorePageData } from "./types";
import { typeSetter } from "./loreUtils";
import BookFrame from "./BookFrame";
import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

export type Props = {
  loreTokenSlug: "wizards" | "souls";
  tokenId: number;
  lorePageData: LorePageData;
};

const Book = ({ loreTokenSlug, tokenId, lorePageData }: Props) => {
  const bg =
    loreTokenSlug === "wizards"
      ? "#" + wizData[tokenId.toString()].background_color
      : loreTokenSlug === "souls"
      ? "#" + (soulsData?.[tokenId.toString()]?.background_color ?? "00000")
      : "#000000";

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
      leftPageLoreIndex={lorePageData.leftPage?.loreIndex}
      rightPageLoreIndex={lorePageData.rightPage?.loreIndex}
      leftPageCreator={lorePageData.leftPage.creator}
      rightPageCreator={lorePageData.rightPage.creator}
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
