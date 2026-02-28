import { expect, test } from "@playwright/test";

const HOST = process.env.HOST ?? "http://localhost:3000";

test.describe("Snake game — mobile", () => {
  test("page renders on mobile viewport", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ fullPage: true, path: "playwright-report/mobile-idle.png" });
  });

  test("canvas dimensions fit mobile screen", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

    const vw = page.viewportSize()!.width;
    const box = await page.locator("canvas").first().boundingBox();
    console.log(`Viewport: ${vw}px  Canvas: ${JSON.stringify(box)}`);

    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
    // Canvas should fit within the viewport width (with some margin for padding)
    expect(box!.width).toBeLessThanOrEqual(vw);
  });

  test("Start Game button is visible without scrolling", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

    const startBtn = page.getByRole("button", { name: /start game/i });
    await expect(startBtn).toBeVisible();

    const vh = page.viewportSize()!.height;
    const box = await startBtn.boundingBox();
    console.log(`Viewport height: ${vh}px  Start button: ${JSON.stringify(box)}`);
    // Button should be visible in the initial viewport
    expect(box!.y + box!.height).toBeLessThanOrEqual(vh);
  });

  test("tapping Start Game works", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /start game/i }).tap();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });

    // D-pad should appear
    await expect(page.getByRole("button", { name: "▲" })).toBeVisible();
    await page.screenshot({ fullPage: true, path: "playwright-report/mobile-playing.png" });
  });

  test("D-pad buttons are tappable", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /start game/i }).tap();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "▲" }).tap();
    await page.getByRole("button", { name: "◀" }).tap();
    await page.getByRole("button", { name: "▼" }).tap();
    await page.getByRole("button", { name: "▶" }).tap();

    // Game should still be in playing state after d-pad taps
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
  });
});
