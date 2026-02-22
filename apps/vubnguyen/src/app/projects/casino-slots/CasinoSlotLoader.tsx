"use client";

import dynamic from "next/dynamic";

// Phaser requires window/canvas — load it only in the browser
const CasinoSlotGame = dynamic(
  () =>
    import("@vujita/casino-slot-game").then((mod) => ({
      default: mod.CasinoSlotGame,
    })),
  { ssr: false },
);

export function CasinoSlotLoader() {
  return (
    <CasinoSlotGame
      className="rounded-sm"
      height={520}
      width={500}
    />
  );
}
