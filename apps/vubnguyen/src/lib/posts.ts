import { type Route } from "next";

export interface PostMeta {
  date: string;
  description: string;
  href: Route;
  slug: string;
  tags: string[];
  title: string;
}

export const allPosts: PostMeta[] = [
  {
    date: "2024-11-15",
    description: "Lessons learned from scaling analytics infrastructure to handle billions of events per day — and the engineering principles that made it possible.",
    href: "/writing/building-systems-that-scale",
    slug: "building-systems-that-scale",
    tags: ["distributed-systems", "engineering", "platform"],
    title: "Building Systems That Scale",
  },
  {
    date: "2024-09-03",
    description: "What I have learned about technical leadership — the parts no one tells you about when you transition from individual contributor to staff engineer.",
    href: "/writing/on-leading-engineering-teams",
    slug: "on-leading-engineering-teams",
    tags: ["leadership", "engineering", "team"],
    title: "On Leading Engineering Teams",
  },
  {
    date: "2024-06-20",
    description: "Code is read far more than it is written. The choices you make today will be debugged by someone at 2am three years from now — make their life easier.",
    href: "/writing/writing-code-that-lasts",
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
