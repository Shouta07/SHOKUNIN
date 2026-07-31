"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  C, SANS, SERVICES, CRAFTSMEN, DAYS, BANDS, AVAILABILITY, RATING_AXES, fmtSlot,
  saveProject, fmtYen,
  type Service, type Craftsman,
} from "@/lib/caas";

type Phase = "intro" | "service" | "quote" | "slot" | "craftsman" | "confirm";

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function CaasBooking() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [service, setService] = useState<Service | null>(null);
  const [slotId, setSlotId] = useState<string>("");
  const [craftsman, setCraftsman] = useState<Craftsman | null>(null);
  const [quoteReady, setQuoteReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (phase === "quote") { setQuoteReady(false); const t = setTimeout(() => setQuoteReady(true), 1100); return () => clearTimeout(t); }
  }, [phase]);

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;

  const confirm = () => {
    if (!service || !slotId || !craftsman) return;
    saveProject({ id: crypto.randomUUID(), serviceId: service.id, craftsmanId: craftsman.id, slotId, stage: 0, createdAt: new Date().toISOString() });
    router.push("/caas/project");
  };

  const btn = (label: string, onClick: () => void, primary = true, disabled = false): React.ReactNode => (
    <button onClick={onClick} disabled={disabled}
      style={{ width: "100%", fontSize: "15px", fontWeight: 600, letterSpacing: "0.02em",
        background: disabled ? C.lineSoft : primary ? C.accent : C.surface, color: disabled ? C.faint : primary ? "#fff" : C.ink,
        border: primary ? "none" : `1px solid ${C.line}`, borderRadius: "14px", padding: "16px", cursor: disabled ? "default" : "pointer", transition: "all 200ms" }}>
      {label}
    </button>
  );

  const Progress = ({ n }: { n: number }) => (
    <div style={{ display: "flex", gap: "5px", marginBottom: "32px" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ flex: 1, height: "3px", borderRadius: "100px", background: i < n ? C.accent : C.line, transition: "all 300ms" }} />)}
    </div>
  );

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "28px 20px 40px" }}>

        {/* ── intro ── */}
        {phase === "intro" && (
          <div style={{ paddingTop: "6px" }}>
            {/* HERO */}
            <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", padding: "30px 24px 26px", color: "#fff", marginBottom: "16px",
              background: "linear-gradient(155deg,#13224a 0%,#1e3a8a 55%,#2f6bed 100%)" }}>
              <div className="caas-blob b1" />
              <div className="caas-blob b2" />
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.14)", borderRadius: "100px", padding: "6px 13px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ff5a5f", animation: "caasPulse 1.2s infinite" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em" }}>現場が見える工事</span>
                </div>
                <h1 style={{ fontSize: "33px", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em", margin: "16px 0 14px" }}>
                  工事を、<br />
                  <span style={{ background: "linear-gradient(90deg,#7dd3fc,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ワクワクする体験</span>に。
                </h1>
                <p style={{ fontSize: "14px", lineHeight: 1.85, color: "rgba(255,255,255,0.82)", marginBottom: "22px" }}>
                  電話も待ち時間もなし。見積は最短30秒。<br />施工はライブで見えて、完了後もずっとつながる。
                </p>
                <div style={{ display: "flex", gap: "18px" }}>
                  {[{ v: "30秒", l: "で見積" }, { v: "98%", l: "満足度" }, { v: "12,800+", l: "施工実績" }].map((s) => (
                    <div key={s.l}>
                      <div style={{ fontSize: "20px", fontWeight: 800 }}>{s.v}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", marginTop: "1px" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* primary CTA */}
            <button onClick={() => setPhase("service")}
              style={{ width: "100%", fontSize: "16px", fontWeight: 700, letterSpacing: "0.02em", color: "#fff", background: C.accent, border: "none", borderRadius: "16px", padding: "18px", cursor: "pointer", boxShadow: "0 8px 24px rgba(47,107,237,0.28)", marginBottom: "18px" }}>
              工事を依頼する　→
            </button>

            {/* entry grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: "🪄", t: "AR設置シミュ", d: "置くだけで死角ゼロ設計", href: "/caas/ar", tint: "#7c5cff" },
                { icon: "🎥", t: "リモート現調", d: "web面談で現地を調査", href: "/caas/survey", tint: "#0ea5a4" },
                { icon: "📊", t: "業界別の価値", d: "同業はこう使っている", href: "/caas/industries", tint: "#2f6bed" },
                { icon: "🏢", t: "多拠点・法人", d: "一括調整＋CSV連携", href: "/caas/sites", tint: "#f59e0b" },
              ].map((e) => (
                <button key={e.href} onClick={() => router.push(e.href)}
                  style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "16px", cursor: "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${e.tint}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "10px" }}>{e.icon}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>{e.t}</div>
                  <div style={{ fontSize: "11px", color: C.sub, marginTop: "3px", lineHeight: 1.5 }}>{e.d}</div>
                </button>
              ))}
            </div>

            {/* trust strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "22px", fontSize: "12px", color: C.faint }}>
              <span>⭐️ 4.9</span><span>·</span><span>認定職人のみ</span><span>·</span><span>1年保証</span>
            </div>
          </div>
        )}

        {/* ── service ── */}
        {phase === "service" && (
          <div style={{ paddingTop: "8px" }}>
            <Progress n={1} />
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>どんな工事ですか？</h2>
            <p style={{ fontSize: "14px", color: C.sub, marginBottom: "24px" }}>選ぶと、すぐに見積が出ます。</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {SERVICES.map((s) => (
                <button key={s.id} onClick={() => { setService(s); setPhase("quote"); }}
                  style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "16px 18px", cursor: "pointer", transition: "all 200ms" }}>
                  <span style={{ fontSize: "26px" }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: "12px", color: C.faint, marginTop: "3px" }}>{s.duration}・{s.desc}</div>
                  </div>
                  <span style={{ color: C.faint }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── quote ── */}
        {phase === "quote" && service && (
          <div style={{ paddingTop: "8px" }}>
            <Progress n={2} />
            {!quoteReady ? (
              <div style={{ textAlign: "center", paddingTop: "80px" }}>
                <div style={{ display: "inline-flex", gap: "6px", marginBottom: "20px" }}>
                  {[0, 1, 2].map((i) => <span key={i} style={{ width: "9px", height: "9px", borderRadius: "50%", background: C.accent, animation: `caasDot 1.2s ease-in-out ${i * 0.18}s infinite` }} />)}
                </div>
                <p style={{ fontSize: "15px", color: C.sub }}>最適な見積を計算しています…</p>
              </div>
            ) : (
              <div style={{ animation: "caasUp 500ms ease both" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: C.accent, marginBottom: "10px" }}>お見積り（税込・目安）</div>
                <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "18px", padding: "28px 24px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
                    <span style={{ fontSize: "28px" }}>{service.icon}</span>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 600 }}>{service.label}</div>
                      <div style={{ fontSize: "12px", color: C.faint }}>{service.duration}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", paddingTop: "20px", borderTop: `1px solid ${C.lineSoft}` }}>
                    <span style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em" }}>{fmtYen(service.price)}</span>
                    <span style={{ fontSize: "13px", color: C.sub }}>〜</span>
                  </div>
                  <p style={{ fontSize: "12px", color: C.faint, marginTop: "10px", lineHeight: 1.7 }}>
                    現地状況により追加が必要な場合は、施工前に必ずご確認します。勝手に増えることはありません。
                  </p>
                </div>
                {btn("この内容で日程を選ぶ", () => setPhase("slot"))}
                <div style={{ marginTop: "12px" }}>{btn("工事を選び直す", () => setPhase("service"), false)}</div>
              </div>
            )}
          </div>
        )}

        {/* ── slot (調整さん型・空き枠グリッド) ── */}
        {phase === "slot" && (
          <div style={{ paddingTop: "8px" }}>
            <Progress n={3} />
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>職人の空き枠から選ぶ</h2>
            <p style={{ fontSize: "14px", color: C.sub, marginBottom: "20px" }}>電話のやり取りは不要。空いている枠をタップ。</p>

            {/* legend */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "14px", fontSize: "12px", color: C.sub }}>
              <span><b style={{ color: C.ok }}>○</b> 空きあり</span>
              <span><b style={{ color: C.amber }}>△</b> 残りわずか</span>
              <span><b style={{ color: C.faint }}>×</b> 満枠</span>
            </div>

            {/* grid */}
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "10px", overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `56px repeat(${DAYS.length}, 1fr)`, gap: "6px", minWidth: "340px" }}>
                <div />
                {DAYS.map((d) => (
                  <div key={d.id} style={{ textAlign: "center", padding: "4px 0" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600 }}>{d.label}</div>
                    <div style={{ fontSize: "10px", color: d.dow === "土" ? "#2f6bed" : d.dow === "日" ? "#e5484d" : C.faint }}>{d.dow}</div>
                  </div>
                ))}
                {BANDS.map((b) => (
                  <FragmentRow key={b.id}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", paddingLeft: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>{b.label}</span>
                      <span style={{ fontSize: "9px", color: C.faint }}>{b.time}</span>
                    </div>
                    {DAYS.map((d) => {
                      const n = AVAILABILITY[d.id][b.id];
                      const id = `${d.id}|${b.id}`;
                      const sel = slotId === id;
                      const mark = n >= 2 ? "○" : n === 1 ? "△" : "×";
                      const col = n >= 2 ? C.ok : n === 1 ? C.amber : C.faint;
                      const disabled = n === 0;
                      return (
                        <button key={id} onClick={() => !disabled && setSlotId(id)} disabled={disabled}
                          style={{ aspectRatio: "1", borderRadius: "10px", cursor: disabled ? "default" : "pointer",
                            background: sel ? C.accent : disabled ? C.lineSoft : C.bg,
                            border: `1.5px solid ${sel ? C.accent : C.line}`,
                            color: sel ? "#fff" : col, fontSize: "17px", fontWeight: 700, transition: "all 150ms" }}>
                          {mark}
                        </button>
                      );
                    })}
                  </FragmentRow>
                ))}
              </div>
            </div>

            {slotId && (
              <div style={{ marginTop: "14px", fontSize: "13px", color: C.accent, fontWeight: 600, textAlign: "center" }}>
                選択中：{fmtSlot(slotId)}
              </div>
            )}
            <div style={{ marginTop: "20px" }}>{btn("担当を選ぶ", () => setPhase("craftsman"), true, !slotId)}</div>
          </div>
        )}

        {/* ── craftsman ── */}
        {phase === "craftsman" && (
          <div style={{ paddingTop: "8px" }}>
            <Progress n={4} />
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>どの職人に頼みますか？</h2>
            <p style={{ fontSize: "14px", color: C.sub, marginBottom: "24px" }}>評価・実績を見て、あなたが選べます。</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {CRAFTSMEN.map((c) => {
                const sel = craftsman?.id === c.id;
                return (
                  <button key={c.id} onClick={() => setCraftsman(c)}
                    style={{ textAlign: "left", width: "100%", background: C.surface, border: `1.5px solid ${sel ? C.accent : C.line}`, borderRadius: "16px", padding: "18px", cursor: "pointer", transition: "all 200ms" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: c.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, flexShrink: 0 }}>{c.initial}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "15px", fontWeight: 600 }}>{c.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: C.amber }}>★ {c.rating}</span>
                          <span style={{ fontSize: "12px", color: C.faint }}>({c.reviews}件)・{c.area}・{c.years}年</span>
                        </div>
                      </div>
                      {sel && <span style={{ color: C.accent, fontSize: "18px" }}>✓</span>}
                    </div>
                    {/* Uber型 ホスピタリティ多軸 */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                      {RATING_AXES.map((ax) => (
                        <div key={ax.key} style={{ flex: 1, background: C.bg, borderRadius: "10px", padding: "8px 4px", textAlign: "center" }}>
                          <div style={{ fontSize: "13px" }}>{ax.icon}</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: C.ink, marginTop: "2px" }}>{c.axes[ax.key].toFixed(1)}</div>
                          <div style={{ fontSize: "9px", color: C.faint }}>{ax.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", background: C.amber, borderRadius: "100px", padding: "3px 9px" }}>🏅 {c.level}</span>
                      {c.badges.slice(0, 2).map((b) => <span key={b} style={{ fontSize: "10px", color: C.accent, background: C.accentSoft, borderRadius: "100px", padding: "3px 9px" }}>{b}</span>)}
                    </div>
                    <p style={{ fontSize: "12px", color: C.sub, marginTop: "10px" }}>{c.hospitalityQuote}</p>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: "24px" }}>{btn("予約内容を確認", () => setPhase("confirm"), true, !craftsman)}</div>
          </div>
        )}

        {/* ── confirm ── */}
        {phase === "confirm" && service && craftsman && (
          <div style={{ paddingTop: "40px", animation: "caasUp 400ms ease both" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>この内容で予約します</h2>
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "18px", padding: "22px 24px", marginBottom: "20px" }}>
              {[
                { l: "工事", v: `${service.icon} ${service.label}` },
                { l: "日時", v: fmtSlot(slotId) },
                { l: "担当", v: `${craftsman.name}（★${craftsman.rating}）` },
              ].map((r, i, arr) => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", gap: "16px", paddingBottom: i < arr.length - 1 ? "14px" : 0, marginBottom: i < arr.length - 1 ? "14px" : 0, borderBottom: i < arr.length - 1 ? `1px solid ${C.lineSoft}` : "none" }}>
                  <span style={{ fontSize: "13px", color: C.faint }}>{r.l}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, textAlign: "right" }}>{r.v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "18px", paddingTop: "16px", borderTop: `1px solid ${C.line}` }}>
                <span style={{ fontSize: "13px", color: C.faint }}>お支払い目安</span>
                <span style={{ fontSize: "24px", fontWeight: 700 }}>{fmtYen(service.price)}〜</span>
              </div>
            </div>
            {btn("予約を確定する", confirm)}
            <div style={{ marginTop: "12px" }}>{btn("戻る", () => setPhase("craftsman"), false)}</div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes caasDot { 0%,100% { opacity: .25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
        @keyframes caasUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes caasPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes caasFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(24px,18px) scale(1.15); } }
        @keyframes caasFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,-16px) scale(1.1); } }
        .caas-blob { position: absolute; border-radius: 50%; filter: blur(26px); opacity: 0.55; pointer-events: none; }
        .caas-blob.b1 { width: 180px; height: 180px; top: -40px; right: -30px; background: radial-gradient(circle, #38bdf8, transparent 70%); animation: caasFloat1 9s ease-in-out infinite; }
        .caas-blob.b2 { width: 150px; height: 150px; bottom: -50px; left: -20px; background: radial-gradient(circle, #a78bfa, transparent 70%); animation: caasFloat2 11s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
