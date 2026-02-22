import { SYMBOLS, type SymbolId } from "./symbols.js";

/** Number of columns (reels) */
export const REEL_COUNT = 3;
/** Number of visible rows per reel */
export const ROW_COUNT = 3;

export type ReelGrid = SymbolId[][];

/**
 * Build a weighted reel strip from SYMBOLS.
 * Each symbol appears `weight` times in the strip.
 */
export function buildReelStrip(): SymbolId[] {
  const strip: SymbolId[] = [];
  for (const sym of SYMBOLS) {
    for (let i = 0; i < sym.weight; i++) {
      strip.push(sym.id);
    }
  }
  return strip;
}

/**
 * Pick a random symbol from a weighted strip using the provided RNG.
 * @param strip   The reel strip to sample from
 * @param random  A function returning [0, 1) — defaults to Math.random
 */
export function pickSymbol(strip: SymbolId[], random: () => number = Math.random): SymbolId {
  const idx = Math.floor(random() * strip.length);
  const sym = strip[idx];
  if (sym === undefined) throw new Error("Strip is empty");
  return sym;
}

/**
 * Spin all reels and return a ROW_COUNT × REEL_COUNT grid.
 * grid[row][col]
 */
export function spinReels(random: () => number = Math.random): ReelGrid {
  const strip = buildReelStrip();
  const grid: ReelGrid = [];
  for (let row = 0; row < ROW_COUNT; row++) {
    const rowSymbols: SymbolId[] = [];
    for (let col = 0; col < REEL_COUNT; col++) {
      rowSymbols.push(pickSymbol(strip, random));
    }
    grid.push(rowSymbols);
  }
  return grid;
}
