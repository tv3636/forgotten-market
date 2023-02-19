import { StaticJsonRpcProvider } from "@ethersproject/providers";

export function getProvider(useServerSideProvider = false) {
  const provider = new StaticJsonRpcProvider(
    useServerSideProvider
      ? process.env.SERVER_SIDE_NETWORK_URL
      : process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL
  );
  return provider;
}

const useProvider = () => {
  return getProvider();
};

export default useProvider;
