import Link from "next/link";
import Card from "@/components/ui/Card";

const features = [
  {
    href: "/services",
    title: "施工パッケージ",
    description: "エアコン設置、電気工事など施工サービスを探す",
    icon: "🔧",
  },
  {
    href: "/courses",
    title: "技術動画で学ぶ",
    description: "現場のプロから直接技術を学ぶ",
    icon: "🎬",
  },
  {
    href: "/search",
    title: "近くの職人を探す",
    description: "今すぐ動ける設備屋を地図で検索",
    icon: "📍",
  },
  {
    href: "/dashboard",
    title: "職人ダッシュボード",
    description: "出品・注文管理・売上確認",
    icon: "📊",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 pb-24 pt-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-[var(--color-primary)]">
          SHOKUNIN
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          職人の技術を、正当に評価する。
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

      {/* 構造化データ: トップページ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SHOKUNIN",
            description:
              "建築・建設・設備系の職人が技術や施工サービスを直接販売できるプラットフォーム",
            url: "https://shokunin.jp",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://shokunin.jp/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
