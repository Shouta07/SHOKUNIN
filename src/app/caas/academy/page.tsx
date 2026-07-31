"use client";

import { useState } from "react";
import {
  C, SANS, SKILL_CATEGORIES, RATING_AXES, CRAFTSMEN, skillProgress,
} from "@/lib/caas";

// 職人（施工パートナー）向けの育成・査定ダッシュボード。
// tebiki型 動画マニュアル × skill-puzzle型 スキル可視化 × Uber型 ホスピタリティ査定。
export default function CaasAcademy() {
  const me = CRAFTSMEN[0]; // デモ：田中さん視点
  const [openCat, setOpenCat] = useState<string>(SKILL_CATEGORIES[0].id);
  const [playing, setPlaying] = useState<string | null>(null);

  const totalDone = SKILL_CATEGORIES.reduce((s, c) => s + c.modules.filter((m) => m.done).length, 0);
  const totalMods = SKILL_CATEGORIES.reduce((s, c) => s + c.modules.length, 0);

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "28px 20px 60px" }}>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: C.accent }}>ACADEMY</div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginTop: "6px" }}>職人アカデミー</h1>
          <p style={{ fontSize: "13px", color: C.sub, marginTop: "6px", lineHeight: 1.7 }}>動画マニュアルで学び、評価で磨く。</p>
        </div>

        {/* Me / hospitality score */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: me.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700 }}>{me.initial}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{me.name}</div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "3px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: C.amber, borderRadius: "100px", padding: "3px 10px" }}>🏅 {me.level}</span>
                <span style={{ fontSize: "12px", color: C.sub }}>総合 ★{me.rating}（{me.reviews}件）</span>
              </div>
            </div>
          </div>
          {/* hospitality axes */}
          <div style={{ display: "flex", gap: "8px" }}>
            {RATING_AXES.map((ax) => (
              <div key={ax.key} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "14px" }}>{ax.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "2px" }}>{me.axes[ax.key].toFixed(1)}</div>
                <div style={{ fontSize: "9px", color: C.faint }}>{ax.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "11px", color: C.sub, marginTop: "14px", lineHeight: 1.6, background: C.accentSoft, borderRadius: "10px", padding: "10px 12px" }}>
            💬 顧客の声：{me.hospitalityQuote}
          </p>
        </div>

        {/* Skill puzzle — 技術伝承の全体像 */}
        <SectionTitle>スキルマップ（習得 {totalDone}/{totalMods}）</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "8px" }}>
          {SKILL_CATEGORIES.map((cat) => {
            const pct = skillProgress(cat);
            const open = openCat === cat.id;
            return (
              <div key={cat.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", overflow: "hidden" }}>
                <button onClick={() => setOpenCat(open ? "" : cat.id)}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "22px" }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600 }}>{cat.label}</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: pct === 100 ? C.ok : C.accent }}>{pct}%</span>
                      </div>
                      <div style={{ height: "6px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden", marginTop: "8px" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? C.ok : C.accent, borderRadius: "100px", transition: "width 400ms" }} />
                      </div>
                    </div>
                  </div>
                </button>

                {/* tebiki型 動画モジュール */}
                {open && (
                  <div style={{ padding: "0 18px 14px", animation: "aUp 300ms ease both" }}>
                    {cat.modules.map((m) => (
                      <button key={m.id} onClick={() => setPlaying(playing === m.id ? null : m.id)}
                        style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: `1px solid ${C.lineSoft}` }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: m.done ? "#eafaf1" : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "16px", color: m.done ? C.ok : C.accent }}>
                          {m.done ? "✓" : "▶"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: m.done ? C.sub : C.ink }}>{m.title}</div>
                          <div style={{ fontSize: "11px", color: C.faint, marginTop: "2px" }}>動画 {m.duration}{m.done ? "・修了" : ""}</div>
                        </div>
                      </button>
                    ))}

                    {/* inline "video" mock */}
                    {playing && cat.modules.some((m) => m.id === playing) && (
                      <div style={{ marginTop: "10px", borderRadius: "12px", overflow: "hidden", background: "linear-gradient(135deg,#2b3542,#1a2430)", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
                          <div style={{ fontSize: "30px" }}>▶</div>
                          <div style={{ fontSize: "11px", marginTop: "4px" }}>{cat.modules.find((m) => m.id === playing)?.title}</div>
                        </div>
                        <span style={{ position: "absolute", top: "10px", left: "10px", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>現場撮影マニュアル</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: "12px", color: C.sub, lineHeight: 1.8, textAlign: "center", marginTop: "20px" }}>
          動画マニュアルを修了すると<b>認定バッジ</b>が付き、<br />顧客に「認定済み」として表示されます。
        </p>

        {/* how it connects */}
        <div style={{ background: C.accentSoft, borderRadius: "14px", padding: "16px 18px", marginTop: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: C.accent, marginBottom: "8px" }}>品質改善ループ</div>
          <p style={{ fontSize: "12px", color: C.sub, lineHeight: 1.8 }}>
            動画で学ぶ → 現場で実践 → 顧客がホスピタリティを評価 → 弱い項目に動画が推薦される。
            この循環で、全国の職人の品質が標準化されていきます。
          </p>
        </div>

      </div>
      <style>{`@keyframes aUp { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "12px", fontWeight: 700, color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase", margin: "8px 0 12px" }}>{children}</div>;
}
