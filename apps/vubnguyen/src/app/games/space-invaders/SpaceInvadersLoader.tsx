"use client";

import dynamic from "next/dynamic";

const SpaceInvadersGame = dynamic(() => import("src/app/games/space-invaders/SpaceInvadersGame"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--site-bg)]">
      <p className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Loading game…"}</p>
    </div>
  ),
  ssr: false,
});

export default function SpaceInvadersLoader() {
  return <SpaceInvadersGame />;
}
