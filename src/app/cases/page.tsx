"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  C, SANS, SERIF, SEED_CASES, CATEGORIES, AGE_BANDS, GENDERS,
  getPublishedCases, fmtCost, fmtDuration, type CategoryId, type CaseRecord,
} from "@/lib/recovery";

export default function CasesPage() {
  const [cat, setCat] = useState<CategoryId | "">("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [severity, setSeverity] = useState<number | "">("");
  const [budget, setBudget] = useState<number | "">("");
  const [published, setPublished] = useState<CaseRecord[]>([]);

  useEffect(() => { setPublished(getPublishedCases()); }, []);

  const allCases = useMemo(() => [...published, ...SEED_CASES], [published]);

  const results = useMemo(() => {
    return allCases.filter((c) => {
      if (cat && c.category !== cat) return false;
      if (age && c.ageBand !== age) return false;
      if (gender && c.gender !== gender) return false;
      if (severity !== "" && c.severity < (severity as number) - 1) return false;
      if (budget !== "" && c.cost > (budget as number)) return false;
      return true;
    });
  }, [allCases, cat, age, gender, severity, budget]);

  const chip = (active: boolean): React.CSSProperties => ({
    fontSize: "13px", fontWeight: 400, padding: "9px 18px", borderRadius: "100px",
    cursor: "pointer", transition: "all 250ms",
    background: active ? C.accent : "transparent",
    border: `1px solid ${active ? C.accent : C.line}`,
    color: active ? "#fff" : C.sub,
    fontFamily: SANS, whiteSpace: "nowrap",
  });

  const fieldLabel: React.CSSProperties = {
    fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em",
    color: C.faint, textTransform: "uppercase", display: "block", marginBottom: "10px",
  };

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>

      {/* ── Hero / Search ── */}
      <section style={{ padding: "72px 24px 48px", maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.accent }}>
            IMPROVEMENT LIBRARY
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: "30px", fontWeight: 500, lineHeight: 1.5, margin: "20px 0 16px", letterSpacing: "0.01em" }}>
            あなたと似た人は、<br />どう改善したのか。
          </h1>
          <p style={{ fontSize: "14px", fontWeight: 300, color: C.sub, lineHeight: 1.9 }}>
            情報ではなく、体験を探す。<br />同じ悩みを越えた人の記録を検索する。
          </p>
        </div>

        {/* Search card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.line}`, borderRadius: "20px",
          padding: "28px 24px", boxShadow: "0 1px 40px rgba(31,29,26,0.04)",
        }}>
          <div style={{ marginBottom: "24px" }}>
            <span style={fieldLabel}>悩み</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} style={chip(cat === c.id)}
                  onClick={() => setCat(cat === c.id ? "" : c.id)}>{c.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <span style={fieldLabel}>年齢帯</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {AGE_BANDS.map((a) => (
                <button key={a} style={chip(age === a)}
                  onClick={() => setAge(age === a ? "" : a)}>{a}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <span style={fieldLabel}>性別</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {GENDERS.map((g) => (
                <button key={g} style={chip(gender === g)}
                  onClick={() => setGender(gender === g ? "" : g)}>{g}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <span style={fieldLabel}>重症度（以上）</span>
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} style={{ ...chip(severity === n), padding: "9px 0", width: "44px", textAlign: "center" }}
                  onClick={() => setSeverity(severity === n ? "" : n)}>{n}</button>
              ))}
            </div>
          </div>

          <div>
            <span style={fieldLabel}>予算（以内）</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[20000, 50000, 100000].map((b) => (
                <button key={b} style={chip(budget === b)}
                  onClick={() => setBudget(budget === b ? "" : b)}>{fmtCost(b)}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section style={{ padding: "0 24px 100px", maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <span style={{ fontSize: "13px", color: C.sub }}>
            <span style={{ fontFamily: SERIF, fontSize: "20px", color: C.ink, marginRight: "4px" }}>{results.length}</span>件の改善体験
          </span>
          {(cat || age || gender || severity !== "" || budget !== "") && (
            <button onClick={() => { setCat(""); setAge(""); setGender(""); setSeverity(""); setBudget(""); }}
              style={{ fontSize: "12px", color: C.faint, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              条件をクリア
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {results.map((c) => (
            <Link key={c.id} href={`/cases/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px",
                padding: "22px 24px", transition: "all 300ms",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", color: C.accent, background: C.accentSoft, padding: "5px 12px", borderRadius: "100px" }}>
                    {c.categoryLabel}
                  </span>
                  <span style={{ fontSize: "12px", color: C.faint }}>{c.ageBand}・{c.gender}</span>
                </div>

                <p style={{ fontFamily: SERIF, fontSize: "17px", fontWeight: 500, lineHeight: 1.5, marginBottom: "18px" }}>
                  {c.title}
                </p>

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {[
                    { label: "改善期間", value: fmtDuration(c.durationDays) },
                    { label: "費用", value: fmtCost(c.cost) },
                    { label: "改善度", value: `${c.improvementDegree}%` },
                  ].map((m) => (
                    <div key={m.label}>
                      <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "3px", letterSpacing: "0.05em" }}>{m.label}</span>
                      <span style={{ fontSize: "15px", fontWeight: 500, color: C.ink }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}

          {results.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.faint }}>
              <p style={{ fontSize: "14px", lineHeight: 1.8 }}>
                条件に合う事例がまだありません。<br />
                あなたが最初の記録者になれます。
              </p>
              <Link href="/recovery/join" style={{
                display: "inline-block", marginTop: "24px", fontSize: "13px", color: C.accent,
                border: `1px solid ${C.accent}`, borderRadius: "100px", padding: "12px 32px", textDecoration: "none",
              }}>
                チャレンジに参加する
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
