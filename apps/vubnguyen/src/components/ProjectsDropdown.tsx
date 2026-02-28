"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PROJECTS = [{ href: "/games/snake", label: "Snake" }] as const;

const linkClass = "font-code block px-4 py-2 text-xs uppercase tracking-[0.1em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]";

export function ProjectsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
    >
      <button
        className="font-code text-xs uppercase tracking-[0.1em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)] sm:tracking-[0.2em]"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {"Projects"}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-10 mt-2 min-w-[120px] border border-[var(--site-border)] bg-[var(--site-surface)] py-1">
          {PROJECTS.map(({ href, label }) => (
            <Link
              className={linkClass}
              href={href}
              key={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
