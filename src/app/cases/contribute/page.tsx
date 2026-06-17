"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  C, SANS, SERIF, CATEGORIES, AGE_BANDS, GENDERS,
  contributeCase, fmtCost, type CategoryId,
} from "@/lib/recovery";

const DURATIONS = [
  { label: "1ヶ月", days: 30 },
  { label: "3ヶ月", days: 90 },
  { label: "半年", days: 180 },
  { label: "1年〜", days: 365 },
];

export default function ContributePage() {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryId | "">("");
  const [ageBand, setAgeBand] = useState("");
  const [gender, setGender] = useState("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [clinic, setClinic] = useState("");
  const [procedure, setProcedure] = useState("");
  const [cost, setCost] = useState("");
  const [durationDays, setDurationDays] = useState<number | null>(null);
  const [improvement, setImprovement] = useState(50);
  const [worthIt, setWorthIt] = useState<boolean | null>(null);
  const [receiptSet, setReceiptSet] = useState(false);
  const [whatDid, setWhatDid] = useState("");
  const [failures, setFailures] = useState("");
  const [comment, setComment] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  const canSubmit = category && ageBand && gender && severity && procedure && cost && durationDays !== null && worthIt !== null && comment && agreed;

  const submit = useCallback(() => {
    if (!canSubmit || busy) return;
    setBusy(true);
    const c = contributeCase({
      category: category as CategoryId,
      ageBand, gender, severity: severity as number,
      clinic, procedure,
      cost: parseInt(cost || "0", 10),
      durationDays: durationDays as number,
      improvementDegree: improvement,
      worthIt: worthIt as boolean,
      verified: receiptSet,
      beforeNote: "", afterNote: "",
      whatTheyDid: whatDid.split("\n").map((s) => s.trim()).filter(Boolean),
      failures: failures.split("\n").map((s) => s.trim()).filter(Boolean),
      comment,
    });
    router.push(`/cases/${c.id}?new=1`);
  }, [canSubmit, busy, category, ageBand, gender, severity, clinic, procedure, cost, durationDays, improvement, worthIt, receiptSet, whatDid, failures, comment, router]);

  const fieldLabel: React.CSSProperties = { fontSize: "12px", fontWeight: 500, color: C.faint, letterSpacing: "0.08em", display: "block", marginBottom: "12px" };
  const sub: React.CSSProperties = { fontSize: "11px", color: C.faint, marginTop: "-6px", marginBottom: "12px", lineHeight: 1.6 };
  const input: React.CSSProperties = { width: "100%", fontFamily: SANS, fontSize: "15px", color: C.ink, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 16px", outline: "none" };
  const chip = (active: boolean): React.CSSProperties => ({
    fontSize: "13px", fontWeight: 400, padding: "10px 18px", borderRadius: "100px", cursor: "pointer", transition: "all 250ms",
    background: active ? C.accent : "transparent", border: `1px solid ${active ? C.accent : C.line}`, color: active ? "#fff" : C.sub, fontFamily: SANS,
  });

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "460px", margin: "0 auto", padding: "44px 24px 100px" }}>

        <Link href="/cases" style={{ fontSize: "13px", color: C.sub, textDecoration: "none", display: "inline-block", marginBottom: "28px" }}>← 戻る</Link>

        <div style={{ marginBottom: "36px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>CONTRIBUTE</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 500, lineHeight: 1.5, margin: "14px 0 10px" }}>
            あなたの記録を、<br />誰かの地図にする
          </h1>
          <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.9 }}>
            完璧な成功談でなくて構いません。失敗も遠回りも、同じ悩みの誰かには宝になります。<span style={{ color: C.ink }}>すべて匿名</span>です。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* category */}
          <div>
            <label style={fieldLabel}>悩み</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} style={chip(category === c.id)} onClick={() => setCategory(c.id)}>{c.label}</button>
              ))}
            </div>
          </div>

          {/* age + gender */}
          <div>
            <label style={fieldLabel}>年齢帯</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {AGE_BANDS.map((a) => <button key={a} style={chip(ageBand === a)} onClick={() => setAgeBand(a)}>{a}</button>)}
            </div>
          </div>
          <div>
            <label style={fieldLabel}>性別</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {GENDERS.map((g) => <button key={g} style={chip(gender === g)} onClick={() => setGender(g)}>{g}</button>)}
            </div>
          </div>

          {/* severity */}
          <div>
            <label style={fieldLabel}>当時の重症度</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const s = severity === n;
                return <button key={n} onClick={() => setSeverity(n)}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer", fontFamily: SANS, fontSize: "14px", fontWeight: s ? 500 : 400, background: s ? C.accent : C.surface, border: `1px solid ${s ? C.accent : C.line}`, color: s ? "#fff" : C.sub, transition: "all 250ms" }}>{n}</button>;
              })}
            </div>
          </div>

          {/* clinic + procedure — 口コミより深い核 */}
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: C.accent }}>どこで・どう改善したか</span>
            <div>
              <label style={fieldLabel}>受けた施術・方法 <span style={{ color: C.accent }}>*</span></label>
              <input style={input} value={procedure} onChange={(e) => setProcedure(e.target.value)} placeholder="例：内服薬、ケミカルピーリング、生活改善" />
            </div>
            <div>
              <label style={fieldLabel}>クリニック・場所（任意）</label>
              <p style={sub}>匿名表記でOK（例：都内の皮膚科）。誹謗中傷はできません。</p>
              <input style={input} value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="例：AGA専門クリニック（オンライン）" />
            </div>
            <div>
              <label style={fieldLabel}>かかった実費用（円） <span style={{ color: C.accent }}>*</span></label>
              <input style={input} type="number" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="例：38000" />
            </div>
            {/* receipt = verification */}
            <div>
              <label style={fieldLabel}>領収書で検証（任意）</label>
              <p style={sub}>領収書をアップすると「検証済み」バッジが付き、信頼度が上がります。</p>
              <button onClick={() => setReceiptSet(!receiptSet)}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: SANS, fontSize: "13px", transition: "all 250ms",
                  background: receiptSet ? C.accentSoft : C.bg, border: `1px ${receiptSet ? "solid" : "dashed"} ${receiptSet ? C.accent : C.line}`, color: receiptSet ? C.accent : C.sub }}>
                {receiptSet ? "✓ 領収書を添付しました（検証済みになります）" : "＋ 領収書を添付する"}
              </button>
            </div>
          </div>

          {/* duration */}
          <div>
            <label style={fieldLabel}>改善までの期間 <span style={{ color: C.accent }}>*</span></label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {DURATIONS.map((d) => <button key={d.days} style={chip(durationDays === d.days)} onClick={() => setDurationDays(d.days)}>{d.label}</button>)}
            </div>
          </div>

          {/* improvement */}
          <div>
            <label style={fieldLabel}>どれくらい改善した？ <span style={{ color: C.accent }}>{improvement}%</span></label>
            <input type="range" min={0} max={100} step={5} value={improvement} onChange={(e) => setImprovement(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: C.accent }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: C.faint }}>変化なし</span>
              <span style={{ fontSize: "10px", color: C.faint }}>大きく改善</span>
            </div>
          </div>

          {/* worth it */}
          <div>
            <label style={fieldLabel}>また受けますか？（Worth It） <span style={{ color: C.accent }}>*</span></label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ ...chip(worthIt === true), flex: 1 }} onClick={() => setWorthIt(true)}>はい、受ける</button>
              <button style={{ ...chip(worthIt === false), flex: 1 }} onClick={() => setWorthIt(false)}>いいえ</button>
            </div>
          </div>

          {/* what did */}
          <div>
            <label style={fieldLabel}>具体的にやったこと（1行ずつ）</label>
            <textarea style={{ ...input, resize: "none", lineHeight: 1.9 }} rows={3} value={whatDid} onChange={(e) => setWhatDid(e.target.value)} placeholder={"外用薬を毎晩\nシーツを週2回交換\n汗をかいたらすぐ流す"} />
          </div>

          {/* failures */}
          <div>
            <label style={fieldLabel}>失敗・遠回り（1行ずつ）</label>
            <p style={sub}>これが一番、誰かの役に立ちます。</p>
            <textarea style={{ ...input, resize: "none", lineHeight: 1.9 }} rows={2} value={failures} onChange={(e) => setFailures(e.target.value)} placeholder={"市販薬で自己流→悪化\n効果を期待しすぎて落ち込んだ"} />
          </div>

          {/* comment */}
          <div>
            <label style={fieldLabel}>振り返って一言 <span style={{ color: C.accent }}>*</span></label>
            <textarea style={{ ...input, resize: "none", lineHeight: 1.9 }} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="完璧じゃなくていい。今の正直な気持ちを。" />
          </div>

          {/* agreement */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }} onClick={() => setAgreed(!agreed)}>
            <div style={{ width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "2px", border: `1px solid ${agreed ? C.accent : C.line}`, background: agreed ? C.accent : C.surface, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 250ms" }}>
              {agreed && <span style={{ fontSize: "12px", color: "#fff" }}>✓</span>}
            </div>
            <span style={{ fontSize: "12px", color: C.sub, lineHeight: 1.8 }}>
              本人の実体験であること、匿名公開されること、特定個人・施設への誹謗中傷を含まないことに同意します。
            </span>
          </label>

          <button onClick={submit} disabled={!canSubmit || busy}
            style={{ width: "100%", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em", background: canSubmit ? C.accent : C.lineSoft, color: canSubmit ? "#fff" : C.faint, border: "none", borderRadius: "100px", padding: "18px", cursor: canSubmit ? "pointer" : "default", transition: "all 300ms" }}>
            {busy ? "..." : "記録を公開して、集合知を解放する"}
          </button>
          <p style={{ fontSize: "11px", color: C.faint, textAlign: "center", lineHeight: 1.7, marginTop: "-12px" }}>
            投稿すると、似た人の「何から始めたか・失敗」がすべて見えるようになります。
          </p>

        </div>
      </div>
    </div>
  );
}
