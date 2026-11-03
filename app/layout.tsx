import type { Metadata } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";

import "./globals.css";

import { IntroOverlay } from "@/components/intro-overlay";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PixelSky } from "@/components/pixel/pixel-sky";
import { ZoomProvider } from "@/components/transitions/zoom-provider";
import { getBaseUrl, siteConfig } from "@/lib/site";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixelify",
  weight: ["400", "500", "600", "700"],
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start",
  weight: "400",
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
      className={`${pixelify.variable} ${pressStart.variable}`}
      lang="en"
    >
      {process.env.NEXT_PUBLIC_FIGMA_CAPTURE === "1" ? (
        // Dev-only: lets Figma's html-to-design capture pull pages from localhost.
        <script async src="https://mcp.figma.com/mcp/html-to-design/capture.js" />
      ) : null}
      <body className="flex min-h-screen flex-col">
        <PixelSky />
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
