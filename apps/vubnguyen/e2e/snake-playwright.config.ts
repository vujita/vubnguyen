import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      },
    },
  ],
  reporter: [["list"], ["json", { outputFile: "playwright-report/snake-results.json" }]],
  testDir: ".",
  testMatch: "**/snake.spec.ts",
  use: {
    baseURL: process.env.HOST ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});
