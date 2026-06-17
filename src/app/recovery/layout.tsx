import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recovery Challenge Season 1 — 100日後、別人になれるか。",
  description: "恥ずかしかったBeforeを、未来の誰かの地図に変える。100日間の改善チャレンジ。",
  openGraph: {
    title: "Recovery Challenge Season 1",
    description: "恥ずかしかったBeforeを、未来の誰かの地図に変える。",
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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div style={{ minHeight: "100vh", background: "#050505" }}>
        {children}
      </div>
    </>
  );
}
