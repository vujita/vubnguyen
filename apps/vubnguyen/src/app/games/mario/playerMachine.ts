import { assign, sendParent, setup } from "xstate";

// ─── Types ─────────────────────────────────────────────────────────────────

export type PowerState = "small" | "big" | "fire";
export type MotionState = "idle" | "running" | "jumping" | "falling" | "crouching" | "dead";

export interface PlayerContext {
  powerState: PowerState;
}

export type PlayerEvent =
  | { type: "RUN" }
  | { type: "STOP" }
  | { type: "JUMP" }
  | { type: "FALL" }
  | { type: "LAND" }
  | { type: "CROUCH" }
  | { type: "UNCROUCH" }
  | { type: "GET_HIT" }
  | { type: "COLLECT_MUSHROOM" }
  | { type: "COLLECT_FIRE_FLOWER" }
  | { type: "DIE" };

// ─── Machine ────────────────────────────────────────────────────────────────

export const playerMachine = setup({
  types: {
    context: {} as PlayerContext,
    events: {} as PlayerEvent,
  },
  guards: {
    isSmall: ({ context }) => context.powerState === "small",
  },
  actions: {
    downgradePower: assign({
      powerState: ({ context }): PowerState =>
        context.powerState === "fire" ? "big" : "small",
    }),
    upgradeToBig: assign({ powerState: (): PowerState => "big" }),
    upgradeToFire: assign({ powerState: (): PowerState => "fire" }),
    notifyDied: sendParent({ type: "PLAYER_DIED" }),
  },
}).createMachine({
  id: "player",
  context: { powerState: "small" },
  initial: "idle",
  states: {
    idle: {
      on: {
        RUN: "running",
        JUMP: "jumping",
        FALL: "falling",
        CROUCH: "crouching",
        GET_HIT: [
          { guard: "isSmall", target: "dead" },
          { actions: "downgradePower" },
        ],
        COLLECT_MUSHROOM: {
          actions: "upgradeToBig",
          guard: ({ context }) => context.powerState === "small",
        },
        COLLECT_FIRE_FLOWER: { actions: "upgradeToFire" },
        DIE: "dead",
      },
    },
    running: {
      on: {
        STOP: "idle",
        JUMP: "jumping",
        FALL: "falling",
        CROUCH: "crouching",
        GET_HIT: [
          { guard: "isSmall", target: "dead" },
          { actions: "downgradePower", target: "idle" },
        ],
        COLLECT_MUSHROOM: {
          actions: "upgradeToBig",
          guard: ({ context }) => context.powerState === "small",
        },
        COLLECT_FIRE_FLOWER: { actions: "upgradeToFire" },
        DIE: "dead",
      },
    },
    jumping: {
      on: {
        FALL: "falling",
        LAND: "idle",
        GET_HIT: [
          { guard: "isSmall", target: "dead" },
          { actions: "downgradePower", target: "falling" },
        ],
        DIE: "dead",
      },
    },
    falling: {
      on: {
        LAND: "idle",
        GET_HIT: [
          { guard: "isSmall", target: "dead" },
          { actions: "downgradePower" },
        ],
        DIE: "dead",
      },
    },
    crouching: {
      on: {
        UNCROUCH: "idle",
        JUMP: "jumping",
        GET_HIT: [
          { guard: "isSmall", target: "dead" },
          { actions: "downgradePower", target: "idle" },
        ],
        DIE: "dead",
      },
    },
    dead: {
      entry: "notifyDied",
      type: "final",
    },
  },
});
