import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "세호 (SEHO) - 취향 공동체를 위한 복합 문화 플랫폼",
  description: "당신의 취향, 우리의 연결. 비슷한 취향을 가진 사람들과 만나고, 문화를 공유하세요.",
  keywords: ["커뮤니티", "문화", "전시", "공연", "취향", "소셜"],
  authors: [{ name: "SEHO Team" }],
  openGraph: {
    title: "세호 (SEHO)",
    description: "취향 공동체를 위한 복합 문화 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
