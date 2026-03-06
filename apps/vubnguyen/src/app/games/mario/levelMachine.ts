import { type ActorRefFrom, assign, sendParent, setup } from "xstate";

import { type EnemySpawnConfig, enemyMachine } from "@vujita/vubnguyen/src/app/games/mario/enemyMachine";
import { playerMachine } from "@vujita/vubnguyen/src/app/games/mario/playerMachine";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface LevelInput {
  enemies: EnemySpawnConfig[];
}

export interface LevelContext {
  playerRef: ActorRefFrom<typeof playerMachine>;
  enemyRefs: Record<string, ActorRefFrom<typeof enemyMachine>>;
  coinsCollected: number;
}

export type LevelEvent =
  | { type: "PLAYER_DIED" }
  | { type: "ENEMY_KILLED"; id: string }
  | { type: "COIN_COLLECTED" }
  | { type: "FLAG_REACHED" };

// ─── Machine ────────────────────────────────────────────────────────────────

/**
 * Manages a single level run.
 *
 * Child actors:
 *  - playerRef  — one playerMachine, spawned on entry
 *  - enemyRefs  — one enemyMachine per enemy, spawned on entry
 *
 * Events bubble upward to gameMachine via sendParent.
 */
export const levelMachine = setup({
  types: {
    context: {} as LevelContext,
    events: {} as LevelEvent,
    input: {} as LevelInput,
  },
  actions: {
    removeEnemy: assign({
      enemyRefs: ({ context, event }) => {
        if (event.type !== "ENEMY_KILLED") return context.enemyRefs;
        const next = { ...context.enemyRefs };
        delete next[event.id];
        return next;
      },
    }),
    incrementCoins: assign({
      coinsCollected: ({ context }) => context.coinsCollected + 1,
    }),
    forwardPlayerDied: sendParent({ type: "PLAYER_DIED" }),
    forwardCoinCollected: sendParent({ type: "COIN_COLLECTED" }),
    forwardLevelComplete: sendParent({ type: "LEVEL_COMPLETE" }),
  },
}).createMachine({
  id: "level",
  context: ({ spawn, input }) => ({
    playerRef: spawn(playerMachine, { id: "player" }),
    enemyRefs: Object.fromEntries(
      input.enemies.map((e) => [
        e.id,
        spawn(enemyMachine, {
          id: e.id,
          input: { id: e.id, type: e.type, direction: e.direction },
        }),
      ]),
    ),
    coinsCollected: 0,
  }),
  initial: "active",
  states: {
    active: {
      on: {
        PLAYER_DIED: { actions: "forwardPlayerDied" },
        ENEMY_KILLED: { actions: "removeEnemy" },
        COIN_COLLECTED: { actions: ["incrementCoins", "forwardCoinCollected"] },
        FLAG_REACHED: "complete",
      },
    },
    complete: {
      entry: "forwardLevelComplete",
      type: "final",
    },
  },
});
