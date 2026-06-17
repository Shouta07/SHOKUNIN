"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  C, SANS, SERIF, MILESTONES,
  getCurrentChallenge, getRecords, daysSince, calcImprovementScore, calcStreak,
  type ChallengeData, type DayRecord,
} from "@/lib/recovery";

const VITALITY_LABELS: Record<keyof DayRecord["vitality"], string> = {
  sleep: "睡眠", stress: "ストレス", energy: "活力", focus: "集中", mood: "気分",
};

export default function ChallengeDashboard({ params }: { params: Promise<{ id: string }> }) {
  use(params); // MVP: 現在のチャレンジを表示
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ch = getCurrentChallenge();
    setChallenge(ch);
    if (ch) setRecords(getRecords(ch.id));
  }, []);

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;

  if (!challenge) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontSize: "20px", marginBottom: "16px" }}>まだチャレンジがありません</p>
          <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.8, marginBottom: "28px" }}>
            まずは似た人の改善事例を見てみましょう。
          </p>
          <Link href="/cases" style={{ display: "inline-block", fontSize: "14px", color: "#fff", background: C.accent, borderRadius: "100px", padding: "14px 36px", textDecoration: "none" }}>
            改善事例を検索する
          </Link>
        </div>
      </div>
    );
  }

  const days = daysSince(challenge.startDate);
  const score = calcImprovementScore(records);
  const nextMilestone = MILESTONES.find((m) => m > days) ?? 100;
  const recordedDays = new Set(records.map((r) => r.day));
  const streak = calcStreak(records);

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px 120px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>SEASON 1</span>
          <Link href="/cases" style={{ fontSize: "12px", color: C.sub, textDecoration: "none" }}>事例を見る</Link>
        </div>

        {/* Greeting */}
        <h1 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 500, lineHeight: 1.5, marginBottom: "6px" }}>
          {challenge.nickname}さんの100日
        </h1>
        <p style={{ fontSize: "13px", color: C.sub, marginBottom: "32px" }}>目標：{challenge.goal}</p>

        {/* ── Streak hero（損失回避の核） ── */}
        <div style={{
          background: streak.recordedToday ? C.accent : C.surface,
          border: `1px solid ${streak.recordedToday ? C.accent : streak.atRisk ? "#c2603f" : C.line}`,
          borderRadius: "20px", padding: "28px 24px", marginBottom: "16px",
          textAlign: "center", transition: "all 300ms",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "26px", lineHeight: 1 }}>🔥</span>
            <span style={{ fontFamily: SERIF, fontSize: "52px", fontWeight: 500, lineHeight: 1, color: streak.recordedToday ? "#fff" : C.ink }}>
              {streak.current}
            </span>
            <span style={{ fontSize: "14px", color: streak.recordedToday ? "rgba(255,255,255,0.7)" : C.sub }}>日連続</span>
          </div>

          {streak.recordedToday ? (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginTop: "16px" }}>
              今日も記録できました。<br />また明日、この火を絶やさないで。
            </p>
          ) : streak.current > 0 && streak.atRisk ? (
            <>
              <p style={{ fontSize: "13px", color: "#c2603f", fontWeight: 500, lineHeight: 1.7, marginTop: "16px" }}>
                {streak.current}日の積み重ねが、今日で途切れます。
              </p>
              <button onClick={() => router.push("/recovery/record")}
                style={{ marginTop: "18px", fontSize: "14px", fontWeight: 500, letterSpacing: "0.06em", background: "#c2603f", color: "#fff", border: "none", borderRadius: "100px", padding: "14px 40px", cursor: "pointer" }}>
                記録して{streak.current + 1}日目にする
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7, marginTop: "16px" }}>
                {streak.current === 0 ? "今日から、最初の1日を。" : `今日記録すれば、${streak.current + 1}日連続。`}
              </p>
              <button onClick={() => router.push("/recovery/record")}
                style={{ marginTop: "18px", fontSize: "14px", fontWeight: 500, letterSpacing: "0.06em", background: C.accent, color: "#fff", border: "none", borderRadius: "100px", padding: "14px 40px", cursor: "pointer" }}>
                今日を記録する
              </button>
            </>
          )}

          {/* Progress to next streak milestone */}
          {streak.current > 0 && (
            <div style={{ marginTop: "22px" }}>
              <div style={{ height: "5px", background: streak.recordedToday ? "rgba(255,255,255,0.2)" : C.lineSoft, borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min((streak.current / streak.nextMilestone) * 100, 100)}%`, height: "100%", background: streak.recordedToday ? "#fff" : C.accent, borderRadius: "100px" }} />
              </div>
              <p style={{ fontSize: "11px", color: streak.recordedToday ? "rgba(255,255,255,0.6)" : C.faint, marginTop: "8px" }}>
                次の節目まであと {streak.daysToNext} 日（{streak.nextMilestone}日連続）
              </p>
            </div>
          )}
        </div>

        {/* Key metrics */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px 18px", textAlign: "center" }}>
            <span style={{ fontFamily: SERIF, fontSize: "34px", fontWeight: 500, color: C.ink, display: "block", lineHeight: 1 }}>{days}</span>
            <span style={{ fontSize: "11px", color: C.faint, letterSpacing: "0.1em", marginTop: "8px", display: "block" }}>経過日数</span>
          </div>
          <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px 18px", textAlign: "center" }}>
            <span style={{ fontFamily: SERIF, fontSize: "34px", fontWeight: 500, color: C.ink, display: "block", lineHeight: 1 }}>{streak.longest}</span>
            <span style={{ fontSize: "11px", color: C.faint, letterSpacing: "0.1em", marginTop: "8px", display: "block" }}>最長連続</span>
          </div>
          <div style={{ flex: 1, background: C.accent, borderRadius: "16px", padding: "22px 18px", textAlign: "center" }}>
            <span style={{ fontFamily: SERIF, fontSize: "34px", fontWeight: 500, color: "#fff", display: "block", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", marginTop: "8px", display: "block" }}>Score</span>
          </div>
        </div>

        {/* Next post */}
        <div style={{ background: C.accentSoft, borderRadius: "12px", padding: "14px 18px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: C.accent }}>次の記録の節目</span>
          <span style={{ fontSize: "14px", fontWeight: 500, color: C.accent }}>Day {nextMilestone}</span>
        </div>

        {/* Milestone progress */}
        <h3 style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", marginBottom: "20px" }}>進捗</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "44px", position: "relative" }}>
          <div style={{ position: "absolute", top: "13px", left: "5%", right: "5%", height: "1px", background: C.line, zIndex: 0 }} />
          {MILESTONES.map((m) => {
            const reached = days >= m;
            const recorded = recordedDays.has(m);
            return (
              <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: recorded ? C.accent : reached ? C.surface : C.surface,
                  border: `2px solid ${recorded ? C.accent : reached ? C.accent : C.line}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {recorded && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                </div>
                <span style={{ fontSize: "10px", color: reached ? C.ink : C.faint, marginTop: "8px" }}>Day {m}</span>
              </div>
            );
          })}
        </div>

        {/* Photo timeline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase" }}>写真タイムライン</h3>
          <Link href="/recovery/record" style={{ fontSize: "13px", color: C.accent, textDecoration: "none", fontWeight: 500 }}>＋ 記録する</Link>
        </div>

        {records.length === 0 ? (
          <div style={{ background: C.surface, border: `1px dashed ${C.line}`, borderRadius: "16px", padding: "40px 24px", textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "14px", color: C.sub, lineHeight: 1.8, marginBottom: "20px" }}>
              まだ記録がありません。<br />Day 0 の今を、残しておきましょう。
            </p>
            <Link href="/recovery/record" style={{ display: "inline-block", fontSize: "13px", color: "#fff", background: C.accent, borderRadius: "100px", padding: "12px 32px", textDecoration: "none" }}>
              最初の記録をする
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px", marginBottom: "40px" }}>
            {records.map((r) => (
              <div key={r.id} style={{ flexShrink: 0, width: "100px" }}>
                <div style={{
                  aspectRatio: "3/4", borderRadius: "10px",
                  background: "linear-gradient(160deg, #ece8e2 0%, #e3ddd4 100%)",
                  border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: "11px", color: C.faint, fontWeight: 500 }}>Day {r.day}</span>
                </div>
                <span style={{ fontSize: "10px", color: C.faint, marginTop: "6px", display: "block", textAlign: "center" }}>自己評価 {r.selfScore}/5</span>
              </div>
            ))}
          </div>
        )}

        {/* Vitality history */}
        {records.length > 0 && (
          <>
            <h3 style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", marginBottom: "20px" }}>Vitality 推移</h3>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px", marginBottom: "40px" }}>
              {(Object.keys(VITALITY_LABELS) as (keyof DayRecord["vitality"])[]).map((k) => {
                const avg = records.reduce((s, r) => s + r.vitality[k], 0) / records.length;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "12px", color: C.sub, width: "64px" }}>{VITALITY_LABELS[k]}</span>
                    <div style={{ flex: 1, height: "6px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden" }}>
                      <div style={{ width: `${(avg / 5) * 100}%`, height: "100%", background: C.accent, borderRadius: "100px" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: C.ink, width: "32px", textAlign: "right" }}>{avg.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>

            {/* Action history */}
            <h3 style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", marginBottom: "20px" }}>行動・感情の履歴</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
              {[...records].reverse().map((r) => (
                <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: C.accent }}>Day {r.day}</span>
                    <span style={{ fontSize: "12px", color: C.faint }}>自己評価 {r.selfScore}/5</span>
                  </div>
                  {r.careActions && <p style={{ fontSize: "13px", color: C.ink, lineHeight: 1.7, marginBottom: r.note ? "6px" : 0 }}>{r.careActions}</p>}
                  {r.note && <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7, fontStyle: "italic" }}>「{r.note}」</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Report teaser */}
        <div style={{ textAlign: "center", padding: "32px 24px", background: C.accentSoft, borderRadius: "20px" }}>
          <p style={{ fontFamily: SERIF, fontSize: "16px", lineHeight: 1.6, marginBottom: "8px", color: C.accent }}>
            {days >= 100 ? "100日、走り抜きました。" : "Day 100 で、あなたのレポートが生成されます。"}
          </p>
          <p style={{ fontSize: "12px", color: C.sub, lineHeight: 1.8, marginBottom: "20px" }}>
            Before / After・変化グラフ・100日間の記録。<br />
            希望すれば、匿名症例として誰かの希望になれます。
          </p>
          <Link href={`/report/${challenge.id}`}
            style={{ display: "inline-block", fontSize: "13px", fontWeight: 500, color: C.accent, border: `1px solid ${C.accent}`, borderRadius: "100px", padding: "12px 32px", textDecoration: "none" }}>
            {days >= 100 ? "完走レポートを作る" : "レポートをプレビュー"}
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button onClick={() => router.push("/recovery/record")}
            style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", background: C.accent, color: "#fff", border: "none", borderRadius: "100px", padding: "16px 56px", cursor: "pointer" }}>
            今日を記録する
          </button>
        </div>

      </div>
    </div>
  );
}
