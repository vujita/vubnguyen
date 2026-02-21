"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { env } from "@vujita/vubnguyen/src/env.mjs";
import { initAmplitude, trackPageView } from "@vujita/vubnguyen/src/lib/amplitude";

export function AmplitudeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    const apiKey = env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (!apiKey) return;

    if (!initialized.current) {
      initAmplitude(apiKey);
      initialized.current = true;
    }

    trackPageView(pathname);
  }, [pathname]);

  return <>{children}</>;
}
