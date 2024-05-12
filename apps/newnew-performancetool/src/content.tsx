import { webVitalsStore } from "./stores/web-vitals";

console.log("content script loaded", webVitalsStore);
webVitalsStore.subscribe(() => {
  console.log("web-vitals update", webVitalsStore.getState());
});
