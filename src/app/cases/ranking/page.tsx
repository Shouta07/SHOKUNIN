"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  C, SANS, SERIF, SEED_CASES, getPublishedCases, categoryRanking, fmtCost,
  type CaseRecord, type CategoryStat,
} from "@/lib/recovery";

type Axis = "worthIt" | "improved";

export default function RankingPage() {
  const [published, setPublished] = useState<CaseRecord[]>([]);
  const [axis, setAxis] = useState<Axis>("worthIt");
  useEffect(() => { setPublished(getPublishedCases()); }, []);

  const ranking = useMemo(() => {
    const r = categoryRanking([...published, ...SEED_CASES]);
    return [...r].sort((a, b) => axis === "worthIt" ? b.worthItRate - a.worthItRate : b.improvedRate - a.improvedRate);
  }, [published, axis]);

  const tab = (active: boolean): React.CSSProperties => ({
    flex: 1, textAlign: "center", fontSize: "13px", fontWeight: active ? 500 : 400, padding: "12px",
    borderRadius: "100px", cursor: "pointer", transition: "all 250ms", fontFamily: SANS,
    background: active ? C.accent : "transparent", border: `1px solid ${active ? C.accent : C.line}`, color: active ? "#fff" : C.sub,
  });

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px 100px" }}>
        <Link href="/cases" style={{ fontSize: "13px", color: C.sub, textDecoration: "none", display: "inline-block", marginBottom: "28px" }}>← 戻る</Link>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.accent }}>RANKING</span>
          <h1 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: 500, lineHeight: 1.5, margin: "16px 0 10px" }}>
            悩み別・Most Worth It
          </h1>
          <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.8 }}>施術ではなく、改善で評価する。</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          <button style={tab(axis === "worthIt")} onClick={() => setAxis("worthIt")}>やってよかった率</button>
          <button style={tab(axis === "improved")} onClick={() => setAxis("improved")}>改善率</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {ranking.map((s: CategoryStat, i) => {
            const rate = axis === "worthIt" ? s.worthItRate : s.improvedRate;
            return (
              <Link key={s.id} href={`/cases?c=${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 500, color: i < 3 ? C.accent : C.faint, minWidth: "28px" }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontSize: "12px", color: C.faint }}>{s.count}件 ・ 中央値{fmtCost(s.medianCost)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ flex: 1, height: "6px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{ width: `${rate}%`, height: "100%", background: C.accent, borderRadius: "100px" }} />
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: C.accent, minWidth: "42px", textAlign: "right" }}>{rate}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p style={{ fontSize: "10px", color: C.faint, textAlign: "center", marginTop: "28px", lineHeight: 1.7 }}>
          ※ 件数が少ないカテゴリは精度が低くなります。これは医療判断ではありません。
        </p>
      </div>
    </div>
  );
}
