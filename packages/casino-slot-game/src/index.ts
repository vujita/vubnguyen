// Core pure-TS game logic (safe to import anywhere, including server)
export type { SymbolId, SlotSymbol } from "./core/symbols";
export { SYMBOLS, SYMBOL_MAP, getSymbol } from "./core/symbols";

export type { ReelGrid } from "./core/reels";
export { REEL_COUNT, ROW_COUNT, buildReelStrip, pickSymbol, spinReels } from "./core/reels";

export type { Payline } from "./core/paylines";
export { PAYLINES, validatePaylines } from "./core/paylines";

export type { WinResult, SpinResult } from "./core/winCalculator";
export { checkPayline, calculateWins } from "./core/winCalculator";

// React component (client-only — dynamic import Phaser internally)
export type { CasinoSlotGameProps } from "./components/CasinoSlotGame";
export { CasinoSlotGame } from "./components/CasinoSlotGame";
