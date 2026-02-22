import { REEL_COUNT, ROW_COUNT } from "./reels.js";

export interface Payline {
  id: number;
  /** Array of row indices, one per column, defining which cell is on this payline */
  rows: readonly number[];
}

/**
 * Standard 5-payline layout for a 3×3 grid:
 *  0: top row
 *  1: middle row (classic centre line)
 *  2: bottom row
 *  3: diagonal top-left → bottom-right
 *  4: diagonal bottom-left → top-right
 */
export const PAYLINES: readonly Payline[] = [
  { id: 0, rows: [0, 0, 0] }, // top
  { id: 1, rows: [1, 1, 1] }, // middle
  { id: 2, rows: [2, 2, 2] }, // bottom
  { id: 3, rows: [0, 1, 2] }, // diagonal ↘
  { id: 4, rows: [2, 1, 0] }, // diagonal ↗
] as const;

/** Validate that every payline has exactly REEL_COUNT entries, all within [0, ROW_COUNT) */
export function validatePaylines(paylines: readonly Payline[]): void {
  for (const pl of paylines) {
    if (pl.rows.length !== REEL_COUNT) {
      throw new Error(`Payline ${pl.id} has ${pl.rows.length} rows, expected ${REEL_COUNT}`);
    }
    for (const r of pl.rows) {
      if (r < 0 || r >= ROW_COUNT) {
        throw new Error(`Payline ${pl.id} row index ${r} out of range [0, ${ROW_COUNT})`);
      }
    }
  }
}
