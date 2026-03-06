"use client";

import { useEffect, useRef } from "react";
import { useActor } from "@xstate/react";
import { type Game as PhaserGame } from "phaser";

import { type SpaceInvaderScene } from "@vujita/vubnguyen/src/app/games/space-invaders/SpaceInvaderScene";
import { CANVAS_H, CANVAS_W, spaceInvadersMachine } from "@vujita/vubnguyen/src/app/games/space-invaders/spaceInvadersMachine";

type SceneInstance = InstanceType<typeof SpaceInvaderScene>;

// ─── State name helpers ───────────────────────────────────────────────────────

type StateValue = string | Record<string, string>;

function getStateName(value: StateValue): string {
  if (typeof value === "string") return value;
  const entries = Object.entries(value);
  if (entries.length === 0) return "idle";
  const [outer, inner] = entries[0]!;
  return typeof inner === "string" ? `${outer}.${inner}` : outer;
}

// ─── Button styles ────────────────────────────────────────────────────────────

const controlBtn = "font-code flex h-14 w-16 select-none items-center justify-center border border-[var(--site-border)] text-lg text-[var(--site-muted)] touch-manipulation transition-colors duration-150 active:bg-[var(--site-accent)] active:text-[var(--site-bg)]";

const fireBtn = "font-code flex h-14 w-24 select-none items-center justify-center border border-[var(--site-accent)] text-xs uppercase tracking-widest text-[var(--site-accent)] touch-manipulation transition-colors duration-150 active:bg-[var(--site-accent)] active:text-[var(--site-bg)]";

const actionBtn = "font-code border border-[var(--site-accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-accent)] transition-colors duration-150 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]";

const muteBtn = "font-code border border-[var(--site-border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-muted)] transition-colors duration-150 hover:text-[var(--site-accent)]";

const rapidFireBtn = (active: boolean) => (active ? "font-code flex h-14 w-16 select-none items-center justify-center border border-[var(--site-accent)] bg-[var(--site-accent)] text-[var(--site-bg)] touch-manipulation transition-colors duration-150" : "font-code flex h-14 w-16 select-none items-center justify-center border border-[var(--site-border)] text-[var(--site-muted)] touch-manipulation transition-colors duration-150 active:bg-[var(--site-accent)] active:text-[var(--site-bg)]");

// ─── Lives display ────────────────────────────────────────────────────────────
function LivesDisplay({ lives }: { lives: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: Math.max(0, lives) }, (_, i) => (
        <svg
          fill="currentColor"
          height="14"
          key={i}
          viewBox="0 0 24 16"
          width="21"
        >
          <rect
            height="8"
            width="24"
            x="0"
            y="8"
          />
          <rect
            height="4"
            width="12"
            x="6"
            y="4"
          />
          <rect
            height="4"
            width="4"
            x="10"
            y="0"
          />
        </svg>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SpaceInvadersGame() {
  const cancelledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGame | null>(null);
  const sceneRef = useRef<SceneInstance | null>(null);

  const [snapshot, send] = useActor(spaceInvadersMachine);
  const { context } = snapshot;
  const stateName = getStateName(snapshot.value as StateValue);

  const isPlaying = stateName.startsWith("playing");
  const isActive = stateName === "playing.active";
  const isDying = stateName === "playing.playerDying";
  const isLevelComplete = stateName === "playing.levelComplete";
  const isPaused = stateName === "paused";
  const isGameOver = stateName === "gameOver";
  const isIdle = stateName === "idle";

  // ─── Mount Phaser once (client-side only) ──────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    cancelledRef.current = false;

    void (async () => {
      const Phaser = (await import("phaser")).default;
      const { SpaceInvaderScene } = await import("src/app/games/space-invaders/SpaceInvaderScene");

      if (cancelledRef.current || !containerRef.current || gameRef.current) return;

      const scene = new SpaceInvaderScene();
      const game = new Phaser.Game({
        backgroundColor: "#0d0c0a",
        height: CANVAS_H,
        parent: containerRef.current,
        scene,
        type: Phaser.AUTO,
        width: CANVAS_W,
      });

      game.canvas.style.width = "100%";
      game.canvas.style.height = "auto";

      gameRef.current = game;
      game.scene.start("SpaceInvaderScene", { send });
      sceneRef.current = scene;
    })();

    return () => {
      cancelledRef.current = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, [send]);

  // ─── Game clock: 60 fps TICK for all playing substates ────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => send({ type: "TICK" }), 16);
    return () => clearInterval(id);
  }, [isPlaying, send]);

  // ─── Sync every XState snapshot → Phaser renderer ─────────────────────────
  useEffect(() => {
    sceneRef.current?.updateFromSnapshot(context, stateName);
  }, [context, stateName]);

  // ─── P / Escape to pause; R to toggle rapid fire at React layer ───────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        if (isActive) send({ type: "PAUSE" });
        if (isPaused) send({ type: "RESUME" });
      }
      if ((e.key === "r" || e.key === "R") && isActive) {
        send({ type: "TOGGLE_RAPID_FIRE" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [send, isActive, isPaused]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--site-bg)] px-4 pb-12 pt-24 text-[var(--site-text)]">
      {/* HUD */}
      <div className="mb-3 flex w-full max-w-[480px] items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-code text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Score"}</p>
          <p className="font-code text-sm text-[var(--site-accent)]">{context.score.toString().padStart(5, "0")}</p>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <p className="font-code text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Hi-Score"}</p>
          <p className="font-code text-sm text-[var(--site-text)]">{context.hiScore.toString().padStart(5, "0")}</p>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <p className="font-code text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Lives"}</p>
          <LivesDisplay lives={context.lives} />
        </div>
      </div>

      {/* Level badge */}
      {isPlaying ? (
        <p className="font-code mb-2 text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">
          {"Level "}
          {context.level}
          {isLevelComplete ? " — Wave Cleared!" : null}
        </p>
      ) : null}

      {/* Canvas */}
      <div
        className="relative w-full max-w-[480px] border border-[var(--site-border)]"
        ref={containerRef}
      >
        {/* State overlays — rendered on top of the Phaser canvas */}
        {isIdle ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="font-code text-xl uppercase tracking-[0.4em] text-[var(--site-accent)]">{"Space Invaders"}</p>
            <p className="font-code text-xs uppercase tracking-widest text-[var(--site-muted)]">{"Press Start"}</p>
          </div>
        ) : null}
        {isPaused ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="font-code text-sm uppercase tracking-[0.4em] text-[var(--site-muted)]">{"Paused"}</p>
          </div>
        ) : null}
        {isDying ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="font-code text-sm uppercase tracking-[0.4em] text-red-500">{"Ship Destroyed"}</p>
          </div>
        ) : null}
        {isGameOver ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p className="font-code text-xl uppercase tracking-[0.4em] text-red-500">{"Game Over"}</p>
            <p className="font-code text-xs uppercase tracking-widest text-[var(--site-muted)]">
              {"Final score: "}
              {context.score}
            </p>
          </div>
        ) : null}
      </div>

      {/* Mobile controls */}
      {isActive || isPaused ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            className={controlBtn}
            onPointerDown={() => send({ type: "INPUT_LEFT_DOWN" })}
            onPointerLeave={() => send({ type: "INPUT_LEFT_UP" })}
            onPointerUp={() => send({ type: "INPUT_LEFT_UP" })}
            type="button"
          >
            {"◀"}
          </button>
          <button
            className={fireBtn}
            onPointerDown={() => send({ type: "FIRE_PLAYER" })}
            type="button"
          >
            {"Fire"}
          </button>
          <button
            className={controlBtn}
            onPointerDown={() => send({ type: "INPUT_RIGHT_DOWN" })}
            onPointerLeave={() => send({ type: "INPUT_RIGHT_UP" })}
            onPointerUp={() => send({ type: "INPUT_RIGHT_UP" })}
            type="button"
          >
            {"▶"}
          </button>
          <button
            aria-label={context.rapidFire ? "Rapid Fire: On" : "Rapid Fire: Off"}
            className={rapidFireBtn(context.rapidFire)}
            onClick={() => send({ type: "TOGGLE_RAPID_FIRE" })}
            title={context.rapidFire ? "Rapid Fire: On" : "Rapid Fire: Off"}
            type="button"
          >
            <svg
              fill="currentColor"
              height="20"
              viewBox="0 0 12 20"
              width="12"
            >
              <polygon points="7,0 0,11 5,11 5,20 12,9 7,9" />
            </svg>
          </button>
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="mt-5 flex w-full max-w-[480px] flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {isIdle ? (
            <button
              className={actionBtn}
              onClick={() => send({ type: "START" })}
              type="button"
            >
              {"Start Game"}
            </button>
          ) : null}
          {isActive ? (
            <button
              className={muteBtn}
              onClick={() => send({ type: "PAUSE" })}
              type="button"
            >
              {"Pause"}
            </button>
          ) : null}
          {isPaused ? (
            <button
              className={actionBtn}
              onClick={() => send({ type: "RESUME" })}
              type="button"
            >
              {"Resume"}
            </button>
          ) : null}
          {isPaused || isGameOver ? (
            <button
              className={muteBtn}
              onClick={() => send({ type: "RESET" })}
              type="button"
            >
              {"Reset"}
            </button>
          ) : null}
          {isGameOver ? (
            <button
              className={actionBtn}
              onClick={() => send({ type: "START" })}
              type="button"
            >
              {"Play Again"}
            </button>
          ) : null}
        </div>

        <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">{"← → or A D to move · Space to fire · R to rapid fire · Esc or P to pause"}</p>
      </div>
    </div>
  );
}
