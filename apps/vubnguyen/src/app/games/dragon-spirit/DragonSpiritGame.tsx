"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { type Game as PhaserGame } from "phaser";

import { type DragonSpiritScene } from "@vujita/vubnguyen/src/app/games/dragon-spirit/DragonSpiritScene";
import {
  CANVAS_H,
  CANVAS_W,
  STAGES,
  dragonSpiritMachine,
  type HeldKeys,
} from "@vujita/vubnguyen/src/app/games/dragon-spirit/dragonSpiritMachine";

type SceneInstance = InstanceType<typeof DragonSpiritScene>;

// ─── Button styles ────────────────────────────────────────────────────────────

const dpadBtn =
  "font-code flex h-14 w-14 select-none items-center justify-center border border-[var(--site-border)] text-lg text-[var(--site-muted)] touch-manipulation transition-colors duration-100 active:bg-[var(--site-accent)] active:text-[var(--site-bg)] hover:text-[var(--site-accent)]";

const actionBtn =
  "font-code border border-[var(--site-accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-accent)] transition-colors duration-150 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]";

const muteBtn =
  "font-code border border-[var(--site-border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-muted)] transition-colors duration-150 hover:text-[var(--site-accent)]";

// ─── Small SVG dragon icon for lives display ──────────────────────────────────

function DragonIcon() {
  return (
    <svg
      fill="currentColor"
      height="16"
      viewBox="0 0 20 20"
      width="16"
    >
      {/* wing */}
      <polygon points="10,4 2,14 10,14" opacity="0.7" />
      <polygon points="10,4 18,14 10,14" opacity="0.7" />
      {/* body */}
      <ellipse cx="10" cy="13" rx="4" ry="4" />
      {/* head */}
      <polygon points="10,2 7,8 13,8" />
    </svg>
  );
}

function LivesDisplay({ lives }: { lives: number }) {
  return (
    <div className="flex items-center gap-1 text-[var(--site-accent)]">
      {Array.from({ length: Math.max(0, lives) }, (_, i) => (
        <DragonIcon key={i} />
      ))}
    </div>
  );
}

// ─── Heads indicator ─────────────────────────────────────────────────────────

function HeadsIndicator({ heads }: { heads: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((n) => (
        <div
          className={[
            "h-3 w-3 rotate-45 transition-colors duration-150",
            n <= heads ? "bg-[var(--site-accent)]" : "border border-[var(--site-border)]",
          ].join(" ")}
          key={n}
        />
      ))}
    </div>
  );
}

// ─── Firepower indicator ─────────────────────────────────────────────────────

function FirepowerIndicator({ firepower }: { firepower: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((n) => (
        <div
          className={[
            "h-2 w-2 rounded-full transition-colors duration-150",
            n <= firepower ? "bg-orange-400" : "border border-[var(--site-border)]",
          ].join(" ")}
          key={n}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DragonSpiritGame() {
  const cancelledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGame | null>(null);
  const sceneRef = useRef<SceneInstance | null>(null);
  const keysRef = useRef<HeldKeys>({ down: false, left: false, right: false, up: false });

  const [snapshot, send] = useActor(dragonSpiritMachine);
  const { context } = snapshot;
  const stateName = typeof snapshot.value === "string" ? snapshot.value : "playing";

  const isPlaying = stateName === "playing";
  const isPaused = stateName === "paused";
  const isIdle = stateName === "idle";
  const isGameOver = stateName === "gameOver";
  const isStageClear = stateName === "stageClear";
  const isVictory = stateName === "victory";

  const stageDef = STAGES[context.stage - 1]!;

  // ── Mount Phaser once (client only) ────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    cancelledRef.current = false;

    void (async () => {
      const Phaser = (await import("phaser")).default;
      const { DragonSpiritScene } = await import("src/app/games/dragon-spirit/DragonSpiritScene");

      if (cancelledRef.current || !containerRef.current || gameRef.current) return;

      const scene = new DragonSpiritScene();
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
      game.scene.start("DragonSpiritScene");
      sceneRef.current = scene;
    })();

    return () => {
      cancelledRef.current = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  // ── Game clock: 60 fps ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying && !isStageClear) return;
    const id = setInterval(() => send({ type: "TICK" }), 16);
    return () => clearInterval(id);
  }, [isPlaying, isStageClear, send]);

  // ── Sync XState snapshot → Phaser ──────────────────────────────────────────
  useEffect(() => {
    sceneRef.current?.updateFromSnapshot(context, stateName);
  }, [context, stateName]);

  // ── Send held-key state on every animation frame while playing ─────────────
  useEffect(() => {
    if (!isPlaying) return;
    let raf: number;
    const loop = () => {
      send({ keys: { ...keysRef.current }, type: "SET_KEYS" });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, send]);

  // ── Keyboard: track held keys ──────────────────────────────────────────────
  useEffect(() => {
    const DOWN_MAP: Record<string, keyof HeldKeys> = {
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      KeyA: "left",
      KeyD: "right",
      KeyS: "down",
      KeyW: "up",
      s: "down",
      a: "left",
      d: "right",
      w: "up",
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const dir = DOWN_MAP[e.code] ?? DOWN_MAP[e.key];
      if (dir) keysRef.current = { ...keysRef.current, [dir]: true };

      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (isPlaying) send({ type: "PAUSE" });
        if (isPaused) send({ type: "RESUME" });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const dir = DOWN_MAP[e.code] ?? DOWN_MAP[e.key];
      if (dir) keysRef.current = { ...keysRef.current, [dir]: false };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isPlaying, isPaused, send]);

  // ── D-pad press/release helpers ────────────────────────────────────────────
  const pressDir = useCallback((dir: keyof HeldKeys) => {
    keysRef.current = { ...keysRef.current, [dir]: true };
  }, []);

  const releaseDir = useCallback((dir: keyof HeldKeys) => {
    keysRef.current = { ...keysRef.current, [dir]: false };
  }, []);

  const releaseAll = useCallback(() => {
    keysRef.current = { down: false, left: false, right: false, up: false };
  }, []);

  // Pointer-based D-pad button props factory
  function dpadProps(dir: keyof HeldKeys) {
    return {
      className: dpadBtn,
      onPointerDown: () => pressDir(dir),
      onPointerLeave: () => releaseDir(dir),
      onPointerUp: () => releaseDir(dir),
      type: "button" as const,
    };
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--site-bg)] px-4 pb-10 pt-24 text-[var(--site-text)]">

      {/* ── HUD ──────────────────────────────────────────────────────────── */}
      <div className="mb-3 flex w-full max-w-[400px] items-start justify-between">
        {/* Left: score */}
        <div className="flex flex-col gap-0.5">
          <p className="font-code text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Score"}</p>
          <p className="font-code text-sm text-[var(--site-accent)]">{context.score.toString().padStart(6, "0")}</p>
        </div>

        {/* Center: stage name */}
        <div className="flex flex-col items-center gap-0.5">
          <p className="font-code text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Stage"}</p>
          <p className="font-code text-xs text-[var(--site-text)]">
            {context.stage}
            {" — "}
            {stageDef.name}
          </p>
        </div>

        {/* Right: hi-score */}
        <div className="flex flex-col items-end gap-0.5">
          <p className="font-code text-[9px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Hi-Score"}</p>
          <p className="font-code text-sm text-[var(--site-text)]">{context.hiScore.toString().padStart(6, "0")}</p>
        </div>
      </div>

      {/* Lives + heads + firepower row */}
      {(isPlaying || isPaused) && (
        <div className="mb-2 flex w-full max-w-[400px] items-center justify-between">
          <LivesDisplay lives={context.lives} />
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-code text-[8px] uppercase tracking-widest text-[var(--site-muted)]">{"Heads"}</p>
              <HeadsIndicator heads={context.heads} />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <p className="font-code text-[8px] uppercase tracking-widest text-[var(--site-muted)]">{"Power"}</p>
              <FirepowerIndicator firepower={context.firepower} />
            </div>
          </div>
        </div>
      )}

      {/* ── Phaser canvas + overlays ───────────────────────────────────── */}
      <div
        className="relative w-full max-w-[400px] border border-[var(--site-border)]"
        ref={containerRef}
      >
        {isIdle && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5">
            <p className="font-display text-2xl font-bold italic uppercase tracking-[0.2em] text-[var(--site-accent)]">
              {"Dragon Spirit"}
            </p>
            <p className="font-code text-[10px] uppercase tracking-[0.3em] text-[var(--site-muted)]">{"Press Start"}</p>
          </div>
        )}

        {isPaused && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="font-code text-base uppercase tracking-[0.4em] text-[var(--site-muted)]">{"Paused"}</p>
          </div>
        )}

        {isStageClear && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p className="font-code text-base uppercase tracking-[0.3em] text-[var(--site-accent)]">{"Stage Clear!"}</p>
            <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
              {"Stage "}
              {context.stage}
              {" — "}
              {stageDef.name}
            </p>
          </div>
        )}

        {isGameOver && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="font-code text-xl uppercase tracking-[0.4em] text-red-500">{"Game Over"}</p>
            <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
              {"Score: "}
              {context.score.toLocaleString()}
            </p>
          </div>
        )}

        {isVictory && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="font-display text-xl font-bold italic uppercase tracking-[0.3em] text-[var(--site-accent)]">
              {"You Win!"}
            </p>
            <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
              {"Final Score: "}
              {context.score.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ── Mobile D-pad controls (shown while playing or paused) ─────────── */}
      {(isPlaying || isPaused) && (
        <div
          className="mt-5 flex w-full max-w-[400px] items-end justify-between"
          // Release all directions if pointer leaves the whole dpad area
          onPointerLeave={releaseAll}
        >
          {/* D-pad */}
          <div className="grid grid-cols-3 gap-1.5">
            <div />
            <button {...dpadProps("up")}>{"▲"}</button>
            <div />

            <button {...dpadProps("left")}>{"◀"}</button>
            <div className="h-14 w-14 border border-[var(--site-border)] opacity-20" />
            <button {...dpadProps("right")}>{"▶"}</button>

            <div />
            <button {...dpadProps("down")}>{"▼"}</button>
            <div />
          </div>

          {/* Action buttons: pause and power-up legend */}
          <div className="flex flex-col items-end gap-2">
            {isPlaying && (
              <button
                className={muteBtn}
                onClick={() => send({ type: "PAUSE" })}
                type="button"
              >
                {"Pause"}
              </button>
            )}
            {isPaused && (
              <>
                <button
                  className={actionBtn}
                  onClick={() => send({ type: "RESUME" })}
                  type="button"
                >
                  {"Resume"}
                </button>
                <button
                  className={muteBtn}
                  onClick={() => { releaseAll(); send({ type: "RESET" }); }}
                  type="button"
                >
                  {"Reset"}
                </button>
              </>
            )}

            {/* Power-up legend */}
            <div className="mt-1 flex flex-col items-end gap-1">
              <span className="font-code text-[8px] uppercase tracking-widest text-[var(--site-muted)]">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-400" />
                {"Blue = +head"}
              </span>
              <span className="font-code text-[8px] uppercase tracking-widest text-[var(--site-muted)]">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-400" />
                {"Red = +power"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Start / Game-over / Victory buttons ──────────────────────────── */}
      <div className="mt-5 flex w-full max-w-[400px] flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {isIdle && (
            <button
              className={actionBtn}
              onClick={() => send({ type: "START" })}
              type="button"
            >
              {"Start Game"}
            </button>
          )}

          {(isGameOver || isVictory) && (
            <>
              <button
                className={actionBtn}
                onClick={() => send({ type: "START" })}
                type="button"
              >
                {"Play Again"}
              </button>
              <button
                className={muteBtn}
                onClick={() => send({ type: "RESET" })}
                type="button"
              >
                {"Main Menu"}
              </button>
            </>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
          {"Arrow keys or WASD to fly · Auto-fire · P or Esc to pause"}
        </p>

        {/* Power-up reference (desktop) */}
        <div className="hidden flex-wrap gap-4 sm:flex">
          <span className="font-code text-[9px] uppercase tracking-widest text-[var(--site-muted)]">
            {"● Blue orb — extra head (wider shot)"}
          </span>
          <span className="font-code text-[9px] uppercase tracking-widest text-[var(--site-muted)]">
            {"● Red orb — stronger fireballs"}
          </span>
          <span className="font-code text-[9px] uppercase tracking-widest text-[var(--site-muted)]">
            {"● ◇ Diamond — 100 pts · ▪ Gold — 500 pts"}
          </span>
        </div>
      </div>
    </div>
  );
}
