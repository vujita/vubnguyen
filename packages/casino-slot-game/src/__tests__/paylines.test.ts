import { PAYLINES, validatePaylines } from "../core/paylines.js";
import { REEL_COUNT, ROW_COUNT } from "../core/reels.js";

describe("PAYLINES", () => {
  it("has at least one payline", () => {
    expect(PAYLINES.length).toBeGreaterThan(0);
  });

  it("every payline has REEL_COUNT row entries", () => {
    for (const pl of PAYLINES) {
      expect(pl.rows.length).toBe(REEL_COUNT);
    }
  });

  it("every row index is within [0, ROW_COUNT)", () => {
    for (const pl of PAYLINES) {
      for (const r of pl.rows) {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(ROW_COUNT);
      }
    }
  });

  it("payline ids are unique", () => {
    const ids = PAYLINES.map((pl) => pl.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("validatePaylines", () => {
  it("does not throw for valid paylines", () => {
    expect(() => validatePaylines(PAYLINES)).not.toThrow();
  });

  it("throws when a payline has the wrong number of rows", () => {
    expect(() => validatePaylines([{ id: 99, rows: [0, 0] }])).toThrow(/expected 3/);
  });

  it("throws when a row index is out of range", () => {
    expect(() => validatePaylines([{ id: 99, rows: [0, 99, 0] }])).toThrow(/out of range/);
  });
});
