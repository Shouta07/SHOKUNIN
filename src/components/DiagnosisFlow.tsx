"use client";

import { useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Question, DiagnosisResult, DiagnosisIntro } from "@/lib/diagnosis/types";

interface Props {
  title: string;
  intro: DiagnosisIntro;
  questions: Question[];
  results: Record<string, DiagnosisResult>;
  accentColor: string;
}

const STAT_LABELS: Record<string, string> = {
  存在感: "PRE",
  清潔感: "CLN",
  信頼感: "TRS",
  色気: "CHM",
  親しみ: "APR",
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const tag = STAT_LABELS[label] ?? "";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-[var(--color-text-muted)] w-7">{tag}</span>
      <span className="text-xs font-bold w-16">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono font-bold w-7 text-right">{value}</span>
    </div>
  );
}

export default function DiagnosisFlow({ title, intro, questions, results, accentColor }: Props) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnswer = useCallback((optionScore: Record<string, number>) => {
    const newScores = { ...scores };
    for (const [key, value] of Object.entries(optionScore)) {
      newScores[key] = (newScores[key] ?? 0) + value;
    }
    setScores(newScores);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
      const topType = sorted[0][0];
      setResult(results[topType]);
    }
  }, [scores, currentIndex, questions.length, results]);

  const restart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setScores({});
    setResult(null);
  };

  // ═══════════════════════════════════════
  // RESULT: TRIAL CLEAR
  // ═══════════════════════════════════════
  if (result) {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topPct = Math.round((sortedScores[0][1] / totalScore) * 100);
    const statEntries = Object.entries(result.stats);

    return (
      <div className="px-4 pt-6 pb-24">
        {/* Trial Clear Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-2">
            ── TRIAL CLEAR ──
          </p>
          <h2 className="text-2xl font-black" style={{ color: accentColor }}>
            {result.label}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">
            MATCH {topPct}%
          </p>
        </div>

        {/* Score Breakdown */}
        <Card className="p-4 mb-4 bg-[var(--color-primary)] text-white">
          <h3 className="text-xs font-mono tracking-wider mb-3 opacity-70">DIAGNOSIS SCORE</h3>
          <div className="space-y-1.5">
            {sortedScores.map(([key, value]) => {
              const pct = Math.round((value / totalScore) * 100);
              const label = results[key]?.label ?? key;
              const isTop = key === result.type;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-xs flex-1 ${isTop ? "font-bold" : "opacity-60"}`}>{label}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isTop ? accentColor : "#6b7280",
                      }}
                    />
                  </div>
                  <span className={`text-xs font-mono w-8 text-right ${isTop ? "font-bold" : "opacity-60"}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Character Stats */}
        <Card className="p-5 mb-4 bg-gray-50 border border-gray-200">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-4">
            YOUR STATUS
          </h3>
          <div className="space-y-2.5">
            {statEntries.map(([label, value]) => (
              <StatBar key={label} label={label} value={value} color={accentColor} />
            ))}
          </div>
        </Card>

        {/* Description */}
        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed">{result.description}</p>
        </Card>

        {/* Features */}
        <Card className="p-5 mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-3">TRAITS</h3>
          <ul className="space-y-2">
            {result.features.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Unlocked Equipment */}
        <div className="mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-3 px-1">
            UNLOCKED EQUIPMENT ── 解放された装備
          </h3>
          <div className="space-y-2">
            {result.fashion.map((f, i) => (
              <Card key={i} className="p-4 border border-green-200 bg-green-50/50">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold flex items-start gap-2">
                    <span className="flex-shrink-0">🗡️</span>
                    <span>{f.item}</span>
                  </p>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {f.stat}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] ml-7">{f.reason}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Cursed Equipment */}
        <div className="mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-3 px-1">
            CURSED EQUIPMENT ── 呪いの装備
          </h3>
          <div className="space-y-2">
            {result.ngItems.map((f, i) => (
              <Card key={i} className="p-4 border border-red-200 bg-red-50/50">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold flex items-start gap-2">
                    <span className="flex-shrink-0">💀</span>
                    <span>{f.item}</span>
                  </p>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 whitespace-nowrap">
                    {f.stat}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] ml-7">{f.reason}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Party Members */}
        <Card className="p-5 mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-3">PARTY MEMBERS ── 同じタイプの仲間</h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((c, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full bg-gray-100 font-medium">{c}</span>
            ))}
          </div>
        </Card>

        {/* Gift Guide */}
        <Card className="p-5 mb-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
          <h3 className="font-bold mb-2">装備を手に入れろ。</h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            最強の装備は、大切な人からの贈り物。
            この診断結果をシェアして、あなたに合ったギフトを届けてもらおう。
          </p>
        </Card>

        {/* Share Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              const text = `外見ステータス診断の結果「${result.label}」だった！\n似合う装備がわかったから、プレゼント選びの参考にしてほしい\n${window.location.href}`;
              const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
              window.open(lineUrl, "_blank", "noopener,noreferrer");
            }}
            className="flex-1 py-3 rounded-xl bg-[#06C755] text-white font-bold text-sm touch-target active:scale-[0.98] transition-transform"
          >
            LINEでシェア
          </button>
          <button
            onClick={async () => {
              const text = `外見ステータス診断の結果「${result.label}」だった！\n似合う装備がわかったから、プレゼント選びの参考にしてほしい\n${window.location.href}`;
              if (navigator.share) {
                await navigator.share({ title: `${title}の結果`, text });
              } else {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            }}
            className="flex-1 py-3 rounded-xl border-2 font-bold text-sm touch-target active:scale-[0.98] transition-transform"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            {copied ? "コピー完了！" : "リンクをコピー"}
          </button>
        </div>

        {/* Legendary Equipment */}
        <div className="mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-3 px-1">
            LEGENDARY EQUIPMENT ── 伝説の装備
          </h3>
          <div className="space-y-3">
            {result.products.map((product, i) => (
              <a
                key={i}
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="p-4 border-2 border-transparent hover:border-[var(--color-accent)] active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm flex-1">⚔️ {product.name}</h4>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full text-white ml-2 whitespace-nowrap"
                      style={{ backgroundColor: accentColor }}
                    >
                      {product.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold" style={{ color: accentColor }}>{product.price}</span>
                    <span className="text-xs font-mono" style={{ color: accentColor }}>EQUIP →</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Salon CTA */}
        <Card className="p-5 mb-6 gradient-accent text-white">
          <h3 className="font-bold text-lg mb-2">{result.salonCta.heading}</h3>
          <p className="text-sm opacity-90 mb-4">{result.salonCta.description}</p>
          <a
            href={result.salonCta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl bg-white text-[var(--color-accent)] font-bold text-sm touch-target active:scale-[0.98] transition-transform"
          >
            {result.salonCta.buttonLabel}
          </a>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={restart} className="flex-1">もう一度挑戦する</Button>
          <Button onClick={() => window.location.href = "/"} className="flex-1">冒険の書に戻る</Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // INTRO: TRIAL BRIEFING
  // ═══════════════════════════════════════
  if (!started) {
    return (
      <div className="px-4 pt-6 pb-24">
        <div className="text-center mb-6">
          <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-2">
            ── TRIAL ──
          </p>
          <h1
            className="text-2xl font-black leading-tight whitespace-pre-line"
            style={{ color: accentColor }}
          >
            {intro.headline}
          </h1>
        </div>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed">{intro.problem}</p>
        </Card>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed font-medium">{intro.solution}</p>
        </Card>

        <div className="mb-6">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-text-muted)] mb-3 px-1">
            UNLOCKABLE STATUS ── 解放されるステータス
          </h3>
          <div className="space-y-2">
            {intro.benefits.map((b, i) => (
              <Card key={i} className="p-3 flex items-center gap-3 border border-gray-100">
                <span className="text-lg flex-shrink-0">{b.icon}</span>
                <p className="text-sm">{b.text}</p>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[var(--color-text-muted)] mb-4 font-mono">
          {intro.closingHook}
        </p>

        <Button onClick={() => setStarted(true)} className="w-full">
          試練を開始する
        </Button>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // QUESTIONS: STAGES
  // ═══════════════════════════════════════
  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="text-center mb-4">
        <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-1">
          ── {title} ──
        </p>
        <p className="text-lg font-mono font-bold" style={{ color: accentColor }}>
          STAGE {currentIndex + 1} / {questions.length}
        </p>
      </div>

      {/* HP-style progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 8px ${accentColor}60`,
          }}
        />
      </div>

      <Card className="p-5 mb-6">
        <h2 className="text-base font-bold text-center mb-6 leading-relaxed">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.score)}
              className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-400 active:scale-[0.98] transition-all touch-target text-sm font-medium"
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="text-xs font-mono text-[var(--color-text-muted)] underline mx-auto block"
        >
          ← 前のステージに戻る
        </button>
      )}
    </div>
  );
}
