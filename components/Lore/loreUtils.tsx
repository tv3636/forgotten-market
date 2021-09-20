import { LorePageData } from "./types";

import IndividualLorePage, {
  CoreWizardPage,
  EmptyLorePage,
} from "./IndividualLorePage";
import React from "react";

export type LoreBookPageComponents = {
  currentLeftPage: any;
  currentRightPage: any;
};

export type WizardLorePageRoute = {
  as: string;
  wizardId: number;
  loreIdx: number;
};

export function typeSetter({
  loreTokenSlug,
  tokenId,
  lorePageData,
}: {
  loreTokenSlug: string;
  tokenId: number;
  lorePageData: LorePageData;
}) {
  const components: LoreBookPageComponents = {
    currentLeftPage: null,
    currentRightPage: null,
  };

  components.currentLeftPage = !lorePageData.leftPage.isEmpty ? (
    <IndividualLorePage
      bgColor={lorePageData.leftPage.bgColor ?? "#000000"}
      title={lorePageData.leftPage.title}
      story={lorePageData.leftPage.story}
    />
  ) : loreTokenSlug === "wizards" ? (
    <CoreWizardPage wizardId={tokenId.toString()} />
  ) : null;

  components.currentRightPage = !lorePageData.rightPage.isEmpty ? (
    <IndividualLorePage
      bgColor={lorePageData.rightPage.bgColor ?? "#000000"}
      title={lorePageData.rightPage.title}
      story={lorePageData.rightPage.story}
    />
  ) : loreTokenSlug === "wizards" ? (
    <EmptyLorePage
      wizardNum={tokenId}
      pageNum={lorePageData.rightPage?.pageNumber ?? 0}
    />
  ) : null;

  return {
    components,
  };
}

export function getLoreUrl(
  loreTokenSlug: string,
  tokenId: number,
  pageNum: number
) {
  return `/lore/${loreTokenSlug}/${tokenId}/${pageNum}`;
}
