import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto(process.env.HOST ?? "http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/vubnguyen/);
});
