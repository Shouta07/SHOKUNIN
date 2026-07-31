import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safie Field Works — Construction as a Service",
  description:
    "見積から施工完了まで、電話ゼロで。店舗・拠点をもつ事業者のための工事プラットフォーム。",
  openGraph: {
    title: "Safie Field Works — Construction as a Service",
    description: "見積から施工完了まで、電話ゼロで。",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
