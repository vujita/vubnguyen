import { assign, setup } from "xstate";

// ─── Canvas / world constants ─────────────────────────────────────────────────
export const CANVAS_W = 400;
export const CANVAS_H = 600;

// Ground band: bottom 22 % of canvas
export const GROUND_Y = Math.round(CANVAS_H * 0.78); // y where ground starts
export const DRAGON_SPEED = 3.5;

// Auto-fire intervals (ticks at 60 fps)
const FIREBALL_INTERVAL = 18;
const BOMB_INTERVAL = 55;

// Dragon geometry
const DRAGON_HALF_W = 18;
const DRAGON_HALF_H = 14;

export const INITIAL_LIVES = 3;
const INVINCIBLE_TICKS = 90; // 1.5 s
const STAGE_CLEAR_TICKS = 90;

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnemyType =
  | "bat"
  | "bird"
  | "gargoyle"
  | "skyDrake"
  | "toad"
  | "scorpion"
  | "beetle"
  | "groundWyrm"
  | "boss";

export type PowerupType = "blueOrb" | "redOrb" | "diamond" | "gold";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Enemy {
  hp: number;
  id: number;
  isGround: boolean;
  pattern: string;
  patternT: number; // ticks alive, used for pattern calcs
  type: EnemyType;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
}

export interface Bomb {
  id: number;
  radius: number;
  x: number;
  y: number;
}

export interface Powerup {
  id: number;
  type: PowerupType;
  x: number;
  y: number;
}

export interface GroundTile {
  type: number; // 0–3 decorative variants
  x: number;
  y: number;
}

export interface SpawnDef {
  count?: number;
  pattern: string;
  spread?: number; // x spread for multiple
  type: EnemyType;
  x: number;
  y: number; // spawn y (usually negative — above screen)
}

export interface Wave {
  defs: SpawnDef[];
  scrollY: number; // trigger when scrollY >= this value
}

export interface StageDefinition {
  bgColor: number;
  bossScrollY: number;
  groundColor: number;
  id: number;
  name: string;
  scrollSpeed: number;
  stageLength: number;
  waves: Wave[];
}

export interface HeldKeys {
  down: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
}

export interface DragonSpiritContext {
  // Stage / progress
  stage: number;
  scrollY: number;
  nextWaveIndex: number;
  stageClearTimer: number;

  // Player stats
  score: number;
  hiScore: number;
  lives: number;
  heads: number; // 1–3
  firepower: number; // 1–4
  invincibleTicks: number;

  // Dragon position
  dragonX: number;
  dragonY: number;
  heldKeys: HeldKeys;

  // Fire timers
  fireTimer: number;
  bombTimer: number;

  // Entities
  bullets: Bullet[];
  bombs: Bomb[];
  enemies: Enemy[];
  powerups: Powerup[];
  groundTiles: GroundTile[];

  // Boss
  bossActive: boolean;
  bossSpawned: boolean; // true once spawned — prevents respawn after defeat
  bossHP: number;
  maxBossHP: number;
  bossBullets: Bullet[];
  bossX: number;
  bossY: number;
  bossVx: number;
  bossVy: number;
  bossFiringTimer: number;
  bossDefeated: boolean; // latches true when boss HP hits 0, cleared on new stage

  // Id counter
  nextId: number;
}

export type DragonSpiritEvent =
  | { type: "START" }
  | { type: "TICK" }
  | { keys: HeldKeys; type: "SET_KEYS" }
  | { type: "FIRE" }
  | { type: "FIRE_DOWN" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" };

// ─── Stage definitions ────────────────────────────────────────────────────────

function makeWaves(stage: number): Wave[] {
  const w: Wave[] = [];
  const totalLen = 2400 + stage * 400;
  const spacing = Math.round(totalLen / 10);

  for (let i = 0; i < 10; i++) {
    const sy = 100 + i * spacing;
    const airTypes: EnemyType[] = ["bat", "bird", "gargoyle", "skyDrake"];
    const groundTypes: EnemyType[] = ["toad", "scorpion", "beetle", "groundWyrm"];

    // mix air + ground waves
    const defs: SpawnDef[] = [];

    const airType = airTypes[(i + stage) % airTypes.length]!;
    const groundType = groundTypes[(i + stage) % groundTypes.length]!;

    defs.push({
      count: 2 + Math.min(stage, 3),
      pattern: i % 2 === 0 ? "zigzag" : "dive",
      spread: 60,
      type: airType,
      x: CANVAS_W / 2,
      y: -40,
    });

    if (i >= 2) {
      const groundCount = 1 + Math.min(stage - 1, 2);
      // Spawn off-screen: alternate left and right sides so enemies walk in
      const fromLeft = i % 2 === 0;
      defs.push({
        count: groundCount,
        pattern: fromLeft ? "patrol" : "patrol_left",
        spread: 40,
        type: groundType,
        x: fromLeft ? -50 : CANVAS_W + 50,
        y: GROUND_Y + 16,
      });
    }
    w.push({ defs, scrollY: sy });
  }
  return w;
}

const STAGE_THEMES: Array<{
  bgColor: number;
  groundColor: number;
  name: string;
}> = [
  { bgColor: 0x0d2b0d, groundColor: 0x0a1a08, name: "Forest" },
  { bgColor: 0x0a1a2e, groundColor: 0x051020, name: "Ocean" },
  { bgColor: 0x1a1a1a, groundColor: 0x0f0f0f, name: "Mountain" },
  { bgColor: 0x2b1a08, groundColor: 0x1a0f04, name: "Desert" },
  { bgColor: 0x0d1a2b, groundColor: 0x060f1a, name: "Ice Cavern" },
  { bgColor: 0x2b0800, groundColor: 0x1a0400, name: "Volcano" },
  { bgColor: 0x0d0d1a, groundColor: 0x060610, name: "Dark Fortress" },
  { bgColor: 0x1a0d1a, groundColor: 0x100810, name: "Shadow Realm" },
  { bgColor: 0x0d0000, groundColor: 0x080000, name: "Final Castle" },
];

export const STAGES: StageDefinition[] = STAGE_THEMES.map((t, i) => {
  const id = i + 1;
  const stageLength = 2800 + id * 400;
  return {
    bgColor: t.bgColor,
    bossScrollY: stageLength - 300,
    groundColor: t.groundColor,
    id,
    name: t.name,
    scrollSpeed: 1.6 + id * 0.18,
    stageLength,
    waves: makeWaves(id),
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _idCtr = 1;
function nextId(): number {
  return _idCtr++;
}

function enemyBaseHP(type: EnemyType, stage: number): number {
  const base: Record<EnemyType, number> = {
    bat: 1,
    beetle: 3,
    bird: 1,
    boss: 18 + stage * 4,
    gargoyle: 2,
    groundWyrm: 4,
    scorpion: 2,
    skyDrake: 3,
    toad: 1,
  };
  return base[type];
}

function enemyIsGround(type: EnemyType): boolean {
  return type === "toad" || type === "scorpion" || type === "beetle" || type === "groundWyrm";
}

function spawnWave(wave: Wave, stage: number): Enemy[] {
  const enemies: Enemy[] = [];
  for (const def of wave.defs) {
    const count = def.count ?? 1;
    const spread = def.spread ?? 0;
    for (let i = 0; i < count; i++) {
      const offsetX = count === 1 ? 0 : -spread / 2 + (spread / (count - 1)) * i;
      enemies.push({
        hp: enemyBaseHP(def.type, stage),
        id: nextId(),
        isGround: enemyIsGround(def.type),
        pattern: def.pattern,
        patternT: 0,
        type: def.type,
        vx: 0,
        vy: 0.8 + stage * 0.06,
        x: def.x + offsetX,
        y: def.y,
      });
    }
  }
  return enemies;
}

function spawnBoss(stage: number, id: number): Enemy {
  return {
    hp: 18 + stage * 4,
    id,
    isGround: false,
    pattern: "boss",
    patternT: 0,
    type: "boss",
    vx: 1.2,
    vy: 0,
    x: CANVAS_W / 2,
    y: 80,
  };
}

function applyEnemyPattern(e: Enemy, dragonX: number, dragonY: number, t: number): Pick<Enemy, "vx" | "vy"> {
  switch (e.pattern) {
    case "zigzag":
      return { vx: Math.sin(t * 0.08) * 2, vy: e.vy };
    case "dive":
      if (t < 30) return { vx: (dragonX - e.x) * 0.03, vy: e.vy };
      return { vx: 0, vy: e.vy };
    case "patrol": {
      const dir = Math.sign(Math.sin(t * 0.04)) || 1;
      return { vx: dir * 1.2, vy: 0 };
    }
    case "patrol_left": {
      // Starts moving left (enters from right side of screen)
      const dir = Math.sign(Math.sin(t * 0.04 + Math.PI)) || -1;
      return { vx: dir * 1.2, vy: 0 };
    }
    case "orbit":
      return {
        vx: Math.cos(t * 0.06) * 1.8,
        vy: Math.sin(t * 0.06) * 1.2 + 0.4,
      };
    case "boss": {
      const newVx = e.x <= 40 ? Math.abs(e.vx) : e.x >= CANVAS_W - 40 ? -Math.abs(e.vx) : e.vx;
      // bob up and down slowly
      return { vx: newVx, vy: Math.sin(t * 0.03) * 1.5 };
    }
    default:
      return { vx: e.vx, vy: e.vy };
  }
}

function circleRect(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number): boolean {
  const nearX = Math.max(rx, Math.min(cx, rx + rw));
  const nearY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearX;
  const dy = cy - nearY;
  return dx * dx + dy * dy < cr * cr;
}

function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function dragonHitRadius(heads: number): number {
  return 10 + heads * 3; // larger = bigger hitbox for more heads
}

function randomPowerup(x: number, y: number, stage: number): Powerup | null {
  const r = Math.random();
  const threshold = 0.28 + stage * 0.01;
  if (r > threshold) return null;
  let type: PowerupType;
  const t2 = Math.random();
  if (t2 < 0.3) type = "blueOrb";
  else if (t2 < 0.5) type = "redOrb";
  else if (t2 < 0.8) type = "diamond";
  else type = "gold";
  return { id: nextId(), type, x, y };
}

function initialGroundTiles(): GroundTile[] {
  const tiles: GroundTile[] = [];
  for (let i = 0; i < 12; i++) {
    tiles.push({ type: Math.floor(Math.random() * 4), x: Math.random() * CANVAS_W, y: GROUND_Y + 5 + Math.random() * 20 });
  }
  return tiles;
}

function initialContext(): DragonSpiritContext {
  return {
    // Boss
    bossActive: false,
    bossSpawned: false,
    bossDefeated: false,
    bossHP: 0,
    bossBullets: [],
    bossFiringTimer: 0,
    bossVx: 1.2,
    bossVy: 0,
    bossX: CANVAS_W / 2,
    bossY: 80,
    bombTimer: 0,
    bullets: [],
    bombs: [],
    dragonX: CANVAS_W / 2,
    dragonY: CANVAS_H * 0.65,
    enemies: [],
    firepower: 1,
    fireTimer: 0,
    groundTiles: [],
    heads: 2,
    heldKeys: { down: false, left: false, right: false, up: false },
    hiScore: 0,
    invincibleTicks: 0,
    lives: INITIAL_LIVES,
    maxBossHP: 0,
    nextId: 1,
    nextWaveIndex: 0,
    powerups: [],
    score: 0,
    scrollY: 0,
    stage: 1,
    stageClearTimer: 0,
  };
}

// ─── TICK logic ───────────────────────────────────────────────────────────────

function tick(ctx: DragonSpiritContext): Partial<DragonSpiritContext> {
  const stageDef = STAGES[ctx.stage - 1]!;

  // ── Move dragon ──────────────────────────────────────────────────────────
  let dx = 0;
  let dy = 0;
  if (ctx.heldKeys.left) dx -= DRAGON_SPEED;
  if (ctx.heldKeys.right) dx += DRAGON_SPEED;
  if (ctx.heldKeys.up) dy -= DRAGON_SPEED;
  if (ctx.heldKeys.down) dy += DRAGON_SPEED;

  const dragonX = Math.max(DRAGON_HALF_W, Math.min(CANVAS_W - DRAGON_HALF_W, ctx.dragonX + dx));
  // Clamp dragon to air zone (keep above ground layer, not too high off screen)
  const dragonY = Math.max(30, Math.min(GROUND_Y - DRAGON_HALF_H - 4, ctx.dragonY + dy));

  // ── Auto-fire: fireballs (air) ────────────────────────────────────────────
  let bullets = [...ctx.bullets];
  let fireTimer = ctx.fireTimer + 1;
  if (fireTimer >= FIREBALL_INTERVAL) {
    fireTimer = 0;
    const spread = ctx.heads === 1 ? [0] : ctx.heads === 2 ? [-18, 18] : [-30, 0, 30];
    for (const offsetX of spread) {
      bullets.push({ id: nextId(), x: dragonX + offsetX, y: dragonY - DRAGON_HALF_H });
    }
  }

  // ── Auto-fire: bombs (ground) ────────────────────────────────────────────
  let bombs = [...ctx.bombs];
  let bombTimer = ctx.bombTimer + 1;
  if (bombTimer >= BOMB_INTERVAL) {
    bombTimer = 0;
    bombs.push({ id: nextId(), radius: 0, x: dragonX, y: GROUND_Y + 8 });
  }

  // ── Move fireballs ───────────────────────────────────────────────────────
  const bulletSpeed = 6 + ctx.firepower;
  bullets = bullets
    .map((b) => ({ ...b, y: b.y - bulletSpeed }))
    .filter((b) => b.y > -20);

  // ── Expand / cull bombs ───────────────────────────────────────────────────
  bombs = bombs
    .map((b) => ({ ...b, radius: b.radius + 3.5 }))
    .filter((b) => b.radius < 38);

  // ── Move enemies ──────────────────────────────────────────────────────────
  let enemies = ctx.enemies.map((e) => {
    const { vx, vy } = applyEnemyPattern(e, dragonX, dragonY, e.patternT + 1);
    return { ...e, patternT: e.patternT + 1, vx, vy, x: e.x + vx, y: e.y + vy };
  }).filter((e) => e.y < CANVAS_H + 60 && e.y > -120);

  // ── Boss movement ────────────────────────────────────────────────────────
  let { bossActive, bossSpawned, bossDefeated, bossHP, bossX, bossY, bossVx, bossVy, maxBossHP } = ctx;
  let bossBullets = [...ctx.bossBullets];
  let bossFiringTimer = ctx.bossFiringTimer;

  if (bossActive) {
    const bossEnemy = enemies.find((e) => e.type === "boss");
    if (bossEnemy) {
      bossX = bossEnemy.x;
      bossY = bossEnemy.y;
      bossVx = bossEnemy.vx;
      bossVy = bossEnemy.vy;
    }

    // Boss fires at player
    bossFiringTimer++;
    const bossFireRate = Math.max(40, 80 - ctx.stage * 4);
    if (bossFiringTimer >= bossFireRate) {
      bossFiringTimer = 0;
      const angle = Math.atan2(dragonY - bossY, dragonX - bossX);
      const speed = 2.5;
      bossBullets.push({ id: nextId(), x: bossX, y: bossY + 20 });
      // also fire aimed shot
      bossBullets.push({ id: nextId(), x: bossX + Math.cos(angle) * 20, y: bossY + Math.sin(angle) * 20 });
    }
  }

  // Move boss bullets
  bossBullets = bossBullets
    .map((b) => ({ ...b, y: b.y + 3 }))
    .filter((b) => b.y < CANVAS_H + 20);

  // ── Spawn from wave queue ─────────────────────────────────────────────────
  let nextWaveIndex = ctx.nextWaveIndex;
  const scrollY = ctx.scrollY + stageDef.scrollSpeed;
  while (nextWaveIndex < stageDef.waves.length && stageDef.waves[nextWaveIndex]!.scrollY <= scrollY) {
    enemies = [...enemies, ...spawnWave(stageDef.waves[nextWaveIndex]!, ctx.stage)];
    nextWaveIndex++;
  }

  // ── Spawn boss (only once per stage) ────────────────────────────────────
  if (!bossSpawned && scrollY >= stageDef.bossScrollY) {
    bossSpawned = true;
    bossActive = true;
    const boss = spawnBoss(ctx.stage, nextId());
    maxBossHP = boss.hp;
    bossHP = boss.hp;
    enemies = [...enemies, boss];
  }

  // ── Invincibility countdown ───────────────────────────────────────────────
  const invincibleTicks = Math.max(0, ctx.invincibleTicks - 1);

  // ── Bullet × enemy collisions (air enemies only) ─────────────────────────
  let score = ctx.score;
  let powerups = [...ctx.powerups];
  const hitEnemyIds = new Set<number>();
  const hitBulletIds = new Set<number>();

  for (const b of bullets) {
    for (const e of enemies) {
      if (e.isGround) continue;
      if (hitEnemyIds.has(e.id)) continue;
      // Skip enemies that haven't entered the visible canvas yet
      if (e.y < 0 || e.y > CANVAS_H) continue;
      if (Math.abs(b.x - e.x) < 22 && Math.abs(b.y - e.y) < 18) {
        hitBulletIds.add(b.id);
        const newHP = e.hp - 1;
        if (newHP <= 0) {
          hitEnemyIds.add(e.id);
          const pts = e.type === "boss" ? 0 : (e.type === "skyDrake" ? 400 : e.type === "gargoyle" ? 200 : e.type === "bird" ? 100 : 50);
          score += pts;
          const drop = randomPowerup(e.x, e.y, ctx.stage);
          if (drop) powerups.push(drop);
        } else {
          // update hp in place
          const idx = enemies.findIndex((x) => x.id === e.id);
          if (idx >= 0) enemies[idx] = { ...enemies[idx]!, hp: newHP };
        }
        break;
      }
    }
  }

  // Boss bullet hit (air)
  for (const b of bullets) {
    if (hitBulletIds.has(b.id)) continue;
    const bossEnemy = enemies.find((e) => e.type === "boss");
    if (bossEnemy && bossEnemy.y >= 0 && bossEnemy.y <= CANVAS_H && Math.abs(b.x - bossEnemy.x) < 42 && Math.abs(b.y - bossEnemy.y) < 38) {
      hitBulletIds.add(b.id);
      const newHP = bossEnemy.hp - 1;
      bossHP = newHP;
      if (newHP <= 0) {
        hitEnemyIds.add(bossEnemy.id);
        score += 10000;
        bossActive = false;
        bossDefeated = true;
      } else {
        const idx = enemies.findIndex((x) => x.id === bossEnemy.id);
        if (idx >= 0) enemies[idx] = { ...enemies[idx]!, hp: newHP };
      }
    }
  }

  // ── Bomb × ground enemy collisions ───────────────────────────────────────
  for (const bm of bombs) {
    for (const e of enemies) {
      if (!e.isGround) continue;
      if (hitEnemyIds.has(e.id)) continue;
      // Skip ground enemies that haven't walked onto screen yet
      if (e.x < -50 || e.x > CANVAS_W + 50) continue;
      if (circleRect(bm.x, bm.y, bm.radius, e.x - 16, e.y - 16, 32, 32)) {
        const newHP = e.hp - 1;
        if (newHP <= 0) {
          hitEnemyIds.add(e.id);
          const pts = e.type === "groundWyrm" ? 300 : e.type === "beetle" ? 150 : e.type === "scorpion" ? 100 : 50;
          score += pts;
          const drop = randomPowerup(e.x, e.y, ctx.stage);
          if (drop) powerups.push(drop);
        } else {
          const idx = enemies.findIndex((x) => x.id === e.id);
          if (idx >= 0) enemies[idx] = { ...enemies[idx]!, hp: newHP };
        }
      }
    }
  }

  enemies = enemies.filter((e) => !hitEnemyIds.has(e.id));
  bullets = bullets.filter((b) => !hitBulletIds.has(b.id));

  // ── Move / cull powerups ──────────────────────────────────────────────────
  powerups = powerups
    .map((p) => ({ ...p, y: p.y + 0.5 }))
    .filter((p) => p.y < CANVAS_H + 20);

  // ── Dragon × powerup collisions ───────────────────────────────────────────
  let heads = ctx.heads;
  let firepower = ctx.firepower;
  const collectedIds = new Set<number>();
  for (const p of powerups) {
    if (Math.abs(dragonX - p.x) < 28 && Math.abs(dragonY - p.y) < 24) {
      collectedIds.add(p.id);
      if (p.type === "blueOrb") heads = Math.min(3, heads + 1);
      else if (p.type === "redOrb") firepower = Math.min(4, firepower + 1);
      else if (p.type === "diamond") score += 100;
      else if (p.type === "gold") score += 500;
    }
  }
  powerups = powerups.filter((p) => !collectedIds.has(p.id));

  // ── Dragon × enemy / boss-bullet collision ────────────────────────────────
  let lives = ctx.lives;
  let hitThisTick = false;

  if (invincibleTicks === 0) {
    const hr = dragonHitRadius(heads);
    // vs enemy bodies
    for (const e of enemies) {
      if (rectsOverlap(dragonX - hr, dragonY - hr, hr * 2, hr * 2, e.x - 14, e.y - 14, 28, 28)) {
        hitThisTick = true;
        break;
      }
    }
    // vs boss bullets
    if (!hitThisTick) {
      for (const b of bossBullets) {
        if (Math.abs(dragonX - b.x) < hr && Math.abs(dragonY - b.y) < hr) {
          hitThisTick = true;
          break;
        }
      }
    }
  }

  let newInvincibleTicks = invincibleTicks;
  if (hitThisTick) {
    newInvincibleTicks = INVINCIBLE_TICKS;
    if (heads > 1) {
      heads--;
    } else {
      lives--;
      heads = 2; // respawn with 2 heads
    }
  }

  // ── Scroll ground tiles ───────────────────────────────────────────────────
  let groundTiles = ctx.groundTiles.map((t) => ({ ...t, y: t.y + stageDef.scrollSpeed * 0.5 }));
  while (groundTiles.some((t) => t.y > CANVAS_H + 20)) {
    groundTiles = groundTiles.filter((t) => t.y <= CANVAS_H + 20);
    groundTiles.push({ type: Math.floor(Math.random() * 4), x: Math.random() * CANVAS_W, y: GROUND_Y });
  }
  // replenish if too few
  while (groundTiles.length < 12) {
    groundTiles.push({ type: Math.floor(Math.random() * 4), x: Math.random() * CANVAS_W, y: GROUND_Y + Math.random() * 30 });
  }

  // ── Stage clear check ─────────────────────────────────────────────────────
  const stageClearTimer = ctx.stageClearTimer; // handled in state transitions

  return {
    bossActive,
    bossSpawned,
    bossDefeated,
    bossHP,
    bossBullets,
    bossFiringTimer,
    bossVx,
    bossVy,
    bossX,
    bossY,
    bombTimer,
    bullets,
    bombs,
    dragonX,
    dragonY,
    enemies,
    firepower,
    fireTimer,
    groundTiles,
    heads,
    hiScore: Math.max(ctx.hiScore, score),
    invincibleTicks: newInvincibleTicks,
    lives,
    maxBossHP,
    nextWaveIndex,
    powerups,
    score,
    scrollY,
    stageClearTimer,
  };
}

// ─── Machine ──────────────────────────────────────────────────────────────────

export const dragonSpiritMachine = setup({
  types: {
    context: {} as DragonSpiritContext,
    events: {} as DragonSpiritEvent,
  },
}).createMachine({
  context: initialContext(),
  id: "dragonSpirit",
  initial: "idle",
  states: {
    // ── Idle / title screen ─────────────────────────────────────────────
    idle: {
      on: {
        START: {
          actions: assign(() => ({
            ...initialContext(),
            groundTiles: initialGroundTiles(),
          })),
          target: "playing",
        },
      },
    },

    // ── Actively playing ────────────────────────────────────────────────
    playing: {
      on: {
        PAUSE: { target: "paused" },
        RESET: {
          actions: assign(() => initialContext()),
          target: "idle",
        },
        SET_KEYS: {
          actions: assign({ heldKeys: ({ event }) => event.keys }),
        },
        // Manual fire: extra fireball burst (resets auto-fire timer)
        FIRE: {
          actions: assign(({ context }: { context: DragonSpiritContext }) => {
            const spread = context.heads === 1 ? [0] : context.heads === 2 ? [-18, 18] : [-30, 0, 30];
            const newBullets = spread.map((ox) => ({
              id: nextId(),
              x: context.dragonX + ox,
              y: context.dragonY - 14,
            }));
            return { bullets: [...context.bullets, ...newBullets], fireTimer: 0 };
          }),
        },
        // Manual bomb: drop ground bomb immediately (resets auto-bomb timer)
        FIRE_DOWN: {
          actions: assign(({ context }: { context: DragonSpiritContext }) => ({
            bombs: [...context.bombs, { id: nextId(), radius: 0, x: context.dragonX, y: GROUND_Y + 8 }],
            bombTimer: 0,
          })),
        },
        TICK: [
          // Player out of lives → game over
          {
            actions: assign(({ context }: { context: DragonSpiritContext }) => tick(context)),
            guard: ({ context }: { context: DragonSpiritContext }) => {
              const next = tick(context);
              return (next.lives ?? context.lives) <= 0;
            },
            target: "gameOver",
          },
          // Boss defeated → stage clear
          {
            actions: assign(({ context }: { context: DragonSpiritContext }) => ({
              ...tick(context),
              stageClearTimer: 0,
            })),
            guard: ({ context }: { context: DragonSpiritContext }) =>
              context.bossDefeated,
            target: "stageClear",
          },
          // Normal tick
          {
            actions: assign(({ context }: { context: DragonSpiritContext }) => tick(context)),
          },
        ],
      },
    },

    // ── Paused ──────────────────────────────────────────────────────────
    paused: {
      on: {
        RESET: {
          actions: assign(() => initialContext()),
          target: "idle",
        },
        RESUME: { target: "playing" },
      },
    },

    // ── Stage clear transition ───────────────────────────────────────────
    stageClear: {
      on: {
        RESET: {
          actions: assign(() => initialContext()),
          target: "idle",
        },
        TICK: [
          // All 9 stages done → victory
          {
            guard: ({ context }) => context.stage >= 9 && context.stageClearTimer >= STAGE_CLEAR_TICKS,
            target: "victory",
          },
          // Advance to next stage
          {
            actions: assign(({ context }) => {
              const nextStage = context.stage + 1;
              return {
                ...initialContext(),
                firepower: context.firepower,
                groundTiles: initialGroundTiles(),
                heads: context.heads,
                hiScore: context.hiScore,
                lives: context.lives,
                score: context.score,
                stage: nextStage,
              };
            }),
            guard: ({ context }) => context.stageClearTimer >= STAGE_CLEAR_TICKS && context.stage < 9,
            target: "playing",
          },
          // Waiting for clear timer
          {
            actions: assign(({ context }) => ({
              stageClearTimer: context.stageClearTimer + 1,
            })),
          },
        ],
      },
    },

    // ── Game over ────────────────────────────────────────────────────────
    gameOver: {
      on: {
        RESET: {
          actions: assign(() => initialContext()),
          target: "idle",
        },
        START: {
          actions: assign(({ context }) => ({
            ...initialContext(),
            groundTiles: initialGroundTiles(),
            hiScore: context.hiScore,
          })),
          target: "playing",
        },
      },
    },

    // ── Victory ──────────────────────────────────────────────────────────
    victory: {
      on: {
        RESET: {
          actions: assign(() => initialContext()),
          target: "idle",
        },
        START: {
          actions: assign(({ context }) => ({
            ...initialContext(),
            groundTiles: initialGroundTiles(),
            hiScore: context.hiScore,
          })),
          target: "playing",
        },
      },
    },
  },
});
