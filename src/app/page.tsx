import Link from "next/link";
import Card from "@/components/ui/Card";

const trials = [
  {
    href: "/diagnosis/body",
    title: "骨格の試練",
    stages: "7 STAGES",
    description: "体型データから装備適性を分析する",
  },
  {
    href: "/diagnosis/face",
    title: "顔の試練",
    stages: "6 STAGES",
    description: "顔の印象データから最適解を導出する",
  },
  {
    href: "/diagnosis/color",
    title: "色の試練",
    stages: "7 STAGES",
    description: "肌・髪・瞳のカラーデータを解析する",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 pt-10 pb-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-[var(--color-accent)] tracking-tight">
          His Recoveries
        </h1>
        <p className="mt-1 text-xs font-mono tracking-[0.2em] text-[var(--color-text-muted)]">
          ── 外見の冒険 ──
        </p>
      </header>

      <Card className="p-5 mb-6">
        <p className="text-sm leading-loose">
          冒険者よ。<br />
          自分の「つよさ」を知らずに<br />
          装備を選んでいないか？
        </p>
        <p className="text-sm leading-loose mt-3">
          3つの試練をクリアし<br />
          自分のステータスを把握して<br />
          <span className="text-[var(--color-accent)] font-bold">最適な装備</span>を手に入れよ。
        </p>
      </Card>

      <div className="mb-6">
        <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3 px-1">
          ── どの試練に挑む？ ──
        </h3>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#2a3a6e]">
            {trials.map((t) => (
              <Link key={t.href} href={t.href} className="block">
                <div className="flex items-center gap-3 px-5 py-4 hover:bg-[rgba(90,138,199,0.12)] active:bg-[rgba(90,138,199,0.25)] transition-colors">
                  <span className="text-[var(--color-accent)] text-xs flex-shrink-0">▶</span>
                  <div className="flex-1">
                    <h2 className="text-base font-bold">{t.title}</h2>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] whitespace-nowrap">
                    {t.stages}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mb-6 dq-window-gold">
        <p className="text-sm leading-loose">
          <span className="text-[var(--color-accent)] font-bold">すべての試練をクリアすると</span><br />
          骨格 × 顔タイプ × カラーの<br />
          3つの分析データが統合され<br />
          あなただけの<br />
          「最強の装備リスト」が完成する。
        </p>
      </Card>

      <div className="text-center space-y-1">
        <p className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wider">
          所要時間: 各2分 / 完全無料
        </p>
        <p className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wider">
          登録不要 / スマホだけで完結
        </p>
      </div>
    </div>
  );
}
