import { IPFS_SERVER } from "../constants";
import { BigNumber, Contract } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { fetchTokenUrisViaMultiCall } from "./web3Utils";
import zip from "lodash/zip";
import {
  getSoulsContract,
  getWizardsContract,
} from "../contracts/ForgottenRunesWizardsCultContract";

export async function httpifyUrl(url: string, tokenId: string) {
  url = url.replace(/0x\{id\}/, tokenId); // OpenSea
  if (url.match(/^http/)) {
    return url;
  } else if (url.match(/^ipfs/)) {
    return url.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
  } else {
    return url;
  }
}

export async function getTokensAndUrisForAddress(
  contract: Contract,
  address: string,
  provider: BaseProvider
): Promise<any[]> {
  const tokens = await contract.tokensOfOwner(address);
  const tokenURIs = await fetchTokenUrisViaMultiCall(
    provider,
    contract.address,
    tokens
  );

  return zip(
    tokens.map((id: BigNumber) => id.toNumber()),
    tokenURIs
  );
}

export async function getTokenDataForAllCollections(
  mainProvider: BaseProvider,
  address: string
) {
  const wizardsContract = await getWizardsContract({ provider: mainProvider });
  const soulsContract = await getSoulsContract({ provider: mainProvider });

  const tokensAndUris = await Promise.all([
    getTokensAndUrisForAddress(wizardsContract, address, mainProvider),
    getTokensAndUrisForAddress(soulsContract, address, mainProvider),
  ]);

  const tokenData = {
    wizards: tokensAndUris[0],
    souls: tokensAndUris[1],
  };
  return tokenData;
}
