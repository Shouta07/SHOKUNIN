"use client";

import { useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Question, DiagnosisResult } from "@/lib/diagnosis/types";

interface Props {
  title: string;
  questions: Question[];
  results: Record<string, DiagnosisResult>;
  accentColor: string;
}

export default function DiagnosisFlow({ title, questions, results, accentColor }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);

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
    setCurrentIndex(0);
    setScores({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="px-4 pt-8 pb-24">
        <div className="text-center mb-6">
          <p className="text-sm text-[var(--color-text-muted)]">{title}の結果</p>
          <h2 className="text-2xl font-black mt-1" style={{ color: accentColor }}>
            {result.label}
          </h2>
        </div>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed">{result.description}</p>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">あなたの特徴</h3>
          <ul className="space-y-2">
            {result.features.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">似合うファッション</h3>
          <ul className="space-y-2">
            {result.fashion.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span style={{ color: accentColor }}>●</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="font-bold mb-3">避けたほうがいいアイテム</h3>
          <ul className="space-y-2">
            {result.ngItems.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-gray-400">△</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 mb-6">
          <h3 className="font-bold mb-3">同じタイプの有名人</h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((c, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full bg-gray-100">{c}</span>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={restart} className="flex-1">もう一度診断する</Button>
          <Button onClick={() => window.location.href = "/"} className="flex-1">ホームに戻る</Button>
        </div>
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
