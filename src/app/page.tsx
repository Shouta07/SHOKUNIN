import Link from "next/link";
import Card from "@/components/ui/Card";

const diagnoses = [
  {
    href: "/diagnosis/body",
    title: "骨格診断",
    description: "体型の特徴からストレート・ウェーブ・ナチュラルを判定",
    icon: "🦴",
    time: "約2分",
    color: "border-l-4 border-l-blue-500",
  },
  {
    href: "/diagnosis/face",
    title: "顔タイプ診断",
    description: "顔の輪郭・パーツから似合うテイストを特定",
    icon: "👤",
    time: "約2分",
    color: "border-l-4 border-l-purple-500",
  },
  {
    href: "/diagnosis/color",
    title: "パーソナルカラー診断",
    description: "肌・瞳・髪の色から似合う色のグループを診断",
    icon: "🎨",
    time: "約2分",
    color: "border-l-4 border-l-amber-500",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 pt-12 pb-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-[var(--color-primary)] tracking-tight">
          His Recoveries
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          男のための外見診断
        </p>
        <p className="mt-4 text-base text-[var(--color-text)]">
          3つの診断で、あなたに<br />
          <span className="font-bold text-[var(--color-accent)]">本当に似合うスタイル</span>がわかる。
        </p>
      </header>

      <div className="space-y-4 mb-8">
        {diagnoses.map((d) => (
          <Link key={d.href} href={d.href}>
            <Card className={`flex items-center gap-4 active:scale-[0.98] transition-transform ${d.color}`}>
              <span className="text-3xl">{d.icon}</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{d.title}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{d.description}</p>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{d.time}</span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          すべて無料・登録不要で診断できます
        </p>
      </div>
    </div>
  );
}
