import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description: "Side projects and experiments by Vu Nguyen.",
  title: "Projects — Vu Nguyen",
};

const projects = [
  {
    description: "Classic Snake built with XState v5 state machines and Phaser 3 for rendering. Playable in the browser with keyboard, D-pad, and swipe controls.",
    href: "/games/snake",
    label: "Snake",
    tags: ["XState", "Phaser 3", "TypeScript"],
  },
  {
    description: "Classic Space Invaders built with XState v5 state machines and Phaser 3 for rendering. Pixel-art invaders, UFO mystery ship, destructible shields, and progressive difficulty. Fully playable on mobile with on-screen controls.",
    href: "/games/space-invaders",
    label: "Space Invaders",
    tags: ["XState", "Phaser 3", "TypeScript", "Mobile"],
  },
] as const;

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

          <div>
            {projects.map((project) => (
              <div
                className="group border-t border-[var(--site-border)] py-10"
                key={project.href}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <Link href={project.href}>
                      <h2 className="font-display text-2xl font-semibold text-[var(--site-text)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">{project.label}</h2>
                    </Link>
                    <p className="mt-4 max-w-[40rem] text-sm leading-relaxed text-[var(--site-muted)]">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          className="font-code border border-[var(--site-border)] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[var(--site-muted)]"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    className="font-code mt-1 whitespace-nowrap text-xs uppercase tracking-[0.15em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)] md:mt-0.5"
                    href={project.href}
                  >
                    {"Play →"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
