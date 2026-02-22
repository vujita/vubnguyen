export type SymbolId = "seven" | "bar" | "double-bar" | "triple-bar" | "cherry" | "lemon" | "orange" | "watermelon";

export interface SlotSymbol {
  id: SymbolId;
  label: string;
  /** Base payout multiplier for 3-of-a-kind on a payline */
  payout: number;
  /** Relative weight on the reel strip (higher = more frequent) */
  weight: number;
}

export const SYMBOLS: readonly SlotSymbol[] = [
  { id: "seven", label: "7", payout: 100, weight: 1 },
  { id: "triple-bar", label: "BAR BAR BAR", payout: 50, weight: 2 },
  { id: "double-bar", label: "BAR BAR", payout: 20, weight: 4 },
  { id: "bar", label: "BAR", payout: 10, weight: 6 },
  { id: "watermelon", label: "🍉", payout: 8, weight: 8 },
  { id: "orange", label: "🍊", payout: 6, weight: 10 },
  { id: "lemon", label: "🍋", payout: 4, weight: 12 },
  { id: "cherry", label: "🍒", payout: 2, weight: 15 },
] as const;

export const SYMBOL_MAP = new Map<SymbolId, SlotSymbol>(SYMBOLS.map((s) => [s.id, s]));

export function getSymbol(id: SymbolId): SlotSymbol {
  const sym = SYMBOL_MAP.get(id);
  if (!sym) throw new Error(`Unknown symbol id: ${id}`);
  return sym;
}
