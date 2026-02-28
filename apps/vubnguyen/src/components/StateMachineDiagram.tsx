"use client";

import { useEffect, useRef } from "react";

const DEFAULT_DIAGRAM = `stateDiagram-v2
  direction LR
  [*] --> IDLE
  IDLE --> PLANNING
  PLANNING --> EXECUTING
  EXECUTING --> VERIFYING
  VERIFYING --> COMPLETE
  EXECUTING --> FAILED : error
  COMPLETE --> [*]
  FAILED --> [*]`;

const DEFAULT_CAPTION = "The system is always in exactly one state — transitions are enforced by the orchestration layer, not inferred by the model";

interface Props {
  caption?: string;
  diagram?: string;
}

export default function StateMachineDiagram({ caption = DEFAULT_CAPTION, diagram = DEFAULT_DIAGRAM }: Props) {
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
      const { svg } = await mermaid.render(id, diagram);

      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [diagram]);

  return (
    <figure className="my-6 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-6">
      <div
        className="mx-auto w-full max-w-[640px] overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
        ref={containerRef}
      />
      <figcaption className="font-code mt-3 text-center text-[10px] uppercase tracking-widest text-[var(--site-muted)]">{caption}</figcaption>
    </figure>
  );
}
