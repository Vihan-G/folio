import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_TITLE = "folio — paste your portfolio, get honest AI analysis";
const SITE_DESCRIPTION =
  "Paste your holdings in any format. folio returns concentration risk, sector exposure, volatility, and a plain-English rebalance suggestion. No login. No broker connection.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "folio",
  authors: [{ name: "Vihan Goenka", url: "https://github.com/Vihan-G" }],
  creator: "Vihan Goenka",
  keywords: [
    "portfolio analysis",
    "AI",
    "investing",
    "concentration risk",
    "sector exposure",
    "rebalance",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8f7f4] text-zinc-900 font-sans">
        {children}
      </body>
    </html>
  );
}
