import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description: "Side projects and experiments by Vu Nguyen.",
  title: "Projects — Vu Nguyen",
};

interface Project {
  description: string;
  href: string;
  stack: string[];
  title: string;
}

const projects: Project[] = [
  {
    description: "A browser-based 3-reel slot machine built with Phaser 3. Weighted symbol strips, configurable paylines, jackpot detection, and animated spinning reels — all driven by pure TypeScript game logic with full unit test coverage.",
    href: "/projects/casino-slots",
    stack: ["Phaser 3", "TypeScript", "React", "Next.js"],
    title: "Casino Slot Machine",
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <section className="min-h-screen px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"Projects"}</p>
          <h1 className="font-display mb-16 text-[clamp(48px,8vw,96px)] font-bold italic leading-none tracking-tight text-[var(--site-text)]">
            {"Side"}
            <br />
            {"Projects."}
          </h1>

          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                className="group block border border-[var(--site-border)] p-8 transition-colors duration-200 hover:border-[var(--site-accent)]"
                href={project.href}
                key={project.title}
              >
                <h2 className="font-display mb-3 text-xl font-semibold text-[var(--site-text)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">{project.title}</h2>
                <p className="mb-6 text-sm leading-relaxed text-[var(--site-muted)]">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      className="font-code border border-[var(--site-border)] px-3 py-1 text-xs uppercase tracking-[0.1em] text-[var(--site-muted)]"
                      key={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
