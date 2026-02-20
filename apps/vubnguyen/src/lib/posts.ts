import { type Route } from "next";

export interface PostMeta {
  date: string;
  description: string;
  slug: string;
  tags: string[];
  title: string;
}

export function postHref(slug: string): Route<`/writing/${string}`> {
  return `/writing/${encodeURIComponent(slug)}` as Route<`/writing/${string}`>;
}

export const allPosts: PostMeta[] = [
  {
    date: "2026-02-20",
    description:
      "The rules of the market have changed. Productivity is now the primary competitive lever — and great DX is how you pull it.",
    slug: "dx-for-the-ai-era",
    tags: ["dx", "engineering", "productivity", "ai", "startups"],
    title: "Optimizing Developer Experience for Today",
  },
  {
    date: "2026-02-20",
    description:
      "Generative AI is collapsing the cost of writing code. The bottleneck is shifting — and so should your architecture.",
    slug: "ai-coding-paradigm",
    tags: ["ai", "engineering", "architecture", "dx"],
    title: "The Shifting Paradigm of Coding in the Age of AI",
  },
  {
    date: "2024-11-15",
    description: "Lessons learned from scaling analytics infrastructure to handle billions of events per day — and the engineering principles that made it possible.",
    slug: "building-systems-that-scale",
    tags: ["distributed-systems", "engineering", "platform"],
    title: "Building Systems That Scale",
  },
  {
    date: "2024-09-03",
    description: "What I have learned about technical leadership — the parts no one tells you about when you transition from individual contributor to staff engineer.",
    slug: "on-leading-engineering-teams",
    tags: ["leadership", "engineering", "team"],
    title: "On Leading Engineering Teams",
  },
  {
    date: "2024-06-20",
    description: "Code is read far more than it is written. The choices you make today will be debugged by someone at 2am three years from now — make their life easier.",
    slug: "writing-code-that-lasts",
    tags: ["engineering", "craft", "code-quality"],
    title: "Writing Code That Lasts",
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
