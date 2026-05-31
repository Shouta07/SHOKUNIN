import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "His Recoveries - 男のための外見診断",
  description:
    "骨格診断・顔タイプ診断・パーソナルカラー診断であなたに似合うスタイルを見つける。無料の男性向け外見診断サービス。",
  openGraph: {
    title: "His Recoveries - 男のための外見診断",
    description: "3つの診断であなたに本当に似合うスタイルがわかる。",
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
      <body className="antialiased">
        <main className="mx-auto max-w-lg min-h-screen pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
