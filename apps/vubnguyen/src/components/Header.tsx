import { type FC } from "react";
import Link from "next/link";

import ThemeSwitcher from "@vujita/vubnguyen/src/components/theme-switcher";

export const Header: FC = () => {
  return (
    <header className="header-bg fixed top-0 z-50 w-full border-b border-[var(--site-border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xs uppercase tracking-[0.25em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-text)]"
        >
          Vu Nguyen
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/work"
            className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
          >
            Work
          </Link>
          <Link
            href="/writing"
            className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
          >
            Writing
          </Link>
          <Link
            href="/contact"
            className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
          >
            Contact
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};
