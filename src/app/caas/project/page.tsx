"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  C, SANS, STAGES, LIVE_TIMELINE, RATING_AXES, CROSS_SELL, getProject, saveProject, clearProject,
  getService, getCraftsman, fmtSlot, fmtYen, type Project,
} from "@/lib/caas";

export default function CaasProject() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [livePct, setLivePct] = useState(0);

  useEffect(() => { setMounted(true); setProject(getProject()); }, []);

  // 施工中フェーズは進捗を自動で伸ばす（LIVE感）
  useEffect(() => {
    if (!project || STAGES[project.stage].id !== "live") return;
    setLivePct(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const target = LIVE_TIMELINE[Math.min(step, LIVE_TIMELINE.length - 1)].pct;
      setLivePct(target);
      if (step >= LIVE_TIMELINE.length - 1) clearInterval(iv);
    }, 1500);
    return () => clearInterval(iv);
  }, [project?.stage]);

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;

  if (!project) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
        <div>
          <p style={{ fontSize: "17px", fontWeight: 600, marginBottom: "18px" }}>進行中の工事はありません</p>
          <button onClick={() => router.push("/caas")} style={{ fontSize: "15px", fontWeight: 600, color: "#fff", background: C.accent, border: "none", borderRadius: "14px", padding: "14px 32px", cursor: "pointer" }}>
            工事を依頼する
          </button>
        </div>
      </div>
    );
  }

  const service = getService(project.serviceId)!;
  const craftsman = getCraftsman(project.craftsmanId)!;
  const slotLabel = fmtSlot(project.slotId);
  const stage = STAGES[project.stage];

  const advance = () => {
    if (project.stage >= STAGES.length - 1) return;
    const p = { ...project, stage: project.stage + 1 };
    saveProject(p); setProject(p);
  };
  const reorder = () => { clearProject(); router.push("/caas"); };

  const shownTimeline = LIVE_TIMELINE.filter((t) => t.pct <= (livePct || 5));

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Title */}
        <div style={{ marginBottom: "8px", textAlign: "right" }}>
          <span style={{ fontSize: "12px", color: C.faint }}>予約番号 #{project.id.slice(0, 6).toUpperCase()}</span>
        </div>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>{service.icon}</span>
            <h1 style={{ fontSize: "20px", fontWeight: 700 }}>{service.label}</h1>
          </div>
          <p style={{ fontSize: "13px", color: C.sub, marginTop: "6px" }}>{slotLabel}・{fmtYen(service.price)}〜</p>
        </div>

        {/* Stage tracker */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px", position: "relative" }}>
          <div style={{ position: "absolute", top: "13px", left: "8%", right: "8%", height: "2px", background: C.line, zIndex: 0 }} />
          <div style={{ position: "absolute", top: "13px", left: "8%", width: `${(project.stage / (STAGES.length - 1)) * 84}%`, height: "2px", background: C.accent, zIndex: 0, transition: "width 400ms" }} />
          {STAGES.map((s, i) => {
            const done = i < project.stage, cur = i === project.stage;
            return (
              <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, flex: 1 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: done || cur ? C.accent : C.surface, border: `2px solid ${done || cur ? C.accent : C.line}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 300ms" }}>
                  {done ? <span style={{ color: "#fff", fontSize: "13px" }}>✓</span> : <span style={{ color: cur ? "#fff" : C.faint, fontSize: "11px", fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: "10px", color: cur ? C.ink : C.faint, fontWeight: cur ? 700 : 400, marginTop: "7px" }}>{s.short}</span>
              </div>
            );
          })}
        </div>

        {/* ── Stage content ── */}

        {/* Craftsman card (常時) */}
        <div style={{ display: "flex", gap: "13px", alignItems: "center", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "16px 18px", marginBottom: "16px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: craftsman.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", fontWeight: 700 }}>{craftsman.initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>{craftsman.name}</div>
            <div style={{ fontSize: "12px", color: C.sub, marginTop: "2px" }}>★ {craftsman.rating}・{craftsman.area}</div>
          </div>
          <button style={{ fontSize: "12px", fontWeight: 600, color: C.accent, background: C.accentSoft, border: "none", borderRadius: "100px", padding: "9px 15px", cursor: "pointer" }}>メッセージ</button>
        </div>

        {/* booked */}
        {stage.id === "booked" && (
          <div style={{ animation: "cUp 400ms ease both" }}>
            <div style={{ background: C.accentSoft, borderRadius: "14px", padding: "18px 20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: C.accent, marginBottom: "6px" }}>✓ 予約が確定しました</div>
              <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7 }}>当日は担当が時間通りに伺います。変更もこの画面から可能です。</p>
            </div>
            <SectionTitle>当日の流れ</SectionTitle>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "8px 4px" }}>
              {["到着・ご挨拶", "設置場所の最終確認", "施工（現場をライブ配信）", "動作確認・使い方のご説明", "完了報告・お引渡し"].map((t, i) => (
                <div key={t} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 16px" }}>
                  <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: C.accentSoft, color: C.accent, fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: "14px" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* pre */}
        {stage.id === "pre" && (
          <div style={{ animation: "cUp 400ms ease both" }}>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "18px 20px", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: C.faint, marginBottom: "8px" }}>担当より</div>
              <p style={{ fontSize: "14px", lineHeight: 1.8 }}>「明日はよろしくお願いします。設置場所の周辺を少し空けておいていただけると助かります。当日お会いできるのを楽しみにしています。」</p>
            </div>
            <SectionTitle>事前に確認しておくこと</SectionTitle>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "14px 18px" }}>
              {["設置場所の周辺を空ける", "Wi-Fiのパスワードを準備", "駐車スペースの有無を共有"].map((t) => (
                <label key={t} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 0", cursor: "pointer" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "6px", border: `1.5px solid ${C.line}` }} />
                  <span style={{ fontSize: "14px" }}>{t}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* live — Safieの武器 */}
        {stage.id === "live" && (
          <div style={{ animation: "cUp 400ms ease both" }}>
            {/* Live camera */}
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "16px", background: "linear-gradient(135deg, #2b3542 0%, #1a2430 100%)", aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.4)", borderRadius: "100px", padding: "5px 11px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.live, animation: "cPulse 1.2s ease-in-out infinite" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>LIVE</span>
              </div>
              <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>現場カメラ・Safie</div>
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                <div style={{ fontSize: "34px", marginBottom: "6px" }}>📹</div>
                <div style={{ fontSize: "12px" }}>施工の様子を配信中</div>
              </div>
              <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", fontSize: "12px", color: "#fff", fontWeight: 600 }}>
                {shownTimeline[shownTimeline.length - 1]?.label ?? "まもなく開始します"}
              </div>
            </div>

            {/* progress */}
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "18px 20px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>施工の進捗</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: C.accent }}>{livePct}%</span>
              </div>
              <div style={{ height: "8px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: `${livePct}%`, height: "100%", background: C.accent, borderRadius: "100px", transition: "width 900ms ease" }} />
              </div>
            </div>

            {/* photo timeline */}
            <SectionTitle>写真タイムライン</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[...shownTimeline].reverse().map((t) => (
                <div key={t.time} style={{ display: "flex", gap: "12px", alignItems: "center", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "10px 12px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "10px", background: "linear-gradient(135deg,#dbe3ec,#c8d3df)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📷</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontSize: "11px", color: C.faint, marginTop: "2px" }}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* done */}
        {stage.id === "done" && (
          <div style={{ animation: "cUp 400ms ease both" }}>
            <div style={{ background: "#eafaf1", border: `1px solid ${C.ok}33`, borderRadius: "14px", padding: "18px 20px", marginBottom: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>🎉</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: C.ok }}>工事が完了しました</div>
              <p style={{ fontSize: "13px", color: C.sub, marginTop: "6px" }}>お疲れさまでした。完了報告書と保証書をお届けします。</p>
            </div>

            <SectionTitle>Before / After</SectionTitle>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              {["Before", "After"].map((l) => (
                <div key={l} style={{ flex: 1 }}>
                  <div style={{ aspectRatio: "4/3", borderRadius: "12px", background: l === "After" ? "linear-gradient(135deg,#dce9dc,#cfe0cf)" : "linear-gradient(135deg,#e7e2da,#ddd6cb)", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: C.faint, fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* warranty */}
            <div style={{ background: C.surface, border: `1px solid ${C.amber}44`, borderRadius: "16px", padding: "18px 20px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px" }}>🛡️</span>
                <span style={{ fontSize: "15px", fontWeight: 700 }}>保証書（1年間）</span>
              </div>
              <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7 }}>施工箇所の不具合は1年間無償対応。この画面からいつでも呼び出せます。</p>
            </div>

            {/* review — Uber型 ホスピタリティ査定 */}
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "18px 20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{craftsman.name} はいかがでしたか？</div>
              <p style={{ fontSize: "12px", color: C.faint, marginBottom: "14px" }}>技術だけでなく、来た人のホスピタリティも評価してください。</p>
              {RATING_AXES.map((ax) => (
                <div key={ax.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.lineSoft}` }}>
                  <span style={{ fontSize: "13px" }}>{ax.icon} {ax.label}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((n) => <span key={n} style={{ fontSize: "20px", color: C.amber, cursor: "pointer" }}>★</span>)}
                  </div>
                </div>
              ))}
              <p style={{ fontSize: "11px", color: C.faint, marginTop: "12px", lineHeight: 1.7 }}>
                あなたの評価は職人のランクに反映され、良い職人ほど選ばれやすくなります。
              </p>
            </div>
          </div>
        )}

        {/* maintenance — また頼みたくなるループ */}
        {stage.id === "maintenance" && (
          <div style={{ animation: "cUp 400ms ease both" }}>
            <SectionTitle>次回の点検</SectionTitle>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "13px", color: C.faint }}>推奨点検日</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "2px" }}>6ヶ月後</div>
                </div>
                <button style={{ fontSize: "13px", fontWeight: 600, color: C.accent, background: C.accentSoft, border: "none", borderRadius: "100px", padding: "10px 18px", cursor: "pointer" }}>リマインド設定</button>
              </div>
            </div>

            <SectionTitle>もう一度、頼む</SectionTitle>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "18px 20px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.8, marginBottom: "14px" }}>
                前回と同じ {craftsman.name} に、ワンタップで再依頼できます。設定も履歴も引き継がれます。
              </p>
              <button onClick={reorder} style={{ width: "100%", fontSize: "15px", fontWeight: 600, color: "#fff", background: C.accent, border: "none", borderRadius: "14px", padding: "15px", cursor: "pointer" }}>
                同じ職人にまた頼む
              </button>
            </div>

            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.8 }}>この工事の記録はすべて保存されています。<br />次も、電話も待ち時間もいりません。</p>
            </div>
          </div>
        )}

        {/* Cross-sell — 他設備の依頼契機（done / maintenance） */}
        {(stage.id === "done" || stage.id === "maintenance") && (
          <div style={{ marginTop: "8px" }}>
            <SectionTitle>この機会に、こんな工事も</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {CROSS_SELL.filter((x) => x.serviceId !== project.serviceId).slice(0, 3).map((x) => {
                const svc = getService(x.serviceId)!;
                return (
                  <button key={x.serviceId} onClick={() => { clearProject(); router.push("/caas"); }}
                    style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "14px 16px", cursor: "pointer" }}>
                    <span style={{ fontSize: "24px" }}>{svc.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{svc.label}</div>
                      <div style={{ fontSize: "12px", color: C.accent, marginTop: "2px" }}>{x.hook}</div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: C.accent }}>{fmtYen(svc.price)}〜</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo control */}
        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: `1px dashed ${C.line}` }}>
          {project.stage < STAGES.length - 1 ? (
            <button onClick={advance} style={{ width: "100%", fontSize: "13px", fontWeight: 600, color: C.sub, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "13px", cursor: "pointer" }}>
              ▶ デモ：次の段階へ（{STAGES[project.stage + 1].label}）
            </button>
          ) : (
            <button onClick={() => { clearProject(); router.push("/caas"); }} style={{ width: "100%", fontSize: "13px", fontWeight: 600, color: C.faint, background: "none", border: `1px solid ${C.line}`, borderRadius: "12px", padding: "13px", cursor: "pointer" }}>
              デモをリセット
            </button>
          )}
        </div>

      </div>

      <style>{`
        @keyframes cUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
      `}</style>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "12px", fontWeight: 700, color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase", margin: "20px 0 12px" }}>{children}</div>;
}
