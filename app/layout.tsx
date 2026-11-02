import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { IntroOverlay } from "@/components/intro-overlay";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GroundGlow } from "@/components/ground-glow";
import { ZoomProvider } from "@/components/transitions/zoom-provider";
import { getBaseUrl, siteConfig } from "@/lib/site";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
      lang="en"
    >
      <body className="flex min-h-screen flex-col">
        <GroundGlow />
        <IntroOverlay />
        <SiteHeader />
        <ZoomProvider>
          <main className="flex-1 min-h-0">{children}</main>
        </ZoomProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
