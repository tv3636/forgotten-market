import { Instance, types } from "mobx-state-tree";

export const Counter = types
  .model({
    count: types.optional(types.number, 0)
  })
  .actions((self) => ({
    increment() {
      self.count++;
    },
    decrement() {
      self.count--;
    }
  }));

export type ICounter = Instance<typeof Counter>;
