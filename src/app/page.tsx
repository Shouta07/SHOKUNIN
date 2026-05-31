import Link from "next/link";
import Card from "@/components/ui/Card";

const trials = [
  {
    href: "/diagnosis/body",
    title: "骨格の試練",
    description: "体型の装備適性を解放せよ",
    icon: "🦴",
    stages: "7 STAGES",
    color: "border-l-4 border-l-blue-500",
    stat: "存在感・信頼感",
  },
  {
    href: "/diagnosis/face",
    title: "顔の試練",
    description: "印象の装備適性を解放せよ",
    icon: "👤",
    stages: "6 STAGES",
    color: "border-l-4 border-l-purple-500",
    stat: "清潔感・親しみ",
  },
  {
    href: "/diagnosis/color",
    title: "色の試練",
    description: "カラー適性を解放せよ",
    icon: "🎨",
    stages: "7 STAGES",
    color: "border-l-4 border-l-amber-500",
    stat: "色気・清潔感",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 pt-12 pb-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tight">
          His Recoveries
        </h1>
        <p className="mt-1 text-xs font-mono tracking-[0.2em] text-[var(--color-text-muted)]">
          APPEARANCE STATUS SYSTEM
        </p>
        <p className="mt-5 text-base text-[var(--color-text)] leading-relaxed">
          外見のステータスを可視化せよ。<br />
          <span className="font-bold text-[var(--color-accent)]">3つの試練</span>をクリアし、<br />
          最強の装備適性を解き明かせ。
        </p>
      </header>

      <div className="space-y-4 mb-6">
        {trials.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className={`flex items-center gap-4 active:scale-[0.98] transition-transform ${t.color}`}>
              <span className="text-3xl">{t.icon}</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{t.title}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{t.description}</p>
                <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-1">
                  UNLOCK: {t.stat}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] whitespace-nowrap">{t.stages}</span>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-4 mb-6 bg-gray-50 border border-gray-200">
        <div className="flex items-start gap-3">
          <span className="text-lg">⚔️</span>
          <div>
            <p className="text-sm font-bold mb-1">全ての試練をクリアすると...</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              骨格 × 顔タイプ × カラーの3つのステータスが統合され、あなただけの「最適装備リスト」が完成する。
            </p>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-wider">
          FREE / NO REGISTRATION REQUIRED
        </p>
      </div>
    </div>
  );
}
