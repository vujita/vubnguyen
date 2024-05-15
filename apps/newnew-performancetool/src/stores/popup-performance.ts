import { createStore } from "zustand/vanilla";

export interface PopupState {
  marks: PerformanceMark[];
  marksIndex: number;
  // perfTimings?: PerformanceEntry[];
  resources: PerformanceResourceTiming[];
  resourcesIndex: number;
  timing?: Partial<Pick<PerformanceTiming, "connectEnd" | "connectStart" | "domComplete" | "domContentLoadedEventEnd" | "domContentLoadedEventStart" | "domInteractive" | "domLoading" | "domainLookupEnd" | "domainLookupStart" | "fetchStart" | "loadEventEnd" | "loadEventStart" | "navigationStart" | "redirectEnd" | "redirectStart" | "requestStart" | "responseEnd" | "secureConnectionStart" | "unloadEventEnd" | "unloadEventStart">>;
}

export const popupStore = createStore<PopupState>(() => {
  // TODO: Call chrome.getMessage to to send polling request

  return {
    marks: [],
    marksIndex: -1,
    resources: [],
    resourcesIndex: -1,
  };
});
