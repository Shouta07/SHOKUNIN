import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHOKUNIN - 職人のスキルシェアプラットフォーム",
  description:
    "建築・建設・設備系の職人が技術や施工サービスを直接販売できるプラットフォーム。多重下請けから脱却し、あなたの技術を正当に評価します。",
  openGraph: {
    title: "SHOKUNIN - 職人のスキルシェアプラットフォーム",
    description: "職人の技術を直接販売。施工パッケージ・技術動画の販売プラットフォーム。",
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
      </body>
    </html>
  );
}
