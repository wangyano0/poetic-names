import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "古诗文起名 | 诗经 楚辞 唐诗 宋词 名字生成器 - Discover Poetic Chinese Names",
  description:
    "基于诗经、楚辞、唐诗、宋词的名字生成器，帮助你发现独特的中文名字及寓意。Discover poetic Chinese names with rich cultural stories and meanings.",
  keywords: [
    "古诗文起名",
    "诗经起名",
    "楚辞起名",
    "唐诗起名",
    "宋词起名",
    "中国风名字",
    "中文名字生成器",
    "poetic chinese names",
    "chinese name generator",
  ],
  alternates: {
    languages: {
      zh: "https://example.com/zh",
      en: "https://example.com/en",
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  openGraph: {
    title: "古诗文起名 | 诗经 楚辞 唐诗 宋词 名字生成器",
    description:
      "从《诗经》《楚辞》《唐诗》《宋词》中精选优美字词，生成具有文化底蕴的中文名字。",
    type: "website",
    url: "https://example.com/",
    siteName: "古诗文起名",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="/style.css" />
        <meta name="robots" content="index,follow" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
