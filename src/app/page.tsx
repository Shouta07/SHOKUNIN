import Link from "next/link";
import Card from "@/components/ui/Card";

const features = [
  {
    href: "/estimates/new",
    title: "見積書を作成",
    description: "人工計算 → 粗利シミュレーション → PDF出力",
    icon: "📝",
  },
  {
    href: "/estimates",
    title: "見積一覧",
    description: "作成した見積の管理・検索・ステータス確認",
    icon: "📋",
  },
  {
    href: "/master",
    title: "単価マスタ",
    description: "職種別の出し値・原価を管理",
    icon: "💰",
  },
  {
    href: "/projects",
    title: "案件管理",
    description: "元請からの案件情報を一元管理",
    icon: "🏗️",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 pb-24 pt-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-[var(--color-primary)]">
          SHOKUNIN
        </h1>
        <p className="mt-1 text-base font-bold text-[var(--color-accent)]">
          人工見積AI
        </p>
        <p className="mt-2 text-sm text-gray-600">
          建設人材会社のための見積作成ツール
        </p>
      </header>

      <div className="space-y-4">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="flex items-center gap-4 active:bg-gray-50 transition-colors">
              <span className="text-3xl">{feature.icon}</span>
              <div>
                <h2 className="text-lg font-bold">{feature.title}</h2>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
