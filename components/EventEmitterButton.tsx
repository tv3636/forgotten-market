import React from "react";
import events from "../game/events";
import { useEventEmitter } from "phaser-react-tools";

export default () => {
  const emit = useEventEmitter(events.ON_BUTTON_CLICK);
  return (
    <button
      onClick={() => {
        emit("Button clicked!");
      }}
      style={{ color: "white" }}
    >
      Emit game event
    </button>
  );
};
