import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenge — 改善チャレンジ",
  description: "100日間、変化を記録する。あなたの記録が、未来の誰かの希望になる。",
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
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
