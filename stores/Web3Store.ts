import { Instance, types } from "mobx-state-tree";

export const defaultWeb3Settings = {
  connected: false
};

export const Web3Settings = types
  .model("Web3Settings", {
    connected: types.boolean
  })
  .actions((self) => {
    return {
      setConnected(k: boolean) {
        self.connected = k;
      }
    };
  })
  .views((self) => {
    const views = {};
    return views;
  });

export type IWeb3Settings = Instance<typeof Web3Settings>;
