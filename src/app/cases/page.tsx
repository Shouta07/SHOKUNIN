"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  C, SANS, SERIF, SEED_CASES, CATEGORIES, AGE_BANDS, OCCUPATIONS, WORTH_IT_LABELS,
  getPublishedCases, hasContributed, calcAggregate, fmtCost, fmtDuration,
  type CategoryId, type CaseRecord, type Aggregate,
} from "@/lib/recovery";

type Phase = "top" | "ask" | "searching" | "reveal" | "browse";
const BUDGETS = [30000, 100000, 300000];

export default function CasesPage() {
  const [cat, setCat] = useState<CategoryId | "">("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [published, setPublished] = useState<CaseRecord[]>([]);
  const [contributed, setContributed] = useState(false);
  const [phase, setPhase] = useState<Phase>("top");
  const [step, setStep] = useState(0);

  useEffect(() => {
    setPublished(getPublishedCases());
    setContributed(hasContributed());
    const p = new URLSearchParams(window.location.search).get("c");
    if (p && CATEGORIES.some((c) => c.id === p)) { setCat(p as CategoryId); setPhase("browse"); }
  }, []);

  const allCases = useMemo(() => [...published, ...SEED_CASES], [published]);

  const results = useMemo(() => allCases.filter((c) => {
    if (cat && c.category !== cat) return false;
    if (age && c.ageBand !== age) return false;
    if (occupation && c.occupation !== occupation) return false;
    if (budget !== "" && c.cost > (budget as number)) return false;
    return true;
  }), [allCases, cat, age, occupation, budget]);

  const agg = useMemo(() => calcAggregate(results), [results]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of allCases) m.set(c.category, (m.get(c.category) ?? 0) + 1);
    return m;
  }, [allCases]);

  const hasFilter = Boolean(cat || age || occupation || budget !== "");
  const filterLabel = useMemo(() => {
    const parts: string[] = [];
    if (age) parts.push(age);
    if (occupation) parts.push(occupation);
    if (cat) parts.push(CATEGORIES.find((c) => c.id === cat)?.label ?? "");
    if (budget !== "") parts.push(`予算${fmtCost(budget as number)}以内`);
    return parts.filter(Boolean).join("・");
  }, [cat, age, occupation, budget]);

  const chip = (active: boolean): React.CSSProperties => ({
    fontSize: "13px", fontWeight: 400, padding: "9px 18px", borderRadius: "100px", cursor: "pointer", transition: "all 250ms",
    background: active ? C.accent : "transparent", border: `1px solid ${active ? C.accent : C.line}`, color: active ? "#fff" : C.sub, fontFamily: SANS, whiteSpace: "nowrap",
  });
  const fieldLabel: React.CSSProperties = { fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: C.faint, textTransform: "uppercase", display: "block", marginBottom: "10px" };

  const advance = () => {
    if (step < 3) setStep((s) => s + 1);
    else { setPhase("searching"); setTimeout(() => setPhase("reveal"), 1700); }
  };
  const resetFilters = () => { setCat(""); setAge(""); setOccupation(""); setBudget(""); };

  const QUESTIONS = [
    { sub: "まず、ひとつだけ", title: "何に、一番苦しんでいる？", body: (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => { setCat(c.id); setTimeout(advance, 220); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", padding: "15px 20px", borderRadius: "14px", cursor: "pointer", transition: "all 200ms", background: cat === c.id ? C.accentSoft : C.surface, border: `1px solid ${cat === c.id ? C.accent : C.line}`, color: C.ink }}>
            <span style={{ fontSize: "15px" }}>{c.label}</span>
            <span style={{ fontSize: "11px", color: C.faint }}>{counts.get(c.id) ?? 0}件</span>
          </button>
        ))}
      </div>
    )},
    { sub: "あなたのこと", title: "年齢は？", body: (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {AGE_BANDS.map((a) => <button key={a} style={chip(age === a)} onClick={() => { setAge(a); setTimeout(advance, 220); }}>{a}</button>)}
      </div>
    )},
    { sub: "あなたのこと", title: "職業は？", body: (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {OCCUPATIONS.map((o) => <button key={o} style={chip(occupation === o)} onClick={() => { setOccupation(o); setTimeout(advance, 220); }}>{o}</button>)}
      </div>
    )},
    { sub: "最後に", title: "もし改善できるなら、いくらまで？", body: (
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {BUDGETS.map((b) => <button key={b} style={chip(budget === b)} onClick={() => { setBudget(b); setTimeout(advance, 220); }}>{fmtCost(b)}まで</button>)}
      </div>
    )},
  ];

  const AggregateBlock = ({ a }: { a: Aggregate }) => (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "20px", overflow: "hidden" }}>
      <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${C.lineSoft}` }}>
        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", color: C.accent }}>{hasFilter ? "あなたと似た人の集合知" : "改善体験の集合知"}</span>
        <p style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: 500, lineHeight: 1.5, marginTop: "10px" }}>
          {filterLabel ? `「${filterLabel}」に近い ` : "登録された "}<span style={{ color: C.accent }}>{a.count}人</span>{filterLabel ? "の記録" : "人の記録"}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: C.lineSoft }}>
        {[
          { label: "やってよかった", value: `${a.worthItRate}%`, big: true },
          { label: "費用の中央値", value: fmtCost(a.medianCost) },
          { label: "平均改善期間", value: fmtDuration(a.avgDuration) },
        ].map((m) => (
          <div key={m.label} style={{ background: C.surface, padding: "20px 8px", textAlign: "center" }}>
            <span style={{ fontFamily: SERIF, fontSize: m.big ? "28px" : "18px", fontWeight: 500, color: m.big ? C.accent : C.ink, display: "block", lineHeight: 1 }}>{m.value}</span>
            <span style={{ fontSize: "10px", color: C.faint, marginTop: "8px", display: "block", letterSpacing: "0.04em" }}>{m.label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "relative", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ filter: contributed ? "none" : "blur(5px)", userSelect: contributed ? "auto" : "none", pointerEvents: contributed ? "auto" : "none" }}>
          {a.topTreatments.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: C.faint, letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>みんながやった施術・手段</span>
              <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                {a.topTreatments.map((t) => (
                  <span key={t.label} style={{ fontSize: "12px", color: C.accent, background: C.accentSoft, borderRadius: "100px", padding: "6px 13px" }}>{t.label}{t.count > 1 ? ` ${t.count}` : ""}</span>
                ))}
              </div>
            </div>
          )}
          {a.topActions.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: C.faint, letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>みんながまず始めたこと</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {a.topActions.map((x, i) => (
                  <div key={x.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: C.accent, minWidth: "18px" }}>{i + 1}</span>
                    <span style={{ fontSize: "13px", color: C.ink, flex: 1, lineHeight: 1.5 }}>{x.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {a.topFailures.length > 0 && (
            <div>
              <span style={{ fontSize: "11px", fontWeight: 500, color: C.faint, letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>よくある遠回り・失敗</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {a.topFailures.map((f) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: C.faint, lineHeight: 1.6 }}>×</span>
                    <span style={{ fontSize: "13px", color: C.sub, flex: 1, lineHeight: 1.6 }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!contributed && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "24px", background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.92))" }}>
            <span style={{ fontSize: "20px" }}>🔒</span>
            <p style={{ fontSize: "13px", color: C.ink, textAlign: "center", lineHeight: 1.7, fontWeight: 500 }}>「みんなが何をして・どう失敗したか」<br />は、記録を出した人だけに開きます。</p>
            <Link href="/cases/contribute" style={{ fontSize: "13px", fontWeight: 500, background: C.accent, color: "#fff", borderRadius: "100px", padding: "12px 28px", textDecoration: "none" }}>自分の記録を出して見る</Link>
          </div>
        )}
      </div>
      <p style={{ fontSize: "10px", color: C.faint, textAlign: "center", padding: "0 24px 18px", lineHeight: 1.6 }}>※ 件数が増えるほど精度が上がります。これは医療判断ではありません。</p>
    </div>
  );

  const CaseCard = ({ c }: { c: CaseRecord }) => (
    <Link href={`/cases/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, color: C.accent, background: C.accentSoft, padding: "5px 12px", borderRadius: "100px" }}>{c.categoryLabel}</span>
            {c.verified && <span style={{ fontSize: "10px", fontWeight: 500, color: C.accent, border: `1px solid ${C.accent}`, borderRadius: "100px", padding: "4px 9px" }}>✓ 検証済み</span>}
            {c.worthItLevel === "great" && <span style={{ fontSize: "10px", color: C.sub }}>👍 {WORTH_IT_LABELS.great}</span>}
          </div>
          <span style={{ fontSize: "12px", color: C.faint }}>{[c.ageBand, c.occupation].filter(Boolean).join("・")}</span>
        </div>
        {(c.procedure || c.clinic) && <p style={{ fontSize: "12px", color: C.sub, marginBottom: "10px" }}>{c.procedure}{c.clinic ? ` ・ ${c.clinic}` : ""}</p>}
        <p style={{ fontFamily: SERIF, fontSize: "17px", fontWeight: 500, lineHeight: 1.5, marginBottom: "18px" }}>{c.title}</p>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            { label: "改善期間", value: fmtDuration(c.durationDays) },
            { label: "費用", value: fmtCost(c.cost) },
            { label: "改善度", value: `${Math.round(c.improvementDegree / 10)}/10` },
          ].map((m) => (
            <div key={m.label}>
              <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "3px", letterSpacing: "0.05em" }}>{m.label}</span>
              <span style={{ fontSize: "15px", fontWeight: 500, color: C.ink }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <style>{`@keyframes caseFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } @keyframes pulseDot { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }`}</style>

      {/* ════ TOP（カテゴリ一覧） ════ */}
      {phase === "top" && (
        <section style={{ padding: "64px 24px 100px", maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.accent }}>HIS RECOVERIES</span>
            <h1 style={{ fontFamily: SERIF, fontSize: "28px", fontWeight: 500, lineHeight: 1.5, margin: "18px 0 14px" }}>
              男の悩みは、<br />誰かがもう越えている。
            </h1>
            <p style={{ fontSize: "14px", color: C.sub, lineHeight: 1.9 }}>何をして・いくらかかって・どれだけ改善したか。<br />匿名の実体験で検索する。</p>
          </div>

          <button onClick={() => { resetFilters(); setStep(0); setPhase("ask"); }}
            style={{ width: "100%", fontSize: "15px", fontWeight: 500, letterSpacing: "0.06em", background: C.accent, color: "#fff", border: "none", borderRadius: "100px", padding: "18px", cursor: "pointer", marginBottom: "14px" }}>
            自分に近い人を探す
          </button>
          <div style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
            <Link href="/cases/ranking" style={{ flex: 1, textAlign: "center", fontSize: "13px", color: C.ink, border: `1px solid ${C.line}`, borderRadius: "100px", padding: "13px", textDecoration: "none" }}>改善率ランキング</Link>
            <Link href="/cases/contribute" style={{ flex: 1, textAlign: "center", fontSize: "13px", color: C.ink, border: `1px solid ${C.line}`, borderRadius: "100px", padding: "13px", textDecoration: "none" }}>＋ 記録を投稿</Link>
          </div>

          <span style={fieldLabel}>カテゴリから探す</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => { resetFilters(); setCat(c.id); setPhase("browse"); }}
                style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "18px 18px", cursor: "pointer", transition: "all 250ms" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: C.ink, display: "block" }}>{c.label}</span>
                <span style={{ fontSize: "11px", color: C.faint, marginTop: "5px", display: "block" }}>{counts.get(c.id) ?? 0}件の記録</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ════ ASK ════ */}
      {phase === "ask" && (
        <section style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", padding: "0 28px" }}>
          <div style={{ display: "flex", gap: "6px", paddingTop: "32px", maxWidth: "440px", width: "100%", margin: "0 auto" }}>
            {QUESTIONS.map((_, i) => <div key={i} style={{ flex: 1, height: "3px", borderRadius: "100px", background: i <= step ? C.accent : C.line, transition: "all 300ms" }} />)}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: "440px", width: "100%", margin: "0 auto", paddingBottom: "40px" }}>
            <div key={`ask-${step}`} style={{ width: "100%", textAlign: "center", animation: "caseFade 500ms ease both" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.accent }}>{QUESTIONS[step].sub}</span>
              <h1 style={{ fontFamily: SERIF, fontSize: "25px", fontWeight: 500, lineHeight: 1.5, margin: "16px 0 36px" }}>{QUESTIONS[step].title}</h1>
              {QUESTIONS[step].body}
            </div>
          </div>
          <div style={{ textAlign: "center", paddingBottom: "32px" }}>
            <button onClick={() => { resetFilters(); setPhase("browse"); }} style={{ fontSize: "12px", color: C.faint, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>質問をとばして探す</button>
          </div>
        </section>
      )}

      {/* ════ SEARCHING ════ */}
      {phase === "searching" && (
        <section style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.accent, animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
          <p style={{ fontFamily: SERIF, fontSize: "18px", color: C.sub, lineHeight: 1.7 }}>あなたに似た人を、<br />探しています…</p>
        </section>
      )}

      {/* ════ REVEAL ════ */}
      {phase === "reveal" && (
        <section style={{ minHeight: "100dvh", padding: "56px 24px 80px", maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px", animation: "caseFade 700ms ease both" }}>
            {results.length > 0 ? (
              <>
                <p style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 500, lineHeight: 1.5, marginBottom: "16px" }}>あなたは、<br />ひとりじゃなかった。</p>
                <p style={{ fontSize: "14px", color: C.sub, lineHeight: 1.9 }}>{filterLabel ? `「${filterLabel}」に近い ` : ""}<span style={{ color: C.accent, fontWeight: 500 }}>{results.length}人</span>が、同じ場所から前に進んでいた。</p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 500, lineHeight: 1.5, marginBottom: "16px" }}>まだ、近い記録はない。</p>
                <p style={{ fontSize: "14px", color: C.sub, lineHeight: 1.9 }}>でも、それはあなたが<br /><span style={{ color: C.accent, fontWeight: 500 }}>最初のひとり</span>になれるということ。</p>
              </>
            )}
          </div>
          {results.length > 0 && <div style={{ marginBottom: "32px", animation: "caseFade 700ms ease 0.2s both" }}><AggregateBlock a={agg} /></div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "caseFade 700ms ease 0.4s both" }}>
            {results.length > 0 && (
              <button onClick={() => setPhase("browse")} style={{ width: "100%", fontSize: "14px", fontWeight: 500, letterSpacing: "0.06em", background: C.surface, color: C.ink, border: `1px solid ${C.line}`, borderRadius: "100px", padding: "17px", cursor: "pointer" }}>この人たちの記録を、ひとつずつ見る</button>
            )}
            <Link href="/cases/contribute" style={{ width: "100%", textAlign: "center", fontSize: "14px", fontWeight: 500, letterSpacing: "0.06em", background: C.accent, color: "#fff", borderRadius: "100px", padding: "17px", textDecoration: "none" }}>自分の記録を出す</Link>
          </div>
        </section>
      )}

      {/* ════ BROWSE ════ */}
      {phase === "browse" && (
        <>
          <section style={{ padding: "32px 24px 24px", maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <button onClick={() => setPhase("top")} style={{ fontSize: "13px", color: C.sub, background: "none", border: "none", cursor: "pointer" }}>← TOP</button>
              <Link href="/cases/contribute" style={{ fontSize: "12px", fontWeight: 500, color: C.accent, border: `1px solid ${C.accent}`, borderRadius: "100px", padding: "8px 18px", textDecoration: "none" }}>＋ 投稿</Link>
            </div>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "20px", padding: "24px 22px" }}>
              <div style={{ marginBottom: "20px" }}>
                <span style={fieldLabel}>悩み</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {CATEGORIES.map((c) => <button key={c.id} style={chip(cat === c.id)} onClick={() => setCat(cat === c.id ? "" : c.id)}>{c.label}</button>)}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={fieldLabel}>年齢帯</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {AGE_BANDS.map((a) => <button key={a} style={chip(age === a)} onClick={() => setAge(age === a ? "" : a)}>{a}</button>)}
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={fieldLabel}>職業</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {OCCUPATIONS.map((o) => <button key={o} style={chip(occupation === o)} onClick={() => setOccupation(occupation === o ? "" : o)}>{o}</button>)}
                </div>
              </div>
              <div>
                <span style={fieldLabel}>予算（以内）</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {BUDGETS.map((b) => <button key={b} style={chip(budget === b)} onClick={() => setBudget(budget === b ? "" : b)}>{fmtCost(b)}</button>)}
                </div>
              </div>
            </div>
          </section>

          {agg.count > 0 && <section style={{ padding: "0 24px 28px", maxWidth: "640px", margin: "0 auto" }}><AggregateBlock a={agg} /></section>}

          <section style={{ padding: "0 24px 100px", maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <span style={{ fontSize: "13px", color: C.sub }}><span style={{ fontFamily: SERIF, fontSize: "20px", color: C.ink, marginRight: "4px" }}>{results.length}</span>件の改善体験</span>
              {hasFilter && <button onClick={resetFilters} style={{ fontSize: "12px", color: C.faint, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>条件をクリア</button>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {results.map((c) => <CaseCard key={c.id} c={c} />)}
              {results.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: C.faint }}>
                  <p style={{ fontSize: "14px", lineHeight: 1.8 }}>条件に合う事例がまだありません。<br />あなたが最初の記録者になれます。</p>
                  <Link href="/cases/contribute" style={{ display: "inline-block", marginTop: "24px", fontSize: "13px", color: C.accent, border: `1px solid ${C.accent}`, borderRadius: "100px", padding: "12px 32px", textDecoration: "none" }}>記録を投稿する</Link>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
