import { Github, Linkedin, Twitter } from "lucide-react";

import Signature from "@vujita/vubnguyen/src/components/signature";

export default function HomePage() {
  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="flex min-h-screen flex-col justify-center px-6 pt-24">
        <div className="mx-auto w-full max-w-5xl">
          <p className="anim-label font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"— Staff Engineer · Amplitude Analytics"}</p>

          <h1 className="anim-name font-display text-[clamp(72px,13vw,148px)] font-bold italic leading-none tracking-tight text-[var(--site-text)]">
            {"Vu"}
            <br />
            {"Nguyen"}
          </h1>

          <div className="anim-sig mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-16">
            <Signature className="h-36 w-auto shrink-0 sm:h-44" />
            <div className="anim-bio">
              <p className="font-display max-w-[28rem] text-xl font-light italic leading-relaxed text-[var(--site-muted)]">{"Building systems that scale. Leading teams that ship. Writing code that lasts."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER / CONTACT ─────────────────────────────── */}
      <footer
        className="border-t border-[var(--site-border)] px-6 py-12"
        id="contact"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="font-display text-sm italic text-[var(--site-muted)]">{"Vu Nguyen \u2014 vubnguyen.com"}</p>
          <div className="flex items-center gap-6">
            <a
              aria-label="GitHub"
              className="text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
              href="https://github.com/vujita"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              aria-label="LinkedIn"
              className="text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
              href="https://www.linkedin.com/in/vu-nguyen-462b29a/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              aria-label="Twitter"
              className="text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
              href="https://twitter.com/Vu_Man_Chu"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
