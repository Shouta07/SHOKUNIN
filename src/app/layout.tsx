import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "His Recoveries - 誰にも言えなかった、あの瞬間",
  description:
    "男の恥に、共感で寄り添うメディア。体臭・多汗症・薄毛・口臭・肌——誰にも相談できなかった悩みを、俺たちは知っている。",
  openGraph: {
    title: "His Recoveries - 誰にも言えなかった、あの瞬間",
    description: "男の恥に、共感で寄り添うメディア。",
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
        <BottomNav />
      </body>
    </html>
  );
}
