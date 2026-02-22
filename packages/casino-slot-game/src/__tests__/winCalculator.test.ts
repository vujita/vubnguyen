import { type Payline } from "../core/paylines.js";
import { type ReelGrid } from "../core/reels.js";
import { calculateWins, checkPayline } from "../core/winCalculator.js";

const middlePayline: Payline = { id: 1, rows: [1, 1, 1] };

describe("checkPayline", () => {
  it("returns a win when all columns on the payline match", () => {
    const grid: ReelGrid = [
      ["cherry", "cherry", "cherry"],
      ["lemon", "lemon", "lemon"],
      ["orange", "orange", "orange"],
    ];
    const result = checkPayline(grid, middlePayline);
    expect(result).not.toBeNull();
    expect(result?.symbol).toBe("lemon");
    expect(result?.multiplier).toBeGreaterThan(0);
    expect(result?.paylineId).toBe(1);
  });

  it("returns null when symbols do not match", () => {
    const grid: ReelGrid = [
      ["cherry", "cherry", "cherry"],
      ["lemon", "orange", "lemon"],
      ["orange", "orange", "orange"],
    ];
    expect(checkPayline(grid, middlePayline)).toBeNull();
  });

  it("detects a diagonal win", () => {
    const diagonalPayline: Payline = { id: 3, rows: [0, 1, 2] };
    const grid: ReelGrid = [
      ["seven", "lemon", "cherry"],
      ["cherry", "seven", "cherry"],
      ["cherry", "cherry", "seven"],
    ];
    const result = checkPayline(grid, diagonalPayline);
    expect(result?.symbol).toBe("seven");
  });
});

describe("calculateWins", () => {
  it("returns no wins for a losing grid", () => {
    // No row, column, or diagonal produces 3-of-a-kind on any of the 5 paylines
    const grid: ReelGrid = [
      ["cherry", "lemon", "orange"],
      ["orange", "orange", "lemon"],
      ["lemon", "cherry", "cherry"],
    ];
    const result = calculateWins(grid);
    expect(result.wins).toHaveLength(0);
    expect(result.totalMultiplier).toBe(0);
    expect(result.isJackpot).toBe(false);
  });

  it("accumulates multipliers across multiple winning paylines", () => {
    // All rows are identical → top, middle, bottom all win
    const grid: ReelGrid = [
      ["cherry", "cherry", "cherry"],
      ["cherry", "cherry", "cherry"],
      ["cherry", "cherry", "cherry"],
    ];
    const result = calculateWins(grid);
    // At least 3 wins (top, middle, bottom)
    expect(result.wins.length).toBeGreaterThanOrEqual(3);
    expect(result.totalMultiplier).toBeGreaterThan(0);
  });

  it("flags isJackpot when sevens win on a payline", () => {
    const grid: ReelGrid = [
      ["lemon", "lemon", "lemon"],
      ["seven", "seven", "seven"],
      ["cherry", "cherry", "cherry"],
    ];
    const paylines: Payline[] = [{ id: 1, rows: [1, 1, 1] }];
    const result = calculateWins(grid, paylines);
    expect(result.isJackpot).toBe(true);
    expect(result.wins[0]?.symbol).toBe("seven");
  });

  it("does not flag isJackpot for non-seven wins", () => {
    const grid: ReelGrid = [
      ["bar", "bar", "bar"],
      ["lemon", "lemon", "lemon"],
      ["orange", "orange", "orange"],
    ];
    const result = calculateWins(grid);
    expect(result.isJackpot).toBe(false);
  });
});
