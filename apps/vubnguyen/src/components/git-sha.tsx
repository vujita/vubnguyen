"use client";

import { useEffect, type FC } from "react";

declare global {
  interface Window {
    COMMIT_SHA?: string;
  }
}

export const GitSha: FC = () => {
  useEffect(() => {
    window.COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA;
  }, []);
  return null;
};
