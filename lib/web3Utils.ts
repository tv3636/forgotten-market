import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseProvider } from "@ethersproject/providers";
import { Contract, Provider } from "ethcall";

import { IPFS_SERVER } from "../constants";
import axiosRetry from "axios-retry";
import axios from "axios";
import { WIZARDS_ABI } from "../contracts/abis";

export const getAddressSafe = (x: string | null) => {
  try {
    return getAddress(x || "");
  } catch (err) {
    return null;
  }
};

export function expandToDecimals(n: number, decimals: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(decimals));
}

export function expandTo18Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

export function contractFrom18Decimals(n: number): BigNumber {
  return BigNumber.from(n).div(BigNumber.from(10).pow(18));
}

export function bigNumberMins(...nums: BigNumber[]) {
  let min = nums[0];
  for (let i = 0; i < nums.length; i++) {
    min = bigNumberMin(min, nums[i]);
  }
  return min;
}

export function bigNumberMaxs(...nums: BigNumber[]) {
  let max = nums[0];
  for (let i = 0; i < nums.length; i++) {
    max = bigNumberMax(max, nums[i]);
  }
  return max;
}

export function bigNumberMin(a: BigNumber, b: BigNumber) {
  return BigNumber.from(a).gt(BigNumber.from(b))
    ? BigNumber.from(b)
    : BigNumber.from(a);
}
export function bigNumberMax(a: BigNumber, b: BigNumber) {
  return BigNumber.from(a).gt(BigNumber.from(b))
    ? BigNumber.from(a)
    : BigNumber.from(b);
}

export function bigNumberSubSafe(a: BigNumber, b: BigNumber) {
  try {
    return BigNumber.from(a).sub(BigNumber.from(b));
  } catch (err) {
    return BigNumber.from(0);
  }
}

export async function fetchTokenUrisViaMultiCall(
  mainProvider: BaseProvider,
  contractAddress: string,
  ids: BigNumber[]
) {
  const ethcallProvider = new Provider();
  await ethcallProvider.init(mainProvider);

  const contract = new Contract(contractAddress, WIZARDS_ABI); //Using Wizards as standin for generic ERC721

  const data = await ethcallProvider.all(
    ids.map((id: BigNumber) => contract.tokenURI(id))
  );

  return data;
}

export async function fetchFromIpfs(
  loreMetadataURI: string | null
): Promise<any> {
  if (!loreMetadataURI) return null;

  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;

  // console.log("ipfsURL: ", ipfsURL);

  if (!ipfsURL || ipfsURL === "undefined") {
    return null;
  }

  axiosRetry(axios, {
    retries: 3,
    retryDelay: () => 80,
  });

  try {
    const response = await axios.get(ipfsURL);
    return response.data;
  } catch (e) {
    console.error("Failed IPFS fetch for: " + ipfsURL);
    console.error(e);
    return {};
  }
}
