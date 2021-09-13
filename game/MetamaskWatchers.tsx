import { StaticJsonRpcProvider } from "@ethersproject/providers";
import {
  useEventListener,
  useEventEmitter,
  GameContext
} from "phaser-react-tools";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import events from "../game/events";
import useUserAddress from "../hooks/UserAddress";
import useUserProvider from "../hooks/UserProvider";
import useWeb3Modal from "../hooks/useWeb3Modal";

type Props = {};

export function MetamaskWatchers({}: Props) {
  const provider = new StaticJsonRpcProvider(
    process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL
  );

  const [injectedProvider, setInjectedProvider] = useState<any>();
  const userProvider = useUserProvider(injectedProvider, provider);
  const address = useUserAddress(userProvider);
  const [web3Modal, loadWeb3Modal, logoutOfWeb3Modal] =
    useWeb3Modal(setInjectedProvider);
  const emitMetamaskConnected = useEventEmitter(events.ON_METAMASK_CONNECTED);
  const emitProvider = useEventEmitter(events.ON_SITE_PROVIDER);
  const game = useContext(GameContext);

  console.log("address:", address);

  // you have to use the user's provider if you want any authenticated functions (because the user's provider is connected to their wallet)

  // TODO, right here, store state on if the modal is already open or not

  useEventListener(events.ON_METAMASK_ATTEMPT_CONNECT, (event: any) => {
    console.log(
      "React ON_METAMASK_ATTEMPT_CONNECT",
      event,
      web3Modal?.cachedProvider
    );

    loadWeb3Modal();
  });

  useEffect(() => {
    console.log("MetamaskWatchers", game, provider);
    if (game && provider) {
      emitProvider({ provider });
    }
  }, [game, provider]);

  useEffect(() => {
    // we need to send a connected event if we are connected
    if (game && provider && injectedProvider && address) {
      emitMetamaskConnected({ provider, injectedProvider, address });
    }
  }, [game, provider, injectedProvider, address]);

  return <React.Fragment />;
}
