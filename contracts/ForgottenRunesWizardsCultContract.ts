import { ethers } from "ethers";
import { abi as ForgottenRunesWizardsCultAbi } from "./ForgottenRunesWizardsCult.json";
import { abi as BookOfLoreAbi } from "./BookOfLore.json";
import { abi as ForgottenSoulsAbi } from "./ForgottenSouls.json";
import { abi as InfinityVeilAbi } from "./ForgottenRunesInfinityVeil.json";

export const WIZARDS_CONTRACT_ADDRESS: { [chainId: number]: string } = {
  4: `0x2BC27A0786B0b07b6061710C59FcF6Ce91D77080`,
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
  4: `0x95082b505c0752eEf1806aEf2b6b2d55eEa77e4E`,
  1: `0x251b5F14A825C537ff788604eA1b58e49b70726f`,
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
