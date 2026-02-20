import { type FC } from "react";
import Link from "next/link";

import ThemeSwitcher from "@vujita/vubnguyen/src/components/theme-switcher";

export const Header: FC = () => {
  return (
    <header className="header-bg fixed top-0 z-50 w-full border-b border-[var(--site-border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-5">
        <Link
          className="font-display text-xs uppercase tracking-[0.15em] whitespace-nowrap text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-text)] sm:tracking-[0.25em]"
          href="/"
        >
          {"Vu Nguyen"}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <Link
            className="font-code text-xs uppercase tracking-[0.1em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)] sm:tracking-[0.2em]"
            href="/work"
          >
            {"Work"}
          </Link>
          <Link
            className="font-code text-xs uppercase tracking-[0.1em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)] sm:tracking-[0.2em]"
            href="/writing"
          >
            {"Writing"}
          </Link>
          <Link
            className="font-code text-xs uppercase tracking-[0.1em] text-[var(--site-muted)] transition-colors duration-200 hover:text-[var(--site-accent)] sm:tracking-[0.2em]"
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
