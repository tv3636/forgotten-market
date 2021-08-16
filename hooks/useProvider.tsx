import { useState, useEffect } from "react";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

const useProvider = () => {
  const provider = new StaticJsonRpcProvider(
    process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL
  );
  return provider;
};

export default useProvider;
