import { ttiStore } from "./stores/tti";

setInterval(() => {
  console.log("tti", ttiStore.getState());
}, 1000);
