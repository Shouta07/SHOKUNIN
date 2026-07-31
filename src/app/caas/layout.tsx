import type { Metadata } from "next";
import Shell from "@/components/caas/Shell";

export const metadata: Metadata = {
  title: "CaaS — Construction as a Service",
  description: "工事を、頼みたくなる体験に。予約から施工ライブ、完了、メンテナンスまで一貫して。",
  openGraph: {
    title: "Construction as a Service",
    description: "工事を、頼みたくなる体験に。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function CaasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Shell>{children}</Shell>
    </>
  );
}
