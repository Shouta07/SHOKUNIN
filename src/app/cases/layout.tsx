import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Improvement Library — 改善事例を検索する",
  description: "あなたと似た人は、どう改善したのか。年齢・悩み・期間・費用で改善体験を検索。",
  openGraph: {
    title: "Improvement Library — His Recoveries",
    description: "あなたと似た人は、どう改善したのか。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Lora:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div style={{ minHeight: "100vh", background: "#f6f4ef" }}>{children}</div>
    </>
  );
}
