import Card from "@/components/ui/Card";
import Link from "next/link";

const categories = [
  "エアコン設置",
  "電気工事",
  "水道工事",
  "内装工事",
  "外壁塗装",
  "リフォーム",
];

export default function ServicesPage() {
  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="mb-6 text-2xl font-black">施工パッケージ</h1>

      {/* カテゴリフィルター */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/services?category=${encodeURIComponent(cat)}`}
            className="touch-target rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm active:bg-gray-100"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* サービス一覧（SSRでAPI呼び出し） */}
      <ServiceList />
    </div>
  );
}

async function ServiceList() {
  // MVP: サーバーコンポーネントから直接Supabaseを呼ぶ例
  // 実際にはcreateServerSupabaseを使用
  return (
    <div className="space-y-4">
      {/* プレースホルダー: API接続後に動的表示 */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">エアコン設置・交換</h3>
            <p className="mt-1 text-sm text-gray-500">
              家庭用エアコンの新規設置から交換まで対応
            </p>
            <p className="mt-2 text-xs text-gray-400">施工時間: 約90分</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-[var(--color-accent)]">
              ¥20,000
            </p>
            <p className="text-xs text-gray-400">税込</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">コンセント増設</h3>
            <p className="mt-1 text-sm text-gray-500">
              安全な配線工事でコンセントを増設
            </p>
            <p className="mt-2 text-xs text-gray-400">施工時間: 約60分</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-[var(--color-accent)]">
              ¥12,000
            </p>
            <p className="text-xs text-gray-400">税込</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
