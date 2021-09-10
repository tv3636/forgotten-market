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

export type LorePageData = {
  leftPage: { [key: string]: string };
  rightPage: { [key: string]: string };
  prevLeftPage: { [key: string]: string };
  prevRightPage: { [key: string]: string };
  nextLeftPage: { [key: string]: string };
  nextRightPage: { [key: string]: string };
  nextWizardRightPage: { [key: string]: string };
  prevWizardPageCount: number;
};
