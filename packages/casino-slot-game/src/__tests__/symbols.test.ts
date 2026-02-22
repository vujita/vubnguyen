import { getSymbol, SYMBOL_MAP, SYMBOLS } from "../core/symbols.js";

describe("SYMBOLS", () => {
  it("has at least one symbol", () => {
    expect(SYMBOLS.length).toBeGreaterThan(0);
  });

  it("every symbol has a positive payout", () => {
    for (const sym of SYMBOLS) {
      expect(sym.payout).toBeGreaterThan(0);
    }
  });

  it("every symbol has a positive weight", () => {
    for (const sym of SYMBOLS) {
      expect(sym.weight).toBeGreaterThan(0);
    }
  });

  it("symbol ids are unique", () => {
    const ids = SYMBOLS.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("SYMBOL_MAP contains all symbols", () => {
    for (const sym of SYMBOLS) {
      expect(SYMBOL_MAP.has(sym.id)).toBe(true);
    }
  });
});

describe("getSymbol", () => {
  it("returns the correct symbol for a known id", () => {
    const sym = getSymbol("seven");
    expect(sym.id).toBe("seven");
    expect(sym.payout).toBe(100);
  });

  it("throws for an unknown id", () => {
    // @ts-expect-error — intentionally passing invalid id
    expect(() => getSymbol("unknown")).toThrow("Unknown symbol id: unknown");
  });
});
