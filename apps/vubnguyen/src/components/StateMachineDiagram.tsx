"use client";

import { useEffect, useRef } from "react";

const DIAGRAM = `stateDiagram-v2
  direction LR
  [*] --> idle
  idle --> playing : START
  playing --> paused : PAUSE
  playing --> dead : TICK [willCollide]
  playing --> playing : TICK
  playing --> playing : STEER
  playing --> idle : RESET
  paused --> playing : RESUME
  paused --> idle : RESET
  dead --> idle : RESET`;

export default function StateMachineDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    void (async () => {
      const mermaid = (await import("mermaid")).default;
      if (cancelledRef.current) return;

      const s = getComputedStyle(document.documentElement);
      const css = (v: string) => s.getPropertyValue(v).trim();

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          background: css("--site-bg"),
          clusterBkg: css("--site-surface"),
          edgeLabelBackground: css("--site-bg"),
          fontFamily: "ui-monospace, monospace",
          fontSize: "13px",
          lineColor: css("--site-muted"),
          mainBkg: css("--site-surface"),
          nodeBorder: css("--site-border"),
          nodeTextColor: css("--site-muted"),
          primaryBorderColor: css("--site-border"),
          primaryColor: css("--site-surface"),
          primaryTextColor: css("--site-muted"),
        },
      });

      const id = `sm-${Math.random().toString(36).slice(2, 8)}`;
      const { svg } = await mermaid.render(id, DIAGRAM);

      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  return (
    <figure className="my-10 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-6">
      <div
        className="mx-auto w-full max-w-[640px] overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
        ref={containerRef}
      />
      <figcaption className="font-code mt-3 text-center text-[10px] uppercase tracking-widest text-[var(--site-muted)]">{"Snake game state machine — four states, six event types, every transition explicit"}</figcaption>
    </figure>
  );
}
