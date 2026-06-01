"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

interface TrialResult {
  type: string;
  label: string;
  stats: Record<string, number>;
}

const trials = [
  {
    key: "body",
    href: "/diagnosis/body",
    title: "骨格の試練",
    stages: "7 STAGES",
    description: "体型データから装備適性を分析する",
  },
  {
    key: "face",
    href: "/diagnosis/face",
    title: "顔の試練",
    stages: "6 STAGES",
    description: "顔の印象データから最適解を導出する",
  },
  {
    key: "color",
    href: "/diagnosis/color",
    title: "色の試練",
    stages: "7 STAGES",
    description: "肌・髪・瞳のカラーデータを解析する",
  },
];

export default function HomePage() {
  const [completed, setCompleted] = useState<Record<string, TrialResult | null>>({
    body: null,
    face: null,
    color: null,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const body = localStorage.getItem("his-recoveries-body");
      const face = localStorage.getItem("his-recoveries-face");
      const color = localStorage.getItem("his-recoveries-color");
      setCompleted({
        body: body ? JSON.parse(body) : null,
        face: face ? JSON.parse(face) : null,
        color: color ? JSON.parse(color) : null,
      });
    } catch {}
    setMounted(true);
  }, []);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const level = completedCount + 1;

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

      {/* Status Card */}
      <Card className="p-5 mb-6">
        <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3">
          ── あなたのステータス ──
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">レベル</span>
          <span className="text-xl font-black text-[var(--color-accent)]">Lv. {mounted ? level : 1}</span>
        </div>
        <div className="space-y-2">
          {trials.map((t) => {
            const result = mounted ? completed[t.key] : null;
            return (
              <div key={t.key} className="flex items-center justify-between">
                <span className="text-sm">{t.title.replace("の試練", "適性")}</span>
                {result ? (
                  <span className="text-xs font-mono text-green-400">{result.label}</span>
                ) : (
                  <span className="text-xs font-mono text-[var(--color-text-muted)]">？？？</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* King's Message */}
      <Card className="p-5 mb-6">
        <p className="text-sm leading-loose">
          {completedCount === 0 || !mounted ? (
            <>
              冒険者よ。<br />
              自分の「つよさ」を知らずに<br />
              装備を選んでいないか？<br />
              <br />
              3つの試練をクリアして<br />
              自分のステータスを把握し<br />
              <span className="text-[var(--color-accent)] font-bold">最適な装備</span>を手に入れよ。
            </>
          ) : completedCount < 3 ? (
            <>
              冒険者よ。<br />
              まだ すべての試練が<br />
              クリアされていない。<br />
              <br />
              残りの試練に挑み<br />
              <span className="text-[var(--color-accent)] font-bold">装備適性を 全解放</span>せよ。
            </>
          ) : (
            <>
              冒険者よ。<br />
              すべての試練を クリアした！<br />
              <br />
              3つの分析データが統合され<br />
              <span className="text-[var(--color-accent)] font-bold">最強の装備リスト</span>が<br />
              完成した。
            </>
          )}
        </p>
      </Card>

      {/* Quest Selection */}
      <div className="mb-6">
        <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3 px-1">
          ── どの試練に挑む？ ──
        </h3>
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-[#2a3a6e]">
            {trials.map((t) => {
              const result = mounted ? completed[t.key] : null;
              return (
                <Link key={t.href} href={t.href} className="block">
                  <div className="flex items-center gap-3 px-5 py-4 hover:bg-[rgba(90,138,199,0.12)] active:bg-[rgba(90,138,199,0.25)] transition-colors">
                    <span className="text-[var(--color-accent)] text-xs flex-shrink-0">▶</span>
                    <div className="flex-1">
                      <h2 className="text-base font-bold">{t.title}</h2>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {result ? `クリア済み: ${result.label}` : t.description}
                      </p>
                    </div>
                    {result ? (
                      <span className="text-xs font-mono text-green-400">CLEAR</span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)] whitespace-nowrap">
                        {t.stages}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

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
