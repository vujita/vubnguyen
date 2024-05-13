export const getActiveTab = (): Promise<chrome.tabs.Tab> =>
  new Promise((res, rej) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const activeTab = tabs[0];
      if (!activeTab) {
        return rej(new Error("No active tab found"));
      }
      res(activeTab);
    });
  });
