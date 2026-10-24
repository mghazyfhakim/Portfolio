import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const barlowCond = Barlow_Condensed({
  variable: "--font-barlow-cond",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Ghazy Fhakim — AI Engineer / Web Developer",
  description:
    "Drawing-set portfolio of an AI engineer and web developer working in industrial sealing B2B. Agent systems, benchmarks, and zero-dependency web tools — measured, benchmarked, shipped.",
  keywords: [
    "AI engineer",
    "web developer",
    "Hermes Agent",
    "Next.js",
    "portfolio",
  ],
  authors: [{ name: "Muhammad Ghazy Fhakim" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Muhammad Ghazy Fhakim — AI Engineer / Web Developer",
    description:
      "A portfolio rendered as an engineering drawing set. Measured, benchmarked, shipped.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e9eae6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${barlowCond.variable} ${barlow.variable} ${plexMono.variable} antialiased bg-paper text-ink grain`}
      >
        {children}
      </body>
    </html>
  );
}
