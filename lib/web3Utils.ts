import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";

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
