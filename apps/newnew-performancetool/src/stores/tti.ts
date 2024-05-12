import ttiPolyfill from "tti-polyfill";
import { createStore } from "zustand/vanilla";

export const ttiStore = createStore<{
  tti: number;
}>((set) => {
  void ttiPolyfill.getFirstConsistentlyInteractive().then((r) => {
    set({ tti: r ?? performance.now() });
  });
  return {
    tti: -1,
  };
});
