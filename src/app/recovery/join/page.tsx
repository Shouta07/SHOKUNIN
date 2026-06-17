"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { C, SANS, SERIF, CATEGORIES, AGE_BANDS, GENDERS } from "@/lib/recovery";

export default function JoinPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [goal, setGoal] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const canSubmit = nickname && age && gender && category && severity && goal && agreed;

  const submit = useCallback(() => {
    if (busy || !canSubmit) return;
    setBusy(true);
    const id = crypto.randomUUID();
    const data = {
      id, nickname, age, gender, category, severity, goal, isPublic,
      startDate: new Date().toISOString(), status: "active", createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("recovery_challenges") || "[]") as unknown[];
      existing.push(data);
      localStorage.setItem("recovery_challenges", JSON.stringify(existing));
      localStorage.setItem("recovery_current", JSON.stringify(data));
    } catch {}
    setBusy(false);
    setDone(id);
  }, [busy, canSubmit, nickname, age, gender, category, severity, goal, isPublic]);

  const fieldLabel: React.CSSProperties = { fontSize: "12px", fontWeight: 500, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "12px" };
  const inputStyle: React.CSSProperties = { width: "100%", fontFamily: SANS, fontSize: "15px", color: C.ink, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 16px", outline: "none" };

  const chip = (active: boolean): React.CSSProperties => ({
    fontSize: "13px", fontWeight: 400, padding: "10px 20px", borderRadius: "100px", cursor: "pointer", transition: "all 250ms",
    background: active ? C.accent : "transparent", border: `1px solid ${active ? C.accent : C.line}`,
    color: active ? "#fff" : C.sub, fontFamily: SANS,
  });

  if (done) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 28px", textAlign: "center" }}>
        <div style={{ maxWidth: "420px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>DAY 0</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "28px", fontWeight: 500, lineHeight: 1.5, margin: "16px 0 20px" }}>
            ようこそ。
          </h1>
          <p style={{ fontSize: "14px", color: C.sub, lineHeight: 2, marginBottom: "36px" }}>
            100日後、この瞬間を振り返ったとき、<br />きっと意味がある。
          </p>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "24px 26px", marginBottom: "36px", textAlign: "left" }}>
            <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", display: "block", marginBottom: "12px" }}>His Recoveries より</span>
            <p style={{ fontSize: "14px", color: C.ink, lineHeight: 2 }}>
              記録ありがとうございます。<br />最初の一歩が、一番むずかしい一歩でした。<br />あなたの記録は、未来の誰かの助けになります。
            </p>
          </div>
          <button onClick={() => router.push(`/challenge/${done}`)}
            style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", background: C.accent, color: "#fff", border: "none", borderRadius: "100px", padding: "16px 48px", cursor: "pointer" }}>
            ダッシュボードへ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "440px", margin: "0 auto", padding: "56px 24px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>SEASON 1</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 500, lineHeight: 1.5, margin: "16px 0 8px" }}>
            私も挑戦する
          </h1>
          <p style={{ fontSize: "12px", color: C.sub }}>所要時間 2分 · 匿名</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          <div>
            <label style={fieldLabel}>ニックネーム</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="匿名で表示されます" style={inputStyle} />
          </div>

          <div>
            <label style={fieldLabel}>年齢帯</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {AGE_BANDS.map((a) => (
                <button key={a} style={chip(age === a)} onClick={() => setAge(a)}>{a}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={fieldLabel}>性別</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {GENDERS.map((g) => (
                <button key={g} style={chip(gender === g)} onClick={() => setGender(g)}>{g}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={fieldLabel}>悩み</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left",
                    padding: "15px 18px", borderRadius: "12px", cursor: "pointer", transition: "all 250ms",
                    background: category === c.id ? C.accentSoft : C.surface,
                    border: `1px solid ${category === c.id ? C.accent : C.line}`, color: C.ink,
                  }}>
                  <span style={{ fontSize: "14px", fontWeight: category === c.id ? 500 : 400 }}>{c.label}</span>
                  <span style={{ fontSize: "10px", color: C.faint, letterSpacing: "0.08em" }}>{c.en}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={fieldLabel}>深刻度</label>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const sel = severity === n;
                return (
                  <button key={n} onClick={() => setSeverity(n)}
                    style={{
                      width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", transition: "all 250ms",
                      fontSize: "15px", fontWeight: sel ? 500 : 400, fontFamily: SANS,
                      background: sel ? C.accent : C.surface, border: `1px solid ${sel ? C.accent : C.line}`,
                      color: sel ? "#fff" : C.sub,
                    }}>
                    {n}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "10px", color: C.faint }}>気になる程度</span>
              <span style={{ fontSize: "10px", color: C.faint }}>とても深刻</span>
            </div>
          </div>

          <div>
            <label style={fieldLabel}>100日後の目標</label>
            <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例：背中を気にせずTシャツを着たい" rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.9 }} />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }} onClick={() => setIsPublic(!isPublic)}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "2px",
                border: `1px solid ${isPublic ? C.accent : C.line}`, background: isPublic ? C.accent : C.surface,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 250ms",
              }}>
                {isPublic && <span style={{ fontSize: "12px", color: "#fff" }}>✓</span>}
              </div>
              <div>
                <span style={{ fontSize: "13px", color: C.ink, display: "block" }}>完走後、匿名症例として公開してもよい</span>
                <span style={{ fontSize: "11px", color: C.faint, marginTop: "4px", display: "block", lineHeight: 1.6 }}>個人が特定されない形で公開されます。後から変更可能。</span>
              </div>
            </label>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }} onClick={() => setAgreed(!agreed)}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "2px",
                border: `1px solid ${agreed ? C.accent : C.line}`, background: agreed ? C.accent : C.surface,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 250ms",
              }}>
                {agreed && <span style={{ fontSize: "12px", color: "#fff" }}>✓</span>}
              </div>
              <span style={{ fontSize: "12px", color: C.sub, lineHeight: 1.8 }}>
                利用規約に同意する（写真は暗号化保存、匿名公開は任意、いつでも退会可能）
              </span>
            </label>
          </div>

          <button onClick={submit} disabled={!canSubmit || busy}
            style={{
              width: "100%", fontSize: "14px", fontWeight: 500, letterSpacing: "0.1em",
              background: canSubmit ? C.accent : C.lineSoft, color: canSubmit ? "#fff" : C.faint,
              border: "none", borderRadius: "100px", padding: "18px",
              cursor: canSubmit ? "pointer" : "default", transition: "all 300ms",
            }}>
            {busy ? "..." : "Day 0 を始める"}
          </button>

        </div>
      </div>
    </div>
  );
}
