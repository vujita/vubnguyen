import { and, assign, setup } from "xstate";

// ─── Canvas dimensions ────────────────────────────────────────────────────────
export const CANVAS_W = 480;
export const CANVAS_H = 560;

// ─── Player ──────────────────────────────────────────────────────────────────
const PLAYER_SPEED = 3;
export const PLAYER_H = 16;
export const PLAYER_W = 36;
export const PLAYER_Y = 508;

// ─── Bullets ─────────────────────────────────────────────────────────────────
const INVADER_BULLET_SPEED = 3;
export const MAX_INVADER_BULLETS = 3;
export const MAX_PLAYER_BULLETS = 3;
const PLAYER_BULLET_SPEED = 9;

// ─── Invader formation ───────────────────────────────────────────────────────
export const COL_GAP = 36;
export const COLS = 11;
export const INVADER_H = 16;
export const INVADER_W = 24;
const DROP_PX = 12;
export const FORMATION_INIT_X = (CANVAS_W - (COLS - 1) * COL_GAP - INVADER_W) / 2; // centers formation
const FORMATION_INIT_Y = 72;
const LEVEL_Y_INCREMENT = 16;
const MAX_FORMATION_Y = 200; // cap starting Y so game doesn't begin in invasion zone
export const ROW_GAP = 36;
export const ROWS = 5;
const STEP_PX = 8;

// ─── Invasion threshold ──────────────────────────────────────────────────────
// Game over when any alive invader's bottom edge crosses this Y
export const INVASION_Y = 440;

// ─── UFO ─────────────────────────────────────────────────────────────────────
const UFO_SPAWN_INTERVAL = 720; // ~12 s at 60 fps
const UFO_SPEED = 2;
export const UFO_Y = 28;

// ─── Shields ─────────────────────────────────────────────────────────────────
export const SHIELD_H = 28;
export const SHIELD_MAX_HEALTH = 10;
export const SHIELD_POSITIONS = [56, 152, 248, 344] as const;
export const SHIELD_TOP_Y = 448;
export const SHIELD_W = 52;

// ─── Animation ───────────────────────────────────────────────────────────────
const ANIM_INTERVAL = 28;

// ─── Timing ──────────────────────────────────────────────────────────────────
const DEATH_TICKS = 120; // 2 s at 60 fps
const FIRE_CHANCE = 0.0025; // per bottom-row invader per tick
const INITIAL_LIVES = 3;
const LEVEL_TICKS = 90; // 1.5 s at 60 fps

// ─── Score table ─────────────────────────────────────────────────────────────
export const ROW_POINTS = [30, 20, 20, 10, 10] as const; // row 0 = top squid

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Bullet {
  x: number;
  y: number;
}

export interface Invader {
  alive: boolean;
  col: number;
  row: number;
}

export interface Shield {
  health: number;
  x: number;
}

export interface Ufo {
  dir: 1 | -1;
  x: number;
}

export interface SpaceInvadersContext {
  animCounter: number;
  animFrame: 0 | 1;
  deathTimer: number;
  dropQueued: boolean;
  formationDir: 1 | -1;
  formationX: number;
  formationY: number;
  frameCount: number;
  hiScore: number;
  invaderBullets: Bullet[];
  invaderMoveCounter: number;
  invaderMoveRate: number;
  invaders: Invader[];
  level: number;
  levelTimer: number;
  lives: number;
  playerBullets: Bullet[];
  playerMoving: -1 | 0 | 1;
  playerX: number;
  rapidFire: boolean;
  score: number;
  shields: Shield[];
  ufo: Ufo | null;
  ufoTimer: number;
}

export type SpaceInvadersEvent = { type: "FIRE_PLAYER" } | { type: "INPUT_LEFT_DOWN" } | { type: "INPUT_LEFT_UP" } | { type: "INPUT_RIGHT_DOWN" } | { type: "INPUT_RIGHT_UP" } | { type: "PAUSE" } | { type: "RESET" } | { type: "RESUME" } | { type: "START" } | { type: "TICK" } | { type: "TOGGLE_RAPID_FIRE" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcMoveRate(aliveCount: number, level: number): number {
  return Math.max(1, Math.floor(aliveCount / level));
}

function createInvaders(): Invader[] {
  return Array.from({ length: ROWS * COLS }, (_, i) => ({
    alive: true,
    col: i % COLS,
    row: Math.floor(i / COLS),
  }));
}

function createShields(): Shield[] {
  return SHIELD_POSITIONS.map((x) => ({ health: SHIELD_MAX_HEALTH, x }));
}

function buildInitialContext(level: number, score = 0, hiScore = 0, lives = INITIAL_LIVES, rapidFire = false): SpaceInvadersContext {
  const invaders = createInvaders();
  const aliveCount = invaders.length;
  const moveRate = calcMoveRate(aliveCount, level);
  const formationY = Math.min(FORMATION_INIT_Y + (level - 1) * LEVEL_Y_INCREMENT, MAX_FORMATION_Y);

  return {
    animCounter: 0,
    animFrame: 0,
    deathTimer: 0,
    dropQueued: false,
    formationDir: 1,
    formationX: FORMATION_INIT_X,
    formationY,
    frameCount: 0,
    hiScore,
    invaderBullets: [],
    invaderMoveCounter: moveRate,
    invaderMoveRate: moveRate,
    invaders,
    level,
    levelTimer: 0,
    lives,
    playerBullets: [],
    playerMoving: 0,
    playerX: CANVAS_W / 2,
    rapidFire,
    score,
    shields: createShields(),
    ufo: null,
    ufoTimer: UFO_SPAWN_INTERVAL,
  };
}

// ─── Core tick logic (pure function) ─────────────────────────────────────────

function tickActive(ctx: SpaceInvadersContext): Partial<SpaceInvadersContext> {
  let animCounter = ctx.animCounter + 1;
  let animFrame: 0 | 1 = ctx.animFrame;
  let dropQueued = ctx.dropQueued;
  let formationDir: 1 | -1 = ctx.formationDir;
  let formationX = ctx.formationX;
  let formationY = ctx.formationY;
  let hiScore = ctx.hiScore;
  let invaderBullets: Bullet[] = [...ctx.invaderBullets];
  let invaderMoveCounter = ctx.invaderMoveCounter - 1;
  let invaderMoveRate = ctx.invaderMoveRate;
  let invaders: Invader[] = ctx.invaders;
  let playerBullets: Bullet[] = [...ctx.playerBullets];
  let score = ctx.score;
  let shields: Shield[] = ctx.shields;
  let ufo: Ufo | null = ctx.ufo;
  let ufoTimer = ctx.ufoTimer;

  const frameCount = ctx.frameCount + 1;
  const level = ctx.level;

  // 1. Move player
  const playerX = Math.max(PLAYER_W / 2, Math.min(CANVAS_W - PLAYER_W / 2, ctx.playerX + ctx.playerMoving * PLAYER_SPEED));

  // 2. Move player bullets upward, remove off-screen
  playerBullets = playerBullets.map((b) => ({ ...b, y: b.y - PLAYER_BULLET_SPEED })).filter((b) => b.y >= 0);

  // 3. Move invader bullets downward, remove off-screen
  invaderBullets = invaderBullets.map((b) => ({ ...b, y: b.y + INVADER_BULLET_SPEED })).filter((b) => b.y < CANVAS_H);

  // 4. UFO movement and spawn
  if (ufo) {
    ufo = { ...ufo, x: ufo.x + ufo.dir * UFO_SPEED };
    if (ufo.x < -40 || ufo.x > CANVAS_W + 40) {
      ufo = null;
      ufoTimer = UFO_SPAWN_INTERVAL;
    }
  } else {
    ufoTimer -= 1;
    if (ufoTimer <= 0) {
      const dir: 1 | -1 = frameCount % 2 === 0 ? 1 : -1;
      ufo = { dir, x: dir === 1 ? -24 : CANVAS_W + 24 };
      ufoTimer = UFO_SPAWN_INTERVAL;
    }
  }

  // 5. Animation flip
  if (animCounter >= ANIM_INTERVAL) {
    animCounter = 0;
    animFrame = animFrame === 0 ? 1 : 0;
  }

  // 6. Formation movement
  if (invaderMoveCounter <= 0) {
    if (dropQueued) {
      formationY += DROP_PX;
      formationDir = formationDir === 1 ? -1 : 1;
      dropQueued = false;
    } else {
      formationX += formationDir * STEP_PX;
      // Check wall collision using leftmost/rightmost alive invader columns
      const alive = invaders.filter((i) => i.alive);
      if (alive.length > 0) {
        const minCol = Math.min(...alive.map((i) => i.col));
        const maxCol = Math.max(...alive.map((i) => i.col));
        const leftEdge = formationX + minCol * COL_GAP;
        const rightEdge = formationX + maxCol * COL_GAP + INVADER_W;
        if (leftEdge <= 4 || rightEdge >= CANVAS_W - 4) {
          dropQueued = true;
        }
      }
    }
    const aliveCount = invaders.filter((i) => i.alive).length;
    invaderMoveRate = calcMoveRate(aliveCount, level);
    invaderMoveCounter = invaderMoveRate;
  }

  // 7. Invader random fire — only bottom-row invader per column fires
  if (invaderBullets.length < MAX_INVADER_BULLETS) {
    const bottomMap = new Map<number, Invader>();
    for (const inv of invaders) {
      if (!inv.alive) continue;
      const cur = bottomMap.get(inv.col);
      if (!cur || inv.row > cur.row) bottomMap.set(inv.col, inv);
    }
    for (const inv of bottomMap.values()) {
      if (Math.random() < FIRE_CHANCE) {
        const bx = formationX + inv.col * COL_GAP + INVADER_W / 2;
        const by = formationY + inv.row * ROW_GAP + INVADER_H;
        invaderBullets = [...invaderBullets, { x: bx, y: by }];
        if (invaderBullets.length >= MAX_INVADER_BULLETS) break;
      }
    }
  }

  // 8. Collision: player bullets vs invaders
  playerBullets = playerBullets.filter((bullet) => {
    let hit = false;
    invaders = invaders.map((inv) => {
      if (hit || !inv.alive) return inv;
      const ix = formationX + inv.col * COL_GAP;
      const iy = formationY + inv.row * ROW_GAP;
      if (bullet.x >= ix && bullet.x <= ix + INVADER_W && bullet.y >= iy && bullet.y <= iy + INVADER_H) {
        score += ROW_POINTS[inv.row] ?? 10;
        hiScore = Math.max(hiScore, score);
        hit = true;
        return { ...inv, alive: false };
      }
      return inv;
    });
    return !hit;
  });

  // 9. Collision: player bullets vs UFO
  if (ufo) {
    const curUfo = ufo;
    playerBullets = playerBullets.filter((bullet) => {
      if (Math.abs(bullet.x - curUfo.x) <= 22 && Math.abs(bullet.y - UFO_Y) <= 12) {
        const bonus = (Math.floor(Math.random() * 6) + 1) * 50; // 50–300
        score += bonus;
        hiScore = Math.max(hiScore, score);
        ufo = null;
        ufoTimer = UFO_SPAWN_INTERVAL;
        return false;
      }
      return true;
    });
  }

  // 10–11. Shield collisions — player bullets and invader bullets vs shields
  shields = shields.map((shield) => {
    if (shield.health <= 0) return shield;
    let health = shield.health;

    const inShield = (bx: number, by: number): boolean => bx >= shield.x && bx <= shield.x + SHIELD_W && by >= SHIELD_TOP_Y && by <= SHIELD_TOP_Y + SHIELD_H;

    playerBullets = playerBullets.filter((bullet) => {
      if (inShield(bullet.x, bullet.y) && health > 0) {
        health = Math.max(0, health - 2);
        return false;
      }
      return true;
    });

    invaderBullets = invaderBullets.filter((b) => {
      if (inShield(b.x, b.y) && health > 0) {
        health = Math.max(0, health - 1);
        return false;
      }
      return true;
    });

    return health === shield.health ? shield : { ...shield, health };
  });

  return {
    animCounter,
    animFrame,
    dropQueued,
    formationDir,
    formationX,
    formationY,
    frameCount,
    hiScore,
    invaderBullets,
    invaderMoveCounter,
    invaderMoveRate,
    invaders,
    playerBullets,
    playerX,
    score,
    shields,
    ufo,
    ufoTimer,
  };
}

// ─── Machine ──────────────────────────────────────────────────────────────────

export const spaceInvadersMachine = setup({
  guards: {
    allCleared: ({ context }: { context: SpaceInvadersContext }) => context.invaders.every((i) => !i.alive),
    deathTimerDone: ({ context }: { context: SpaceInvadersContext }) => context.deathTimer <= 0,
    hasInvaded: ({ context }: { context: SpaceInvadersContext }) => {
      const alive = context.invaders.filter((i) => i.alive);
      if (alive.length === 0) return false;
      const maxRow = Math.max(...alive.map((i) => i.row));
      return context.formationY + maxRow * ROW_GAP + INVADER_H >= INVASION_Y;
    },
    levelTimerDone: ({ context }: { context: SpaceInvadersContext }) => context.levelTimer <= 0,
    noLivesLeft: ({ context }: { context: SpaceInvadersContext }) => context.lives <= 0,
    playerHit: ({ context }: { context: SpaceInvadersContext }) => context.invaderBullets.some((b) => b.x >= context.playerX - PLAYER_W / 2 && b.x <= context.playerX + PLAYER_W / 2 && b.y >= PLAYER_Y - PLAYER_H / 2 && b.y <= PLAYER_Y + PLAYER_H / 2),
  },
  types: {
    context: {} as SpaceInvadersContext,
    events: {} as SpaceInvadersEvent,
  },
}).createMachine({
  context: buildInitialContext(1),
  id: "spaceInvaders",
  initial: "idle",
  states: {
    gameOver: {
      on: {
        RESET: { target: "idle" },
      },
    },
    idle: {
      on: {
        START: {
          actions: assign(() => buildInitialContext(1)),
          target: "playing",
        },
      },
    },
    paused: {
      on: {
        RESET: { target: "idle" },
        RESUME: { target: "playing.active" },
      },
    },
    playing: {
      initial: "active",
      on: {
        PAUSE: { target: "paused" },
        RESET: { target: "idle" },
      },
      states: {
        active: {
          on: {
            FIRE_PLAYER: {
              actions: assign(({ context }: { context: SpaceInvadersContext }) => {
                const maxBullets = context.rapidFire ? MAX_PLAYER_BULLETS : 1;
                if (context.playerBullets.length >= maxBullets) return {};
                return { playerBullets: [...context.playerBullets, { x: context.playerX, y: PLAYER_Y - PLAYER_H }] };
              }),
            },
            INPUT_LEFT_DOWN: {
              actions: assign({ playerMoving: () => -1 as const }),
            },
            INPUT_LEFT_UP: {
              actions: assign({
                playerMoving: ({ context }: { context: SpaceInvadersContext }) => (context.playerMoving === -1 ? (0 as const) : context.playerMoving),
              }),
            },
            INPUT_RIGHT_DOWN: {
              actions: assign({ playerMoving: () => 1 as const }),
            },
            INPUT_RIGHT_UP: {
              actions: assign({
                playerMoving: ({ context }: { context: SpaceInvadersContext }) => (context.playerMoving === 1 ? (0 as const) : context.playerMoving),
              }),
            },
            TICK: [
              { guard: "hasInvaded", target: "#spaceInvaders.gameOver" },
              {
                actions: assign(({ context }: { context: SpaceInvadersContext }) => ({
                  deathTimer: DEATH_TICKS,
                  invaderBullets: [],
                  lives: context.lives - 1,
                  playerBullets: [],
                  playerMoving: 0 as const,
                })),
                guard: "playerHit",
                target: "playerDying",
              },
              {
                actions: assign({ levelTimer: () => LEVEL_TICKS }),
                guard: "allCleared",
                target: "levelComplete",
              },
              { actions: assign(({ context }: { context: SpaceInvadersContext }) => tickActive(context)) },
            ],
            TOGGLE_RAPID_FIRE: {
              actions: assign(({ context }: { context: SpaceInvadersContext }) => ({ rapidFire: !context.rapidFire })),
            },
          },
        },
        levelComplete: {
          on: {
            TICK: [
              {
                actions: assign(({ context }: { context: SpaceInvadersContext }) => buildInitialContext(context.level + 1, context.score, context.hiScore, context.lives, context.rapidFire)),
                guard: "levelTimerDone",
                target: "active",
              },
              {
                actions: assign({
                  levelTimer: ({ context }: { context: SpaceInvadersContext }) => context.levelTimer - 1,
                }),
              },
            ],
          },
        },
        playerDying: {
          on: {
            TICK: [
              {
                guard: and(["deathTimerDone", "noLivesLeft"]),
                target: "#spaceInvaders.gameOver",
              },
              {
                actions: assign(({ context }: { context: SpaceInvadersContext }) => ({
                  formationDir: 1 as const,
                  invaderMoveCounter: context.invaderMoveRate,
                  playerBullets: [],
                  playerMoving: 0 as const,
                  playerX: CANVAS_W / 2,
                })),
                guard: "deathTimerDone",
                target: "active",
              },
              {
                actions: assign({
                  deathTimer: ({ context }: { context: SpaceInvadersContext }) => context.deathTimer - 1,
                }),
              },
            ],
          },
        },
      },
    },
  },
});
