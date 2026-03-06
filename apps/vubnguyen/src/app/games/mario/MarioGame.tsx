"use client";

import { useCallback, useEffect, useRef } from "react";
import { useActor } from "@xstate/react";
import { type Game as PhaserGame } from "phaser";

import { type MarioScene, type MarioSnapshot } from "@vujita/vubnguyen/src/app/games/mario/MarioScene";
import { CANVAS_W, CANVAS_H, gameMachine } from "@vujita/vubnguyen/src/app/games/mario/gameMachine";

type MarioSceneInstance = InstanceType<typeof MarioScene>;

const btnClass =
  "font-code border border-[var(--site-border)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-muted)] transition-colors duration-150 hover:text-[var(--site-accent)]";
const btnAccentClass =
  "font-code border border-[var(--site-accent)] px-6 py-2 text-xs uppercase tracking-widest text-[var(--site-accent)] transition-colors duration-150 hover:bg-[var(--site-accent)] hover:text-[var(--site-bg)]";

export default function MarioGame() {
  const cancelledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserGame | null>(null);
  const sceneRef = useRef<MarioSceneInstance | null>(null);

  const [snapshot, send] = useActor(gameMachine);
  const { context: gameCtx } = snapshot;
  const gameState = typeof snapshot.value === "string" ? snapshot.value : "playing";

  // ─── Helpers to reach child actor refs ────────────────────────────────────

  const getLevelRef = useCallback(() => gameCtx.levelRef, [gameCtx.levelRef]);

  const getPlayerRef = useCallback(() => {
    const levelSnap = getLevelRef()?.getSnapshot();
    return levelSnap?.context.playerRef ?? null;
  }, [getLevelRef]);

  const getEnemyRef = useCallback(
    (id: string) => {
      const levelSnap = getLevelRef()?.getSnapshot();
      return levelSnap?.context.enemyRefs[id] ?? null;
    },
    [getLevelRef],
  );

  // ─── Callbacks for Phaser scene ───────────────────────────────────────────

  // Keep a stable ref so the scene always gets the freshest version
  const cbRef = useRef({
    onJump: () => getPlayerRef()?.send({ type: "JUMP" }),
    onFall: () => getPlayerRef()?.send({ type: "FALL" }),
    onLand: () => getPlayerRef()?.send({ type: "LAND" }),
    onRun: () => getPlayerRef()?.send({ type: "RUN" }),
    onStop: () => getPlayerRef()?.send({ type: "STOP" }),
    onCrouch: () => getPlayerRef()?.send({ type: "CROUCH" }),
    onUncrouch: () => getPlayerRef()?.send({ type: "UNCROUCH" }),
    onGetHit: () => getPlayerRef()?.send({ type: "GET_HIT" }),
    onDie: () => getPlayerRef()?.send({ type: "DIE" }),
    onCoinCollected: () => getLevelRef()?.send({ type: "COIN_COLLECTED" }),
    onMushroomCollected: () => getPlayerRef()?.send({ type: "COLLECT_MUSHROOM" }),
    onFireFlowerCollected: () => getPlayerRef()?.send({ type: "COLLECT_FIRE_FLOWER" }),
    onEnemyStomp: (id: string) => getEnemyRef(id)?.send({ type: "STOMP" }),
    onEnemyHit: (id: string) => getEnemyRef(id)?.send({ type: "HIT" }),
    onFlagReached: () => getLevelRef()?.send({ type: "FLAG_REACHED" }),
    onScoreAdd: (amount: number) => send({ type: "SCORE_ADD", amount }),
  });

  // Update callback closures whenever actor refs change
  useEffect(() => {
    cbRef.current = {
      onJump: () => getPlayerRef()?.send({ type: "JUMP" }),
      onFall: () => getPlayerRef()?.send({ type: "FALL" }),
      onLand: () => getPlayerRef()?.send({ type: "LAND" }),
      onRun: () => getPlayerRef()?.send({ type: "RUN" }),
      onStop: () => getPlayerRef()?.send({ type: "STOP" }),
      onCrouch: () => getPlayerRef()?.send({ type: "CROUCH" }),
      onUncrouch: () => getPlayerRef()?.send({ type: "UNCROUCH" }),
      onGetHit: () => getPlayerRef()?.send({ type: "GET_HIT" }),
      onDie: () => getPlayerRef()?.send({ type: "DIE" }),
      onCoinCollected: () => getLevelRef()?.send({ type: "COIN_COLLECTED" }),
      onMushroomCollected: () => getPlayerRef()?.send({ type: "COLLECT_MUSHROOM" }),
      onFireFlowerCollected: () => getPlayerRef()?.send({ type: "COLLECT_FIRE_FLOWER" }),
      onEnemyStomp: (id: string) => getEnemyRef(id)?.send({ type: "STOMP" }),
      onEnemyHit: (id: string) => getEnemyRef(id)?.send({ type: "HIT" }),
      onFlagReached: () => getLevelRef()?.send({ type: "FLAG_REACHED" }),
      onScoreAdd: (amount: number) => send({ type: "SCORE_ADD", amount }),
    };
  }, [getPlayerRef, getLevelRef, getEnemyRef, send]);

  // ─── Mount Phaser once ────────────────────────────────────────────────────

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    cancelledRef.current = false;

    void (async () => {
      const Phaser = (await import("phaser")).default;
      const { MarioScene } = await import(
        "src/app/games/mario/MarioScene"
      );

      if (cancelledRef.current || !containerRef.current || gameRef.current) return;

      // Proxy callbacks — always delegate to cbRef.current so closures stay fresh
      const cb = new Proxy(
        {},
        {
          get(_t, prop: string) {
            return (...args: unknown[]) =>
              (cbRef.current as Record<string, (...a: unknown[]) => void>)[prop]?.(...args);
          },
        },
      ) as Parameters<typeof MarioScene.prototype.init>[0]["cb"];

      const scene = new MarioScene();
      const game = new Phaser.Game({
        backgroundColor: "#5c94fc",
        height: CANVAS_H,
        parent: containerRef.current,
        physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 }, debug: false } },
        scene: scene,
        type: Phaser.AUTO,
        width: CANVAS_W,
      });

      game.canvas.style.width = "100%";
      game.canvas.style.height = "auto";

      gameRef.current = game;
      game.scene.start("MarioScene", { cb });
      sceneRef.current = scene;
    })();

    return () => {
      cancelledRef.current = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Spawn enemies whenever a new level starts ────────────────────────────

  const prevLevelRef = useRef<typeof gameCtx.levelRef>(null);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (gameCtx.levelRef === prevLevelRef.current) return;
    prevLevelRef.current = gameCtx.levelRef;

    sceneRef.current?.reset();
    sceneRef.current?.spawnEnemies(getLevelEnemyConfigs(gameCtx.level));
  }, [gameCtx.levelRef, gameCtx.level, gameState]);

  // ─── Sync XState state → Phaser on every snapshot change ─────────────────

  useEffect(() => {
    const levelSnap = gameCtx.levelRef?.getSnapshot();
    const playerSnap = levelSnap?.context.playerRef?.getSnapshot();
    const enemyStates: MarioSnapshot["enemyStates"] = {};

    if (levelSnap) {
      for (const [id, ref] of Object.entries(levelSnap.context.enemyRefs)) {
        const snap = ref.getSnapshot();
        enemyStates[id] = {
          ctx: snap.context,
          state: typeof snap.value === "string" ? snap.value : "patrolling",
        };
      }
    }

    const snap: MarioSnapshot = {
      gameCtx,
      gameState,
      levelCtx: levelSnap?.context ?? null,
      playerCtx: playerSnap?.context ?? null,
      playerMotion: playerSnap
        ? (typeof playerSnap.value === "string" ? playerSnap.value : "idle") as MarioSnapshot["playerMotion"]
        : null,
      enemyStates,
    };

    sceneRef.current?.updateFromSnapshot(snap);
  }, [snapshot, gameCtx, gameState]);

  // ─── Pause via keyboard ───────────────────────────────────────────────────

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key !== "p" && e.key !== "P" && e.key !== "Escape") return;
      if (gameState === "playing") send({ type: "PAUSE" });
      if (gameState === "paused") send({ type: "RESUME" });
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [gameState, send]);

  // ─── UI ───────────────────────────────────────────────────────────────────

  const levelSnap = gameCtx.levelRef?.getSnapshot();
  const coinsCollected = levelSnap?.context.coinsCollected ?? 0;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--site-bg)] px-4 pb-8 pt-24 text-[var(--site-text)]">
      {/* HUD */}
      <div className="mb-4 flex w-full max-w-[800px] items-center justify-between">
        <div className="flex gap-6">
          <span className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">
            {"Score: "}
            {gameCtx.score}
          </span>
          <span className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">
            {"Coins: "}
            {coinsCollected}
          </span>
          <span className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">
            {"Lives: "}
            {gameCtx.lives}
          </span>
          <span className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-muted)]">
            {"Level: "}
            {gameCtx.level}
          </span>
        </div>
        {gameState === "paused" && (
          <span className="font-code text-xs uppercase tracking-widest text-[var(--site-muted)]">
            {"Paused"}
          </span>
        )}
      </div>

      {/* Phaser canvas */}
      <div
        className="relative w-full max-w-[800px] border border-[var(--site-border)]"
        ref={containerRef}
      >
        {/* Overlay screens */}
        {gameState === "menu" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/70">
            <h1 className="font-display text-2xl font-bold tracking-widest text-white">
              {"Super Mario Clone"}
            </h1>
            <p className="font-code text-xs uppercase tracking-widest text-[var(--site-muted)]">
              {"Built with XState v5 + Phaser 3"}
            </p>
            <button
              className={btnAccentClass}
              onClick={() => send({ type: "START" })}
              type="button"
            >
              {"Start Game"}
            </button>
          </div>
        )}

        {gameState === "paused" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/60">
            <p className="font-code text-sm uppercase tracking-widest text-white">{"Paused"}</p>
            <div className="flex gap-3">
              <button
                className={btnAccentClass}
                onClick={() => send({ type: "RESUME" })}
                type="button"
              >
                {"Resume"}
              </button>
              <button
                className={btnClass}
                onClick={() => send({ type: "RESTART" })}
                type="button"
              >
                {"Quit"}
              </button>
            </div>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/80">
            <p className="font-code text-lg uppercase tracking-widest text-red-400">{"Game Over"}</p>
            <p className="font-code text-xs tracking-widest text-[var(--site-muted)]">
              {"Final score: "}
              {gameCtx.score}
            </p>
            <button
              className={btnAccentClass}
              onClick={() => send({ type: "RESTART" })}
              type="button"
            >
              {"Play Again"}
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex w-full max-w-[800px] flex-col gap-2">
        {gameState === "playing" && (
          <div className="flex gap-3">
            <button
              className={btnClass}
              onClick={() => send({ type: "PAUSE" })}
              type="button"
            >
              {"Pause"}
            </button>
          </div>
        )}

        <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
          {"← → Arrow keys or A/D to move · ↑ / W / Space to jump · ↓ / S to crouch · P or Esc to pause"}
        </p>

        <p className="font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
          {"Stomp enemies · Collect coins & power-ups · Reach the flagpole"}
        </p>
      </div>
    </div>
  );
}

// ─── Static level enemy position data (mirrors gameMachine LEVEL_ENEMIES) ────

function getLevelEnemyConfigs(level: number) {
  const configs: Record<number, { id: string; type: "goomba" | "koopa"; x: number; y: number }[]> = {
    1: [
      { id: "g1", type: "goomba", x: 580, y: 368 },
      { id: "g2", type: "goomba", x: 780, y: 368 },
      { id: "k1", type: "koopa", x: 1100, y: 360 },
      { id: "g3", type: "goomba", x: 1600, y: 368 },
      { id: "g4", type: "goomba", x: 1900, y: 368 },
      { id: "k2", type: "koopa", x: 2300, y: 360 },
      { id: "g5", type: "goomba", x: 2600, y: 368 },
    ],
  };
  return configs[level] ?? configs[1]!;
}
