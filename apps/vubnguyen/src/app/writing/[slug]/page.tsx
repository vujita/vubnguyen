import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { formatDate, getAllPostMeta, getPostBySlug } from "@vujita/vubnguyen/src/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllPostMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    description: post.description,
    title: `${post.title} — Vu Nguyen`,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[var(--site-bg)] text-[var(--site-text)]">
      <article className="min-h-screen px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-2xl">
          {/* Back link */}
          <Link
            className="font-code mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            href="/writing"
          >
            {"← Writing"}
          </Link>

          {/* Header */}
          <header className="mb-12 mt-8">
            <time className="font-code mb-4 block text-xs tracking-widest text-[var(--site-muted)]">{formatDate(post.date)}</time>
            <h1 className="font-display mb-6 text-[clamp(36px,6vw,64px)] font-bold italic leading-tight tracking-tight text-[var(--site-text)]">{post.title}</h1>
            <p className="text-lg leading-relaxed text-[var(--site-muted)]">{post.description}</p>
            {post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
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
          </header>

          <hr className="mb-12 border-[var(--site-border)]" />

          {/* Content */}
          <div className="prose-blog">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

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
