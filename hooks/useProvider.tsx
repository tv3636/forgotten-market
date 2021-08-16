import { useState, useEffect } from "react";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export function getProvider() {
  const provider = new StaticJsonRpcProvider(
    process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL
  );
  return provider;
}

const useProvider = () => {
  return getProvider();
};

export default useProvider;
