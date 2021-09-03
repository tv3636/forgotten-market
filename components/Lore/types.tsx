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
  strick?: boolean;
  creator?: string;
  parentLoreId?: number;
  wizard: LoreWizard;
};

export type LorePage = {};

export type WizardLores = {
  wizardId: string;
  lore: Lore[];
};

export type WizardLorePages = {
  previousWizardLore: WizardLores;
  currentWizardLore: WizardLores;
  nextWizardLore: WizardLores;
};
