import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "vubnguyen/styles/globals.css";

import type { ReactNode } from "react";
import { Header } from "vubnguyen/components/Header";
import cn from "vujita-ui/dist/classnames";

import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  description: "A website for Vu Nguyen",
  openGraph: {
    description: "A website for Vu Nguyen",
    siteName: "vubnguyen.com",
    title: "Vu Nguyen personal website",
    url: "https://vubnguyen.com",
  },
  title: "vubnguyen",
  twitter: {
    card: "summary_large_image",
    creator: "@Vu_Man_Chu",
    site: "@Vu_Man_Chu",
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
