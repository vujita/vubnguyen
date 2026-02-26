export default function TechDebtChart() {
  return (
    <figure className="my-10 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-8">
      <svg
        aria-label="Chart showing code generation rate (steep upward curve) rapidly outpacing code review rate (shallow curve), with the growing gap representing accumulating tech debt"
        className="mx-auto block w-full max-w-[520px]"
        fill="none"
        viewBox="0 0 520 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Filled gap: tech debt area ── */}
        <path
          d="M 50,155 C 200,148 360,78 480,22 L 480,112 C 360,135 200,153 50,155 Z"
          fill="var(--site-accent)"
          fillOpacity="0.07"
        />

        {/* ── Subtle horizontal grid ── */}
        <line
          stroke="var(--site-border)"
          strokeOpacity="0.6"
          strokeWidth="0.75"
          x1="50"
          x2="484"
          y1="60"
          y2="60"
        />
        <line
          stroke="var(--site-border)"
          strokeOpacity="0.6"
          strokeWidth="0.75"
          x1="50"
          x2="484"
          y1="110"
          y2="110"
        />

        {/* ── Code reviewed (lower, flatter curve) ── */}
        <path
          d="M 50,155 C 200,153 360,135 480,112"
          stroke="var(--site-muted)"
          strokeWidth="2"
        />

        {/* ── Code generated (upper, steep curve) ── */}
        <path
          d="M 50,155 C 200,148 360,78 480,22"
          stroke="var(--site-accent)"
          strokeWidth="2.25"
        />

        {/* ── Axes ── */}
        <line
          stroke="var(--site-border)"
          strokeWidth="1.5"
          x1="50"
          x2="50"
          y1="15"
          y2="165"
        />
        <line
          stroke="var(--site-border)"
          strokeWidth="1.5"
          x1="45"
          x2="488"
          y1="165"
          y2="165"
        />

        {/* Axis arrowheads */}
        <path
          d="M 46,19 L 50,13 L 54,19"
          stroke="var(--site-border)"
          strokeWidth="1.5"
        />
        <path
          d="M 483,161 L 489,165 L 483,169"
          stroke="var(--site-border)"
          strokeWidth="1.5"
        />

        {/* ── Y axis label ── */}
        <text
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.07em"
          textAnchor="middle"
          transform="rotate(-90 16 90)"
          x="16"
          y="90"
        >
          CODE VOLUME
        </text>

        {/* ── X axis label ── */}
        <text
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.07em"
          textAnchor="middle"
          x="267"
          y="182"
        >
          TIME
        </text>

        {/* ── Curve labels ── */}
        <text
          fill="var(--site-accent)"
          fontFamily="ui-monospace, monospace"
          fontSize="8.5"
          letterSpacing="0.05em"
          textAnchor="end"
          x="478"
          y="17"
        >
          code generated
        </text>
        <text
          fill="var(--site-muted)"
          fontFamily="ui-monospace, monospace"
          fontSize="8.5"
          letterSpacing="0.05em"
          textAnchor="end"
          x="478"
          y="128"
        >
          code reviewed
        </text>

        {/* ── "tech debt" label in the gap ── */}
        <text
          fill="var(--site-accent)"
          fillOpacity="0.55"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.07em"
          textAnchor="middle"
          x="340"
          y="64"
        >
          ↑ TECH DEBT ↑
        </text>
      </svg>
      <figcaption className="font-code mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--site-muted)]">AI tools accelerate code generation far beyond the rate at which code can be reviewed and understood</figcaption>
    </figure>
  );
}
