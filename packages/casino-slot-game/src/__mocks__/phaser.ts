/**
 * Minimal Phaser mock for Jest — the unit tests only cover core pure-TS logic
 * and never import Phaser directly. This file is mapped via jest.config.js
 * `moduleNameMapper` to avoid the browser-only Phaser bundle being loaded.
 */
export default {};
export const Game = class {};
export const Scene = class {};
export const AUTO = 0;
