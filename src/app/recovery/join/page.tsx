"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const F = "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif";

const CATEGORIES = [
  { id: "back_acne", label: "背中ニキビ", en: "Back Acne" },
  { id: "body_odor", label: "体臭", en: "Body Odor" },
  { id: "skin_aging", label: "肌・老け", en: "Skin Aging" },
  { id: "hair_loss", label: "薄毛", en: "Hair Loss" },
  { id: "sweat", label: "多汗症", en: "Hyperhidrosis" },
  { id: "other", label: "その他", en: "Other" },
];

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
  const [done, setDone] = useState(false);

  const canSubmit = nickname && age && gender && category && severity && goal && agreed;

  const submit = useCallback(async () => {
    if (busy || !canSubmit) return;
    setBusy(true);
    const data = {
      id: crypto.randomUUID(),
      nickname, age, gender, category, severity, goal, isPublic,
      startDate: new Date().toISOString(),
      status: "active",
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("recovery_challenges") || "[]") as unknown[];
      existing.push(data);
      localStorage.setItem("recovery_challenges", JSON.stringify(existing));
      localStorage.setItem("recovery_current", JSON.stringify(data));
    } catch {}
    setBusy(false);
    setDone(true);
  }, [busy, canSubmit, nickname, age, gender, category, severity, goal, isPublic]);

  const labelStyle = { fontSize: "11px", fontWeight: 400 as const, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" as const, display: "block" as const, marginBottom: "8px" };
  const inputStyle = { width: "100%", fontFamily: F, fontSize: "15px", fontWeight: 300 as const, color: "#fff", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 16px", outline: "none", transition: "border-color 400ms ease" };

  if (done) {
    return (
      <div style={{ fontFamily: F, color: "#fff", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 28px", textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 200, letterSpacing: "0.06em", lineHeight: 1.8, marginBottom: "20px" }}>
            ようこそ。
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 2, marginBottom: "12px" }}>
            Day 0 が始まりました。
          </p>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.25)", lineHeight: 2, marginBottom: "48px" }}>
            100日後、この瞬間を振り返ったとき、<br />きっと意味がある。
          </p>

          <p style={{
            fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", lineHeight: 2,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "14px", padding: "20px 24px", marginBottom: "36px",
          }}>
            記録ありがとうございます。<br />
            変化はまだ小さくても、<br />
            継続そのものが改善の土台です。
          </p>

          <button onClick={() => router.push("/recovery")}
            style={{
              fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em",
              background: "transparent", color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px", padding: "14px 48px", cursor: "pointer",
              transition: "all 400ms ease",
            }}>
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F, color: "#fff", minHeight: "100dvh", padding: "60px 28px 100px" }}>
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(139,92,246,0.4)" }}>SEASON 1</span>
          <h1 style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.8, margin: "16px 0 8px" }}>
            チャレンジに参加する
          </h1>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.25)" }}>所要時間 2分 · 匿名</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* Nickname */}
          <div>
            <label style={labelStyle}>ニックネーム</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
              placeholder="匿名で表示されます" style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }} />
          </div>

          {/* Age */}
          <div>
            <label style={labelStyle}>年齢</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["10代", "20代", "30代", "40代", "50代〜"].map((a) => (
                <button key={a} onClick={() => setAge(a)}
                  style={{
                    fontSize: "13px", fontWeight: 300, padding: "10px 20px",
                    borderRadius: "100px", cursor: "pointer", transition: "all 300ms",
                    background: age === a ? "rgba(255,255,255,0.1)" : "transparent",
                    border: `1px solid ${age === a ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                    color: age === a ? "#fff" : "rgba(255,255,255,0.4)",
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label style={labelStyle}>性別</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["男性", "女性", "その他"].map((g) => (
                <button key={g} onClick={() => setGender(g)}
                  style={{
                    fontSize: "13px", fontWeight: 300, padding: "10px 24px",
                    borderRadius: "100px", cursor: "pointer", transition: "all 300ms",
                    background: gender === g ? "rgba(255,255,255,0.1)" : "transparent",
                    border: `1px solid ${gender === g ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                    color: gender === g ? "#fff" : "rgba(255,255,255,0.4)",
                  }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>悩みカテゴリ</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    width: "100%", textAlign: "left", padding: "14px 18px",
                    borderRadius: "12px", cursor: "pointer", transition: "all 300ms",
                    background: category === c.id ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${category === c.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)"}`,
                    color: "#fff",
                  }}>
                  <span style={{ fontSize: "14px", fontWeight: category === c.id ? 400 : 300 }}>{c.label}</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>{c.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label style={labelStyle}>深刻度</label>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const sel = severity === n;
                return (
                  <button key={n} onClick={() => setSeverity(n)}
                    style={{
                      width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer",
                      transition: "all 300ms", fontSize: "14px", fontWeight: sel ? 500 : 300,
                      fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center",
                      background: sel ? "rgba(255,255,255,0.12)" : "transparent",
                      border: `1px solid ${sel ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                      color: sel ? "#fff" : `rgba(255,255,255,${0.15 + n * 0.1})`,
                    }}>
                    {n}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>気になる程度</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>とても深刻</span>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label style={labelStyle}>100日後の目標</label>
            <textarea value={goal} onChange={(e) => setGoal(e.target.value)}
              placeholder="例：背中を気にせずTシャツを着たい" rows={3}
              style={{ ...inputStyle, resize: "none" as const, lineHeight: 2 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }} />
          </div>

          {/* Public */}
          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}
              onClick={() => setIsPublic(!isPublic)}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0, marginTop: "2px",
                border: `1px solid ${isPublic ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.1)"}`,
                background: isPublic ? "rgba(139,92,246,0.15)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 300ms",
              }}>
                {isPublic && <span style={{ fontSize: "12px", color: "rgba(139,92,246,0.8)" }}>✓</span>}
              </div>
              <div>
                <span style={{ fontSize: "13px", fontWeight: 300, display: "block" }}>完走後、匿名症例として公開してもよい</span>
                <span style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.2)", marginTop: "4px", display: "block" }}>個人が特定されない形で公開されます。後から変更可能。</span>
              </div>
            </label>
          </div>

          {/* Terms */}
          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}
              onClick={() => setAgreed(!agreed)}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0, marginTop: "2px",
                border: `1px solid ${agreed ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                background: agreed ? "rgba(255,255,255,0.1)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 300ms",
              }}>
                {agreed && <span style={{ fontSize: "12px" }}>✓</span>}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
                利用規約に同意する（写真は暗号化保存、匿名公開は任意、いつでも退会可能）
              </span>
            </label>
          </div>

          {/* Submit */}
          <div style={{ textAlign: "center", paddingTop: "16px" }}>
            <button onClick={submit} disabled={!canSubmit || busy}
              style={{
                width: "100%", fontSize: "14px", fontWeight: 400, letterSpacing: "0.1em",
                background: canSubmit ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${canSubmit ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: "100px", padding: "18px",
                color: canSubmit ? "#fff" : "rgba(255,255,255,0.2)",
                cursor: canSubmit ? "pointer" : "default",
                transition: "all 400ms ease",
              }}>
              {busy ? "..." : "Day 0 を始める"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
