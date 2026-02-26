export default function StateMachineDiagram() {
  return (
    <figure className="my-10 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-8">
      <svg
        aria-label="State machine diagram: IDLE → PLANNING → EXECUTING → VERIFYING → COMPLETE, with FAILED as a terminal error state reachable from EXECUTING"
        className="mx-auto block w-full max-w-[550px]"
        fill="none"
        viewBox="0 0 550 190"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="sm-ah"
            markerHeight="5"
            markerWidth="5"
            orient="auto"
            refX="4.5"
            refY="2.5"
            viewBox="0 0 5 5"
          >
            <path d="M0,0.5 L4.5,2.5 L0,4.5 Z" fill="var(--site-border)" />
          </marker>
        </defs>

        {/* ── Horizontal arrows ── */}
        <line markerEnd="url(#sm-ah)" stroke="var(--site-border)" strokeWidth="1.5" x1="106" x2="126" y1="75" y2="75" />
        <line markerEnd="url(#sm-ah)" stroke="var(--site-border)" strokeWidth="1.5" x1="212" x2="232" y1="75" y2="75" />
        <line markerEnd="url(#sm-ah)" stroke="var(--site-border)" strokeWidth="1.5" x1="318" x2="338" y1="75" y2="75" />
        <line markerEnd="url(#sm-ah)" stroke="var(--site-border)" strokeWidth="1.5" x1="424" x2="444" y1="75" y2="75" />

        {/* ── EXECUTING → FAILED (dashed, vertical) ── */}
        <line
          markerEnd="url(#sm-ah)"
          stroke="var(--site-border)"
          strokeDasharray="4 2.5"
          strokeWidth="1.5"
          x1="275"
          x2="275"
          y1="92"
          y2="147"
        />
        <text
          dominantBaseline="middle"
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="7.5"
          letterSpacing="0.06em"
          textAnchor="middle"
          x="300"
          y="120"
        >
          error
        </text>

        {/* ── State: IDLE ── */}
        <rect fill="var(--site-bg)" height="34" rx="5" stroke="var(--site-border)" strokeWidth="1.5" width="86" x="20" y="58" />
        <text
          dominantBaseline="middle"
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          letterSpacing="0.08em"
          textAnchor="middle"
          x="63"
          y="75"
        >
          IDLE
        </text>

        {/* ── State: PLANNING ── */}
        <rect fill="var(--site-bg)" height="34" rx="5" stroke="var(--site-border)" strokeWidth="1.5" width="86" x="126" y="58" />
        <text
          dominantBaseline="middle"
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          letterSpacing="0.08em"
          textAnchor="middle"
          x="169"
          y="75"
        >
          PLANNING
        </text>

        {/* ── State: EXECUTING (active, accent-highlighted) ── */}
        <rect fill="var(--site-surface)" height="34" rx="5" stroke="var(--site-accent)" strokeWidth="1.75" width="86" x="232" y="58" />
        <text
          dominantBaseline="middle"
          fill="var(--site-accent)"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.08em"
          textAnchor="middle"
          x="275"
          y="75"
        >
          EXECUTING
        </text>

        {/* ── State: VERIFYING ── */}
        <rect fill="var(--site-bg)" height="34" rx="5" stroke="var(--site-border)" strokeWidth="1.5" width="86" x="338" y="58" />
        <text
          dominantBaseline="middle"
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          letterSpacing="0.08em"
          textAnchor="middle"
          x="381"
          y="75"
        >
          VERIFYING
        </text>

        {/* ── State: COMPLETE (double-border terminal) ── */}
        <rect fill="var(--site-bg)" height="34" rx="5" stroke="var(--site-accent)" strokeWidth="2" width="86" x="444" y="58" />
        <rect fill="none" height="26" rx="3" stroke="var(--site-accent)" strokeOpacity="0.5" strokeWidth="0.75" width="78" x="448" y="62" />
        <text
          dominantBaseline="middle"
          fill="var(--site-accent)"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          fontWeight="600"
          letterSpacing="0.08em"
          textAnchor="middle"
          x="487"
          y="75"
        >
          COMPLETE
        </text>

        {/* ── State: FAILED (dashed-border terminal) ── */}
        <rect fill="var(--site-bg)" height="34" rx="5" stroke="var(--site-border)" strokeDasharray="5 2.5" strokeWidth="1.5" width="86" x="232" y="148" />
        <text
          dominantBaseline="middle"
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          letterSpacing="0.08em"
          textAnchor="middle"
          x="275"
          y="165"
        >
          FAILED
        </text>
      </svg>
      <figcaption className="mt-4 text-center font-code text-[10px] uppercase tracking-widest text-[var(--site-muted)]">
        The system is always in exactly one state — transitions are enforced by the orchestration layer, not inferred by the model
      </figcaption>
    </figure>
  );
}
