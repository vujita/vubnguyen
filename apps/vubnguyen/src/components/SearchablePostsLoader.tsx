"use client";

import dynamic from "next/dynamic";

import { type PostMeta } from "@vujita/vubnguyen/src/lib/posts";

const SearchablePosts = dynamic<{ posts: PostMeta[] }>(() => import("src/components/SearchablePosts"), {
  loading: () => (
    <div className="divide-y divide-[var(--site-border)]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          className="py-10"
          // eslint-disable-next-line react/no-array-index-key
          key={i}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
            <div className="h-3 w-28 animate-pulse rounded-sm bg-[var(--site-surface)]" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-2/3 animate-pulse rounded-sm bg-[var(--site-surface)]" />
              <div className="h-3 w-full animate-pulse rounded-sm bg-[var(--site-surface)]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  ssr: false,
});

export default function SearchablePostsLoader({ posts }: { posts: PostMeta[] }) {
  return <SearchablePosts posts={posts} />;
}
