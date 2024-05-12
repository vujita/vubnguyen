import { ttiStore } from "./stores/tti";

ttiStore.subscribe(() => {
  console.log("tti just occurred", ttiStore.getState());
});
