import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "vubnguyen/styles/globals.css";

import type { ReactNode } from "react";
import { Header } from "vubnguyen/components/Header";

import cn from "@vujita/classnames";

import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "vubnguyen",
  description: "A website for Vu Nguyen",
  openGraph: {
    title: "Vu Nguyen personal website",
    description: "A website for Vu Nguyen",
    url: "https://vubnguyen.com",
    siteName: "vubnguyen.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Vu_Man_Chu",
    creator: "@Vu_Man_Chu",
  },
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("font-sans", fontSans.variable, "transition-colors duration-300")}>
        <TRPCReactProvider>
          <main>
            <Header />
            {props.children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
