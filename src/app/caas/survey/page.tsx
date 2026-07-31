"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { C, SANS, SURVEY_ZONES, getService, fmtYen } from "@/lib/caas";

export default function RemoteSurvey() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [zone, setZone] = useState(0);
  const [plan, setPlan] = useState<string[]>([]); // zone ids added

  const z = SURVEY_ZONES[zone];
  const svc = getService(z.serviceId);
  const inPlan = plan.includes(z.id);
  const total = plan.reduce((s, id) => {
    const zz = SURVEY_ZONES.find((x) => x.id === id);
    return s + (getService(zz?.serviceId ?? "")?.price ?? 0);
  }, 0);
  const last = zone === SURVEY_ZONES.length - 1;

  const toggle = () => setPlan((p) => (inPlan ? p.filter((x) => x !== z.id) : [...p, z.id]));

  if (!started) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px 60px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: C.accent }}>REMOTE SURVEY</div>
          <h1 style={{ fontSize: "27px", fontWeight: 800, lineHeight: 1.35, margin: "12px 0 14px" }}>
            現地に行かず、<br />スマホ片手に現地調査。
          </h1>
          <p style={{ fontSize: "14px", color: C.sub, lineHeight: 1.9, marginBottom: "28px" }}>
            web面談をつなぎ、施設をぐるりと映すだけ。プロと一緒に、理想の設備プランをその場で描きます。
          </p>

          {/* preview call */}
          <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: "18px", overflow: "hidden", background: "linear-gradient(160deg,#33414f,#212a34)", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.75)" }}>
              <div style={{ fontSize: "34px" }}>🎥</div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>ビデオ通話で現地をご案内</div>
            </div>
            <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", alignItems: "center", background: "rgba(0,0,0,0.4)", borderRadius: "100px", padding: "5px 11px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.live, animation: "svPulse 1.2s infinite" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>現調員が待機中</span>
            </div>
            {/* PIP */}
            <div style={{ position: "absolute", bottom: "12px", right: "12px", width: "78px", height: "58px", borderRadius: "10px", background: "#1a2430", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>👷</div>
          </div>

          <button onClick={() => setStarted(true)}
            style={{ width: "100%", fontSize: "15px", fontWeight: 700, color: "#fff", background: C.accent, border: "none", borderRadius: "14px", padding: "16px", cursor: "pointer" }}>
            現地調査をはじめる
          </button>
          <p style={{ fontSize: "11px", color: C.faint, textAlign: "center", marginTop: "12px" }}>所要 約10分・無料</p>
        </div>
        <style>{`@keyframes svPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 20px 60px" }}>

        {/* progress */}
        <div style={{ display: "flex", gap: "5px", marginBottom: "16px" }}>
          {SURVEY_ZONES.map((_, i) => <div key={i} style={{ flex: 1, height: "3px", borderRadius: "100px", background: i <= zone ? C.accent : C.line }} />)}
        </div>

        {/* video walkthrough */}
        <div style={{ position: "relative", aspectRatio: "16/11", borderRadius: "18px", overflow: "hidden", background: z.scene, marginBottom: "14px" }}>
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", alignItems: "center", background: "rgba(0,0,0,0.4)", borderRadius: "100px", padding: "5px 11px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.live, animation: "svPulse 1.2s infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>LIVE 現地調査中</span>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.85)" }}>
            <div style={{ fontSize: "30px" }}>📍</div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginTop: "6px" }}>{z.label}</div>
            <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}>{z.hint}</div>
          </div>
          <div style={{ position: "absolute", bottom: "12px", right: "12px", width: "72px", height: "54px", borderRadius: "10px", background: "#1a2430", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>👷</div>
        </div>

        {/* surveyor suggestion */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "16px 18px", marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>👷</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", color: C.faint }}>現調員より</div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, marginTop: "3px" }}>ここには <b>{svc?.label}</b> がおすすめです。{z.reason}</p>
            </div>
          </div>
          <button onClick={toggle}
            style={{ width: "100%", marginTop: "14px", fontSize: "14px", fontWeight: 700, borderRadius: "12px", padding: "13px", cursor: "pointer", fontFamily: SANS,
              background: inPlan ? C.ok : C.accentSoft, color: inPlan ? "#fff" : C.accent, border: "none" }}>
            {inPlan ? `✓ プランに追加済み（${fmtYen(svc?.price ?? 0)}）` : `＋ このプランに追加（${fmtYen(svc?.price ?? 0)}）`}
          </button>
        </div>

        {/* nav */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "22px" }}>
          {zone > 0 && (
            <button onClick={() => setZone(zone - 1)} style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: C.sub, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "13px", cursor: "pointer" }}>← 戻る</button>
          )}
          {!last ? (
            <button onClick={() => setZone(zone + 1)} style={{ flex: 2, fontSize: "14px", fontWeight: 700, color: "#fff", background: C.accent, border: "none", borderRadius: "12px", padding: "13px", cursor: "pointer" }}>次の場所へ →</button>
          ) : (
            <button onClick={() => router.push("/caas")} disabled={plan.length === 0}
              style={{ flex: 2, fontSize: "14px", fontWeight: 700, color: "#fff", background: plan.length ? C.accent : C.lineSoft, border: "none", borderRadius: "12px", padding: "13px", cursor: plan.length ? "pointer" : "default" }}>
              プランで見積もる
            </button>
          )}
        </div>

        {/* plan */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: plan.length ? "12px" : 0 }}>
            <span style={{ fontSize: "13px", fontWeight: 700 }}>理想の設備プラン</span>
            <span style={{ fontSize: "16px", fontWeight: 800 }}>{fmtYen(total)}〜</span>
          </div>
          {plan.length === 0 ? (
            <p style={{ fontSize: "12px", color: C.faint }}>気になった場所で「追加」すると、ここに積み上がります。</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {plan.map((id) => {
                const zz = SURVEY_ZONES.find((x) => x.id === id)!;
                const s = getService(zz.serviceId);
                return (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: C.sub }}>{zz.label}・{s?.label}</span>
                    <span style={{ fontWeight: 600 }}>{fmtYen(s?.price ?? 0)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes svPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}
