import { type Metadata } from "next";
import { Inter } from "next/font/google";

import "@vujita/vubnguyen/src/styles/globals.css";

import { type CSSProperties, type ReactNode } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import classnames from "vujita-ui/classnames";

import { TRPCReactProvider } from "@vujita/vubnguyen/src/app/providers";
import { Header } from "@vujita/vubnguyen/src/components/Header";

config.autoAddCss = true; // Prevent Font Awesome from adding its CSS since we did it manually above

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
console.log("fontSans", fontSans);

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
    <html
      lang="en"
      className={classnames("font-sans", fontSans.variable, fontSans.className, "transition-colors duration-300", "light")}
      style={{ "color-scheme": "light" } as CSSProperties}
    >
      <body>
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
