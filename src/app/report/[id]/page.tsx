"use client";

import Link from "next/link";
import { use, useEffect, useState, useMemo } from "react";
import {
  C, SANS, SERIF,
  getChallengeById, getRecords, getReport, saveReport, publishAsCase, unpublishCase,
  calcImprovementScore, daysSince, fmtCost, fmtDuration,
  type ChallengeData, type DayRecord, type Report,
} from "@/lib/recovery";

const VITALITY_LABELS: Record<keyof DayRecord["vitality"], string> = {
  sleep: "睡眠", stress: "ストレス", energy: "活力", focus: "集中", mood: "気分",
};

function Frame({ label }: { label: string }) {
  const after = label === "After";
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        aspectRatio: "3/4", borderRadius: "12px",
        background: after ? "linear-gradient(160deg, #e8ebe6 0%, #dde3da 100%)" : "linear-gradient(160deg, #ece8e2 0%, #e3ddd4 100%)",
        border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.faint }}>{label.toUpperCase()}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h3 style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", marginBottom: "16px" }}>{title}</h3>
      {children}
    </div>
  );
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [report, setReport] = useState<Report | null>(null);

  const [cost, setCost] = useState("");
  const [comment, setComment] = useState("");
  const [publish, setPublish] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ch = getChallengeById(id);
    setChallenge(ch);
    if (ch) {
      const recs = getRecords(ch.id);
      setRecords(recs);
      const existing = getReport(ch.id);
      if (existing) {
        setReport(existing);
        setCost(String(existing.cost || ""));
        setComment(existing.comment);
        setPublish(existing.isPublished);
      } else {
        setPublish(ch.isPublic);
      }
    }
  }, [id]);

  const score = useMemo(() => calcImprovementScore(records), [records]);

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;

  if (!challenge) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontSize: "18px", marginBottom: "20px" }}>レポートが見つかりません</p>
          <Link href="/cases" style={{ fontSize: "14px", color: "#fff", background: C.accent, borderRadius: "100px", padding: "14px 36px", textDecoration: "none" }}>改善事例を見る</Link>
        </div>
      </div>
    );
  }

  const duration = records.length ? records[records.length - 1].day : daysSince(challenge.startDate);

  const handleSave = () => {
    const r: Report = {
      id: report?.id ?? crypto.randomUUID(),
      challengeId: challenge.id,
      cost: parseInt(cost || "0", 10),
      comment,
      isPublished: publish,
      recoveryScore: score,
      createdAt: report?.createdAt ?? new Date().toISOString(),
    };
    saveReport(r);
    setReport(r);
    if (publish) {
      publishAsCase(challenge, records, r);
    } else {
      unpublishCase(challenge.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px 120px" }}>

        <Link href={`/challenge/${challenge.id}`} style={{ fontSize: "13px", color: C.sub, textDecoration: "none", display: "inline-block", marginBottom: "32px" }}>
          ← ダッシュボード
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.accent }}>TRANSFORMATION REPORT</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "27px", fontWeight: 500, lineHeight: 1.5, margin: "18px 0 8px" }}>
            {challenge.nickname}さんの<br />100日間の記録
          </h1>
          <p style={{ fontSize: "13px", color: C.sub }}>{challenge.goal}</p>
        </div>

        {/* Before / After */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "44px" }}>
          <Frame label="Before" />
          <Frame label="After" />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: C.line, borderRadius: "12px", overflow: "hidden", marginBottom: "44px" }}>
          {[
            { label: "改善期間", value: fmtDuration(duration) },
            { label: "費用", value: report ? fmtCost(report.cost) : "—" },
            { label: "改善スコア", value: String(score) },
          ].map((m) => (
            <div key={m.label} style={{ background: C.surface, padding: "18px 8px", textAlign: "center" }}>
              <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "6px" }}>{m.label}</span>
              <span style={{ fontSize: "16px", fontWeight: 500, fontFamily: SERIF }}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* What they did */}
        {records.length > 0 && (
          <Section title="やったこと">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Array.from(new Set(records.flatMap((r) => r.careActions.split(/[、,\n]/).map((s) => s.trim()).filter(Boolean)))).slice(0, 8).map((w, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: C.accent, fontSize: "13px", lineHeight: 1.7 }}>—</span>
                  <span style={{ fontSize: "14px", color: C.ink, lineHeight: 1.7 }}>{w}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Vitality change */}
        {records.length > 0 && (
          <Section title="活力の変化">
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px" }}>
              {(Object.keys(VITALITY_LABELS) as (keyof DayRecord["vitality"])[]).map((k) => {
                const first = records[0].vitality[k];
                const last = records[records.length - 1].vitality[k];
                const diff = last - first;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "12px", color: C.sub, width: "64px" }}>{VITALITY_LABELS[k]}</span>
                    <div style={{ flex: 1, height: "6px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden" }}>
                      <div style={{ width: `${(last / 5) * 100}%`, height: "100%", background: C.accent, borderRadius: "100px" }} />
                    </div>
                    <span style={{ fontSize: "12px", width: "44px", textAlign: "right", color: diff > 0 ? C.accent : C.faint }}>
                      {diff > 0 ? "+" : ""}{diff}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Emotion timeline */}
        {records.filter((r) => r.note).length > 0 && (
          <Section title="感情の変化">
            <div style={{ position: "relative", paddingLeft: "24px" }}>
              <div style={{ position: "absolute", left: "5px", top: "6px", bottom: "6px", width: "1px", background: C.line }} />
              {records.filter((r) => r.note).map((r, i, arr) => (
                <div key={r.id} style={{ position: "relative", marginBottom: i < arr.length - 1 ? "20px" : 0 }}>
                  <div style={{ position: "absolute", left: "-24px", top: "4px", width: "11px", height: "11px", borderRadius: "50%", background: C.bg, border: `2px solid ${C.accent}` }} />
                  <span style={{ fontSize: "11px", fontWeight: 500, color: C.accent }}>Day {r.day}</span>
                  <p style={{ fontSize: "14px", color: C.ink, lineHeight: 1.7, marginTop: "3px" }}>{r.note}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Edit / Publish ── */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "20px", padding: "28px 24px", marginTop: "16px" }}>
          <h3 style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 500, marginBottom: "8px" }}>レポートを仕上げる</h3>
          <p style={{ fontSize: "12px", color: C.sub, lineHeight: 1.7, marginBottom: "24px" }}>
            総費用と本人コメントを記入して、公開設定を選びます。
          </p>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: C.faint, letterSpacing: "0.08em", display: "block", marginBottom: "10px" }}>総費用（円）</label>
            <input type="number" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="例：38000"
              style={{ width: "100%", fontFamily: SANS, fontSize: "15px", color: C.ink, background: C.bg, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 16px", outline: "none" }} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: C.faint, letterSpacing: "0.08em", display: "block", marginBottom: "10px" }}>本人コメント</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="100日間を振り返って。完璧じゃなくていい。"
              style={{ width: "100%", fontFamily: SANS, fontSize: "15px", color: C.ink, background: C.bg, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 16px", outline: "none", resize: "none", lineHeight: 1.9 }} />
          </div>

          {/* Public toggle */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: C.faint, letterSpacing: "0.08em", display: "block", marginBottom: "12px" }}>公開設定</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setPublish(false)}
                style={{
                  flex: 1, fontSize: "13px", fontWeight: publish ? 400 : 500, padding: "14px", borderRadius: "12px", cursor: "pointer", transition: "all 250ms",
                  background: !publish ? C.accentSoft : C.bg, border: `1px solid ${!publish ? C.accent : C.line}`, color: !publish ? C.accent : C.sub, fontFamily: SANS,
                }}>非公開</button>
              <button onClick={() => setPublish(true)}
                style={{
                  flex: 1, fontSize: "13px", fontWeight: publish ? 500 : 400, padding: "14px", borderRadius: "12px", cursor: "pointer", transition: "all 250ms",
                  background: publish ? C.accentSoft : C.bg, border: `1px solid ${publish ? C.accent : C.line}`, color: publish ? C.accent : C.sub, fontFamily: SANS,
                }}>匿名で公開</button>
            </div>
            {publish && (
              <p style={{ fontSize: "11px", color: C.faint, marginTop: "10px", lineHeight: 1.7 }}>
                ニックネームは含まれません。年齢帯・悩み・改善期間・記録のみが匿名症例として Improvement Library に掲載されます。
              </p>
            )}
          </div>

          <button onClick={handleSave}
            style={{ width: "100%", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", background: C.accent, color: "#fff", border: "none", borderRadius: "100px", padding: "16px", cursor: "pointer" }}>
            {saved ? "保存しました ✓" : publish ? "保存して匿名公開する" : "レポートを保存する"}
          </button>

          {saved && publish && (
            <Link href={`/cases/u_${challenge.id.slice(0, 8)}`} style={{ display: "block", textAlign: "center", marginTop: "16px", fontSize: "13px", color: C.accent, textDecoration: "underline" }}>
              公開されたあなたの症例を見る →
            </Link>
          )}
        </div>

        {/* Closing */}
        <p style={{ fontFamily: SERIF, fontSize: "16px", textAlign: "center", lineHeight: 1.8, color: C.sub, marginTop: "48px" }}>
          あなたの100日が、<br />次に悩む誰かの地図になる。
        </p>

      </div>
    </div>
  );
}
