import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave it here.",
  description: "A place for things you can't say out loud.",
  openGraph: {
    title: "Leave it here.",
    description: "A place for things you can't say out loud.",
    locale: "ja_JP",
    type: "website",
  },
};

export default function ConfessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen" style={{ background: "#030014" }}>
        {children}
      </div>
    </>
  );
}
