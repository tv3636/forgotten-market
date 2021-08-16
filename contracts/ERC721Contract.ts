import { ethers } from "ethers";
import { abi as ForgottenRunesWizardsCultAbi } from "./ForgottenRunesWizardsCult.json";

export function getERC721Contract({
  contractAddress,
  provider
}: {
  contractAddress: string;
  provider: any;
}) {
  return new ethers.Contract(
    contractAddress,
    ForgottenRunesWizardsCultAbi, // :joy: - it _is_ an ERC721, so close enough for now
    provider
  );
}
