import { expect, test } from "@playwright/test";

const HOST = process.env.HOST ?? "http://localhost:3000";

test("snake moves and eventually dies without steering", async ({ page }) => {
  await page.goto(`${HOST}/games/snake`);
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

  // Start game with medium speed (130ms/tick)
  await page.getByRole("button", { name: /start game/i }).click();
  await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });

  // At medium speed (130ms/tick), snake starts at x=10 moving right
  // and hits the wall at x=20 after 10 ticks = 1.3s
  // Wait 3 seconds to be sure
  await page.waitForTimeout(3000);

  // Check what state the game is in
  const pauseBtn = page.getByRole("button", { name: /pause/i });
  const gameOver = page.locator("text=Game Over");
  const resetBtn = page.getByRole("button", { name: /reset/i });

  const isPausing = await pauseBtn.isVisible();
  const isGameOver = await gameOver.isVisible();
  const hasReset = await resetBtn.isVisible();

  console.log("After 3s — Pause visible:", isPausing);
  console.log("After 3s — Game Over visible:", isGameOver);
  console.log("After 3s — Reset visible:", hasReset);

  await page.screenshot({ fullPage: true, path: "playwright-report/movement-test.png" });

  // The snake should have moved and died (Game Over)
  // This proves the XState machine is ticking
  expect(isGameOver).toBe(true);
});
