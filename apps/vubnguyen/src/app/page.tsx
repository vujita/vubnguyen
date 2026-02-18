import { Github, Linkedin, Twitter } from "lucide-react";

import Signature from "@vujita/vubnguyen/src/components/signature";

export default function HomePage() {
  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="flex min-h-screen flex-col justify-center px-6 pt-24">
        <div className="mx-auto w-full max-w-5xl">
          <p className="anim-label font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">— Staff Engineer · Amplitude Analytics</p>

          <h1
            className="anim-name font-display font-bold italic leading-none tracking-tight text-[var(--site-text)]"
            style={{ fontSize: "clamp(72px, 13vw, 148px)" }}
          >
            Vu
            <br />
            Nguyen
          </h1>

          <div className="anim-sig mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-16">
            <Signature className="h-36 w-auto shrink-0 sm:h-44" />
            <div className="anim-bio">
              <p
                className="font-display text-xl font-light italic leading-relaxed text-[var(--site-muted)]"
                style={{ maxWidth: "28rem" }}
              >
                Building systems that scale. Leading teams that ship. Writing code that lasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER / CONTACT ─────────────────────────────── */}
      <footer
        id="contact"
        className="border-t border-[var(--site-border)] px-6 py-12"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="font-display text-sm italic text-[var(--site-muted)]">Vu Nguyen &mdash; vubnguyen.com</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/vujita"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/vu-nguyen-462b29a/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/Vu_Man_Chu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
