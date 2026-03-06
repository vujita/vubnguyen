"use client";

import dynamic from "next/dynamic";

const MarioGame = dynamic(() => import("src/app/games/mario/MarioGame"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--site-bg)]">
      <p className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">
        {"Loading game…"}
      </p>
    </div>
  ),
  ssr: false,
});

export default function MarioLoader() {
  return <MarioGame />;
}
