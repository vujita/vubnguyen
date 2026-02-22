"use client";

import { useEffect, useRef } from "react";

export interface CasinoSlotGameProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * React wrapper that mounts a Phaser casino slot game into a div.
 * Phaser is loaded dynamically (browser-only) via a dynamic import so
 * Next.js SSR is never affected.
 */
export function CasinoSlotGame({ width = 500, height = 520, className }: CasinoSlotGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const parent = containerRef.current;
    let game: { destroy: (removeCanvas: boolean) => void } | null = null;

    // Dynamic import keeps Phaser out of the SSR bundle entirely
    void import("../game/SlotGame.js").then(({ createSlotGame }) => {
      game = createSlotGame({ height, parent, width });
    });

    return () => {
      game?.destroy(true);
    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width }}
    />
  );
}
