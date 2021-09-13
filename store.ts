import { IStore, Store } from "./stores/rootStore";
import { useContext, useMemo } from "react";
import {
  applySnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types
} from "mobx-state-tree";
import { MobXProviderContext } from "mobx-react";
import { createContext } from "react";

let store: IStore | undefined;
export function initializeStore(snapshot = null) {
  const _store = store ?? Store.create({ lastUpdate: 0 });

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return store;
}

// see also:
// https://github1s.com/ecklf/react-hooks-mobx-state-tree/blob/main/src/models/Root.ts#L38-L39
export function useStore(initialState: any) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export function getStore() {
  return initializeStore(null);
}

export type RootInstance = IStore;
const RootStoreContext = createContext<null | RootInstance>(null);
export const Provider = RootStoreContext.Provider;

export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
