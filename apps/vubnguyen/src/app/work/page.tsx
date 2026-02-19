const experiences = [
  {
    company: "Amplitude Analytics",
    description: "Building core analytics infrastructure that powers data-driven decisions for thousands of companies globally. Leading technical direction across SDK, data pipeline, and platform engineering.",
    period: "Aug 2022 — Present",
    role: "Staff Software Engineer",
  },
  {
    company: "WalmartLabs",
    description: "Architected and scaled e-commerce platform systems serving millions of daily transactions. Defined engineering strategy and led cross-functional teams across distributed microservices and frontend platforms.",
    period: "Oct 2016 — Aug 2022",
    role: "Principal Software Engineer",
  },
  {
    company: "HP Autonomy",
    description: "Developed enterprise software and internal tooling across hardware and cloud product lines. Built full-stack systems supporting HP's global engineering organization.",
    period: "Oct 2010 — Jul 2015",
    role: "Software Engineer",
  },
] as const;

const skills = ["Distributed Systems", "Platform Engineering", "Frontend Architecture", "API Design", "Data Pipelines", "Technical Strategy", "Team Leadership", "Developer Experience"] as const;

export default function WorkPage() {
  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      {/* ─── EXPERIENCE ───────────────────────────────────── */}
      <section className="px-6 pb-28 pt-36">
        <div className="mx-auto max-w-5xl">
          <p className="font-code mb-14 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"01 / Experience"}</p>
          <div>
            {experiences.map((exp) => (
              <div
                className="group border-t border-[var(--site-border)] py-10"
                key={exp.company}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-semibold text-[var(--site-text)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">{exp.company}</h3>
                    <p className="font-code mt-1.5 text-xs uppercase tracking-[0.2em] text-[var(--site-muted)]">{exp.role}</p>
                    <p className="mt-5 max-w-[40rem] text-sm leading-relaxed text-[var(--site-muted)]">{exp.description}</p>
                  </div>
                  <p className="font-code whitespace-nowrap text-xs text-[var(--site-muted)] md:mt-0.5">{exp.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERTISE ────────────────────────────────────── */}
      <section className="border-t border-[var(--site-border)] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="font-code mb-14 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"02 / Expertise"}</p>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                className="font-code border border-[var(--site-border)] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[var(--site-muted)] transition-colors duration-200 hover:border-[var(--site-accent)] hover:text-[var(--site-accent)]"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
