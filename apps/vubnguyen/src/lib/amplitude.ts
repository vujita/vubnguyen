import * as amplitude from "@amplitude/analytics-browser";

export const initAmplitude = (apiKey: string) => {
  amplitude.init(apiKey, {
    defaultTracking: {
      fileDownloads: false,
      formInteractions: false,
      pageViews: false,
      sessions: true,
    },
  });
};

export const trackPageView = (path: string) => {
  amplitude.track("Page Viewed", { path });
};

export const track = amplitude.track;
