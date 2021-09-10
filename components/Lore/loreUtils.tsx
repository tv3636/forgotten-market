import { LorePageData } from "./types";

import IndividualLorePage, {
  CoreWizardPage,
  EmptyLorePage,
} from "./IndividualLorePage";
import React from "react";

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

export function typeSetterV2({
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
    <EmptyLorePage />
  );

  components.previousPage = lorePageData.prevRightPage ? (
    <IndividualLorePage
      loreMetadataURI={lorePageData.prevRightPage.loreMetadataURI}
    />
  ) : (
    <EmptyLorePage />
  );

  components.nextPage = lorePageData.nextLeftPage ? (
    <IndividualLorePage
      loreMetadataURI={lorePageData.nextLeftPage.loreMetadataURI}
    />
  ) : (
    <CoreWizardPage wizardId={wizardId} />
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
  } else {
    const prevWizardNum = wizardNum > 0 ? wizardNum - 1 : 0;
    previousPageRoute = {
      as: `/lore/${prevWizardNum}/0`,
      wizardId: prevWizardNum,
      loreIdx: 0,
    };
  }

  // Figure out next route
  if (lorePageData.nextLeftPage) {
    nextPageRoute = {
      as: `/lore/${wizardNum}/${pageNum + 1}`,
      wizardId: wizardNum,
      loreIdx: pageNum + 1,
    };
  } else {
    nextPageRoute = {
      as: `/lore/${wizardNum + 1}/0`,
      wizardId: wizardNum + 1,
      loreIdx: 0,
    };
  }

  return {
    components,
    previousPageRoute,
    nextPageRoute,
  };
}
