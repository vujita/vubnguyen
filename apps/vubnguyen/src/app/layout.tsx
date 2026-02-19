import { type Metadata } from "next";
import { Fira_Code, Fraunces } from "next/font/google";

import "@vujita/vubnguyen/src/styles/globals.css";

import { type ReactNode } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import classnames from "vujita-ui/classnames";

import { TRPCReactProvider } from "@vujita/vubnguyen/src/app/providers";
import { Header } from "@vujita/vubnguyen/src/components/Header";

config.autoAddCss = true;

const fontDisplay = Fraunces({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["100", "300", "400", "600", "700", "900"],
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  description: "Staff Engineer at Amplitude. Building systems that scale.",
  openGraph: {
    description: "Staff Engineer at Amplitude. Building systems that scale.",
    siteName: "vubnguyen.com",
    title: "Vu Nguyen — Staff Engineer",
    url: "https://vubnguyen.com",
  },
  title: "Vu Nguyen — Staff Engineer",
  twitter: {
    card: "summary_large_image",
    creator: "@Vu_Man_Chu",
    site: "@Vu_Man_Chu",
  },
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <html
      className={classnames(fontDisplay.variable, fontMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <Header />
          <main>{props.children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
