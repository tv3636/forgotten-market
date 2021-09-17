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
  wizardNum,
  lorePageData,
}: {
  wizardNum: number;
  lorePageData: LorePageData;
}) {
  const components: LoreBookPageComponents = {
    currentLeftPage: null,
    currentRightPage: null,
  };

  components.currentLeftPage = !lorePageData.leftPage.isEmpty ? (
    <IndividualLorePage
      bgColor={lorePageData.leftPage.bgColor ?? "black"}
      title={lorePageData.leftPage.title}
      story={lorePageData.leftPage.story}
    />
  ) : (
    <CoreWizardPage wizardId={wizardNum.toString()} />
  );

  components.currentRightPage = !lorePageData.rightPage.isEmpty ? (
    <IndividualLorePage
      bgColor={lorePageData.rightPage.bgColor ?? "black"}
      title={lorePageData.rightPage.title}
      story={lorePageData.rightPage.story}
    />
  ) : (
    <EmptyLorePage
      wizardNum={wizardNum}
      pageNum={lorePageData.rightPage?.pageNumber ?? 0}
    />
  );

  return {
    components,
  };
}
