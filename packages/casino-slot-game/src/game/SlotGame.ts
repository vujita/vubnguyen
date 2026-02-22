import Phaser from "phaser";

import { MainScene } from "./scenes/MainScene";

export interface SlotGameOptions {
  height?: number;
  parent: HTMLElement;
  width?: number;
}

/**
 * Create and return a Phaser.Game instance mounted into `parent`.
 * Call `game.destroy(true)` to clean up.
 */
export function createSlotGame(options: SlotGameOptions): Phaser.Game {
  const { parent, width = 500, height = 520 } = options;

  return new Phaser.Game({
    backgroundColor: "#0d0d1a",
    height,
    parent,
    physics: { default: "arcade" },
    scene: [MainScene],
    type: Phaser.AUTO,
    width,
  });
}
