import { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Web3Provider } from "@ethersproject/providers";

const useWeb3Modal = (setInjectedProvider: any) => {
  const [web3Modal, setWeb3Modal] = useState<any>();

  useEffect(() => {
    const walletConnectOptions = {
      infuraId: process.env.NEXT_PUBLIC_REACT_APP_INFURA_PROJECT_ID,
      rpc: {
        [process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID
          ? parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID)
          : 1]: process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL,
      },
    };
    // console.log("walletConnectOptions: ", walletConnectOptions);

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      theme: {
        background: "rgb(38 31 45)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(18 15 21)",
      },
      // disableInjectedProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: walletConnectOptions,
        },
      },
    });

    const safeClearCachedProvider = async () => {
      try {
        await web3Modal.clearCachedProvider();
      } catch (err) {
        console.log("clearCachedProvider:", err);
      }
    };
    safeClearCachedProvider();

    window.ethereum &&
      window.ethereum.on("chainChanged", (chainId: any) => {
        web3Modal.cachedProvider &&
          setTimeout(() => {
            safeClearCachedProvider().then(() => {
              console.log("chainChanged");
              window.location.reload();
            });
          }, 1);
      });

    window.ethereum &&
      window.ethereum.on("accountsChanged", (accounts: any) => {
        web3Modal.cachedProvider &&
          setTimeout(() => {
            console.log("accountsChanged");
            // window.location.reload();
          }, 1);
      });

    window.ethereum &&
      window.ethereum.on("disconnect", (accounts: any) => {
        web3Modal.cachedProvider &&
          setTimeout(() => {
            safeClearCachedProvider().then(() => {
              console.log("disconnect");
              window.location.reload();
            });
          }, 1);
      });

    setWeb3Modal(web3Modal);
  }, []);

  const loadWeb3Modal = useCallback(async () => {
    // TODO: why does this not detect that it's already open?
    // console.log("web3Modal", web3Modal, web3Modal.show);

    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider, web3Modal]);

  // useEffect(() => {
  //   if (web3Modal?.cachedProvider) {
  //     loadWeb3Modal();
  //   }
  // }, [loadWeb3Modal]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  return [web3Modal, loadWeb3Modal, logoutOfWeb3Modal];
};

export default useWeb3Modal;
