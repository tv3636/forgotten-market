import { Instance, types } from "mobx-state-tree";
import { Web3Provider } from "@ethersproject/providers";

export const defaultWeb3Settings = {
  connected: false,
  injectedProvider: null,
};

export const Web3Settings = types
  .model("Web3Settings", {
    connected: types.optional(types.boolean, false),
  })
  .volatile((self) => {
    const views: { injectedProvider: Web3Provider | null } = {
      injectedProvider: null,
    };
    return views;
  })
  .actions((self) => {
    return {
      setConnected(k: boolean) {
        self.connected = k;
      },
      setInjectedProvider(p: Web3Provider) {
        self.injectedProvider = p;
        self.connected = true;
      },
    };
  })
  .views((self) => {
    const views = {};
    return views;
  });

export type IWeb3Settings = Instance<typeof Web3Settings>;
