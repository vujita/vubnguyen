import Phaser from "phaser";

import { REEL_COUNT, ROW_COUNT, spinReels, type ReelGrid } from "../../core/reels.js";
import { SYMBOLS, type SymbolId } from "../../core/symbols.js";
import { calculateWins } from "../../core/winCalculator.js";

const SYMBOL_LABEL: Record<SymbolId, string> = {
  bar: "BAR",
  cherry: "🍒",
  "double-bar": "BAR BAR",
  lemon: "🍋",
  orange: "🍊",
  seven: "7",
  "triple-bar": "BAR BAR BAR",
  watermelon: "🍉",
};

const SYMBOL_COLOR: Record<SymbolId, number> = {
  bar: 0xaaaaaa,
  cherry: 0xff4466,
  "double-bar": 0xcccccc,
  lemon: 0xffee44,
  orange: 0xff8822,
  seven: 0xff2200,
  "triple-bar": 0xffffff,
  watermelon: 0x44cc66,
};

const CELL_W = 120;
const CELL_H = 100;
const PADDING = 16;
const REEL_X_START = 80;
const REEL_Y_START = 80;

export class MainScene extends Phaser.Scene {
  private cellTexts: Phaser.GameObjects.Text[][] = [];
  private cellBgs: Phaser.GameObjects.Rectangle[][] = [];
  private spinButton!: Phaser.GameObjects.Text;
  private resultText!: Phaser.GameObjects.Text;
  private balanceText!: Phaser.GameObjects.Text;
  private betText!: Phaser.GameObjects.Text;

  private balance = 100;
  private bet = 5;
  private spinning = false;

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    const { width } = this.scale;

    // Background
    this.add.rectangle(width / 2, 175, width - 32, 380, 0x1a1a2e).setOrigin(0.5);

    // Grid cells
    for (let row = 0; row < ROW_COUNT; row++) {
      this.cellTexts.push([]);
      this.cellBgs.push([]);
      for (let col = 0; col < REEL_COUNT; col++) {
        const x = REEL_X_START + col * (CELL_W + PADDING);
        const y = REEL_Y_START + row * (CELL_H + PADDING);

        const bg = this.add.rectangle(x, y, CELL_W - 4, CELL_H - 4, 0x16213e).setOrigin(0);
        this.cellBgs[row]!.push(bg);

        const txt = this.add
          .text(x + CELL_W / 2 - 2, y + CELL_H / 2 - 2, "?", {
            color: "#ffffff",
            fontSize: "24px",
            fontStyle: "bold",
          })
          .setOrigin(0.5);
        this.cellTexts[row]!.push(txt);
      }
    }

    // Balance
    this.balanceText = this.add.text(16, 360, `Balance: $${this.balance}`, {
      color: "#00ff99",
      fontSize: "16px",
    });

    // Bet
    this.betText = this.add.text(16, 385, `Bet: $${this.bet}`, {
      color: "#aaaaff",
      fontSize: "14px",
    });

    // Spin button
    this.spinButton = this.add
      .text(width / 2, 430, "[ SPIN ]", {
        backgroundColor: "#e63946",
        color: "#ffffff",
        fontSize: "22px",
        fontStyle: "bold",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.onSpin())
      .on("pointerover", () => this.spinButton.setStyle({ backgroundColor: "#c1121f" }))
      .on("pointerout", () => this.spinButton.setStyle({ backgroundColor: "#e63946" }));

    // Result text
    this.resultText = this.add
      .text(width / 2, 475, "", {
        color: "#ffd700",
        fontSize: "18px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  private onSpin(): void {
    if (this.spinning) return;
    if (this.balance < this.bet) {
      this.resultText.setText("Insufficient balance!");
      return;
    }

    this.spinning = true;
    this.balance -= this.bet;
    this.resultText.setText("");
    this.spinButton.setAlpha(0.5);

    // Animate spinning
    this.animateSpin(() => {
      const grid = spinReels();
      this.renderGrid(grid);
      const { totalMultiplier, isJackpot, wins } = calculateWins(grid);

      const payout = totalMultiplier * this.bet;
      this.balance += payout;
      this.balanceText.setText(`Balance: $${this.balance}`);

      if (isJackpot) {
        this.resultText.setStyle({ color: "#ff0" }).setText("🎰 JACKPOT! 🎰");
      } else if (wins.length > 0) {
        this.resultText.setStyle({ color: "#00ff99" }).setText(`Win! +$${payout}`);
      } else {
        this.resultText.setStyle({ color: "#ff6666" }).setText("No win. Try again!");
      }

      this.spinning = false;
      this.spinButton.setAlpha(1);
    });
  }

  private animateSpin(onComplete: () => void): void {
    const SYMBOLS_LIST = SYMBOLS.map((s) => s.id);
    let ticks = 0;
    const maxTicks = 12;

    const timer = this.time.addEvent({
      callback: () => {
        for (let row = 0; row < ROW_COUNT; row++) {
          for (let col = 0; col < REEL_COUNT; col++) {
            const randId = SYMBOLS_LIST[Math.floor(Math.random() * SYMBOLS_LIST.length)] as SymbolId;
            this.cellTexts[row]?.[col]?.setText(SYMBOL_LABEL[randId]);
          }
        }
        ticks++;
        if (ticks >= maxTicks) {
          timer.remove();
          onComplete();
        }
      },
      delay: 80,
      loop: true,
    });
  }

  private renderGrid(grid: ReelGrid): void {
    for (let row = 0; row < ROW_COUNT; row++) {
      for (let col = 0; col < REEL_COUNT; col++) {
        const id = grid[row]?.[col] as SymbolId | undefined;
        if (!id) continue;
        this.cellTexts[row]?.[col]?.setText(SYMBOL_LABEL[id]);
        this.cellTexts[row]?.[col]?.setStyle({ color: `#${SYMBOL_COLOR[id].toString(16).padStart(6, "0")}` });
        this.cellBgs[row]?.[col]?.setFillStyle(0x0f3460);
      }
    }
  }
}
