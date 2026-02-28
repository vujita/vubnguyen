// This file is only ever imported via dynamic import() inside a useEffect,
// so the static Phaser import is never evaluated on the server.
import Phaser from "phaser";

import { CELL_SIZE, GRID_COLS, GRID_ROWS, type SnakeContext, type SnakeEvent } from "@vujita/vubnguyen/src/app/games/snake/snakeMachine";

type SendFn = (event: SnakeEvent) => void;

const COLORS = {
  food: 0xc9a86c,
  grid: 0x262320,
  snakeBody: 0x7a7268,
  snakeHead: 0xe6e0d4,
} as const;

export class SnakeScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private foodGraphics!: Phaser.GameObjects.Graphics;
  private sendToMachine!: SendFn;
  private snakeGraphics!: Phaser.GameObjects.Graphics;
  private wasd!: {
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: "SnakeScene" });
  }

  init(data: { send: SendFn }): void {
    this.sendToMachine = data.send;
  }

  create(): void {
    this.snakeGraphics = this.add.graphics();
    this.foodGraphics = this.add.graphics();
    this.drawGrid();

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      };
    }
  }

  update(): void {
    this.handleInput();
  }

  updateFromSnapshot(context: SnakeContext, state: string): void {
    this.snakeGraphics.clear();
    this.foodGraphics.clear();

    if (state === "idle" || state === "dead") return;

    this.drawFood(context.food);
    this.drawSnake(context.snake);
  }

  private drawFood(food: SnakeContext["food"]): void {
    this.foodGraphics.fillStyle(COLORS.food);
    const cx = food.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = food.y * CELL_SIZE + CELL_SIZE / 2;
    this.foodGraphics.fillCircle(cx, cy, CELL_SIZE / 2 - 3);
  }

  private drawGrid(): void {
    const grid = this.add.graphics();
    grid.lineStyle(1, COLORS.grid, 0.4);
    for (let col = 0; col <= GRID_COLS; col++) {
      grid.lineBetween(col * CELL_SIZE, 0, col * CELL_SIZE, GRID_ROWS * CELL_SIZE);
    }
    for (let row = 0; row <= GRID_ROWS; row++) {
      grid.lineBetween(0, row * CELL_SIZE, GRID_COLS * CELL_SIZE, row * CELL_SIZE);
    }
  }

  private drawSnake(snake: SnakeContext["snake"]): void {
    snake.forEach((seg, i) => {
      this.snakeGraphics.fillStyle(i === 0 ? COLORS.snakeHead : COLORS.snakeBody);
      this.snakeGraphics.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }

  private handleInput(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.cursors || !this.sendToMachine) return;

    const { JustDown } = Phaser.Input.Keyboard;

    if (JustDown(this.cursors.left) || JustDown(this.wasd.left)) {
      this.sendToMachine({ direction: "left", type: "STEER" });
    } else if (JustDown(this.cursors.right) || JustDown(this.wasd.right)) {
      this.sendToMachine({ direction: "right", type: "STEER" });
    } else if (JustDown(this.cursors.up) || JustDown(this.wasd.up)) {
      this.sendToMachine({ direction: "up", type: "STEER" });
    } else if (JustDown(this.cursors.down) || JustDown(this.wasd.down)) {
      this.sendToMachine({ direction: "down", type: "STEER" });
    }

    if (JustDown(this.cursors.space)) {
      this.sendToMachine({ type: "PAUSE" });
    }
  }
}
