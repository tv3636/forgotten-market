import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import { Counter, ICounter } from "./Counter";
import { IWeb3Settings, Web3Settings } from "./Web3Store";

export interface IRootStore {
  web3Settings: IWeb3Settings;
  counter: ICounter;
}

export const Store = types
  .model({
    lastUpdate: types.Date,
    light: false,
    web3Settings: types.optional(Web3Settings, {}),
    counter: types.optional(Counter, {})
  })
  .actions((self) => {
    let timer: any;
    const start = () => {
      timer = setInterval(() => {
        // mobx-state-tree doesn't allow anonymous callbacks changing data.
        // Pass off to another action instead (need to cast self as any
        // because typescript doesn't yet know about the actions we're
        // adding to self here)
        (self as any).update();
      }, 1000);
    };
    const update = () => {
      self.lastUpdate = new Date(Date.now());
      self.light = true;
    };
    const stop = () => {
      clearInterval(timer);
    };
    return { start, stop, update };
  });

export type IStore = Instance<typeof Store>;
export type IStoreSnapshotIn = SnapshotIn<typeof Store>;
export type IStoreSnapshotOut = SnapshotOut<typeof Store>;
