"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { C, SANS, INDUSTRIES } from "@/lib/caas";

export default function Industries() {
  const router = useRouter();
  const [sel, setSel] = useState(INDUSTRIES[0].id);
  const ind = INDUSTRIES.find((i) => i.id === sel)!;

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 20px 60px" }}>

        <div style={{ marginBottom: "18px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: C.accent }}>VALUE BY INDUSTRY</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px", lineHeight: 1.35 }}>この業界では、<br />設備がこう価値になる。</h1>
          <p style={{ fontSize: "13px", color: C.sub, marginTop: "8px", lineHeight: 1.7 }}>設備はコストではなく、事業価値を上げる投資。同業がどう使い、何を得たかを見る。</p>
        </div>

        {/* industry picker */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px", marginBottom: "20px" }}>
          {INDUSTRIES.map((i) => (
            <button key={i.id} onClick={() => setSel(i.id)}
              style={{ flexShrink: 0, padding: "11px 18px", borderRadius: "2px", cursor: "pointer", fontFamily: SANS, fontSize: "13px", fontWeight: 600,
                background: sel === i.id ? C.ink : C.surface, border: `1px solid ${sel === i.id ? C.ink : C.line}`, color: sel === i.id ? "#fff" : C.ink, whiteSpace: "nowrap" }}>
              {i.label}
            </button>
          ))}
        </div>

        {/* adoption comparison */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
          <div style={{ fontSize: "13px", color: C.sub, marginBottom: "12px" }}>{ind.label}の導入率</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", marginBottom: "10px" }}>
            <span style={{ fontSize: "40px", fontWeight: 800, color: C.accent, lineHeight: 1 }}>{ind.adoption}%</span>
            <span style={{ fontSize: "13px", color: C.sub, marginBottom: "5px" }}>が すでに導入済み</span>
          </div>
          <div style={{ height: "10px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden", marginBottom: "8px" }}>
            <div style={{ width: `${ind.adoption}%`, height: "100%", background: C.accent, borderRadius: "100px", transition: "width 400ms" }} />
          </div>
          <div style={{ fontSize: "12px", color: C.amber, fontWeight: 600 }}>あなたはまだ未導入 — 競合に差をつけられています</div>
        </div>

        {/* value metrics — 設備価値向上 */}
        <div style={{ marginBottom: "8px", fontSize: "12px", fontWeight: 700, color: C.faint, letterSpacing: "0.06em" }}>導入で得られる価値</div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          {ind.values.map((v) => (
            <div key={v.label} style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "16px 10px", textAlign: "center" }}>
              <div style={{ fontSize: "19px", fontWeight: 800, color: C.ok }}>{v.value}</div>
              <div style={{ fontSize: "11px", color: C.sub, marginTop: "4px", lineHeight: 1.4 }}>{v.label}</div>
            </div>
          ))}
        </div>

        {/* typical setup */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "18px 20px", marginBottom: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: C.faint, marginBottom: "12px" }}>この業界の定番構成</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ind.setup.map((s) => <span key={s} style={{ fontSize: "13px", color: C.accent, background: C.accentSoft, borderRadius: "100px", padding: "8px 14px" }}>{s}</span>)}
          </div>
        </div>

        {/* insight */}
        <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: "16px", marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: C.ink, lineHeight: 1.9 }}>{ind.insight}</p>
        </div>

        <button onClick={() => router.push("/caas")}
          style={{ width: "100%", fontSize: "15px", fontWeight: 600, color: "#fff", background: C.ink, border: "none", borderRadius: "2px", padding: "16px", cursor: "pointer" }}>
          {ind.label}向けの見積を出す
        </button>

        <div style={{ borderLeft: `2px solid ${C.line}`, paddingLeft: "14px", marginTop: "18px", fontSize: "12px", color: C.sub, lineHeight: 1.8 }}>
          ログイン（ID/パスワード）後は、貴社の業種・業態・規模に合わせて「似た会社の導入例」を自動で比較表示します。
        </div>

      </div>
    </div>
  );
}
