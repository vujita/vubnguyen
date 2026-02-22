import { buildReelStrip, pickSymbol, REEL_COUNT, ROW_COUNT, spinReels } from "../core/reels";
import { SYMBOLS } from "../core/symbols";

const validIds = new Set(SYMBOLS.map((s) => s.id));

describe("buildReelStrip", () => {
  it("contains every symbol at least once", () => {
    const strip = buildReelStrip();
    for (const sym of SYMBOLS) {
      expect(strip).toContain(sym.id);
    }
  });

  it("total length equals sum of weights", () => {
    const expectedLength = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    expect(buildReelStrip().length).toBe(expectedLength);
  });
});

describe("pickSymbol", () => {
  it("returns a valid symbol id", () => {
    const strip = buildReelStrip();
    const id = pickSymbol(strip);
    expect(validIds.has(id)).toBe(true);
  });

  it("uses the provided RNG", () => {
    const strip = buildReelStrip();
    // RNG always returns 0 → should pick first element
    const id = pickSymbol(strip, () => 0);
    expect(id).toBe(strip[0]);
  });

  it("throws when strip is empty", () => {
    expect(() => pickSymbol([], () => 0)).toThrow("Strip is empty");
  });
});

describe("spinReels", () => {
  it("returns a grid with ROW_COUNT rows", () => {
    const grid = spinReels();
    expect(grid.length).toBe(ROW_COUNT);
  });

  it("every row has REEL_COUNT columns", () => {
    const grid = spinReels();
    for (const row of grid) {
      expect(row.length).toBe(REEL_COUNT);
    }
  });

  it("every cell is a valid symbol id", () => {
    const grid = spinReels();
    for (const row of grid) {
      for (const cell of row) {
        expect(validIds.has(cell)).toBe(true);
      }
    }
  });

  it("is deterministic when seeded", () => {
    const seededRng = (() => {
      let seed = 42;
      return () => {
        seed = (seed * 1664525 + 1013904223) % 2 ** 32;
        return seed / 2 ** 32;
      };
    })();
    const grid1 = spinReels(seededRng);
    // Reset seed manually — easiest is to run the same sequence
    let seed = 42;
    const rng2 = () => {
      seed = (seed * 1664525 + 1013904223) % 2 ** 32;
      return seed / 2 ** 32;
    };
    const grid2 = spinReels(rng2);
    expect(grid1).toEqual(grid2);
  });
});
