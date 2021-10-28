export const NETWORK = (chainId: number): NetworkDescription | undefined => {
  for (let n in NETWORKS) {
    if (NETWORKS[n].chainId == chainId) {
      return NETWORKS[n];
    }
  }
};
export const INFURA_ID = "remove";

export type NetworkDescription = {
  name: string;
  color: string;
  chainId: number;
  blockExplorer: string;
  rpcUrl: string;
};

export const NETWORKS: { [key: string]: NetworkDescription } = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://localhost:8545",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
};

export const IMAGE_NOBG_BASE_URL =
  "https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-";
export const OPENSEA_BASE_URL =
  "https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/"; // TODO: prod/stage

export const IPFS_SERVER =
  process.env.NEXT_PUBLIC_IPFS_SERVER ?? "https://nfts.forgottenrunes.com/ipfs";

export const SOULS_IMAGES_BASE_URL = `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/img/`;
export const SOULS_METADATA_BASE_URL = `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/data/`;
