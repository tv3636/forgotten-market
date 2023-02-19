import * as React from "react";
import styled from "@emotion/styled";
import Button from "../ui/Button";
import { useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

type Props = {};

const ConnectButton = styled(Button)`
  background-color: var(--darkGray);
  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 46 42 46 42;

  padding: var(--sp-4);

  cursor: pointer;
  color: var(--lightGray);

  :hover {
    background-color: var(--mediumGray);
    border-color: var(--lightGray);
  }

  @media only screen and (max-width: 600px) {
    margin-bottom: 10px;
  }
  
  transition: all 200ms;
`;

export default function MarketConnect() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  return (
    <ConnectButton onClick={() => connect()}>
      CONNECT YOUR WALLET
    </ConnectButton>
  );
}
