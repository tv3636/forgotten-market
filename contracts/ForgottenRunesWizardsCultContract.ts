import { ethers } from "ethers";
import { abi as ForgottenRunesWizardsCultAbi } from "./ForgottenRunesWizardsCult.json";

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
