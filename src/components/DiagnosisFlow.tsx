"use client";

import { useState, useCallback, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Question, DiagnosisResult, DiagnosisIntro } from "@/lib/diagnosis/types";

interface Props {
  title: string;
  diagnosisKey: string;
  intro: DiagnosisIntro;
  questions: Question[];
  results: Record<string, DiagnosisResult>;
  accentColor: string;
}

const MONSTERS = [
  { name: "スライム", emoji: "🟦", xp: 10 },
  { name: "ゴブリン", emoji: "👹", xp: 15 },
  { name: "スケルトン", emoji: "💀", xp: 20 },
  { name: "ガーゴイル", emoji: "🗿", xp: 25 },
  { name: "キメラ", emoji: "🦅", xp: 30 },
  { name: "ゴーレム", emoji: "🪨", xp: 40 },
  { name: "ドラゴン", emoji: "🐲", xp: 50 },
];

function getMonster(index: number, total: number) {
  if (index === total - 1) return MONSTERS[6];
  return MONSTERS[Math.min(index, 5)];
}

const STAT_NAMES = ["存在感", "清潔感", "信頼感", "色気", "親しみ"];
const LOW_STATS = [22, 28, 25, 18, 20];
const HIGH_STATS = [82, 85, 80, 78, 80];

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-16">{label}</span>
      <div className="flex-1 bg-[#0a0a1a] h-3 overflow-hidden border border-[#2a3a5e]">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-mono font-bold w-8 text-right text-[var(--color-accent)]">
        {value}
      </span>
    </div>
  );
}

type BattlePhase = "encounter" | "command" | "victory";

export default function DiagnosisFlow({
  title,
  diagnosisKey,
  intro,
  questions,
  results,
  accentColor,
}: Props) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>("encounter");
  const [xp, setXp] = useState(0);
  const [pendingResult, setPendingResult] = useState<DiagnosisResult | null>(null);

  const totalXp = questions.reduce(
    (sum, _, i) => sum + getMonster(i, questions.length).xp,
    0
  );
  const monster = getMonster(currentIndex, questions.length);

  useEffect(() => {
    if (battlePhase !== "victory") return;
    const timer = setTimeout(() => {
      if (pendingResult) {
        setResult(pendingResult);
        try {
          localStorage.setItem(
            `his-recoveries-${diagnosisKey}`,
            JSON.stringify({
              type: pendingResult.type,
              label: pendingResult.label,
              stats: pendingResult.stats,
            })
          );
        } catch {}
      } else {
        setCurrentIndex((i) => i + 1);
        setBattlePhase("encounter");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [battlePhase, pendingResult, diagnosisKey]);

  const handleAnswer = useCallback(
    (optionScore: Record<string, number>) => {
      const newScores = { ...scores };
      for (const [key, value] of Object.entries(optionScore)) {
        newScores[key] = (newScores[key] ?? 0) + value;
      }
      setScores(newScores);
      setXp((prev) => prev + monster.xp);
      setBattlePhase("victory");

      if (currentIndex >= questions.length - 1) {
        const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
        const topType = sorted[0][0];
        setPendingResult(results[topType]);
      }
    },
    [scores, currentIndex, questions.length, results, monster.xp]
  );

  const restart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setScores({});
    setResult(null);
    setPendingResult(null);
    setBattlePhase("encounter");
    setXp(0);
  };

  // ═══════════════════════════════════════
  // RESULT: しれん クリア！
  // ═══════════════════════════════════════
  if (result) {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topPct = Math.round((sortedScores[0][1] / totalScore) * 100);
    const statEntries = Object.entries(result.stats);

    return (
      <div className="px-4 pt-6 pb-24">
        {/* Level Up Header */}
        <div className="text-center mb-6">
          <p className="text-lg text-[var(--color-accent)] mb-2 tracking-[0.3em]">
            ♪ ♪ ♪
          </p>
          <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-3">
            ── しれん クリア！──
          </p>
          <h2 className="text-2xl font-black text-[var(--color-accent)]">
            {result.label}
          </h2>
          <p className="text-sm text-[var(--color-text)] mt-2">
            の称号を 手に入れた！
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">
            MATCH {topPct}% ─ EXP {xp}/{totalXp}
          </p>
        </div>

        {/* Before → After Gap Comparison */}
        <Card className="p-5 mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-4">
            ── 装備なし → 最適装備 ──
          </h3>
          <div className="space-y-2">
            {statEntries.map(([label, value]) => {
              const beforeVal = Math.round(value * 0.35);
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-xs w-14">{label}</span>
                  <span className="text-xs font-mono text-red-400 w-6 text-right">
                    {beforeVal}
                  </span>
                  <span className="text-[var(--color-accent)] text-xs">→</span>
                  <div className="flex-1 bg-[#0a0a1a] h-3 border border-[#2a3a5e] overflow-hidden">
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${value}%`, backgroundColor: accentColor }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-accent)] w-6 text-right">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
            最適な装備を選ぶだけで ステータスが大幅に変わる
          </p>
        </Card>

        {/* Score Breakdown */}
        <Card className="p-4 mb-4">
          <h3 className="text-xs font-mono tracking-wider mb-3 text-[var(--color-accent)]">
            ── けっか ──
          </h3>
          <div className="space-y-1.5">
            {sortedScores.map(([key, value]) => {
              const pct = Math.round((value / totalScore) * 100);
              const label = results[key]?.label ?? key;
              const isTop = key === result.type;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className={`text-xs flex-1 ${isTop ? "font-bold text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}
                  >
                    {label}
                  </span>
                  <div className="w-24 bg-[#0a0a1a] h-2 border border-[#2a3a5e]">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isTop ? accentColor : "#4a4a6a",
                      }}
                    />
                  </div>
                  <span
                    className={`text-xs font-mono w-8 text-right ${isTop ? "font-bold text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Description */}
        <Card className="p-5 mb-4">
          <p className="text-sm leading-relaxed">{result.description}</p>
        </Card>

        {/* とくちょう */}
        <Card className="p-5 mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3">
            ── とくちょう ──
          </h3>
          <ul className="space-y-2">
            {result.features.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* さいてきな そうび */}
        <div className="mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3 px-1">
            ── さいてきな そうび ──
          </h3>
          <div className="space-y-2">
            {result.fashion.map((f, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold flex items-start gap-2">
                    <span className="text-[var(--color-accent)] text-xs mt-0.5 flex-shrink-0">
                      ▶
                    </span>
                    <span>{f.item}</span>
                  </p>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap bg-green-900/50 text-green-400 border border-green-700/50">
                    {f.stat}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] ml-5">
                  {f.reason}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* のろいの そうび */}
        <div className="mb-4">
          <h3 className="text-xs font-mono tracking-wider text-red-400 mb-3 px-1">
            ── のろいの そうび ──
          </h3>
          <div className="space-y-2">
            {result.ngItems.map((f, i) => (
              <Card key={i} className="p-4 dq-window-danger">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold flex items-start gap-2">
                    <span className="text-red-400 flex-shrink-0">💀</span>
                    <span>{f.item}</span>
                  </p>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap bg-red-900/50 text-red-400 border border-red-700/50">
                    {f.stat}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] ml-7">
                  {f.reason}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* なかま */}
        <Card className="p-5 mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3">
            ── なかま ──
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.celebrities.map((c, i) => (
              <span
                key={i}
                className="text-sm px-3 py-1 rounded bg-[#1a2a5e] border border-[#3a5a8a]"
              >
                {c}
              </span>
            ))}
          </div>
        </Card>

        {/* Share Guide */}
        <Card className="p-5 mb-4 dq-window-gold">
          <h3 className="font-bold mb-2 text-[var(--color-accent)]">
            この分析結果をシェアせよ。
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            あなたの装備適性データを仲間に共有しよう。
            最適なギフト選びの参考になる。
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
            className="flex-1 py-3 rounded-xl border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-bold text-sm touch-target active:scale-[0.98] transition-transform"
          >
            {copied ? "コピー完了！" : "リンクをコピー"}
          </button>
        </div>

        {/* でんせつの そうび */}
        <div className="mb-4">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3 px-1">
            ── でんせつの そうび ──
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
                <Card className="p-4 hover:brightness-110 active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm flex-1">
                      ⚔️ {product.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded text-[#0a0a1a] ml-2 whitespace-nowrap bg-[var(--color-accent)]">
                      {product.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[var(--color-accent)]">
                      {product.price}
                    </span>
                    <span className="text-xs font-mono text-[var(--color-accent)]">
                      EQUIP →
                    </span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Salon CTA */}
        <Card className="p-5 mb-6 dq-window-gold">
          <h3 className="font-bold text-lg mb-2 text-[var(--color-accent)]">
            {result.salonCta.heading}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            {result.salonCta.description}
          </p>
          <a
            href={result.salonCta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl bg-[var(--color-accent)] text-[#0a0a1a] font-bold text-sm touch-target active:scale-[0.98] transition-transform"
          >
            {result.salonCta.buttonLabel}
          </a>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={restart} className="flex-1">
            もう一度挑戦する
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex-1"
          >
            冒険の書に戻る
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // INTRO: ギャップ可視化 + 試練説明
  // ═══════════════════════════════════════
  if (!started) {
    return (
      <div className="px-4 pt-6 pb-24">
        <div className="text-center mb-6">
          <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-2">
            ── TRIAL ──
          </p>
          <h1 className="text-2xl font-black leading-tight whitespace-pre-line text-[var(--color-accent)]">
            {intro.headline}
          </h1>
        </div>

        {/* Gap Visualization: Before */}
        <Card className="p-4 mb-3 dq-window-danger">
          <h3 className="text-xs font-mono tracking-wider text-red-400 mb-3">
            ── 自分を知らない男 ──
          </h3>
          <div className="space-y-1.5">
            {STAT_NAMES.map((stat, i) => (
              <div key={stat} className="flex items-center gap-2">
                <span className="text-xs w-14">{stat}</span>
                <div className="flex-1 bg-[#0a0a1a] h-2 border border-[#2a3a5e]">
                  <div
                    className="h-full bg-red-800/70"
                    style={{ width: `${LOW_STATS[i]}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-red-400 w-6 text-right">
                  {LOW_STATS[i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <p className="text-center text-[var(--color-accent)] text-lg mb-3">
          ↓ ↓ ↓
        </p>

        {/* Gap Visualization: After */}
        <Card className="p-4 mb-6">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3">
            ── 自分を知っている男 ──
          </h3>
          <div className="space-y-1.5">
            {STAT_NAMES.map((stat, i) => (
              <div key={stat} className="flex items-center gap-2">
                <span className="text-xs w-14">{stat}</span>
                <div className="flex-1 bg-[#0a0a1a] h-2 border border-[#2a3a5e]">
                  <div
                    className="h-full"
                    style={{
                      width: `${HIGH_STATS[i]}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-[var(--color-accent)] w-6 text-right">
                  {HIGH_STATS[i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-loose whitespace-pre-line">
            {intro.problem}
          </p>
        </Card>

        <Card className="p-5 mb-4">
          <p className="text-sm leading-loose whitespace-pre-line font-medium">
            {intro.solution}
          </p>
        </Card>

        <div className="mb-6">
          <h3 className="text-xs font-mono tracking-wider text-[var(--color-accent)] mb-3 px-1">
            ── 解放されるステータス ──
          </h3>
          <Card className="p-4">
            <div className="space-y-3">
              {intro.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0">{b.icon}</span>
                  <p className="text-sm">{b.text}</p>
                </div>
              ))}
            </div>
          </Card>
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
  // BATTLE: ENCOUNTER
  // ═══════════════════════════════════════
  if (battlePhase === "encounter") {
    return (
      <div className="px-4 pt-6 pb-24">
        <div className="text-center mb-4">
          <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-1">
            ── {title} ──
          </p>
          <p className="text-lg font-mono font-bold text-[var(--color-accent)]">
            STAGE {currentIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            EXP
          </span>
          <div className="flex-1 bg-[#0a0a1a] h-2 overflow-hidden border border-[#2a3a5e]">
            <div
              className="h-full transition-all duration-500 bg-green-500"
              style={{ width: `${(xp / totalXp) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            {xp}/{totalXp}
          </span>
        </div>

        <button
          onClick={() => setBattlePhase("command")}
          className="w-full text-left"
        >
          <Card className="p-8">
            <div className="text-center">
              <p className="text-6xl mb-6">{monster.emoji}</p>
              <p className="text-lg font-bold leading-loose">
                {monster.name}が
                <br />
                あらわれた！
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-6 animate-pulse">
                タップして つづける
              </p>
            </div>
          </Card>
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // BATTLE: VICTORY
  // ═══════════════════════════════════════
  if (battlePhase === "victory") {
    return (
      <div className="px-4 pt-6 pb-24">
        <div className="text-center mb-4">
          <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-1">
            ── {title} ──
          </p>
          <p className="text-lg font-mono font-bold text-[var(--color-accent)]">
            STAGE {currentIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            EXP
          </span>
          <div className="flex-1 bg-[#0a0a1a] h-2 overflow-hidden border border-[#2a3a5e]">
            <div
              className="h-full transition-all duration-500 bg-green-500"
              style={{ width: `${(xp / totalXp) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            {xp}/{totalXp}
          </span>
        </div>

        <Card className="p-8">
          <div className="text-center">
            <p className="text-lg text-[var(--color-accent)] mb-3">♪</p>
            <p className="text-lg font-bold leading-loose">
              {monster.name}を
              <br />
              たおした！
            </p>
            <p className="text-sm text-green-400 mt-4 font-mono">
              経験値 {monster.xp} かくとく！
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // BATTLE: COMMAND (Question)
  // ═══════════════════════════════════════
  const question = questions[currentIndex];

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="text-center mb-4">
        <p className="text-xs font-mono tracking-[0.3em] text-[var(--color-text-muted)] mb-1">
          ── {title} ──
        </p>
        <p className="text-lg font-mono font-bold text-[var(--color-accent)]">
          STAGE {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="text-center mb-3">
        <span className="text-4xl">{monster.emoji}</span>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {monster.name}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
          EXP
        </span>
        <div className="flex-1 bg-[#0a0a1a] h-2 overflow-hidden border border-[#2a3a5e]">
          <div
            className="h-full transition-all duration-500 bg-green-500"
            style={{ width: `${(xp / totalXp) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
          {xp}/{totalXp}
        </span>
      </div>

      <Card className="p-0 overflow-hidden mb-6">
        <div className="px-5 pt-5 pb-3">
          <p className="text-xs font-mono text-[var(--color-accent)] mb-3">
            コマンド？
          </p>
          <h2 className="text-base font-bold leading-relaxed">
            {question.text}
          </h2>
        </div>
        <div className="divide-y divide-[#2a3a6e]">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.score)}
              className="w-full text-left px-5 py-4 hover:bg-[rgba(90,138,199,0.12)] active:bg-[rgba(90,138,199,0.25)] transition-colors touch-target text-sm flex items-start gap-3"
            >
              <span className="text-[var(--color-accent)] text-xs mt-0.5 flex-shrink-0">
                ▶
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {currentIndex > 0 && (
        <button
          onClick={() => {
            setCurrentIndex(currentIndex - 1);
            setBattlePhase("encounter");
          }}
          className="text-xs text-[var(--color-text-muted)] mx-auto block"
        >
          ← もどる
        </button>
      )}
    </div>
  );
}
