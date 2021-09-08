import { WizardLorePages } from "./types";
import productionWizardData from "../../data/nfts-prod.json";
import { CoreWizardPage } from "./IndividualLorePage";
import first from "lodash/first";
import last from "lodash/last";
import get from "lodash/get";
import IndividualLorePage from "./IndividualLorePage";

const wizData = productionWizardData as { [wizardId: string]: any };

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
  wizardLorePages
}: {
  wizardId: string;
  pageNum: number;
  wizardLorePages: WizardLorePages;
}) {
  const { previousWizardLore, currentWizardLore, nextWizardLore } =
    wizardLorePages;

  const wizardNum = parseInt(wizardId);

  let components: LoreBookPageComponents = {
    previousPage: null,
    currentLeftPage: null,
    currentRightPage: null,
    nextPage: null
  };

  let previousPageRoute: WizardLorePageRoute | null = null;
  let nextPageRoute: WizardLorePageRoute | null = null;

  const coreWizardPage = <CoreWizardPage wizardId={wizardId} />;
  const numOfCurrentWizardsLore = (
    wizardLorePages.currentWizardLore?.lore || []
  ).length; // todo should we use the graphql pagination values for this?

  const previousLorePageIdx = pageNum > 0 ? Math.max(0, pageNum - 2) : null;
  const nextLoreIdx =
    pageNum + 1 < numOfCurrentWizardsLore ? pageNum + 2 : null;

  const previousWizardId = wizardNum - 1;
  const previousWizardsLastLore = last(
    wizardLorePages.previousWizardLore?.lore
  );
  const numOfPreviousWizardsLore = (
    wizardLorePages.previousWizardLore?.lore || []
  ).length; // todo should we use the graphql pagination values for this?
  const previousLoreId = Math.max(0, numOfPreviousWizardsLore - 1);
  const previousLoreRouteId = Math.max(
    0,
    numOfPreviousWizardsLore % 2 == 0
      ? numOfPreviousWizardsLore
      : numOfPreviousWizardsLore - 1
  );
  const currentWizardsLastLore = get(
    wizardLorePages.currentWizardLore?.lore,
    previousLoreId
  );

  const nextWizardId = wizardNum + 1;
  const nextWizardsFirstLore = first(wizardLorePages.previousWizardLore?.lore);
  const nextWizardsCoreWizardPage = (
    <CoreWizardPage wizardId={nextWizardId.toString()} />
  );

  // the first page for this wizard
  if (pageNum === 0) {
    // show the Wizard themselves on the left
    components.currentLeftPage = coreWizardPage;

    // the the page on the right
    const firstLore = get(wizardLorePages.currentWizardLore?.lore, 0);
    components.currentRightPage = (
      <IndividualLorePage
        wizardId={wizardNum}
        lore={firstLore}
        page={pageNum}
      />
    );

    // the previous page is the last lore of the previous wizard
    // but the route is one farther
    if (wizardNum > 0) {
      components.previousPage = (
        <IndividualLorePage
          wizardId={previousWizardId}
          lore={previousWizardsLastLore}
          page={pageNum}
        />
      );
      previousPageRoute = {
        as: `/lore/${previousWizardId}/${previousLoreRouteId}`,
        wizardId: previousWizardId,
        loreIdx: previousLoreRouteId
      };
    }
  } else {
    // if it's page 1+ for this Wizard...
    // show the Lore on the left
    const loreLeft = get(wizardLorePages.currentWizardLore?.lore, pageNum - 1);
    components.currentLeftPage = (
      <IndividualLorePage wizardId={wizardNum} lore={loreLeft} page={pageNum} />
    );

    // show the next lore on the right
    const loreRight = get(wizardLorePages.currentWizardLore?.lore, pageNum);
    components.currentRightPage = (
      <IndividualLorePage
        wizardId={wizardNum}
        lore={loreRight}
        page={pageNum}
      />
    );

    components.previousPage = (
      <IndividualLorePage
        wizardId={wizardNum}
        lore={currentWizardsLastLore}
        page={pageNum}
      />
    );
    previousPageRoute = {
      as: `/lore/${wizardId}/${previousLorePageIdx}`,
      wizardId: wizardNum,
      loreIdx: previousLorePageIdx as number
    };
  }

  const nextWizardPage = nextWizardsCoreWizardPage;
  const nextWizardPageRoute = {
    as: `/lore/${nextWizardId}/0`,
    wizardId: nextWizardId,
    loreIdx: 0
  };

  const nextLore = get(wizardLorePages.currentWizardLore?.lore, 0);
  const nextLorePage = (
    <IndividualLorePage wizardId={wizardNum} lore={nextLore} page={pageNum} />
  );

  // if we're on page 0 and the wizard has 0 lore => nextWizard
  // if we're on page 0 and the wizard has 1 lore => nextWizard
  // if we're on page 0 and the wizard has 2 lore => nextLore
  // if we're on page 2 and the wizard has 4 lore => nextLore
  // page 2, numLore 2
  if (pageNum >= numOfCurrentWizardsLore - 1) {
    components.nextPage = nextWizardPage;
    nextPageRoute = nextWizardPageRoute;
  } else {
    components.nextPage = (
      <IndividualLorePage
        wizardId={wizardNum}
        lore={get(
          wizardLorePages.currentWizardLore?.lore,
          nextLoreIdx as number
        )}
        page={pageNum}
      />
    );
    nextPageRoute = {
      as: `/lore/${wizardId}/${nextLoreIdx}`,
      wizardId: wizardNum,
      loreIdx: nextLoreIdx as number
    };
    components.nextPage = nextLorePage;
  }

  return {
    components,
    previousPageRoute,
    nextPageRoute
  };
}
