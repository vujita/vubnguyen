import { type ReactNode } from "react";
import Link from "next/link";

import { formatDate } from "@vujita/vubnguyen/src/lib/posts";

interface PostLayoutProps {
  children: ReactNode;
  date: string;
  description: string;
  tags: string[];
  title: string;
}

export default function PostLayout({ children, date, description, tags, title }: PostLayoutProps) {
  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <article className="min-h-screen px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-2xl">
          <Link
            className="font-code mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            href="/writing"
          >
            {"← Writing"}
          </Link>

          <header className="mb-12 mt-8">
            <time className="font-code mb-4 block text-xs tracking-widest text-[var(--site-muted)]">{formatDate(date)}</time>
            <h1 className="font-display mb-6 text-[clamp(36px,6vw,64px)] font-bold italic leading-tight tracking-tight text-[var(--site-text)]">{title}</h1>
            <p className="text-lg leading-relaxed text-[var(--site-muted)]">{description}</p>
            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    className="font-code rounded-sm bg-[var(--site-surface)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--site-muted)]"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <hr className="mb-12 border-[var(--site-border)]" />

          <div className="prose-blog">{children}</div>

          <hr className="mb-12 mt-16 border-[var(--site-border)]" />

          <Link
            className="font-code inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            href="/writing"
          >
            {"← Back to Writing"}
          </Link>
        </div>
      </article>
    </div>
  );
}
