import { ethers } from "ethers";
import {
  BOOK_OF_LORE_ABI,
  INFINITY_VEIL_ABI,
  PONIES_ABI,
  SOULS_ABI,
  WIZARDS_ABI,
} from "./abis";
import { Network } from "@ethersproject/providers";

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

export const FORGOTTEN_PONIES_ADDRESS: { [chainId: number]: string } = {
  4: `0x5020c6460b0b26A69c6c0bb8D99Ed314F3C39D9E`,
  1: `0xf55b615B479482440135Ebf1b907fD4c37eD9420`,
};

export const getAllCharacterContracts = (chainId: number) => {
  return [
    WIZARDS_CONTRACT_ADDRESS[chainId].toLowerCase(),
    FORGOTTEN_SOULS_ADDRESS[chainId].toLowerCase(),
    FORGOTTEN_PONIES_ADDRESS[chainId].toLowerCase(),
  ];
};

export async function getWizardsContract({
  provider,
  chainId,
}: {
  provider: any;
  chainId?: number;
}) {
  if (!chainId) {
    const { chainId: resolvedChainId } =
      (await provider.getNetwork()) as Network;
    chainId = resolvedChainId;
  }

  const wizardsAddress = WIZARDS_CONTRACT_ADDRESS[chainId].toLowerCase();
  if (!wizardsAddress) {
    throw new Error("Specify contract address");
  }
  return new ethers.Contract(wizardsAddress, WIZARDS_ABI, provider);
}

export async function getBookOfLoreContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  return new ethers.Contract(
    BOOK_OF_LORE_ADDRESS[chainId as number].toLowerCase(),
    BOOK_OF_LORE_ABI,
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
  ponies:
    process.env.NEXT_PUBLIC_REACT_APP_PONIES_CONTRACT_ADDRESS?.toLowerCase() ??
    "0x",
};

export function isSoulsContract(address: string) {
  return address.toLowerCase() === CHARACTER_CONTRACTS.souls.toLowerCase();
}

export function isPoniesContract(address: string) {
  return address.toLowerCase() === CHARACTER_CONTRACTS.ponies.toLowerCase();
}

export function isWizardsContract(address: string) {
  return address.toLowerCase() === CHARACTER_CONTRACTS.wizards.toLowerCase();
}

export async function getSoulsContract({
  provider,
  chainId,
}: {
  provider: any;
  chainId?: number;
}) {
  if (!chainId) {
    const { chainId: resolvedChainId } =
      (await provider.getNetwork()) as Network;
    chainId = resolvedChainId;
  }
  return new ethers.Contract(
    FORGOTTEN_SOULS_ADDRESS[chainId as number].toLowerCase(),
    SOULS_ABI,
    provider
  );
}

export async function getPoniesContract({
  provider,
  chainId,
}: {
  provider: any;
  chainId?: number;
}) {
  if (!chainId) {
    const { chainId: resolvedChainId } =
      (await provider.getNetwork()) as Network;
    chainId = resolvedChainId;
  }

  return new ethers.Contract(
    FORGOTTEN_PONIES_ADDRESS[chainId as number].toLowerCase(),
    PONIES_ABI,
    provider
  );
}

export async function getInfinityVeilContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  return new ethers.Contract(
    INFINITY_VEIL_ADDRESS[chainId as number],
    INFINITY_VEIL_ABI,
    provider
  );
}
