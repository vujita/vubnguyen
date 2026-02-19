import { type FC } from "react";
import Link from "next/link";

import ThemeSwitcher from "@vujita/vubnguyen/src/components/theme-switcher";

export const Header: FC = () => {
  return (
    <header className="header-bg fixed top-0 z-50 w-full border-b border-[var(--site-border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          className="font-display text-xs uppercase tracking-[0.25em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-text)]"
          href="/"
        >
          {"Vu Nguyen"}
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            href="/work"
          >
            {"Work"}
          </Link>
          <Link
            className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            href="/writing"
          >
            {"Writing"}
          </Link>
          <Link
            className="font-code text-xs uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)]"
            href="/contact"
          >
            {"Contact"}
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};
