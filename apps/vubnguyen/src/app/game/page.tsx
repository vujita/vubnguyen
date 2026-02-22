import { type Metadata } from "next";

import { LiengGame } from "src/components/game/LiengGame";

export const metadata: Metadata = {
  title: "Liêng — Vu Nguyen",
  description:
    "Play Liêng, a Vietnamese card game where the goal is to get the last digit of your hand sum closest to 9. Special hands: Straight and Triple.",
};

export default function GamePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <div className="mb-12">
        <p className="font-code mb-2 text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">
          {"Game"}
        </p>
        <h1 className="font-display text-3xl italic text-[var(--site-text)] sm:text-4xl">
          {"Liêng"}
        </h1>
        <p className="mt-3 max-w-md text-sm text-[var(--site-muted)]">
          {
            "A Vietnamese card game. Get the last digit of your 3-card sum closest to 9 — or land a Straight or Triple to beat everything."
          }
        </p>
      </div>

      <LiengGame />
    </main>
  );
}
