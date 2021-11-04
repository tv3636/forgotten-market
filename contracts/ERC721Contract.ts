import { ethers } from "ethers";
import { WIZARDS_ABI } from "./abis";

export function getERC721Contract({
  contractAddress,
  provider,
}: {
  contractAddress: string;
  provider: any;
}) {
  return new ethers.Contract(
    contractAddress,
    WIZARDS_ABI, // :joy: - it _is_ an ERC721, so close enough for now
    provider
  );
}
