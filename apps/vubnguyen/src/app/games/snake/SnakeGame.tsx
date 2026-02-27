"use client";

import { useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { type Game as PhaserGame } from "phaser";

// type-only — erased at build time, never triggers Phaser on the server
import { type SnakeScene } from "@vujita/vubnguyen/src/app/games/snake/PhaserScene";
import { CELL_SIZE, DIFFICULTY_SPEEDS, GRID_COLS, GRID_ROWS, snakeMachine, type Difficulty } from "@vujita/vubnguyen/src/app/games/snake/snakeMachine";

type SnakeSceneInstance = InstanceType<typeof SnakeScene>;

const CANVAS_W = GRID_COLS * CELL_SIZE;
const CANVAS_H = GRID_ROWS * CELL_SIZE;

export default function SnakeGame() {
  const cancelledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGame | null>(null);
  const sceneRef = useRef<SnakeSceneInstance | null>(null);

  const [snapshot, send] = useActor(snakeMachine);
  const { context } = snapshot;
  const stateName = typeof snapshot.value === "string" ? snapshot.value : "playing";

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");

  // Mount Phaser once — dynamic import keeps it out of the SSR bundle.
  // `send` from useActor is a stable reference in XState v5.
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    cancelledRef.current = false;

    void (async () => {
      const Phaser = (await import("phaser")).default;
      const { SnakeScene } = await import("src/app/games/snake/PhaserScene");

      if (cancelledRef.current || !containerRef.current) return;

      const scene = new SnakeScene();
      const game = new Phaser.Game({
        backgroundColor: "#0d0c0a",
        height: CANVAS_H,
        parent: containerRef.current,
        scene: scene,
        type: Phaser.AUTO,
        width: CANVAS_W,
      });

      gameRef.current = game;
      game.scene.start("SnakeScene", { send });
      sceneRef.current = game.scene.getScene("SnakeScene") as SnakeSceneInstance;
    })();

    return () => {
      cancelledRef.current = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, [send]);

  // Sync every XState snapshot to the Phaser renderer.
  useEffect(() => {
    sceneRef.current?.updateFromSnapshot(context, stateName);
  }, [context, stateName]);

  // P key toggles pause/resume at the React layer.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        if (stateName === "playing") send({ type: "PAUSE" });
        if (stateName === "paused") send({ type: "RESUME" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [send, stateName]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--site-bg)] px-6 pt-24 text-[var(--site-text)]">
      {/* HUD */}
      <div className="mb-4 flex w-full max-w-[480px] items-center justify-between">
        <p className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">
          {"Score: "}
          {context.score}
        </p>
        {stateName === "paused" && <span className="font-code text-xs uppercase tracking-widest text-[var(--site-muted)]">{"Paused"}</span>}
        {stateName === "dead" && <span className="font-code text-xs uppercase tracking-widest text-red-500">{"Game Over"}</span>}
      </div>

      {/* Phaser canvas container */}
      <div
        className="h-[480px] w-[480px] border border-[var(--site-border)]"
        ref={containerRef}
      />

      {/* Controls */}
      <div className="mt-6 flex w-full max-w-[480px] flex-col gap-4">
        {/* Difficulty selector — only on idle / dead */}
        {(stateName === "idle" || stateName === "dead") && (
          <div className="flex items-center gap-3">
            <span className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">{"Difficulty"}</span>
            {(Object.keys(DIFFICULTY_SPEEDS) as Difficulty[]).map((d) => (
              <button
                className={["font-code rounded-sm px-3 py-1 text-[10px] uppercase tracking-widest transition-colors duration-150", selectedDifficulty === d ? "bg-[var(--site-accent)] text-[var(--site-bg)]" : "bg-[var(--site-surface)] text-[var(--site-muted)] hover:text-[var(--site-text)]"].join(" ")}
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                type="button"
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {stateName === "idle" && (
            <button
              className="font-code border border-[var(--site-accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-accent)] transition-colors duration-150 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]"
              onClick={() => send({ difficulty: selectedDifficulty, type: "START" })}
              type="button"
            >
              {"Start Game"}
            </button>
          )}

          {stateName === "playing" && (
            <button
              className="font-code border border-[var(--site-border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-muted)] transition-colors duration-150 hover:text-[var(--site-accent)]"
              onClick={() => send({ type: "PAUSE" })}
              type="button"
            >
              {"Pause (P)"}
            </button>
          )}

          {stateName === "paused" && (
            <button
              className="font-code border border-[var(--site-accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-accent)] transition-colors duration-150 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]"
              onClick={() => send({ type: "RESUME" })}
              type="button"
            >
              {"Resume (P)"}
            </button>
          )}

          {(stateName === "paused" || stateName === "dead") && (
            <button
              className="font-code border border-[var(--site-border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-muted)] transition-colors duration-150 hover:text-[var(--site-accent)]"
              onClick={() => send({ type: "RESET" })}
              type="button"
            >
              {"Reset"}
            </button>
          )}
        </div>

        <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">{"Arrow keys or WASD to steer · Space or P to pause"}</p>
      </div>
    </div>
  );
}
