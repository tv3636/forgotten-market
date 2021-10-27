import { ethers } from "ethers";
import { abi as ForgottenRunesWizardsCultAbi } from "./ForgottenRunesWizardsCult.json";
import { abi as BookOfLoreAbi } from "./BookOfLore.json";
import { abi as ForgottenSoulsAbi } from "./ForgottenSouls.json";
import { abi as InfinityVeilAbi } from "./ForgottenRunesInfinityVeil.json";
import { BigNumber } from "ethers/lib/ethers";
import { Web3Provider } from "@ethersproject/providers";

export const WIZARDS_CONTRACT_ADDRESS: { [chainId: number]: string } = {
  4: `0x7947251053537aD8745d8E27ac3384BA2097d76c`,
  1: `0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42`,
};

export const BOOK_OF_LORE_ADDRESS: { [chainId: number]: string } = {
  4: `0xe6d5ed58B39aC190A5e347B87F018561036b56B9`,
  1: `0x4218948D1Da133CF4B0758639a8C065Dbdccb2BB`,
};

export const INFINITY_VEIL_ADDRESS: { [chainId: number]: string } = {
  4: `0x35Fe32390eda22cA0a8Da2100e500de740F04Af3`,
  1: `0x31158181b4b91a423bfdc758fc3bf8735711f9c5`,
};

export const FORGOTTEN_SOULS_ADDRESS: { [chainId: number]: string } = {
  4: `0x0b1ef23959ED9D1ba61BBd1b977946dEc816b732`,
  1: ``,
};

export async function getWizardsContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  const wizardsAddress = WIZARDS_CONTRACT_ADDRESS[chainId];
  if (!wizardsAddress) {
    throw new Error("Specify contract address");
  }
  return new ethers.Contract(
    wizardsAddress,
    ForgottenRunesWizardsCultAbi,
    provider
  );
}

export async function getBookOfLoreContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  return new ethers.Contract(
    BOOK_OF_LORE_ADDRESS[chainId as number],
    BookOfLoreAbi,
    provider
  );
}

export const CHARACTER_CONTRACTS = {
  wizards:
    process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS?.toLowerCase() ??
    "0x",
  souls:
    process.env.NEXT_PUBLIC_REACT_APP_SOULS_CONTRACT_ADDRESS?.toLowerCase() ??
    "0x",
};

export async function getSoulsContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  return new ethers.Contract(
    FORGOTTEN_SOULS_ADDRESS[chainId as number],
    ForgottenSoulsAbi,
    provider
  );
}

export async function getInfinityVeilContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  return new ethers.Contract(
    INFINITY_VEIL_ADDRESS[chainId as number],
    InfinityVeilAbi,
    provider
  );
}

export async function getMyNfts(injectedProvider: Web3Provider): {} {
  const addressTokens: { [key: string]: any[] } = {};

  try {
    const address = injectedProvider.provider.selectedAddress;

    // TODO: parallelise awaits
    for (const [contractName, conractAddress] of Object.entries(
      CHARACTER_CONTRACTS
    )) {
      const contract = new ethers.Contract(
        conractAddress,
        ForgottenRunesWizardsCultAbi,
        injectedProvider
      );

      addressTokens[contractName] = (await contract.tokensOfOwner(address)).map(
        (id: BigNumber) => id.toNumber()
      );
    }

    return addressTokens;
  } catch (err) {
    console.log("err: ", err);
    throw err;
  }
}