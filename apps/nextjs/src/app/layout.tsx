import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "vubnguyen",
  description: "A website for Vu Nguyen",
  openGraph: {
    title: "Vu Nguyen personsal website",
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

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider>{props.children}</TRPCReactProvider>
      </body>
    </html>
  );
}
