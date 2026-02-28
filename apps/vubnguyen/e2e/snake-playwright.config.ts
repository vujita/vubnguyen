import { defineConfig, devices } from "@playwright/test";

const CHROME = "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome";
const LAUNCH_OPTS = {
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader"],
};

export default defineConfig({
  fullyParallel: false,
  projects: [
    {
      name: "chromium",
      testMatch: "**/snake.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: LAUNCH_OPTS,
      },
    },
    {
      name: "mobile-chrome",
      testMatch: "**/snake-mobile.spec.ts",
      use: {
        ...devices["Pixel 5"],
        launchOptions: LAUNCH_OPTS,
      },
    },
    {
      name: "debug",
      testMatch: "**/snake-debug.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: LAUNCH_OPTS,
      },
    },
    {
      name: "movement",
      testMatch: "**/snake-movement.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: LAUNCH_OPTS,
      },
    },
  ],
  reporter: [["list"], ["json", { outputFile: "playwright-report/snake-results.json" }]],
  testDir: ".",
  use: {
    baseURL: process.env.HOST ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});
