import Link from "next/link";

import { allPosts, formatDate, postHref } from "@vujita/vubnguyen/src/lib/posts";

export const metadata = {
  description: "Essays and notes on engineering, systems, and leadership.",
  title: "Writing — Vu Nguyen",
};

export default function WritingPage() {
  const posts = allPosts;

  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <section className="min-h-screen px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">{"Writing"}</p>
          <h1 className="font-display mb-16 text-[clamp(48px,8vw,96px)] font-bold italic leading-none tracking-tight text-[var(--site-text)]">
            {"Essays &"}
            <br />
            {"Notes."}
          </h1>

          <div className="divide-y divide-[var(--site-border)]">
            {posts.map((post) => (
              <article
                className="group py-10"
                key={post.slug}
              >
                <Link
                  className="block"
                  href={postHref(post.slug)}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
                    <time className="font-code shrink-0 text-xs tracking-widest text-[var(--site-muted)]">{formatDate(post.date)}</time>
                    <div className="flex-1">
                      <h2 className="font-display mb-2 text-2xl font-bold italic leading-snug text-[var(--site-text)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">{post.title}</h2>
                      <p className="text-sm leading-relaxed text-[var(--site-muted)]">{post.description}</p>
                      {post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              className="font-code rounded-sm bg-[var(--site-surface)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--site-muted)]"
                              key={tag}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="hidden shrink-0 text-[var(--site-muted)] transition-colors duration-200 group-hover:text-[var(--site-accent)] sm:block">{"→"}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
