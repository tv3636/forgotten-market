import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import Button from "../ui/Button";

type Props = {};

export function ConnectWalletButton() {
  const provider = new StaticJsonRpcProvider(
    process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL
  );

  // TODO send this to MobX for use in other places
  const [injectedProvider, setInjectedProvider] = useState<any>();
  const [web3Modal, loadWeb3Modal, logoutOfWeb3Modal] =
    useWeb3Modal(setInjectedProvider);

  return <Button onClick={() => loadWeb3Modal()}>Connect Your Wallet</Button>;
}
