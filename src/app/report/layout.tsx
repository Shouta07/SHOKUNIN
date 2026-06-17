import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transformation Report — 100日間の記録",
  description: "Before / After・変化グラフ・100日間の記録。あなたの記録が、誰かの希望になる。",
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
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
