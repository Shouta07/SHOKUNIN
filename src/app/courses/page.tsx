import Card from "@/components/ui/Card";

export default function CoursesPage() {
  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="mb-2 text-2xl font-black">技術動画で学ぶ</h1>
      <p className="mb-6 text-sm text-gray-500">
        「背中を見て学べ」を超える。プロの技術を動画で。
      </p>

      <div className="space-y-4">
        {/* プレースホルダーコース */}
        <Card className="overflow-hidden">
          <div className="mb-3 h-40 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
          <h3 className="text-lg font-bold">
            エアコン設置の基礎 - 配管から試運転まで
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            全8チャプター・合計2時間30分
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-xs text-gray-400">(24件)</span>
            </div>
            <p className="text-xl font-black text-[var(--color-accent)]">
              ¥4,980
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="mb-3 h-40 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
          <h3 className="text-lg font-bold">
            電気工事士が教える安全な配線テクニック
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            全12チャプター・合計4時間
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★★★★☆</span>
              <span className="text-xs text-gray-400">(18件)</span>
            </div>
            <p className="text-xl font-black text-[var(--color-accent)]">
              ¥7,800
            </p>
          </div>
        </Card>
      </div>

      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "SHOKUNIN 技術動画コース",
            description: "建築・設備系の職人による技術解説動画コース",
            itemListElement: [],
          }),
        }}
      />
    </div>
  );
}
