import { type Route } from "next";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

import Signature from "@vujita/vubnguyen/src/components/signature";
import { allPosts, formatDate, postHref } from "@vujita/vubnguyen/src/lib/posts";

const siteMap: { description: string; href: Route; section: string }[] = [
  {
    description: "Experience, roles, and expertise across distributed systems and platform engineering.",
    href: "/work",
    section: "01 / Work",
  },
  {
    description: "Essays and notes on engineering craft, systems thinking, and technical leadership.",
    href: "/writing",
    section: "02 / Writing",
  },
  {
    description: "Get in touch for collaboration, speaking, or just to say hello.",
    href: "/contact",
    section: "03 / Contact",
  },
];

export default function HomePage() {
  const recentPosts = allPosts.slice(0, 3);

  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="flex min-h-screen flex-col justify-center px-6 pt-24">
        <div className="mx-auto w-full max-w-5xl">
          <p className="anim-label font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"— Staff Engineer · Amplitude Analytics"}</p>

          <h1 className="anim-name font-display text-[clamp(72px,13vw,148px)] font-bold italic leading-none tracking-tight text-[var(--site-text)]">
            <Signature className="block h-36 w-auto sm:h-44" />
            {"Nguyen"}
          </h1>

          <div className="anim-sig anim-bio mt-10">
            <p className="font-display max-w-[28rem] text-xl font-light italic leading-relaxed text-[var(--site-muted)]">{"Building systems that scale. Leading teams that ship. Writing code that lasts."}</p>
          </div>
        </div>
      </section>

      {/* ─── SITEMAP ──────────────────────────────────────── */}
      <section className="border-t border-[var(--site-border)] px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-code mb-12 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"— Site Map"}</p>
          <div className="grid grid-cols-1 gap-px border border-[var(--site-border)] bg-[var(--site-border)] sm:grid-cols-3">
            {siteMap.map((item) => (
              <Link
                className="group flex flex-col justify-between gap-8 bg-[var(--site-bg)] p-8 transition-colors duration-200 hover:bg-[var(--site-surface)]"
                href={item.href}
                key={item.href}
              >
                <div>
                  <p className="font-code mb-4 text-[10px] uppercase tracking-widest text-[var(--site-accent)]">{item.section}</p>
                  <p className="text-sm leading-relaxed text-[var(--site-muted)]">{item.description}</p>
                </div>
                <span className="text-[var(--site-muted)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">{"→"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENT WRITING ───────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="border-t border-[var(--site-border)] px-6 py-24">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-12 flex items-baseline justify-between">
              <p className="font-code text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"— Recent Writing"}</p>
              <Link
                className="font-code text-xs uppercase tracking-widest text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
                href="/writing"
              >
                {"All posts →"}
              </Link>
            </div>

            <div className="divide-y divide-[var(--site-border)]">
              {recentPosts.map((post) => (
                <Link
                  className="group flex flex-col gap-1 py-8 sm:flex-row sm:items-baseline sm:gap-8"
                  href={postHref(post.slug)}
                  key={post.slug}
                >
                  <time className="font-code shrink-0 text-xs tracking-widest text-[var(--site-muted)]">{formatDate(post.date)}</time>
                  <h3 className="font-display flex-1 text-xl font-bold italic text-[var(--site-text)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">{post.title}</h3>
                  <span className="hidden shrink-0 text-[var(--site-muted)] transition-colors duration-200 group-hover:text-[var(--site-accent)] sm:block">{"→"}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
