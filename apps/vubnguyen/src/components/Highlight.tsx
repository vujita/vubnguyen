import { type ReactNode } from "react";

interface HighlightProps {
  query: string;
  text: string;
}

/**
 * Wraps substrings of `text` that match any word in `query` with a styled
 * <mark> element. Uses a capturing-group split so matched portions land at
 * odd indices in the resulting parts array.
 */
export default function Highlight({ text, query }: HighlightProps): ReactNode {
  const words = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            className="rounded-[2px] bg-[var(--site-accent)] px-0.5 text-[var(--site-bg)]"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            {part}
          </mark>
        ) : (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            {part}
          </span>
        ),
      )}
    </>
  );
}
