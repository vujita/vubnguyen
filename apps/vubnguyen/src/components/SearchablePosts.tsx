"use client";

import { useState } from "react";
import Link from "next/link";
import { matchSorter } from "match-sorter";
import Highlight from "src/components/Highlight";

import { formatDate, postHref, type PostMeta } from "@vujita/vubnguyen/src/lib/posts";

interface SearchablePostsProps {
  posts: PostMeta[];
}

export default function SearchablePosts({ posts }: SearchablePostsProps) {
  const [query, setQuery] = useState("");

  const filtered =
    query.trim() === ""
      ? posts
      : matchSorter(posts, query, {
          keys: ["title", "description", "tags"],
          threshold: matchSorter.rankings.CONTAINS,
        });

  return (
    <>
      <div className="mb-10">
        <input
          aria-label="Search posts"
          className="font-code w-full border-b border-[var(--site-border)] bg-transparent py-3 text-sm text-[var(--site-text)] placeholder-[var(--site-muted)] outline-none transition-colors duration-200 focus:border-[var(--site-accent)]"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, topic, or tag…"
          type="search"
          value={query}
        />
      </div>

      <div className="divide-y divide-[var(--site-border)]">
        {filtered.length === 0 ? (
          <p className="font-code py-10 text-sm text-[var(--site-muted)]">
            {"\u201cNo posts matched \u201c"}
            {query}
            {"\u201d."}
          </p>
        ) : (
          filtered.map((post) => (
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
                    <h2 className="font-display mb-2 text-2xl font-bold italic leading-snug text-[var(--site-text)] transition-colors duration-200 group-hover:text-[var(--site-accent)]">
                      <Highlight
                        query={query}
                        text={post.title}
                      />
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--site-muted)]">
                      <Highlight
                        query={query}
                        text={post.description}
                      />
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            className="font-code rounded-sm bg-[var(--site-surface)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--site-muted)]"
                            key={tag}
                          >
                            <Highlight
                              query={query}
                              text={tag}
                            />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="hidden shrink-0 text-[var(--site-muted)] transition-colors duration-200 group-hover:text-[var(--site-accent)] sm:block">{"→"}</span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </>
  );
}
