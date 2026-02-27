"use client";

import dynamic from "next/dynamic";

const SnakeGame = dynamic(() => import("src/app/games/snake/SnakeGame"), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--site-bg)]">
      <p className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Loading game…"}</p>
    </div>
  ),
  ssr: false,
});

export default function SnakeGameLoader() {
  return <SnakeGame />;
}
