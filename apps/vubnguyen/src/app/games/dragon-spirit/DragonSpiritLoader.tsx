"use client";

import dynamic from "next/dynamic";

const DragonSpiritGame = dynamic(
  () => import("src/app/games/dragon-spirit/DragonSpiritGame"),
  {
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[var(--site-bg)]">
        <p className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">
          {"Loading game…"}
        </p>
      </div>
    ),
    ssr: false,
  },
);

export default function DragonSpiritLoader() {
  return <DragonSpiritGame />;
}
