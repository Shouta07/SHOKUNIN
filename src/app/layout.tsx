import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "SHOKUNIN 人工見積AI - 建設人材会社のための見積作成ツール",
  description:
    "建設人材会社向けの人工見積作成SaaS。職種別単価管理、AI単価提案、粗利シミュレーション、見積書PDF出力。",
  openGraph: {
    title: "SHOKUNIN 人工見積AI",
    description: "建設人材会社のための見積作成ツール。人工計算からPDF出力まで30秒。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[var(--color-bg)] text-gray-900 antialiased">
        <main className="mx-auto max-w-lg min-h-screen">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
