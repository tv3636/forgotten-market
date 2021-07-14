import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { GameComponent } from "phaser-react-tools";
import config from "../game/config";
import Overlay from "../components/Overlay";
import FrameCounter from "../components/FrameCounter";
import EventEmitterButton from "../components/EventEmitterButton";
import { useWindowSize } from "@react-hook/window-size/throttled";
import events from "../game/events";
import { useEventEmitter, useEventListener } from "phaser-react-tools";
import { useStore } from "../store";
import { MetamaskWatchers } from "./MetamaskWatchers";
import Head from "next/head";

type Props = {};

const GameRootWrapper = styled.div``;

export default function GameRoot({}: Props) {
  const store = useStore(null);

  return (
    <GameRootWrapper>
      <Head>
        <title>Forgotten Runes Wizards Cult</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GameComponent config={config}>
        <GameWatchers />
        <MetamaskWatchers />
        {/* <Overlay> */}
        {/* <FrameCounter></FrameCounter> */}
        {/* <EventEmitterButton></EventEmitterButton> */}
        {/* </Overlay> */}
      </GameComponent>
    </GameRootWrapper>
  );
}

export function GameWatchers({}: Props) {
  const [width, height] = useWindowSize();

  const emitResize = useEventEmitter(events.ON_WINDOW_RESIZE);
  useEffect(() => {
    try {
      emitResize({ width, height });
    } catch (err) {
      // console.log("emitResize err:", err);
    }
  }, [width, height]);

  return <React.Fragment />;
}
