// Core pure-TS game logic (safe to import anywhere, including server)
export type { SymbolId, SlotSymbol } from "./core/symbols.js";
export { SYMBOLS, SYMBOL_MAP, getSymbol } from "./core/symbols.js";

export type { ReelGrid } from "./core/reels.js";
export { REEL_COUNT, ROW_COUNT, buildReelStrip, pickSymbol, spinReels } from "./core/reels.js";

export type { Payline } from "./core/paylines.js";
export { PAYLINES, validatePaylines } from "./core/paylines.js";

export type { WinResult, SpinResult } from "./core/winCalculator.js";
export { checkPayline, calculateWins } from "./core/winCalculator.js";

// React component (client-only — dynamic import Phaser internally)
export type { CasinoSlotGameProps } from "./components/CasinoSlotGame.js";
export { CasinoSlotGame } from "./components/CasinoSlotGame.js";
