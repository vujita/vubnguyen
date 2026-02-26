"use client";

import Link from "next/link";
import { useMachine } from "@xstate/react";
import { matchSorter } from "match-sorter";
import Highlight from "src/components/Highlight";
import { blogFilterMachine } from "src/machines/blogFilterMachine";

import { formatDate, postHref, type PostMeta } from "@vujita/vubnguyen/src/lib/posts";

interface SearchablePostsProps {
  posts: PostMeta[];
}

export default function SearchablePosts({ posts }: SearchablePostsProps) {
  const [snapshot, send] = useMachine(blogFilterMachine);

  const { query, selectedTags } = snapshot.context;
  const isFiltering = snapshot.matches({ tagFilter: "filtering" });

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  const textFiltered =
    query.trim() === ""
      ? posts
      : matchSorter(posts, query, {
          keys: ["title", "description", "tags"],
          threshold: matchSorter.rankings.CONTAINS,
        });

  const filtered = selectedTags.length === 0 ? textFiltered : textFiltered.filter((p) => selectedTags.some((t) => p.tags.includes(t)));

  return (
    <>
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                aria-pressed={active}
                className={["font-code cursor-pointer rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors duration-150", active ? "bg-[var(--site-accent)] text-[var(--site-bg)]" : "bg-[var(--site-surface)] text-[var(--site-muted)] hover:text-[var(--site-text)]"].join(" ")}
                key={tag}
                onClick={() => send({ type: "TOGGLE_TAG", tag })}
                type="button"
              >
                {tag}
              </button>
            );
          })}
          {isFiltering && (
            <button
              className="font-code cursor-pointer text-[10px] uppercase tracking-widest text-[var(--site-muted)] underline underline-offset-2 transition-colors duration-150 hover:text-[var(--site-accent)]"
              onClick={() => send({ type: "CLEAR_ALL" })}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Text search */}
      <div className="mb-10">
        <input
          aria-label="Search posts"
          className="font-code w-full border-b border-[var(--site-border)] bg-transparent py-3 text-sm text-[var(--site-text)] placeholder-[var(--site-muted)] outline-none transition-colors duration-200 focus:border-[var(--site-accent)]"
          onChange={(e) => send({ type: "SET_QUERY", query: e.target.value })}
          placeholder="Search by title, topic, or tag…"
          type="search"
          value={query}
        />
      </div>

      {/* Post list */}
      <div className="divide-y divide-[var(--site-border)]">
        {filtered.length === 0 ? (
          <p className="font-code py-10 text-sm text-[var(--site-muted)]">
            {"\u201cNo posts matched \u201c"}
            {query || selectedTags.join(", ")}
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
                        {post.tags.map((tag) => {
                          const active = selectedTags.includes(tag);
                          return (
                            <button
                              aria-pressed={active}
                              className={["font-code cursor-pointer rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors duration-150", active ? "bg-[var(--site-accent)] text-[var(--site-bg)]" : "bg-[var(--site-surface)] text-[var(--site-muted)] hover:text-[var(--site-text)]"].join(" ")}
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                send({ type: "TOGGLE_TAG", tag });
                              }}
                              type="button"
                            >
                              <Highlight
                                query={query}
                                text={tag}
                              />
                            </button>
                          );
                        })}
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
