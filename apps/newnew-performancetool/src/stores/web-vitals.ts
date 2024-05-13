import { onCLS, onFCP, onINP } from "web-vitals";
import { createStore } from "zustand/vanilla";

const getTtiPolyFill = async () => import("tti-polyfill");
export const webVitalsStore = createStore<{
  cls: number;
  fcp: number;
  inp: number;
  tti: number;
}>((set) => {
  void getTtiPolyFill()
    .then((ttiPolyfill) =>
      ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
        set({ tti: tti ?? performance.now() });
        return tti;
      }),
    )
    .catch((e) => {
      console.error("error getting tti", e);
    });
  onFCP((r) => {
    set({ fcp: r.value });
  });
  onCLS(
    (r) => {
      set({ cls: r.value });
    },
    {
      reportAllChanges: true,
    },
  );
  onINP(
    (r) => {
      set({ inp: r.value });
    },
    {
      reportAllChanges: true,
    },
  );
  return {
    cls: -1,
    fcp: -1,
    inp: -1,
    tti: -1,
  };
});
