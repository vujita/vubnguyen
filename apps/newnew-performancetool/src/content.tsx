import { webVitalsStore } from "./stores/web-vitals";

console.log("content script loaded", webVitalsStore);
webVitalsStore.subscribe(() => {
  console.log("web-vitals update", webVitalsStore.getState());
});
// Always show for now,
const div = document.createElement("div");

div.id = "newnew-performancetool-memorystat";
document.body.append(div);
console.log(div);
