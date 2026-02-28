import { expect, test } from "@playwright/test";

const HOST = process.env.HOST ?? "http://localhost:3000";

test("capture console errors and verify snake renders", async ({ page }) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.type() === "warning") warnings.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`PAGE ERROR: ${err.message}`));

  await page.goto(`${HOST}/games/snake`);
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

  // Log canvas info
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return "no canvas";
    return {
      clientHeight: canvas.clientHeight,
      clientWidth: canvas.clientWidth,
      height: canvas.height,
      offsetHeight: canvas.offsetHeight,
      offsetWidth: canvas.offsetWidth,
      styleHeight: canvas.style.height,
      styleWidth: canvas.style.width,
      width: canvas.width,
    };
  });
  console.log("Canvas info (idle):", JSON.stringify(canvasInfo));

  // Start the game
  await page.getByRole("button", { name: /start game/i }).click();
  await expect(page.getByRole("button", { name: /pause/i })).toBeVisible({ timeout: 5000 });

  // Wait a couple of ticks for the snake to move
  await page.waitForTimeout(600);

  // Check canvas pixel content — sample a few pixels where the snake should be
  const pixelData = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no 2d context (likely WebGL)";
    // Sample pixel at snake starting position (col 10, row 10 in a 24px grid)
    const x = 10 * 24 + 12; // center of cell
    const y = 10 * 24 + 12;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return { a: pixel[3], b: pixel[2], g: pixel[1], r: pixel[0], x, y };
  });
  console.log("Snake head pixel (10,10):", JSON.stringify(pixelData));

  // Check pixel at background (should be dark)
  const bgPixel = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no 2d context (likely WebGL)";
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    return { a: pixel[3], b: pixel[2], g: pixel[1], r: pixel[0] };
  });
  console.log("Background pixel (0,0):", JSON.stringify(bgPixel));

  await page.screenshot({ fullPage: true, path: "playwright-report/debug-playing.png" });

  console.log("Console errors:", errors);
  console.log("Console warnings:", warnings.slice(0, 5));
});
