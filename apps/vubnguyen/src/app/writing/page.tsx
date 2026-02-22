import SearchablePostsLoader from "src/components/SearchablePostsLoader";

import { allPosts } from "@vujita/vubnguyen/src/lib/posts";

export const metadata = {
  description: "Essays and notes on engineering, systems, and leadership.",
  title: "Writing — Vu Nguyen",
};

export default function WritingPage() {
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

          <SearchablePostsLoader posts={allPosts} />
        </div>
      </section>
    </div>
  );
}
