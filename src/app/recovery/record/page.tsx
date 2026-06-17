"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  C, SANS, SERIF,
  getCurrentChallenge, getRecords, saveRecord, daysSince, getAIComment,
  type ChallengeData, type DayRecord,
} from "@/lib/recovery";

const VITALITY_FIELDS: { key: keyof DayRecord["vitality"]; label: string }[] = [
  { key: "sleep", label: "睡眠" },
  { key: "stress", label: "ストレス" },
  { key: "energy", label: "活力" },
  { key: "focus", label: "集中力" },
  { key: "mood", label: "気分" },
];

export default function RecordPage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [mounted, setMounted] = useState(false);

  const [photoSet, setPhotoSet] = useState(false);
  const [careActions, setCareActions] = useState("");
  const [selfScore, setSelfScore] = useState<number | null>(null);
  const [vitality, setVitality] = useState<DayRecord["vitality"]>({ sleep: 3, stress: 3, energy: 3, focus: 3, mood: 3 });
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiComment, setAiComment] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setChallenge(getCurrentChallenge());
  }, []);

  const submit = useCallback(() => {
    if (!challenge || busy || selfScore === null) return;
    setBusy(true);
    const day = daysSince(challenge.startDate);
    const rec: DayRecord = {
      id: crypto.randomUUID(),
      challengeId: challenge.id,
      day,
      careActions,
      selfScore,
      vitality,
      note,
      createdAt: new Date().toISOString(),
    };
    saveRecord(rec);
    const all = getRecords(challenge.id);
    setAiComment(getAIComment(all, rec));
    setBusy(false);
  }, [challenge, busy, selfScore, careActions, vitality, note]);

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;

  if (!challenge) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontSize: "18px", marginBottom: "20px" }}>チャレンジに参加すると記録できます</p>
          <button onClick={() => router.push("/recovery/join")} style={{ fontSize: "14px", color: "#fff", background: C.accent, border: "none", borderRadius: "100px", padding: "14px 36px", cursor: "pointer" }}>
            参加する
          </button>
        </div>
      </div>
    );
  }

  // AI comment screen
  if (aiComment !== null) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 28px", textAlign: "center" }}>
        <div style={{ maxWidth: "420px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>RECORDED</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 500, lineHeight: 1.5, margin: "20px 0 36px" }}>
            記録しました。
          </h1>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "18px", padding: "28px 26px", marginBottom: "36px", textAlign: "left" }}>
            <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", display: "block", marginBottom: "14px" }}>
              His Recoveries より
            </span>
            {aiComment.split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: "14px", color: C.ink, lineHeight: 2, marginBottom: i < aiComment.split("\n").length - 1 ? "12px" : 0 }}>
                {line}
              </p>
            ))}
          </div>
          <button onClick={() => router.push(`/challenge/${challenge.id}`)}
            style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", background: C.accent, color: "#fff", border: "none", borderRadius: "100px", padding: "16px 48px", cursor: "pointer" }}>
            ダッシュボードへ
          </button>
        </div>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", color: C.faint, textTransform: "uppercase", display: "block", marginBottom: "14px" };
  const day = daysSince(challenge.startDate);

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "440px", margin: "0 auto", padding: "44px 24px 100px" }}>

        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>DAY {day}</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 500, lineHeight: 1.5, margin: "14px 0 6px" }}>
            今日を記録する
          </h1>
          <p style={{ fontSize: "12px", color: C.sub }}>変化の証拠を、残しておく。</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* Photo (mock) */}
          <div>
            <span style={labelStyle}>写真</span>
            <button onClick={() => setPhotoSet(true)}
              style={{
                width: "100%", aspectRatio: "3/4", maxHeight: "320px", borderRadius: "16px", cursor: "pointer",
                background: photoSet ? "linear-gradient(160deg, #e8ebe6 0%, #dde3da 100%)" : C.surface,
                border: `1px ${photoSet ? "solid" : "dashed"} ${photoSet ? C.accent : C.line}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 300ms", fontFamily: SANS,
              }}>
              <span style={{ fontSize: "28px", opacity: 0.4 }}>{photoSet ? "✓" : "＋"}</span>
              <span style={{ fontSize: "13px", color: photoSet ? C.accent : C.sub }}>
                {photoSet ? "写真を記録しました" : "タップして撮影・アップロード"}
              </span>
              <span style={{ fontSize: "11px", color: C.faint }}>あなた以外には公開されません</span>
            </button>
          </div>

          {/* Care actions */}
          <div>
            <span style={labelStyle}>今日やったケア</span>
            <textarea value={careActions} onChange={(e) => setCareActions(e.target.value)}
              placeholder="例：外用薬、保湿、シーツ交換" rows={2}
              style={{ width: "100%", fontFamily: SANS, fontSize: "15px", color: C.ink, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 16px", outline: "none", resize: "none", lineHeight: 1.8 }} />
          </div>

          {/* Vitality Log */}
          <div>
            <span style={labelStyle}>Vitality Log</span>
            <p style={{ fontSize: "11px", color: C.faint, marginTop: "-8px", marginBottom: "18px", lineHeight: 1.7 }}>
              改善との相関を後で振り返るための記録です。任意。
            </p>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px" }}>
              {VITALITY_FIELDS.map((f) => (
                <div key={f.key} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: C.ink }}>{f.label}</span>
                    <span style={{ fontSize: "13px", color: C.accent, fontWeight: 500 }}>{vitality[f.key]}</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setVitality({ ...vitality, [f.key]: n })}
                        style={{
                          flex: 1, height: "8px", borderRadius: "100px", cursor: "pointer", border: "none",
                          background: n <= vitality[f.key] ? C.accent : C.lineSoft, transition: "all 200ms",
                        }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self score */}
          <div>
            <span style={labelStyle}>今日の自己評価</span>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const sel = selfScore === n;
                return (
                  <button key={n} onClick={() => setSelfScore(n)}
                    style={{
                      width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", transition: "all 250ms",
                      fontSize: "15px", fontWeight: sel ? 500 : 400, fontFamily: SANS,
                      background: sel ? C.accent : C.surface,
                      border: `1px solid ${sel ? C.accent : C.line}`,
                      color: sel ? "#fff" : C.sub,
                    }}>
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <span style={labelStyle}>一言メモ</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="今の気持ちを、ひとことだけ。" rows={2}
              style={{ width: "100%", fontFamily: SANS, fontSize: "15px", color: C.ink, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 16px", outline: "none", resize: "none", lineHeight: 1.8 }} />
          </div>

          {/* Submit */}
          <button onClick={submit} disabled={selfScore === null || busy}
            style={{
              width: "100%", fontSize: "14px", fontWeight: 500, letterSpacing: "0.1em",
              background: selfScore !== null ? C.accent : C.lineSoft,
              color: selfScore !== null ? "#fff" : C.faint,
              border: "none", borderRadius: "100px", padding: "18px",
              cursor: selfScore !== null ? "pointer" : "default", transition: "all 300ms",
            }}>
            {busy ? "..." : "記録する"}
          </button>

        </div>
      </div>
    </div>
  );
}
