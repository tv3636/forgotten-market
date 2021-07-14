import { useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";

/*
  ~ What it does? ~

  Gets user provider

  ~ How can I use? ~

  const userProvider = useUserProvider(injectedProvider, localProvider);

  ~ Features ~

  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const address = useUserAddress(userProvider);
    const tx = Transactor(userProvider, gasPrice)
*/

const useUserProvider = (injectedProvider, localProvider) =>
  useMemo(() => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider");
      return injectedProvider;
    }
    if (!localProvider) return undefined;

    // eslint-disable-next-line no-underscore-dangle
    // const networkName = localProvider._network && localProvider._network.name;
    // burnerConfig.rpcUrl = `https://${
    //   networkName || "mainnet"
    // }.infura.io/v3/${INFURA_ID}`;
    // return new Web3Provider();
  }, [injectedProvider, localProvider]);

export default useUserProvider;
