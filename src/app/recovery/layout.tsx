import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "His Recoveries — 改善体験を、検索する。",
  description: "あなたと同じ悩みを持った人は、どうやって前に進んだのか。世界最大の改善体験データベース。",
  openGraph: {
    title: "His Recoveries",
    description: "あなたと同じ悩みを持った人は、どうやって前に進んだのか。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RecoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Lora:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div style={{ minHeight: "100vh", background: "#f6f4ef" }}>
        {children}
      </div>
    </>
  );
}
