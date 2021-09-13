import { ethers } from "ethers";
import { abi as ForgottenRunesWizardsCultAbi } from "./ForgottenRunesWizardsCult.json";
import { abi as BookOfLoreAbi } from "./BookOfLore.json";

export function getWizardsContract({ provider }: { provider: any }) {
  if (!process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS) {
    throw new Error("Specify contract address");
  }
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS,
    ForgottenRunesWizardsCultAbi,
    provider
  );
}

const BOOK_OF_LORE_ADDRESS: { [chainId: number]: string } = {
  4: `0xdEb9121865D634A15023C7724B38F5c7Db6C88bB`
};

export async function getBookOfLoreContract({ provider }: { provider: any }) {
  const { chainId } = await provider.getNetwork();
  return new ethers.Contract(
    BOOK_OF_LORE_ADDRESS[chainId as number],
    BookOfLoreAbi,
    provider
  );
}
