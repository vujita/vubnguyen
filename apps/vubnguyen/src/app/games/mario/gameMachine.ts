import { type ActorRefFrom, assign, setup, stopChild } from "xstate";

import { type EnemySpawnConfig } from "@vujita/vubnguyen/src/app/games/mario/enemyMachine";
import { levelMachine } from "@vujita/vubnguyen/src/app/games/mario/levelMachine";

// ─── Level data ─────────────────────────────────────────────────────────────

export const CANVAS_W = 800;
export const CANVAS_H = 480;

/** Enemy spawn configurations keyed by level number (1-based). */
const LEVEL_ENEMIES: Record<number, EnemySpawnConfig[]> = {
  1: [
    { id: "g1", type: "goomba", x: 580, y: 368, direction: -1 },
    { id: "g2", type: "goomba", x: 780, y: 368, direction: -1 },
    { id: "k1", type: "koopa", x: 1100, y: 360, direction: -1 },
    { id: "g3", type: "goomba", x: 1600, y: 368, direction: -1 },
    { id: "g4", type: "goomba", x: 1900, y: 368, direction: -1 },
    { id: "k2", type: "koopa", x: 2300, y: 360, direction: -1 },
    { id: "g5", type: "goomba", x: 2600, y: 368, direction: -1 },
  ],
};

function enemiesForLevel(level: number): EnemySpawnConfig[] {
  return LEVEL_ENEMIES[level] ?? (LEVEL_ENEMIES[1] as EnemySpawnConfig[]);
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GameContext {
  score: number;
  lives: number;
  level: number;
  levelRef: ActorRefFrom<typeof levelMachine> | null;
}

export type GameEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESTART" }
  | { type: "PLAYER_DIED" }
  | { type: "LEVEL_COMPLETE" }
  | { type: "COIN_COLLECTED" }
  | { type: "SCORE_ADD"; amount: number };

// ─── Machine ────────────────────────────────────────────────────────────────

/**
 * Root game machine — orchestrates the full play session.
 *
 * Child actors:
 *  - levelRef  — one levelMachine per attempt, spawned on `playing` entry,
 *                stopped on `playing` exit.
 *
 * levelMachine itself spawns playerMachine + per-enemy enemyMachines.
 */
export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  guards: {
    hasLivesLeft: ({ context }) => context.lives > 1,
  },
  actions: {
    spawnLevel: assign({
      levelRef: ({ spawn, context }) =>
        spawn(levelMachine, {
          id: "level",
          input: { enemies: enemiesForLevel(context.level) },
        }),
    }),
    stopLevel: stopChild(({ context }) => context.levelRef),
    clearLevel: assign({ levelRef: null }),
    loseLife: assign({ lives: ({ context }) => context.lives - 1 }),
    addCoinScore: assign({ score: ({ context }) => context.score + 100 }),
    addLevelClearBonus: assign({ score: ({ context }) => context.score + 1000 }),
    advanceLevel: assign({ level: ({ context }) => context.level + 1 }),
    resetGame: assign({ score: 0, lives: 3, level: 1, levelRef: null }),
  },
}).createMachine({
  id: "game",
  context: { score: 0, lives: 3, level: 1, levelRef: null },
  initial: "menu",
  states: {
    menu: {
      on: {
        START: "playing",
      },
    },

    playing: {
      // Spawn a fresh level actor on every entry; stop it on every exit.
      entry: "spawnLevel",
      exit: ["stopLevel", "clearLevel"],

      on: {
        PAUSE: "paused",

        COIN_COLLECTED: { actions: "addCoinScore" },

        SCORE_ADD: {
          actions: assign({
            score: ({ context, event }) => context.score + event.amount,
          }),
        },

        LEVEL_COMPLETE: {
          actions: ["addLevelClearBonus", "advanceLevel"],
          // Re-enter playing → exit stops old level, entry spawns next level
          target: "playing",
        },

        PLAYER_DIED: [
          {
            guard: "hasLivesLeft",
            actions: "loseLife",
            // Re-enter playing → same level, one fewer life
            target: "playing",
          },
          { target: "gameOver" },
        ],
      },
    },

    paused: {
      on: {
        RESUME: "playing",
        RESTART: { actions: "resetGame", target: "menu" },
      },
    },

    gameOver: {
      on: {
        RESTART: { actions: "resetGame", target: "menu" },
      },
    },
  },
});
