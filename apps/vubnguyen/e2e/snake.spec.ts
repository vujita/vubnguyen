import { expect, test } from "@playwright/test";

const HOST = process.env.HOST ?? "http://localhost:3000";

test.describe("Snake game", () => {
  test("page loads and shows idle state", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);

    // Canvas should be present
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Start Game button should be visible in idle state
    const startBtn = page.getByRole("button", { name: /start game/i });
    await expect(startBtn).toBeVisible();

    // Difficulty buttons should be present
    await expect(page.getByRole("button", { name: /easy/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /medium/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /hard/i })).toBeVisible();

    // Score shows 0
    await expect(page.locator("text=Score: 0")).toBeVisible();
  });

  test("canvas has non-zero dimensions", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    const box = await canvas.boundingBox();
    console.log("Canvas bounding box:", JSON.stringify(box));
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test("Start Game button transitions to playing state", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    const startBtn = page.getByRole("button", { name: /start game/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // After starting: Pause button appears, Start Game disappears
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });
    await expect(startBtn).not.toBeVisible();

    // D-pad should appear
    await expect(page.getByRole("button", { name: "▲" })).toBeVisible();
  });

  test("keyboard steering works while playing", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /start game/i }).click();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });

    // Send arrow keys — should not crash the game
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");

    // Game should still be running (Pause button visible, no Game Over)
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
  });

  test("Pause and Resume work", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /start game/i }).click();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });

    // Pause
    await page.getByRole("button", { name: /pause/i }).click();
    await expect(page.locator("text=Paused")).toBeVisible();
    await expect(page.getByRole("button", { name: /resume/i })).toBeVisible();

    // Resume
    await page.getByRole("button", { name: /resume/i }).click();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
    await expect(page.locator("text=Paused")).not.toBeVisible();
  });

  test("screenshot of idle state", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });
    await page.screenshot({ fullPage: true, path: "playwright-report/snake-idle.png" });
  });

  test("screenshot of playing state", async ({ page }) => {
    await page.goto(`${HOST}/games/snake`);
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: /start game/i }).click();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });
    // Wait a tick so the snake moves
    await page.waitForTimeout(500);
    await page.screenshot({ fullPage: true, path: "playwright-report/snake-playing.png" });
  });
});
