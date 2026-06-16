import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ここに置いていってください",
};

export default function ConfessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
