import type { Metadata } from "next";
import Shell from "@/components/caas/Shell";

export const metadata: Metadata = {
  title: "CaaS — Construction as a Service",
  description:
    "見積から施工完了まで、電話ゼロで。担当職人を選び、施工の様子を画面で確認できます。",
  openGraph: {
    title: "CaaS — Construction as a Service",
    description: "見積から施工完了まで、電話ゼロで。",
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
