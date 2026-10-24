import type { Metadata, Viewport } from "next";
import { Anton, Work_Sans } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Ghazy Fawaz Hakim — Software Engineer, Bandung",
  description:
    "Portofolio software engineer full-stack, DevOps, dan AI dari Bandung. Satu orang di balik sistem produksi PT Puma Makmur: platform B2B, ERP internal, dan chatbot AI pajak — semuanya live.",
  keywords: [
    "software engineer",
    "full-stack developer",
    "Elixir",
    "Phoenix LiveView",
    "AI engineer",
    "Bandung",
    "portfolio",
  ],
  authors: [{ name: "Muhammad Ghazy Fawaz Hakim" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Muhammad Ghazy Fawaz Hakim — Software Engineer, Bandung",
    description:
      "Satu orang di balik sistem produksi PT Puma Makmur: platform B2B, ERP internal, dan chatbot AI pajak — semuanya live hari ini.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#133621",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${anton.variable} ${workSans.variable} antialiased bg-bg text-ink`}>
        {children}
      </body>
    </html>
  );
}
