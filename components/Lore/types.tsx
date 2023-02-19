export type ArtifactConfiguration = {
  contractAddress: string;
  tokenId: string;
};

export type LoreWizard = {
  id: string;
};

// try to match the schema from bookoflore-subgraph
export type Lore = {
  id?: string;
  index?: number;
  wizardId: string;
  assetAddress: string;
  tokenId: string;
  isPixelArt?: boolean;
  title?: string;
  story?: string;
  nsfw?: boolean;
  struck?: boolean;
  creator?: string;
  parentLoreId?: number;
  wizard: LoreWizard;
};

export type LorePage = {};

export type IndividualLorePageData = {
  firstImage: string | null;
  bgColor?: string;
  isEmpty: boolean;
  title?: string;
  story?: string;
  pageNumber?: number;
  loreIndex?: number;
  creator?: string;
};

export type LorePageData = {
  leftPage: IndividualLorePageData;
  rightPage: IndividualLorePageData;
  previousPageRoute: string | null;
  nextPageRoute: string | null;
};
