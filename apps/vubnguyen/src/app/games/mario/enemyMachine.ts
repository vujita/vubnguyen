import { assign, sendParent, setup } from "xstate";

// ─── Types ─────────────────────────────────────────────────────────────────

export type EnemyType = "goomba" | "koopa";

export interface EnemyInput {
  id: string;
  type: EnemyType;
  direction?: -1 | 1;
}

export interface EnemyContext {
  id: string;
  type: EnemyType;
  direction: -1 | 1;
}

export type EnemyEvent =
  | { type: "STOMP" }
  | { type: "HIT" }
  | { type: "FALL_OFF" };

// ─── Machine ────────────────────────────────────────────────────────────────

/**
 * One actor per enemy on screen.
 *
 * Goombas die immediately on stomp.
 * Koopas become stunned (shell) on stomp — a second stomp kills them.
 * Any enemy is killed instantly by a shell slide (HIT) or falling off a pit.
 */
export const enemyMachine = setup({
  types: {
    context: {} as EnemyContext,
    events: {} as EnemyEvent,
    input: {} as EnemyInput,
  },
  guards: {
    isKoopa: ({ context }) => context.type === "koopa",
  },
  actions: {
    reverseDirection: assign({
      direction: ({ context }): -1 | 1 => (context.direction === 1 ? -1 : 1),
    }),
    notifyKilled: sendParent(({ context }) => ({
      type: "ENEMY_KILLED" as const,
      id: context.id,
    })),
  },
}).createMachine({
  id: "enemy",
  context: ({ input }) => ({
    id: input.id,
    type: input.type,
    direction: input.direction ?? -1,
  }),
  initial: "patrolling",
  states: {
    patrolling: {
      on: {
        STOMP: [
          // Koopas turn into a shell when stomped
          { guard: "isKoopa", target: "stunned" },
          // Goombas die instantly
          { target: "dead" },
        ],
        HIT: "dead",
        FALL_OFF: "dead",
      },
    },
    // Koopa shell — slides when hit again, or just sits still (timer handled by Phaser)
    stunned: {
      on: {
        STOMP: "dead",
        HIT: "dead",
        FALL_OFF: "dead",
      },
    },
    dead: {
      entry: "notifyKilled",
      type: "final",
    },
  },
});

// ─── Spawn config (static level data) ──────────────────────────────────────

export interface EnemySpawnConfig {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  direction?: -1 | 1;
}
