import { type Metadata } from "next";

import { CasinoSlotLoader } from "@vujita/vubnguyen/src/app/projects/casino-slots/CasinoSlotLoader";

export const metadata: Metadata = {
  description: "A browser-based 3-reel slot machine built with Phaser 3 and TypeScript.",
  title: "Casino Slot Machine — Vu Nguyen",
};

export default function CasinoSlotsPage() {
  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <section className="min-h-screen px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"Projects / Casino Slots"}</p>
          <h1 className="font-display mb-4 text-[clamp(36px,6vw,72px)] font-bold italic leading-none tracking-tight text-[var(--site-text)]">{"Casino Slot Machine"}</h1>
          <p className="mb-12 max-w-xl text-sm leading-relaxed text-[var(--site-muted)]">{"A 3-reel slot machine powered by Phaser 3. Weighted reel strips, 5 paylines, and jackpot detection — driven by pure TypeScript game logic."}</p>

          <div className="flex justify-center">
            <CasinoSlotLoader />
          </div>

          <div className="mt-16 border-t border-[var(--site-border)] pt-12">
            <p className="font-code mb-6 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"How it works"}</p>
            <div className="grid gap-6 text-sm leading-relaxed text-[var(--site-muted)] sm:grid-cols-3">
              <div>
                <p className="font-code mb-2 text-xs uppercase tracking-[0.15em] text-[var(--site-text)]">{"Weighted reels"}</p>
                <p>{"Each symbol has a weight. Higher-payout symbols appear less often. The reel strip is built at runtime from these weights."}</p>
              </div>
              <div>
                <p className="font-code mb-2 text-xs uppercase tracking-[0.15em] text-[var(--site-text)]">{"5 paylines"}</p>
                <p>{"Top row, middle row, bottom row, and both diagonals. Matching all 3 symbols on any payline pays out."}</p>
              </div>
              <div>
                <p className="font-code mb-2 text-xs uppercase tracking-[0.15em] text-[var(--site-text)]">{"Jackpot"}</p>
                <p>{"Three 7s on any payline triggers the jackpot — a 100× bet multiplier."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
