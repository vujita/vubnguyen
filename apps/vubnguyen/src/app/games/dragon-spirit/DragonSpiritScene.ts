// Only ever imported via dynamic import() inside useEffect — never runs on server.
import Phaser from "phaser";

import {
  CANVAS_H,
  CANVAS_W,
  GROUND_Y,
  STAGES,
  type Bomb,
  type Bullet,
  type DragonSpiritContext,
  type Enemy,
  type EnemyType,
  type GroundTile,
  type Powerup,
} from "@vujita/vubnguyen/src/app/games/dragon-spirit/dragonSpiritMachine";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  airEnemy: 0xcc3333,
  bat: 0x993399,
  bird: 0xcc6622,
  blink: 0xffffff,
  bomb: 0xff4400,
  boss: 0xff2222,
  bossBullet: 0xff6600,
  bullet: 0xffcc44,
  bulletCore: 0xffffff,
  diamond: 0x44ddff,
  dragonBody: 0xc9893a,
  dragonHead: 0xf5c14a,
  dragonWing: 0x8b5e20,
  gargoyle: 0x888888,
  gold: 0xffd700,
  groundEnemy: 0x228833,
  groundLine: 0x1a3a1a,
  groundWyrm: 0x116622,
  hudBg: 0x000000,
  orb: 0x44aaff,
  orbRed: 0xff4444,
  skyDrake: 0x8833aa,
  star: 0xffffff,
} as const;

// ─── Scene ────────────────────────────────────────────────────────────────────

export class DragonSpiritScene extends Phaser.Scene {
  private bgGraphics: Phaser.GameObjects.Graphics | undefined;
  private entityGraphics: Phaser.GameObjects.Graphics | undefined;
  private fxGraphics: Phaser.GameObjects.Graphics | undefined;
  private stars: Array<{ x: number; y: number; b: number }> = [];
  private pendingSnapshot: { ctx: DragonSpiritContext; stateName: string } | null = null;

  constructor() {
    super({ key: "DragonSpiritScene" });
  }

  create(): void {
    this.bgGraphics = this.add.graphics();
    this.entityGraphics = this.add.graphics();
    this.fxGraphics = this.add.graphics();

    // Generate star field
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        b: 0.3 + Math.random() * 0.7,
        x: Math.random() * CANVAS_W,
        y: Math.random() * GROUND_Y,
      });
    }

    // Flush any snapshot that arrived before graphics were ready
    if (this.pendingSnapshot) {
      const { ctx, stateName } = this.pendingSnapshot;
      this.pendingSnapshot = null;
      this.updateFromSnapshot(ctx, stateName);
    }
  }

  updateFromSnapshot(ctx: DragonSpiritContext, stateName: string): void {
    if (!this.bgGraphics || !this.entityGraphics || !this.fxGraphics) {
      this.pendingSnapshot = { ctx, stateName };
      return;
    }

    const stageDef = STAGES[ctx.stage - 1]!;

    this.bgGraphics.clear();
    this.entityGraphics.clear();
    this.fxGraphics.clear();

    // ── Background ─────────────────────────────────────────────────────────
    this.bgGraphics.fillStyle(stageDef.bgColor);
    this.bgGraphics.fillRect(0, 0, CANVAS_W, GROUND_Y);

    // Stars
    for (const s of this.stars) {
      this.bgGraphics.fillStyle(C.star, s.b);
      this.bgGraphics.fillRect(s.x, s.y, 1, 1);
    }

    // Ground band
    this.bgGraphics.fillStyle(stageDef.groundColor);
    this.bgGraphics.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

    // Ground horizon line
    this.bgGraphics.lineStyle(1, C.groundLine, 0.6);
    this.bgGraphics.lineBetween(0, GROUND_Y, CANVAS_W, GROUND_Y);

    // Ground decoration tiles
    this.drawGroundTiles(ctx.groundTiles, stageDef.groundColor);

    if (stateName === "idle" || stateName === "stageClear" || stateName === "gameOver" || stateName === "victory") {
      return;
    }

    // ── Boss HP bar ────────────────────────────────────────────────────────
    if (ctx.bossActive && ctx.maxBossHP > 0) {
      this.drawBossHPBar(ctx.bossHP, ctx.maxBossHP);
    }

    // ── Powerups ───────────────────────────────────────────────────────────
    for (const p of ctx.powerups) {
      this.drawPowerup(p);
    }

    // ── Enemies ────────────────────────────────────────────────────────────
    for (const e of ctx.enemies) {
      this.drawEnemy(e);
    }

    // ── Bullets (fireballs) ────────────────────────────────────────────────
    for (const b of ctx.bullets) {
      this.drawBullet(b);
    }

    // ── Bombs ─────────────────────────────────────────────────────────────
    for (const bm of ctx.bombs) {
      this.drawBomb(bm);
    }

    // ── Boss bullets ───────────────────────────────────────────────────────
    for (const b of ctx.bossBullets) {
      this.drawBossBullet(b);
    }

    // ── Dragon ────────────────────────────────────────────────────────────
    const blinking = ctx.invincibleTicks > 0 && Math.floor(ctx.invincibleTicks / 5) % 2 === 0;
    if (!blinking) {
      this.drawDragon(ctx.dragonX, ctx.dragonY, ctx.heads);
    }
  }

  // ─── Draw helpers ─────────────────────────────────────────────────────────

  private drawGroundTiles(tiles: GroundTile[], _baseColor: number): void {
    for (const t of tiles) {
      // Small decorative rock/shrub shapes
      this.entityGraphics.fillStyle(0x2a4a2a, 0.7);
      if (t.type === 0) {
        this.entityGraphics.fillRect(t.x - 6, t.y - 3, 12, 6);
      } else if (t.type === 1) {
        this.entityGraphics.fillCircle(t.x, t.y, 4);
      } else if (t.type === 2) {
        this.entityGraphics.fillTriangle(t.x, t.y - 6, t.x - 5, t.y + 3, t.x + 5, t.y + 3);
      } else {
        this.entityGraphics.fillRect(t.x - 3, t.y - 5, 6, 10);
      }
    }
  }

  private drawDragon(x: number, y: number, heads: number): void {
    const g = this.entityGraphics;

    // Wing (large triangle behind body)
    g.fillStyle(C.dragonWing);
    g.fillTriangle(x, y - 8, x - 24, y + 14, x + 24, y + 14);

    // Body
    g.fillStyle(C.dragonBody);
    g.fillEllipse(x, y + 2, 22, 18);

    // Head(s)
    if (heads === 1) {
      g.fillStyle(C.dragonHead);
      g.fillTriangle(x, y - 18, x - 8, y - 4, x + 8, y - 4);
    } else if (heads === 2) {
      g.fillStyle(C.dragonHead);
      g.fillTriangle(x - 10, y - 16, x - 18, y - 4, x - 2, y - 4);
      g.fillTriangle(x + 10, y - 16, x + 2, y - 4, x + 18, y - 4);
    } else {
      // 3 heads
      g.fillStyle(C.dragonHead);
      g.fillTriangle(x, y - 20, x - 8, y - 6, x + 8, y - 6);
      g.fillTriangle(x - 14, y - 14, x - 22, y - 3, x - 6, y - 3);
      g.fillTriangle(x + 14, y - 14, x + 6, y - 3, x + 22, y - 3);
    }

    // Eyes (small dots on each head triangle tip)
    g.fillStyle(0xffffff);
    if (heads === 1) {
      g.fillRect(x - 3, y - 17, 3, 3);
      g.fillRect(x + 1, y - 17, 3, 3);
    } else if (heads === 2) {
      g.fillRect(x - 13, y - 15, 2, 2);
      g.fillRect(x + 9, y - 15, 2, 2);
    } else {
      g.fillRect(x - 2, y - 19, 2, 2);
      g.fillRect(x + 1, y - 19, 2, 2);
    }

    // Tail
    g.fillStyle(C.dragonBody);
    g.fillTriangle(x - 8, y + 10, x + 8, y + 10, x, y + 22);
  }

  private drawBullet(b: Bullet): void {
    const g = this.entityGraphics;
    g.fillStyle(C.bullet, 0.85);
    g.fillCircle(b.x, b.y, 5);
    g.fillStyle(C.bulletCore);
    g.fillCircle(b.x, b.y, 2);
  }

  private drawBomb(bm: Bomb): void {
    const g = this.entityGraphics;
    const alpha = Math.max(0, 1 - bm.radius / 38);
    g.fillStyle(C.bomb, alpha * 0.6);
    g.fillCircle(bm.x, bm.y, bm.radius);
    g.lineStyle(2, C.bomb, alpha);
    g.strokeCircle(bm.x, bm.y, bm.radius);
  }

  private drawBossBullet(b: Bullet): void {
    const g = this.entityGraphics;
    g.fillStyle(C.bossBullet, 0.9);
    g.fillCircle(b.x, b.y, 6);
    g.fillStyle(0xffaa22);
    g.fillCircle(b.x, b.y, 3);
  }

  private drawEnemy(e: Enemy): void {
    const g = this.entityGraphics;
    switch (e.type) {
      case "bat":
        this.drawBat(g, e.x, e.y);
        break;
      case "bird":
        this.drawBird(g, e.x, e.y);
        break;
      case "gargoyle":
        this.drawGargoyle(g, e.x, e.y);
        break;
      case "skyDrake":
        this.drawSkyDrake(g, e.x, e.y);
        break;
      case "toad":
        this.drawToad(g, e.x, e.y);
        break;
      case "scorpion":
        this.drawScorpion(g, e.x, e.y);
        break;
      case "beetle":
        this.drawBeetle(g, e.x, e.y);
        break;
      case "groundWyrm":
        this.drawGroundWyrm(g, e.x, e.y);
        break;
      case "boss":
        this.drawBoss(g, e.x, e.y, e.hp);
        break;
    }

    // HP pips for multi-hp enemies (skip boss — has separate bar)
    if (e.type !== "boss" && e.hp > 1) {
      for (let i = 0; i < e.hp; i++) {
        g.fillStyle(0xffffff, 0.7);
        g.fillRect(e.x - e.hp * 3 + i * 6, e.y - 22, 4, 4);
      }
    }
  }

  private drawBat(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(C.bat);
    // wings
    g.fillTriangle(x, y, x - 18, y - 8, x - 4, y + 8);
    g.fillTriangle(x, y, x + 18, y - 8, x + 4, y + 8);
    // body
    g.fillEllipse(x, y, 10, 12);
  }

  private drawBird(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(C.bird);
    g.fillTriangle(x, y - 10, x - 14, y + 8, x + 14, y + 8);
    g.fillStyle(0xffaa44);
    g.fillTriangle(x, y + 12, x - 4, y + 6, x + 4, y + 6); // beak
  }

  private drawGargoyle(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(C.gargoyle);
    // body
    g.fillRect(x - 10, y - 12, 20, 24);
    // wings
    g.fillTriangle(x - 10, y - 8, x - 26, y + 10, x - 10, y + 10);
    g.fillTriangle(x + 10, y - 8, x + 26, y + 10, x + 10, y + 10);
    // eyes
    g.fillStyle(0xff2222);
    g.fillRect(x - 6, y - 6, 4, 4);
    g.fillRect(x + 2, y - 6, 4, 4);
  }

  private drawSkyDrake(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(C.skyDrake);
    // body
    g.fillEllipse(x, y, 26, 18);
    // head
    g.fillTriangle(x + 6, y - 12, x, y - 4, x + 18, y - 2);
    // wings
    g.fillTriangle(x - 6, y, x - 28, y - 14, x - 8, y + 10);
    g.fillTriangle(x + 6, y, x + 28, y - 14, x + 8, y + 10);
  }

  private drawToad(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(C.groundEnemy);
    g.fillEllipse(x, y, 24, 16);
    // eyes
    g.fillStyle(0xffffff);
    g.fillCircle(x - 5, y - 6, 4);
    g.fillCircle(x + 5, y - 6, 4);
    g.fillStyle(0x000000);
    g.fillCircle(x - 5, y - 6, 2);
    g.fillCircle(x + 5, y - 6, 2);
  }

  private drawScorpion(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(0x887722);
    // body
    g.fillRect(x - 8, y - 6, 16, 12);
    // claws
    g.fillRect(x - 18, y - 8, 10, 6);
    g.fillRect(x + 8, y - 8, 10, 6);
    // tail curve (simplified)
    g.fillRect(x - 3, y - 16, 6, 12);
    g.fillTriangle(x + 3, y - 16, x + 9, y - 22, x - 3, y - 18);
  }

  private drawBeetle(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(0x225522);
    // shell
    g.fillEllipse(x, y, 28, 20);
    // carapace line
    g.lineStyle(1, 0x113311, 0.8);
    g.lineBetween(x, y - 10, x, y + 10);
    // antennae
    g.lineStyle(1, 0x446644, 0.9);
    g.lineBetween(x - 6, y - 10, x - 14, y - 20);
    g.lineBetween(x + 6, y - 10, x + 14, y - 20);
  }

  private drawGroundWyrm(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.fillStyle(C.groundWyrm);
    // segments
    for (let i = 0; i < 3; i++) {
      g.fillEllipse(x + i * 14 - 14, y, 16, 14);
    }
    // head
    g.fillStyle(0x338844);
    g.fillCircle(x + 18, y, 10);
    g.fillStyle(0xffffff);
    g.fillCircle(x + 21, y - 3, 3);
    g.fillStyle(0x000000);
    g.fillCircle(x + 21, y - 3, 1);
  }

  private drawBoss(g: Phaser.GameObjects.Graphics, x: number, y: number, hp: number): void {
    // Glow aura
    g.fillStyle(C.boss, 0.15);
    g.fillCircle(x, y, 55);

    // Main body
    g.fillStyle(C.boss);
    g.fillEllipse(x, y, 70, 50);

    // Wings
    g.fillStyle(0x881111);
    g.fillTriangle(x - 20, y, x - 60, y - 30, x - 20, y + 25);
    g.fillTriangle(x + 20, y, x + 60, y - 30, x + 20, y + 25);

    // Head
    g.fillStyle(0xff5555);
    g.fillTriangle(x, y - 30, x - 18, y - 10, x + 18, y - 10);

    // Eyes
    g.fillStyle(0xffff00);
    g.fillCircle(x - 8, y - 14, 6);
    g.fillCircle(x + 8, y - 14, 6);
    g.fillStyle(0x000000);
    g.fillCircle(x - 8, y - 14, 3);
    g.fillCircle(x + 8, y - 14, 3);

    // HP hint (dim glow changes with health — already handled by bar)
    void hp;
  }

  private drawPowerup(p: Powerup): void {
    const g = this.entityGraphics;
    switch (p.type) {
      case "blueOrb":
        g.fillStyle(C.orb, 0.9);
        g.fillCircle(p.x, p.y, 8);
        g.fillStyle(0x88ccff);
        g.fillCircle(p.x - 2, p.y - 2, 3);
        break;
      case "redOrb":
        g.fillStyle(C.orbRed, 0.9);
        g.fillCircle(p.x, p.y, 8);
        g.fillStyle(0xff9999);
        g.fillCircle(p.x - 2, p.y - 2, 3);
        break;
      case "diamond":
        g.fillStyle(C.diamond, 0.9);
        g.fillTriangle(p.x, p.y - 9, p.x - 7, p.y, p.x + 7, p.y);
        g.fillTriangle(p.x - 7, p.y, p.x + 7, p.y, p.x, p.y + 9);
        break;
      case "gold":
        g.fillStyle(C.gold, 0.9);
        g.fillRect(p.x - 7, p.y - 6, 14, 12);
        g.lineStyle(1, 0xaa8800, 0.8);
        g.strokeRect(p.x - 7, p.y - 6, 14, 12);
        break;
    }
  }

  private drawBossHPBar(hp: number, maxHP: number): void {
    const g = this.fxGraphics;
    const barW = CANVAS_W - 40;
    const barH = 8;
    const barX = 20;
    const barY = CANVAS_H - 24;
    const fillW = Math.round(barW * Math.max(0, hp / maxHP));

    g.fillStyle(0x220000, 0.8);
    g.fillRect(barX, barY, barW, barH);
    g.fillStyle(0xff2222);
    g.fillRect(barX, barY, fillW, barH);
    g.lineStyle(1, 0x440000);
    g.strokeRect(barX, barY, barW, barH);
  }

}
