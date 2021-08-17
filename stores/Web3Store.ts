import { Instance, types } from "mobx-state-tree";

export const defaultWeb3Settings = {
  connected: false,
  injectedProvider: null
};

export const Web3Settings = types
  .model("Web3Settings", {
    connected: types.optional(types.boolean, false)
  })
  .volatile((self) => {
    const views = {
      injectedProvider: null
    };
    return views;
  })
  .actions((self) => {
    return {
      setConnected(k: boolean) {
        self.connected = k;
      },
      setInjectedProvider(p: any) {
        self.injectedProvider = p;
        self.connected = true;
      }
    };
  })
  .views((self) => {
    const views = {};
    return views;
  });

export type IWeb3Settings = Instance<typeof Web3Settings>;
