import { type Route } from "next";

export interface PostMeta {
  date: string;
  description: string;
  slug: string;
  tags: string[];
  title: string;
}

export function postHref(slug: string): Route<`/blog/${string}`> {
  return `/blog/${encodeURIComponent(slug)}` as Route<`/blog/${string}`>;
}

export const allPosts: PostMeta[] = [
  {
    date: "2026-02-26",
    description:
      "I attend a lot of meetings. Without a system, they evaporate. Here's how I use Granola, Obsidian, Dataview, and Claude to make every meeting searchable, queryable, and actually useful.",
    slug: "obsidian-granola-notes",
    tags: ["productivity", "obsidian", "ai", "note-taking", "workflow"],
    title: "My Granola + Obsidian Setup for Staying Organized",
  },
  {
    date: "2026-02-25",
    description: "LLM agents drift. They hold contradictory beliefs, wander into undefined transitions, and silently declare victory. State machines are how you stop that.",
    slug: "agentic-state-machines",
    tags: ["ai", "engineering", "architecture", "agentic", "state-machines"],
    title: "Agentic Systems Need State Machines",
  },
  {
    date: "2026-02-22",
    description: "The narrative that SaaS is dying has overcorrected. Some of the pessimism is warranted — but conflating a discipline cycle with a model failure leads builders to abandon durable ideas.",
    slug: "saas-market-correction",
    tags: ["saas", "startups", "engineering", "business", "market"],
    title: "The SaaS Overcorrection",
  },
  {
    date: "2026-02-22",
    description: "AI is generating code faster than we can reason about it. The old playbook for managing tech debt — stop, clean up, resume — is no longer enough.",
    slug: "tech-debt-in-the-ai-era",
    tags: ["ai", "engineering", "tech-debt", "architecture"],
    title: "Tech Debt in the Age of AI",
  },
  {
    date: "2026-02-20",
    description: "The rules of the market have changed. Productivity is now the primary competitive lever — and great DX is how you pull it.",
    slug: "dx-for-the-ai-era",
    tags: ["dx", "engineering", "productivity", "ai", "startups"],
    title: "Optimizing Developer Experience for Today",
  },
  {
    date: "2026-02-20",
    description: "Generative AI is collapsing the cost of writing code. The bottleneck is shifting — and so should your architecture.",
    slug: "ai-coding-paradigm",
    tags: ["ai", "engineering", "architecture", "dx"],
    title: "The Shifting Paradigm of Coding in the Age of AI",
  },
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });
}
