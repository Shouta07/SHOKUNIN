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

  if (result) {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topLabel = results[sortedScores[0][0]]?.label ?? sortedScores[0][0];
    const topPct = Math.round((sortedScores[0][1] / totalScore) * 100);

    return (
      <div className="px-4 pt-8 pb-24">
        <div className="text-center mb-6">
          <p className="text-sm text-[var(--color-text-muted)]">{title}の結果</p>
          <h2 className="text-2xl font-black mt-1" style={{ color: accentColor }}>
            {result.label}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            一致度 {topPct}%
          </p>
        </div>

        {/* スコア内訳 */}
        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3 text-sm">診断スコア</h3>
          <div className="space-y-2">
            {sortedScores.map(([key, value]) => {
              const pct = Math.round((value / totalScore) * 100);
              const label = results[key]?.label ?? key;
              const isTop = key === result.type;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isTop ? "font-bold" : "text-[var(--color-text-muted)]"}>{label}</span>
                    <span className={isTop ? "font-bold" : "text-[var(--color-text-muted)]"}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isTop ? accentColor : "#d1d5db",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed">{result.description}</p>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">あなたの特徴</h3>
          <ul className="space-y-2">
            {result.features.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">なぜこの服が似合うのか</h3>
          <div className="space-y-3">
            {result.fashion.map((f, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium flex items-start gap-2">
                  <span style={{ color: accentColor }} className="flex-shrink-0">●</span>
                  <span>{f.item}</span>
                </p>
                <p className="text-xs text-[var(--color-text-muted)] ml-5 mt-0.5">{f.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">なぜこの服が似合わないのか</h3>
          <div className="space-y-3">
            {result.ngItems.map((f, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium flex items-start gap-2">
                  <span className="text-red-400 flex-shrink-0">✕</span>
                  <span>{f.item}</span>
                </p>
                <p className="text-xs text-[var(--color-text-muted)] ml-5 mt-0.5">{f.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">同じタイプの有名人</h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((c, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full bg-gray-100">{c}</span>
            ))}
          </div>
        </Card>

        {/* ギフトガイド導線 */}
        <Card className="p-5 mb-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
          <h3 className="font-bold mb-2">似合うものがわかった。次は「手に入れる」だけ。</h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            誕生日・記念日・クリスマス——大切な人からのプレゼントは、
            自分では買わない「本当に似合うもの」を贈ってもらうチャンス。
            この結果をシェアして、あなたの骨格に合ったギフトを届けてもらおう。
          </p>
        </Card>

        {/* シェアボタン */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              const text = `${title}の結果「${result.label}」だった！\n似合う服がわかったから、プレゼント選びの参考にしてほしい\n${window.location.href}`;
              const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
              window.open(lineUrl, "_blank", "noopener,noreferrer");
            }}
            className="flex-1 py-3 rounded-xl bg-[#06C755] text-white font-bold text-sm touch-target active:scale-[0.98] transition-transform"
          >
            LINEで贈り先にシェア
          </button>
          <button
            onClick={async () => {
              const text = `${title}の結果「${result.label}」だった！\n似合う服がわかったから、プレゼント選びの参考にしてほしい\n${window.location.href}`;
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
            {copied ? "コピーしました" : "リンクをコピー"}
          </button>
        </div>

        {/* 骨格特化ギフトアイテム */}
        <div className="mb-4">
          <h3 className="font-bold mb-1 px-1">あなたの体型に合うギフトアイテム</h3>
          <p className="text-xs text-[var(--color-text-muted)] px-1 mb-3">
            骨格タイプに基づいて厳選。贈る側も選びやすい。
          </p>
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
                    <h4 className="font-bold text-sm flex-1">{product.name}</h4>
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
                    <span className="text-xs text-[var(--color-accent)]">詳しく見る →</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* サロン送客CTA */}
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
          <Button variant="secondary" onClick={restart} className="flex-1">もう一度診断する</Button>
          <Button onClick={() => window.location.href = "/"} className="flex-1">ホームに戻る</Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="px-4 pt-8 pb-24">
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-black leading-tight whitespace-pre-line"
            style={{ color: accentColor }}
          >
            {intro.headline}
          </h1>
        </div>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed text-[var(--color-text)]">
            {intro.problem}
          </p>
        </Card>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed text-[var(--color-text)] font-medium">
            {intro.solution}
          </p>
        </Card>

        <div className="mb-6">
          <h3 className="font-bold mb-3 px-1">知ることで変わること</h3>
          <div className="space-y-3">
            {intro.benefits.map((b, i) => (
              <Card key={i} className="p-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <p className="text-sm font-medium">{b.text}</p>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
          {intro.closingHook}
        </p>

        <Button onClick={() => setStarted(true)} className="w-full">
          診断を始める
        </Button>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="px-4 pt-8 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold" style={{ color: accentColor }}>{title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: accentColor }}
        />
      </div>

      <Card className="p-5 mb-6">
        <h2 className="text-lg font-bold text-center mb-6">{question.text}</h2>
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
          className="text-sm text-[var(--color-text-muted)] underline mx-auto block"
        >
          前の質問に戻る
        </button>
      )}
    </div>
  );
}
