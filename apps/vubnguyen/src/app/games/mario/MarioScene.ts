// Only ever imported via dynamic import() inside a useEffect —
// the static Phaser import is never evaluated on the server.
import Phaser from "phaser";

import { type GameContext } from "@vujita/vubnguyen/src/app/games/mario/gameMachine";
import { type LevelContext } from "@vujita/vubnguyen/src/app/games/mario/levelMachine";
import { type PlayerContext, type MotionState } from "@vujita/vubnguyen/src/app/games/mario/playerMachine";
import { type EnemyContext } from "@vujita/vubnguyen/src/app/games/mario/enemyMachine";

// ─── Callbacks passed in from React ─────────────────────────────────────────

export interface MarioCallbacks {
  onJump: () => void;
  onFall: () => void;
  onLand: () => void;
  onRun: () => void;
  onStop: () => void;
  onCrouch: () => void;
  onUncrouch: () => void;
  onGetHit: () => void;
  onDie: () => void;
  onCoinCollected: () => void;
  onMushroomCollected: () => void;
  onFireFlowerCollected: () => void;
  onEnemyStomp: (id: string) => void;
  onEnemyHit: (id: string) => void;
  onFlagReached: () => void;
  onScoreAdd: (amount: number) => void;
}

// ─── Colour palette ──────────────────────────────────────────────────────────

const C = {
  sky: 0x5c94fc,
  cloud: 0xffffff,
  ground: 0xc84c0c,
  groundTop: 0x8b4513,
  brick: 0xd07030,
  brickLine: 0xa05020,
  qBlock: 0xe8a020,
  qBlockQuestion: 0xffffff,
  qBlockEmpty: 0xb09060,
  pipe: 0x208020,
  pipeDark: 0x106010,
  coinYellow: 0xffe040,
  coinRing: 0xe8a020,
  mushroom: 0xd83020,
  mushroomSpot: 0xffffff,
  mushroomStem: 0xf8d870,
  fireFlower: 0xff8800,
  fireFlowerCenter: 0xffff00,
  marioRed: 0xd83020,
  marioSkin: 0xf8c898,
  marioBlue: 0x2060e8,
  marioBrown: 0x904830,
  goomba: 0xa05828,
  goombaDark: 0x703818,
  goombaFeet: 0x181010,
  goombaEye: 0x181010,
  koopa: 0x309030,
  koopaShell: 0x207020,
  koopaHead: 0xf8c898,
  flagPole: 0x888888,
  flag: 0x30c030,
  star: 0xffd700,
  hud: 0xffffff,
} as const;

// ─── Level geometry constants ────────────────────────────────────────────────

export const LEVEL_W = 3200;
const GROUND_Y = 400; // top of ground surface
const TILE = 32;

// Floating platform definitions [x, y, tilesWide]
const PLATFORMS: [number, number, number][] = [
  [192, 304, 3],
  [480, 256, 2],
  [800, 272, 4],
  [1120, 240, 2],
  [1440, 288, 3],
  [1664, 240, 3],
  [1920, 208, 2],
  [2112, 272, 4],
  [2432, 288, 3],
  [2720, 256, 3],
];

// Question block positions [x, y, contents]
type QContents = "coin" | "mushroom" | "fire_flower";
const Q_BLOCKS: [number, number, QContents][] = [
  [288, 240, "coin"],
  [544, 192, "mushroom"],
  [864, 224, "coin"],
  [1152, 176, "fire_flower"],
  [1664, 224, "coin"],
  [2176, 208, "coin"],
  [2752, 192, "mushroom"],
];

// Coin row positions: [startX, y, count]
const COIN_ROWS: [number, number, number][] = [
  [320, 208, 3],
  [832, 208, 4],
  [1472, 256, 3],
  [2144, 224, 4],
  [2464, 256, 3],
];

// Pipe positions [x]
const PIPES: number[] = [640, 1280, 1984, 2656];

// Ground has a gap for a pit
const PIT_START = 1248;
const PIT_END = 1408;

const FLAGPOLE_X = 3040;

// ─── Snapshot types ──────────────────────────────────────────────────────────

export interface MarioSnapshot {
  gameCtx: GameContext;
  gameState: string;
  levelCtx: LevelContext | null;
  playerCtx: PlayerContext | null;
  playerMotion: MotionState | null;
  enemyStates: Record<string, { ctx: EnemyContext; state: string }>;
}

// ─── Scene ───────────────────────────────────────────────────────────────────

export class MarioScene extends Phaser.Scene {
  // ── injected from React ───────────────────────────────────────────────────
  private cb!: MarioCallbacks;

  // ── player ────────────────────────────────────────────────────────────────
  private mario!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private wasGrounded = true;
  private wasMoving = false;
  private invincibleTimer = 0; // frames remaining
  private isDead = false;
  private deathAnimTimer = 0;

  // ── world ─────────────────────────────────────────────────────────────────
  private groundGroup!: Phaser.Physics.Arcade.StaticGroup;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private qBlockGroup!: Phaser.Physics.Arcade.StaticGroup;
  private pipeGroup!: Phaser.Physics.Arcade.StaticGroup;
  private coinGroup!: Phaser.Physics.Arcade.StaticGroup;
  private powerUpGroup!: Phaser.Physics.Arcade.StaticGroup;
  private flagpole!: Phaser.GameObjects.Rectangle;
  private flagReached = false;

  // ── enemies ───────────────────────────────────────────────────────────────
  private enemies: Record<
    string,
    {
      sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      id: string;
      type: "goomba" | "koopa";
      dead: boolean;
      stunned: boolean;
    }
  > = {};

  // ── input ─────────────────────────────────────────────────────────────────
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  // ── mobile input ──────────────────────────────────────────────────────────
  private mobileLeft = false;
  private mobileRight = false;
  private mobileJumpQueued = false;

  // ── state mirror ──────────────────────────────────────────────────────────
  private currentPower: "small" | "big" | "fire" = "small";
  private paused = false;

  constructor() {
    super({ key: "MarioScene" });
  }

  // ─── Texture creation (procedural pixel art) ─────────────────────────────

  private createTextures() {
    const g = this.make.graphics({ add: false });

    // Ground tile 32×32
    g.clear();
    g.fillStyle(C.ground);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(C.groundTop);
    g.fillRect(0, 0, 32, 4);
    g.generateTexture("tile_ground", 32, 32);

    // Brick tile 32×32
    g.clear();
    g.fillStyle(C.brick);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(C.brickLine);
    g.fillRect(0, 14, 32, 4);
    g.fillRect(0, 0, 2, 14);
    g.fillRect(16, 14, 2, 18);
    g.generateTexture("tile_brick", 32, 32);

    // Question block active 32×32
    g.clear();
    g.fillStyle(C.qBlock);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0x000000, 0.3);
    g.fillRect(0, 0, 32, 3);
    g.fillRect(0, 0, 3, 32);
    g.fillStyle(C.qBlockQuestion);
    g.fillRect(12, 6, 8, 6);  // top of ?
    g.fillRect(14, 12, 4, 4); // middle dot
    g.fillRect(14, 18, 4, 4); // bottom dot
    g.generateTexture("tile_qblock", 32, 32);

    // Question block empty 32×32
    g.clear();
    g.fillStyle(C.qBlockEmpty);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture("tile_qblock_empty", 32, 32);

    // Pipe segment 64×32 (2 tiles wide, 1 tile tall)
    g.clear();
    g.fillStyle(C.pipe);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(C.pipeDark);
    g.fillRect(0, 0, 6, 32);
    g.fillRect(58, 0, 6, 32);
    g.fillRect(0, 0, 64, 6);
    g.generateTexture("pipe_body", 64, 32);

    // Pipe cap 64×32
    g.clear();
    g.fillStyle(C.pipe);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(C.pipeDark);
    g.fillRect(0, 0, 64, 6);
    g.fillRect(0, 0, 4, 32);
    g.fillRect(60, 0, 4, 32);
    g.generateTexture("pipe_cap", 64, 32);

    // Coin 16×16
    g.clear();
    g.fillStyle(C.coinYellow);
    g.fillCircle(8, 8, 7);
    g.fillStyle(C.coinRing);
    g.fillCircle(8, 8, 4);
    g.fillStyle(C.coinYellow);
    g.fillCircle(8, 8, 2);
    g.generateTexture("coin", 16, 16);

    // Mushroom 24×24
    g.clear();
    g.fillStyle(C.mushroomStem);
    g.fillRect(7, 14, 10, 10);
    g.fillStyle(C.mushroom);
    g.fillCircle(12, 11, 11);
    g.fillStyle(C.mushroomSpot);
    g.fillCircle(7, 9, 3);
    g.fillCircle(17, 7, 3);
    g.generateTexture("mushroom", 24, 24);

    // Fire flower 24×24
    g.clear();
    g.fillStyle(C.mushroomStem);
    g.fillRect(11, 14, 3, 10);
    g.fillStyle(C.fireFlower);
    for (let a = 0; a < 5; a++) {
      const angle = (a / 5) * Math.PI * 2;
      g.fillCircle(12 + Math.cos(angle) * 6, 11 + Math.sin(angle) * 6, 4);
    }
    g.fillStyle(C.fireFlowerCenter);
    g.fillCircle(12, 11, 4);
    g.generateTexture("fire_flower", 24, 24);

    // Mario small (16×16) — simple pixel art body
    this.createMarioTexture(g, "mario_small", false);
    // Mario big (16×28)
    this.createMarioTexture(g, "mario_big", true);

    // Goomba (24×24)
    g.clear();
    g.fillStyle(C.goomba);
    g.fillEllipse(12, 12, 22, 20);
    g.fillStyle(C.goombaDark);
    g.fillRect(2, 14, 8, 8);   // left foot
    g.fillRect(14, 14, 8, 8);  // right foot
    g.fillStyle(C.goombaEye);
    g.fillRect(5, 8, 4, 4);   // left eye
    g.fillRect(15, 8, 4, 4);  // right eye
    g.fillStyle(0xffffff);
    g.fillRect(6, 9, 2, 2);   // eye glint
    g.fillRect(16, 9, 2, 2);
    g.generateTexture("goomba", 24, 24);

    // Goomba squished (24×12)
    g.clear();
    g.fillStyle(C.goomba);
    g.fillEllipse(12, 6, 22, 12);
    g.fillStyle(C.goombaEye);
    g.fillRect(5, 3, 5, 5);
    g.fillRect(14, 3, 5, 5);
    g.generateTexture("goomba_flat", 24, 12);

    // Koopa (24×32)
    g.clear();
    g.fillStyle(C.koopa);
    g.fillRect(4, 0, 16, 32);
    g.fillStyle(C.koopaShell);
    g.fillEllipse(12, 16, 20, 24);
    g.fillStyle(C.koopaHead);
    g.fillCircle(12, 4, 8);
    g.fillStyle(0x000000);
    g.fillRect(8, 2, 3, 3);  // left eye
    g.fillRect(15, 2, 3, 3); // right eye
    g.generateTexture("koopa", 24, 32);

    // Koopa shell (24×20)
    g.clear();
    g.fillStyle(C.koopaShell);
    g.fillEllipse(12, 10, 22, 20);
    g.fillStyle(C.koopa);
    g.fillRect(10, 4, 4, 12);
    g.fillRect(4, 9, 16, 4);
    g.generateTexture("koopa_shell", 24, 20);

    // Flagpole top flag 24×20
    g.clear();
    g.fillStyle(C.flag);
    g.fillTriangle(0, 0, 24, 10, 0, 20);
    g.generateTexture("flag", 24, 20);

    g.destroy();
  }

  private createMarioTexture(g: Phaser.GameObjects.Graphics, key: string, big: boolean) {
    const h = big ? 28 : 16;
    g.clear();
    // Hat
    g.fillStyle(C.marioRed);
    g.fillRect(3, 0, 10, 3);
    g.fillRect(0, 3, 16, 5);
    // Face
    g.fillStyle(C.marioSkin);
    g.fillRect(3, 4, 10, 4);
    g.fillRect(5, 6, 2, 2);
    g.fillRect(9, 6, 2, 2);
    // Overalls
    g.fillStyle(C.marioBlue);
    g.fillRect(2, 8, 12, big ? 12 : 5);
    // Shirt
    g.fillStyle(C.marioRed);
    g.fillRect(0, 10, 2, big ? 8 : 3);
    g.fillRect(14, 10, 2, big ? 8 : 3);
    // Shoes
    g.fillStyle(C.marioBrown);
    g.fillRect(0, h - 5, 6, 5);
    g.fillRect(10, h - 5, 6, 5);
    g.generateTexture(key, 16, h);
  }

  // ─── Phaser lifecycle ────────────────────────────────────────────────────

  init(data: { cb: MarioCallbacks }) {
    this.cb = data.cb;
  }

  create() {
    this.createTextures();
    this.physics.world.setBounds(0, 0, LEVEL_W, this.scale.height + 200);

    // Sky background
    this.add.rectangle(LEVEL_W / 2, this.scale.height / 2, LEVEL_W, this.scale.height, C.sky);
    this.addClouds();

    // Build level geometry
    this.groundGroup = this.physics.add.staticGroup();
    this.platformGroup = this.physics.add.staticGroup();
    this.qBlockGroup = this.physics.add.staticGroup();
    this.pipeGroup = this.physics.add.staticGroup();
    this.coinGroup = this.physics.add.staticGroup();
    this.powerUpGroup = this.physics.add.staticGroup();

    this.buildGround();
    this.buildPlatforms();
    this.buildQBlocks();
    this.buildPipes();
    this.buildCoins();
    this.buildFlagpole();

    // Player
    this.mario = this.physics.add.sprite(80, GROUND_Y - 20, "mario_small");
    this.mario.setCollideWorldBounds(true);
    this.mario.setGravityY(600);
    this.mario.setDepth(10);
    this.mario.setScale(2);

    // Camera
    this.cameras.main.setBounds(0, 0, LEVEL_W, this.scale.height);
    this.cameras.main.startFollow(this.mario, true, 0.1, 0.1);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: this.input.keyboard!.addKey("W"),
      A: this.input.keyboard!.addKey("A"),
      S: this.input.keyboard!.addKey("S"),
      D: this.input.keyboard!.addKey("D"),
    };

    // Colliders set up in activate() after enemies are created
    this.physics.add.collider(this.mario, this.groundGroup);
    this.physics.add.collider(this.mario, this.platformGroup);
    this.physics.add.collider(this.mario, this.pipeGroup);

    // Mario bumps Q-block from below
    this.physics.add.collider(this.mario, this.qBlockGroup, (mario, block) => {
      this.handleQBlockBump(block as Phaser.Physics.Arcade.Sprite);
    });

    // Coins
    this.physics.add.overlap(this.mario, this.coinGroup, (_m, coin) => {
      this.collectCoin(coin as Phaser.Physics.Arcade.Sprite);
    });

    // Power-ups
    this.physics.add.overlap(this.mario, this.powerUpGroup, (_m, pu) => {
      this.collectPowerUp(pu as Phaser.Physics.Arcade.Sprite);
    });

    // Flagpole (wired here because this.mario must exist first)
    this.physics.add.overlap(this.mario, this.flagpole, () => {
      if (!this.flagReached && !this.isDead) {
        this.flagReached = true;
        this.cb.onFlagReached();
      }
    });
  }

  // ─── Level building helpers ───────────────────────────────────────────────

  private addClouds() {
    const positions = [160, 480, 880, 1280, 1680, 2080, 2480, 2880];
    for (const x of positions) {
      const y = 60 + Math.floor((x / 160) % 3) * 20;
      this.add.ellipse(x, y, 80, 30, C.cloud, 0.9);
      this.add.ellipse(x - 30, y + 10, 50, 24, C.cloud, 0.9);
      this.add.ellipse(x + 30, y + 10, 50, 24, C.cloud, 0.9);
    }
  }

  private buildGround() {
    const segments: [number, number][] = [
      [0, PIT_START],
      [PIT_END, LEVEL_W],
    ];
    const rows = 3;
    for (const [xStart, xEnd] of segments) {
      for (let x = xStart; x < xEnd; x += TILE) {
        for (let r = 0; r < rows; r++) {
          const tile = this.groundGroup.create(
            x + TILE / 2,
            GROUND_Y + r * TILE + TILE / 2,
            r === 0 ? "tile_brick" : "tile_ground",
          ) as Phaser.Physics.Arcade.Sprite;
          tile.refreshBody();
        }
      }
    }
  }

  private buildPlatforms() {
    for (const [px, py, w] of PLATFORMS) {
      for (let i = 0; i < w; i++) {
        const tile = this.platformGroup.create(
          px + i * TILE + TILE / 2,
          py + TILE / 2,
          "tile_brick",
        ) as Phaser.Physics.Arcade.Sprite;
        tile.refreshBody();
      }
    }
  }

  private qBlockStates: Map<Phaser.Physics.Arcade.Sprite, QContents | "empty"> = new Map();

  private buildQBlocks() {
    for (const [qx, qy, contents] of Q_BLOCKS) {
      const block = this.qBlockGroup.create(
        qx + TILE / 2,
        qy + TILE / 2,
        "tile_qblock",
      ) as Phaser.Physics.Arcade.Sprite;
      block.refreshBody();
      this.qBlockStates.set(block, contents);
    }
  }

  private buildPipes() {
    for (const px of PIPES) {
      // Two-tile-wide pipe, 3 tiles tall
      const cap = this.pipeGroup.create(px + 32, GROUND_Y - TILE / 2, "pipe_cap") as Phaser.Physics.Arcade.Sprite;
      cap.refreshBody();
      for (let row = 0; row < 2; row++) {
        const body = this.pipeGroup.create(px + 32, GROUND_Y + TILE / 2 + row * TILE, "pipe_body") as Phaser.Physics.Arcade.Sprite;
        body.refreshBody();
      }
    }
  }

  private buildCoins() {
    for (const [cx, cy, count] of COIN_ROWS) {
      for (let i = 0; i < count; i++) {
        const coin = this.coinGroup.create(cx + i * 28, cy, "coin") as Phaser.Physics.Arcade.Sprite;
        coin.refreshBody();
      }
    }
  }

  private buildFlagpole() {
    // Pole
    this.add.rectangle(FLAGPOLE_X, GROUND_Y - 96, 6, 192, C.flagPole).setDepth(5);
    // Ball on top
    this.add.circle(FLAGPOLE_X, GROUND_Y - 192, 8, C.star).setDepth(5);
    // Flag
    this.add.image(FLAGPOLE_X + 4, GROUND_Y - 175, "flag").setDepth(5).setOrigin(0, 0.5);
    // Invisible trigger zone — overlap is wired up in create() after mario exists
    this.flagpole = this.add.rectangle(FLAGPOLE_X, GROUND_Y - 96, 40, 200, 0x000000, 0);
    this.physics.add.existing(this.flagpole, true);
  }

  // ─── Enemy management ─────────────────────────────────────────────────────

  /** Called from React when a new level spawns, providing enemy configs. */
  spawnEnemies(configs: { id: string; type: "goomba" | "koopa"; x: number; y: number }[]) {
    // Remove any leftover from previous level
    for (const e of Object.values(this.enemies)) {
      e.sprite.destroy();
    }
    this.enemies = {};

    for (const cfg of configs) {
      const key = cfg.type === "koopa" ? "koopa" : "goomba";
      const sprite = this.physics.add.sprite(cfg.x, cfg.y, key) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      sprite.setGravityY(600);
      sprite.setCollideWorldBounds(false);
      sprite.setScale(1.5);
      sprite.setData("id", cfg.id);

      this.physics.add.collider(sprite, this.groundGroup);
      this.physics.add.collider(sprite, this.platformGroup);
      this.physics.add.collider(sprite, this.pipeGroup);

      this.enemies[cfg.id] = {
        sprite,
        id: cfg.id,
        type: cfg.type,
        dead: false,
        stunned: false,
      };
    }

    // Enemy ↔ Mario collision detection (set up once after enemies are created)
    this.setupEnemyMarioOverlap();
  }

  private setupEnemyMarioOverlap() {
    for (const e of Object.values(this.enemies)) {
      this.physics.add.overlap(this.mario, e.sprite, () => {
        if (e.dead || this.isDead) return;

        const marioBottom = this.mario.body.bottom;
        const enemyTop = e.sprite.body.top;
        const marioVelY = this.mario.body.velocity.y;

        if (marioVelY > 0 && marioBottom <= enemyTop + 12) {
          // Stomp from above
          this.mario.setVelocityY(-280);
          this.cb.onEnemyStomp(e.id);

          if (e.stunned) {
            // Already in shell — kill it
            this.killEnemy(e.id, true);
          } else if (e.type === "koopa") {
            e.stunned = true;
            e.sprite.setTexture("koopa_shell");
            e.sprite.setVelocityX(0);
          } else {
            this.killEnemy(e.id, false);
          }
          this.cb.onScoreAdd(e.type === "koopa" ? 200 : 100);
        } else if (!e.stunned) {
          // Side collision — Mario gets hit
          if (this.currentPower === "small") {
            // Small Mario dies: Phaser owns the animation so the death
            // sequence plays before XState processes PLAYER_DIED.
            // onDie() fires at the end of deathAnimTimer, which then
            // sends DIE → playerMachine → PLAYER_DIED → gameMachine.
            if (!this.isDead) this.triggerDeath();
          } else {
            // Bigger Mario: downgrade power and grant invincibility frames.
            this.cb.onGetHit();
            if (this.invincibleTimer <= 0) {
              this.invincibleTimer = 180;
            }
          }
        }
      });
    }
  }

  private killEnemy(id: string, wasShell: boolean) {
    const e = this.enemies[id];
    if (!e || e.dead) return;
    e.dead = true;

    if (wasShell || e.type === "goomba") {
      // Squish animation
      e.sprite.setTexture(e.type === "goomba" ? "goomba_flat" : "koopa_shell");
    }
    this.tweens.add({
      targets: e.sprite,
      alpha: 0,
      duration: 300,
      onComplete: () => e.sprite.destroy(),
    });
    this.cb.onEnemyHit(id);
  }

  // ─── Q-block interaction ──────────────────────────────────────────────────

  private handleQBlockBump(block: Phaser.Physics.Arcade.Sprite) {
    const state = this.qBlockStates.get(block);
    if (!state || state === "empty") return;

    // By the time the collider callback fires, Phaser has already zeroed
    // Mario's upward velocity, so we can't use velocity.y to detect direction.
    // Instead, use body.blocked.up (set this frame when head hit something
    // above) and verify positionally that it's *this* block being hit from
    // below (not Mario standing on top or grazing it from the side).
    if (!this.mario.body.blocked.up) return;
    if (Math.abs(this.mario.body.top - block.body.bottom) > 8) return;

    this.qBlockStates.set(block, "empty");
    block.setTexture("tile_qblock_empty");

    if (state === "coin") {
      this.showCoinPop(block.x, block.y);
      this.cb.onCoinCollected();
      this.cb.onScoreAdd(100);
    } else {
      this.spawnPowerUp(block.x, block.y - TILE, state);
    }

    // Bump animation
    this.tweens.add({
      targets: block,
      y: block.y - 8,
      duration: 80,
      yoyo: true,
    });
  }

  private showCoinPop(x: number, y: number) {
    const pop = this.add.image(x, y, "coin").setDepth(20).setScale(1.5);
    this.tweens.add({
      targets: pop,
      y: y - 48,
      alpha: 0,
      duration: 400,
      onComplete: () => pop.destroy(),
    });
  }

  private spawnPowerUp(x: number, y: number, type: "mushroom" | "fire_flower") {
    const pu = this.powerUpGroup.create(x, y, type === "mushroom" ? "mushroom" : "fire_flower") as Phaser.Physics.Arcade.Sprite;
    pu.setData("puType", type);
    pu.refreshBody();
    // Slide out of block
    this.tweens.add({ targets: pu, y: y - 32, duration: 300 });
  }

  private collectCoin(coin: Phaser.Physics.Arcade.Sprite) {
    this.showCoinPop(coin.x, coin.y);
    coin.destroy();
    this.cb.onCoinCollected();
    this.cb.onScoreAdd(100);
  }

  private collectPowerUp(pu: Phaser.Physics.Arcade.Sprite) {
    const type = pu.getData("puType") as "mushroom" | "fire_flower";
    pu.destroy();
    if (type === "mushroom") {
      this.cb.onMushroomCollected();
    } else {
      this.cb.onFireFlowerCollected();
    }
    this.cb.onScoreAdd(type === "mushroom" ? 1000 : 1000);
  }

  // ─── Enemy AI (patrol) ────────────────────────────────────────────────────

  private updateEnemyAI() {
    for (const e of Object.values(this.enemies)) {
      if (e.dead || e.stunned) continue;
      const body = e.sprite.body as Phaser.Physics.Arcade.Body;
      const speed = e.type === "koopa" ? 60 : 50;

      if (body.blocked.left) {
        e.sprite.setVelocityX(speed);
        e.sprite.setFlipX(false);
      } else if (body.blocked.right) {
        e.sprite.setVelocityX(-speed);
        e.sprite.setFlipX(true);
      } else if (body.velocity.x === 0) {
        e.sprite.setVelocityX(-speed);
        e.sprite.setFlipX(true);
      }
    }
  }

  // ─── Mobile input API (called from React touch handlers) ─────────────────

  setMobileLeft(pressed: boolean) { this.mobileLeft = pressed; }
  setMobileRight(pressed: boolean) { this.mobileRight = pressed; }
  queueMobileJump() { this.mobileJumpQueued = true; }

  // ─── Player input & physics ───────────────────────────────────────────────

  private handlePlayerInput() {
    if (this.isDead || this.flagReached || this.paused) return;

    const left = this.cursors.left.isDown || this.wasdKeys.A.isDown || this.mobileLeft;
    const right = this.cursors.right.isDown || this.wasdKeys.D.isDown || this.mobileRight;
    const jump =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasdKeys.W) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space!) ||
      this.mobileJumpQueued;
    const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;
    this.mobileJumpQueued = false; // consume the queued jump each frame

    const grounded = this.mario.body.blocked.down;
    const speed = 200;
    const jumpVelocity = this.currentPower === "small" ? -480 : -520;

    if (left) {
      this.mario.setVelocityX(-speed);
      this.mario.setFlipX(true);
    } else if (right) {
      this.mario.setVelocityX(speed);
      this.mario.setFlipX(false);
    } else {
      this.mario.setVelocityX(0);
    }

    if (jump && grounded) {
      this.mario.setVelocityY(jumpVelocity);
      this.cb.onJump();
    }

    // Notify XState of motion changes
    const isMoving = left || right;
    if (isMoving && !this.wasMoving && grounded) this.cb.onRun();
    if (!isMoving && this.wasMoving && grounded) this.cb.onStop();
    if (grounded && !this.wasGrounded) this.cb.onLand();
    if (!grounded && this.mario.body.velocity.y > 0 && this.wasGrounded) this.cb.onFall();
    if (down && grounded && this.currentPower !== "small") this.cb.onCrouch();
    if (!down && this.wasGrounded) this.cb.onUncrouch();

    this.wasGrounded = grounded;
    this.wasMoving = isMoving;
  }

  // ─── Death handling ───────────────────────────────────────────────────────

  triggerDeath() {
    if (this.isDead) return;
    this.isDead = true;
    this.mario.setVelocityX(0);
    this.mario.setVelocityY(-400);
    this.mario.setGravityY(300);
    this.mario.setCollideWorldBounds(false);
    this.deathAnimTimer = 180;
  }

  reset() {
    this.isDead = false;
    this.flagReached = false;
    this.invincibleTimer = 0;
    this.wasGrounded = true;
    this.wasMoving = false;
    this.mobileLeft = false;
    this.mobileRight = false;
    this.mobileJumpQueued = false;
    this.mario.setPosition(80, GROUND_Y - 20);
    this.mario.setVelocity(0, 0);
    this.mario.setAlpha(1);
    this.mario.setCollideWorldBounds(true);
    this.mario.setGravityY(600);
    this.cameras.main.scrollX = 0;
  }

  // ─── Phaser update loop ───────────────────────────────────────────────────

  update() {
    if (this.paused) return;

    this.handlePlayerInput();
    this.updateEnemyAI();

    // Invincibility flash
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      this.mario.setAlpha(this.invincibleTimer % 10 < 5 ? 0.3 : 1);
    } else {
      this.mario.setAlpha(1);
    }

    // Death fall off screen
    if (this.isDead) {
      this.deathAnimTimer--;
      if (this.deathAnimTimer <= 0) {
        this.cb.onDie();
      }
      return;
    }

    // Pit detection — triggerDeath() sets a short timer; onDie() fires when
    // the timer expires, sending DIE → playerMachine → PLAYER_DIED → gameMachine.
    if (this.mario.y > this.scale.height + 50 && !this.isDead) {
      this.triggerDeath();
      this.deathAnimTimer = 30; // short wait before reporting pit death
    }
  }

  // ─── Snapshot sync (called from React on every XState change) ────────────

  updateFromSnapshot(snap: MarioSnapshot) {
    const { playerCtx, playerMotion, enemyStates, gameState } = snap;
    this.paused = gameState === "playing.paused";

    if (playerCtx) {
      // Update Mario sprite scale / texture for power state
      const newPower = playerCtx.powerState;
      if (newPower !== this.currentPower) {
        this.currentPower = newPower;
        const key = newPower === "small" ? "mario_small" : "mario_big";
        this.mario.setTexture(key);
        this.mario.setScale(2);
      }

      // Trigger death visual if XState says dead
      if (playerMotion === "dead" && !this.isDead) {
        this.triggerDeath();
      }
    }

    // Hide dead enemies
    for (const [id, eState] of Object.entries(enemyStates)) {
      const e = this.enemies[id];
      if (!e) continue;
      if (eState.state === "dead" && !e.dead) {
        e.dead = true;
        e.sprite.destroy();
      } else if (eState.state === "stunned" && !e.stunned) {
        e.stunned = true;
        e.sprite.setTexture(e.type === "koopa" ? "koopa_shell" : "goomba_flat");
        e.sprite.setVelocityX(0);
      }
    }
  }
}
