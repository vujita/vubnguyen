// Only ever imported via dynamic import() inside a useEffect —
// the static Phaser import is never evaluated on the server.
import Phaser from "phaser";

import { CANVAS_H, CANVAS_W, COL_GAP, COLS, INVADER_H, INVADER_W, MAX_INVADER_BULLETS, PLAYER_H, PLAYER_W, PLAYER_Y, ROW_GAP, ROWS, SHIELD_H, SHIELD_MAX_HEALTH, SHIELD_TOP_Y, SHIELD_W, UFO_Y, type SpaceInvadersContext, type SpaceInvadersEvent } from "@vujita/vubnguyen/src/app/games/space-invaders/spaceInvadersMachine";

type SendFn = (event: SpaceInvadersEvent) => void;

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  bg: 0x0d0c0a,
  enemyBullet: 0xc9a86c,
  invaderCrab: 0xa09080,
  invaderOctopus: 0xc9a86c,
  invaderSquid: 0xe6e0d4,
  playerBullet: 0xe6e0d4,
  playerDead: 0xff4444,
  playerShip: 0xe6e0d4,
  shieldFull: 0x33cc44,
  shieldLow: 0xcc4433,
  shieldMid: 0xddaa22,
  star: 0xffffff,
  ufo: 0xff4444,
} as const;

// ─── Pixel-art invader bitmaps (8×8 grids, 2 frames each) ────────────────────
// Frame layout: frame[row][col] = 1 means draw this cell

const SQUID: [number[][], number[][]] = [
  // frame 0
  [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
  ],
  // frame 1
  [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
];

const CRAB: [number[][], number[][]] = [
  [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
  ],
  [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
];

const OCTOPUS: [number[][], number[][]] = [
  [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
  ],
];

// pixel size for invader bitmaps: 8 cols → INVADER_W, 8 rows → INVADER_H
const PX_W = INVADER_W / 8; // 3 px
const PX_H = INVADER_H / 8; // 2 px

// ─── Scene ────────────────────────────────────────────────────────────────────

export class SpaceInvaderScene extends Phaser.Scene {
  private bulletGraphics!: Phaser.GameObjects.Graphics;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private escKey!: Phaser.Input.Keyboard.Key;
  private invaderGraphics!: Phaser.GameObjects.Graphics;
  private lastLeft = false;
  private lastRight = false;
  private playerGraphics!: Phaser.GameObjects.Graphics;
  private sendToMachine!: SendFn;
  private shieldGraphics!: Phaser.GameObjects.Graphics;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private ufoGraphics!: Phaser.GameObjects.Graphics;
  private wasd!: { a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key };

  constructor() {
    super({ key: "SpaceInvaderScene" });
  }

  init(data: { send: SendFn }): void {
    this.sendToMachine = data.send;
  }

  create(): void {
    // Draw static starfield on background
    this.drawStarfield();

    this.shieldGraphics = this.add.graphics();
    this.invaderGraphics = this.add.graphics();
    this.ufoGraphics = this.add.graphics();
    this.bulletGraphics = this.add.graphics();
    this.playerGraphics = this.add.graphics();

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
  }

  update(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.cursors || !this.sendToMachine) return;

    const { JustDown } = Phaser.Input.Keyboard;

    // Left/right: track changes only to avoid flooding the machine
    const leftNow = this.cursors.left.isDown || this.wasd.a.isDown;
    const rightNow = this.cursors.right.isDown || this.wasd.d.isDown;

    if (leftNow !== this.lastLeft) {
      this.sendToMachine({ type: leftNow ? "INPUT_LEFT_DOWN" : "INPUT_LEFT_UP" });
      this.lastLeft = leftNow;
    }
    if (rightNow !== this.lastRight) {
      this.sendToMachine({ type: rightNow ? "INPUT_RIGHT_DOWN" : "INPUT_RIGHT_UP" });
      this.lastRight = rightNow;
    }

    if (JustDown(this.spaceKey)) this.sendToMachine({ type: "FIRE_PLAYER" });
    if (JustDown(this.escKey)) this.sendToMachine({ type: "PAUSE" });
  }

  updateFromSnapshot(ctx: SpaceInvadersContext, state: string): void {
    this.invaderGraphics.clear();
    this.ufoGraphics.clear();
    this.bulletGraphics.clear();
    this.playerGraphics.clear();
    this.shieldGraphics.clear();

    if (state === "idle" || state === "gameOver") return;

    const isDying = state === "playing.playerDying";
    const isLevelComplete = state === "playing.levelComplete";

    this.drawShields(ctx.shields);
    this.drawInvaders(ctx, isLevelComplete);
    if (ctx.ufo) this.drawUFO(ctx.ufo.x);
    this.drawBullets(ctx.playerBullets, ctx.invaderBullets);
    this.drawPlayer(ctx.playerX, isDying);
  }

  // ─── Private draw methods ───────────────────────────────────────────────────

  private drawStarfield(): void {
    const g = this.add.graphics();
    // Deterministic pseudo-random star pattern
    let seed = 42;
    const rand = (): number => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };
    g.fillStyle(C.star, 1);
    for (let i = 0; i < 80; i++) {
      const x = Math.floor(rand() * CANVAS_W);
      const y = Math.floor(rand() * CANVAS_H);
      const brightness = rand();
      g.fillStyle(C.star, 0.15 + brightness * 0.55);
      g.fillRect(x, y, brightness > 0.8 ? 2 : 1, brightness > 0.8 ? 2 : 1);
    }
  }

  private drawInvaders(ctx: SpaceInvadersContext, flash: boolean): void {
    const g = this.invaderGraphics;
    const frame = ctx.animFrame;

    for (const inv of ctx.invaders) {
      if (!inv.alive) continue;

      const ix = ctx.formationX + inv.col * COL_GAP;
      const iy = ctx.formationY + inv.row * ROW_GAP;

      // Select bitmap and colour by row
      let bitmap: [number[][], number[][]] = CRAB;
      let color: number = C.invaderCrab;
      if (inv.row === 0) {
        bitmap = SQUID;
        color = C.invaderSquid;
      } else if (inv.row >= 3) {
        bitmap = OCTOPUS;
        color = C.invaderOctopus;
      }

      g.fillStyle(flash ? 0xffffff : color);
      const grid = bitmap[frame];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (grid[r]![c] === 1) {
            g.fillRect(ix + c * PX_W, iy + r * PX_H, PX_W, PX_H);
          }
        }
      }
    }
  }

  private drawPlayer(px: number, isDying: boolean): void {
    const g = this.playerGraphics;
    const color = isDying ? C.playerDead : C.playerShip;
    const x = Math.round(px - PLAYER_W / 2);
    const y = PLAYER_Y - PLAYER_H / 2;

    if (isDying) {
      // Explosion: cross pattern
      g.fillStyle(color, 0.9);
      g.fillRect(x + PLAYER_W / 2 - 2, y - 6, 4, PLAYER_H + 12);
      g.fillRect(x - 6, y + PLAYER_H / 2 - 2, PLAYER_W + 12, 4);
      return;
    }

    // Ship body (base)
    g.fillStyle(color);
    g.fillRect(x, y + 8, PLAYER_W, 8);

    // Mid section
    g.fillRect(x + 6, y + 4, PLAYER_W - 12, 4);

    // Cannon tip
    g.fillRect(x + PLAYER_W / 2 - 2, y, 4, 4);
  }

  private drawUFO(ux: number): void {
    const g = this.ufoGraphics;
    const y = UFO_Y;
    g.fillStyle(C.ufo);

    // Dome
    g.fillRect(ux - 6, y - 8, 12, 6);
    // Hull
    g.fillRect(ux - 14, y - 2, 28, 8);
    // Windows
    g.fillStyle(0xffaaaa);
    g.fillRect(ux - 8, y, 4, 4);
    g.fillRect(ux - 1, y, 4, 4);
    g.fillRect(ux + 6, y, 4, 4);
  }

  private drawBullets(playerBullets: SpaceInvadersContext["playerBullets"], invaderBullets: SpaceInvadersContext["invaderBullets"]): void {
    const g = this.bulletGraphics;

    g.fillStyle(C.playerBullet);
    for (const bullet of playerBullets) {
      g.fillRect(bullet.x - 1, bullet.y - 4, 2, 8);
    }

    g.fillStyle(C.enemyBullet);
    for (const b of invaderBullets) {
      // Zigzag pattern: alternate left/right segments for enemy bullets
      const zigOffset = Math.floor(b.y / 4) % 2 === 0 ? -1 : 1;
      g.fillRect(b.x + zigOffset - 1, b.y - 4, 2, 4);
      g.fillRect(b.x - zigOffset - 1, b.y, 2, 4);
    }
  }

  private drawShields(shields: SpaceInvadersContext["shields"]): void {
    const g = this.shieldGraphics;

    for (const shield of shields) {
      if (shield.health <= 0) continue;

      const ratio = shield.health / SHIELD_MAX_HEALTH;
      const color = ratio > 0.6 ? C.shieldFull : ratio > 0.3 ? C.shieldMid : C.shieldLow;

      g.fillStyle(color, Math.max(0.25, ratio));

      // Classic bunker shape: full top, notch cut from bottom-center
      const sx = shield.x;
      const sy = SHIELD_TOP_Y;

      // Top arc / full portion (top 60% of height)
      const fullH = Math.round(SHIELD_H * 0.6);
      g.fillRect(sx, sy, SHIELD_W, fullH);

      // Bottom portion with centre notch (remaining 40%)
      const btmH = SHIELD_H - fullH;
      const notchW = Math.round(SHIELD_W * 0.36);
      const notchX = sx + Math.round((SHIELD_W - notchW) / 2);

      // Left leg
      g.fillRect(sx, sy + fullH, notchX - sx, btmH);
      // Right leg
      g.fillRect(notchX + notchW, sy + fullH, sx + SHIELD_W - notchX - notchW, btmH);

      // Damage: draw darker horizontal bands based on how damaged
      if (ratio < 0.9) {
        g.fillStyle(0x000000, (1 - ratio) * 0.6);
        const damageH = Math.round((1 - ratio) * SHIELD_H * 0.7);
        g.fillRect(sx + 4, sy + SHIELD_H - damageH, SHIELD_W - 8, damageH);
      }
    }
  }
}

// ─── Dimension sanity exports (used in React component) ──────────────────────
export const INVADERS_PER_ROW = COLS;
export const INVADER_ROWS = ROWS;
export const MAX_BULLETS = MAX_INVADER_BULLETS;
