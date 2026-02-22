import { PAYLINES, type Payline } from "./paylines";
import { type ReelGrid } from "./reels";
import { SYMBOL_MAP, type SymbolId } from "./symbols";

export interface WinResult {
  /** Payout multiplier × bet */
  multiplier: number;
  paylineId: number;
  symbol: SymbolId;
}

export interface SpinResult {
  /** true when all three reels show "seven" on any payline */
  isJackpot: boolean;
  totalMultiplier: number;
  wins: WinResult[];
}

/**
 * Check a single payline against the reel grid.
 * Returns a WinResult when all symbols on the payline match, otherwise null.
 */
export function checkPayline(grid: ReelGrid, payline: Payline): WinResult | null {
  const firstRowIdx = payline.rows[0];
  if (firstRowIdx === undefined) return null;
  const firstSymbol = grid[firstRowIdx]?.[0];
  if (!firstSymbol) return null;

  for (let col = 1; col < payline.rows.length; col++) {
    const rowIdx = payline.rows[col];
    if (rowIdx === undefined) return null;
    if (grid[rowIdx]?.[col] !== firstSymbol) return null;
  }

  const sym = SYMBOL_MAP.get(firstSymbol);
  if (!sym) return null;

  return {
    multiplier: sym.payout,
    paylineId: payline.id,
    symbol: firstSymbol,
  };
}

/**
 * Evaluate all paylines on a reel grid and return the full spin result.
 */
export function calculateWins(grid: ReelGrid, paylines: readonly Payline[] = PAYLINES): SpinResult {
  const wins: WinResult[] = [];
  let totalMultiplier = 0;

  for (const payline of paylines) {
    const result = checkPayline(grid, payline);
    if (result) {
      wins.push(result);
      totalMultiplier += result.multiplier;
    }
  }

  const isJackpot = wins.some((w) => w.symbol === "seven" && w.multiplier === 100);

  return { isJackpot, totalMultiplier, wins };
}
