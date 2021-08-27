export type ArtifactConfiguration = {
  contractAddress: string;
  tokenId: string;
};

export type Lore = {
  wizardId: string;
  artifactConfiguration: ArtifactConfiguration;
  isPixelArt?: boolean;
  title?: string;
  story?: string;
  isNsfw?: boolean;
};
