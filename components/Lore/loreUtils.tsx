import { LorePageData } from "./types";

import IndividualLorePage, {
  CoreWizardPage,
  EmptyLorePage,
} from "./IndividualLorePage";
import React from "react";
import * as net from "net";

export type LoreBookPageComponents = {
  previousPage: any;
  currentLeftPage: any;
  currentRightPage: any;
  nextPage: any;
};

export type WizardLorePageRoute = {
  as: string;
  wizardId: number;
  loreIdx: number;
};

export function typeSetter({
  wizardId,
  pageNum,
  lorePageData,
}: {
  wizardId: string;
  pageNum: number;
  lorePageData: LorePageData;
}) {
  const wizardNum = parseInt(wizardId);

  const components: LoreBookPageComponents = {
    previousPage: null,
    currentLeftPage: null,
    currentRightPage: null,
    nextPage: null,
  };

  components.currentLeftPage = lorePageData.leftPage ? (
    <IndividualLorePage
      loreMetadataURI={lorePageData.leftPage.loreMetadataURI}
    />
  ) : (
    <CoreWizardPage wizardId={wizardId} />
  );

  components.currentRightPage = lorePageData.rightPage ? (
    <IndividualLorePage
      loreMetadataURI={lorePageData.rightPage.loreMetadataURI}
    />
  ) : (
    <EmptyLorePage wizardId={wizardNum} pageNum={pageNum} />
  );

  let previousPageRoute: WizardLorePageRoute | null = null;
  let nextPageRoute: WizardLorePageRoute | null = null;

  // Figure out previous route
  if (lorePageData.prevRightPage) {
    // Previous page could be this wizards or previous wizard's last
    const previousIdMatcher =
      lorePageData.prevRightPage.id.match(/^(\d+)-(\d+)$/);
    const previousPageWizNum = parseInt(previousIdMatcher?.[1] ?? "0");
    const previousPagePageNum =
      previousPageWizNum === wizardNum
        ? pageNum - 1
        : lorePageData.prevWizardPageCount > 0
        ? lorePageData.prevWizardPageCount - 1
        : 0;
    previousPageRoute = {
      as: `/lore/${previousPageWizNum}/${previousPagePageNum}`,
      wizardId: previousPageWizNum,
      loreIdx: previousPagePageNum,
    };
  }

  // Figure out next route
  if (lorePageData.nextLeftPage) {
    const nextIdMatcher = lorePageData.nextLeftPage.id.match(/^(\d+)-(\d+)$/);
    const nextPageWizNum = parseInt(nextIdMatcher?.[1] ?? "0");
    const nextPagePageNum = nextPageWizNum === wizardNum ? pageNum + 2 : 0;
    nextPageRoute = {
      as: `/lore/${nextPageWizNum}/${nextPagePageNum}`,
      wizardId: nextPageWizNum,
      loreIdx: nextPagePageNum,
    };
  }

  // console.log(previousPageRoute);
  // console.log(nextPageRoute);

  return {
    components,
    previousPageRoute,
    nextPageRoute,
  };
}
