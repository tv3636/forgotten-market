import { ethers } from "ethers";
import { abi as ForgottenRunesWizardsCultAbi } from "./ForgottenRunesWizardsCult.json";
import { abi as BookOfLoreAbi } from "./BookOfLore.json";
import map from "lodash/map";
import { BigNumber } from "ethers/lib/ethers";
import { Web3Provider } from "@ethersproject/providers";

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
  4: `0xe6d5ed58B39aC190A5e347B87F018561036b56B9`,
  1: `0x4218948D1Da133CF4B0758639a8C065Dbdccb2BB`,
};

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
