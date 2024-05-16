import { MemoryStats } from "newnew-performancetool/src/components/MemoryStats";
import { webVitalsStore } from "newnew-performancetool/src/stores/web-vitals";
import { createRoot } from "react-dom/client";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("onMessage", {
    message,
    sendResponse,
    sender,
  });
});

webVitalsStore.subscribe(() => {
  console.log("web-vitals update", webVitalsStore.getState());
});
// TODO: Make this configurable, and pull form chrome storage options
const loadMemoryStats = true;
if (loadMemoryStats) {
  const div = document.createElement("div");

  div.id = "newnew-performancetool-memorystat";
  document.body.append(div);
  console.log("dive", div);
  const root = createRoot(div);
  root.render(<MemoryStats />);
}
