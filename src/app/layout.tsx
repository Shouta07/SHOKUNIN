import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CaaS — Construction as a Service",
  description:
    "工事を、頼みたくなる体験に。予約から施工ライブ、完了、メンテナンスまで一貫した顧客体験。",
  openGraph: {
    title: "CaaS — Construction as a Service",
    description: "工事を、頼みたくなる体験に。",
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
        <main>{children}</main>
      </body>
    </html>
  );
}
