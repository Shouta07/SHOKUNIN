"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  C, SANS, SERVICES, CRAFTSMEN, DAYS, BANDS, AVAILABILITY, RATING_AXES, DAY_PRICING, fmtSlot,
  slotMultiplier, priceForSlot, saveProject, fmtYen,
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
          <div style={{ paddingTop: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.22em", color: C.faint, textTransform: "uppercase" }}>Construction as a Service</div>

            <h1 style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1.18, letterSpacing: "-0.035em", margin: "24px 0 22px" }}>
              頼んで、見て、<br />また頼む。
            </h1>
            <p style={{ fontSize: "15px", color: C.sub, lineHeight: 2, maxWidth: "30ch", marginBottom: "34px" }}>
              電話も、見積の待ち時間も、当日の不安も。依頼から施工、その後のつきあいまでを、一本の線にする。
            </p>

            <button onClick={() => setPhase("service")}
              style={{ fontSize: "15px", fontWeight: 600, color: "#fff", background: C.ink, border: "none", borderRadius: "2px", padding: "16px 32px", cursor: "pointer" }}>
              工事を依頼する
            </button>
            <div style={{ fontSize: "12px", color: C.faint, marginTop: "12px" }}>最短30秒でお見積り</div>

            {/* index */}
            <div style={{ marginTop: "52px", borderTop: `1px solid ${C.line}` }}>
              {[
                { n: "01", t: "AR設置プラン", d: "画面上に機器を置いて配置を決める", href: "/caas/ar" },
                { n: "02", t: "リモート現調", d: "オンラインで施設を映しながら相談", href: "/caas/survey" },
                { n: "03", t: "業界別の使われ方", d: "同じ業種の導入例と得られた価値", href: "/caas/industries" },
                { n: "04", t: "多拠点をまとめて", d: "一括で日程調整・CSVで書き出し", href: "/caas/sites" },
              ].map((e) => (
                <button key={e.href} onClick={() => router.push(e.href)}
                  style={{ display: "flex", alignItems: "baseline", gap: "16px", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid ${C.line}`, padding: "20px 2px", cursor: "pointer" }}>
                  <span style={{ fontSize: "12px", color: C.faint, fontVariantNumeric: "tabular-nums", minWidth: "22px" }}>{e.n}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: C.ink, display: "block" }}>{e.t}</span>
                    <span style={{ fontSize: "13px", color: C.sub, marginTop: "3px", display: "block" }}>{e.d}</span>
                  </span>
                  <span style={{ color: C.faint, fontSize: "15px" }}>→</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "28px", fontSize: "12px", color: C.faint, lineHeight: 1.9 }}>
              施工実績 12,800件　·　満足度 98%　·　認定職人のみ　·　1年保証
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
            <p style={{ fontSize: "14px", color: C.sub, marginBottom: "16px" }}>近日ほど<b>特急料金</b>、先の日ほどお得。空き枠をタップ。</p>

            {/* legend */}
            <div style={{ display: "flex", gap: "14px", marginBottom: "14px", fontSize: "12px", color: C.sub, flexWrap: "wrap" }}>
              <span><b style={{ color: C.ok }}>○</b> 空き</span>
              <span><b style={{ color: C.amber }}>△</b> 残少</span>
              <span><b style={{ color: C.faint }}>×</b> 満</span>
              <span style={{ color: "#e5484d" }}>⚡ 特急</span>
              <span style={{ color: C.ok }}>お得</span>
            </div>

            {/* grid */}
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "10px", overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `56px repeat(${DAYS.length}, 1fr)`, gap: "6px", minWidth: "360px" }}>
                <div />
                {DAYS.map((d) => {
                  const pr = DAY_PRICING[d.id];
                  return (
                    <div key={d.id} style={{ textAlign: "center", padding: "4px 0" }}>
                      <div style={{ fontSize: "12px", fontWeight: 600 }}>{d.label}</div>
                      <div style={{ fontSize: "10px", color: d.dow === "土" ? "#2f6bed" : d.dow === "日" ? "#e5484d" : C.faint }}>{d.dow}</div>
                      {pr && <div style={{ fontSize: "9px", fontWeight: 700, color: pr.color, marginTop: "2px" }}>{pr.tag}</div>}
                    </div>
                  );
                })}
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

            {slotId && service && (
              <div style={{ marginTop: "14px", background: C.bg, borderRadius: "12px", padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: C.accent, fontWeight: 600 }}>選択中：{fmtSlot(slotId)}</div>
                {slotMultiplier(slotId) !== 1 && (
                  <div style={{ fontSize: "12px", color: C.sub, marginTop: "4px" }}>
                    {slotMultiplier(slotId) > 1
                      ? <>特急料金 <b style={{ color: "#e5484d" }}>+{Math.round((slotMultiplier(slotId) - 1) * 100)}%</b> → {fmtYen(priceForSlot(service.price, slotId))}</>
                      : <>お得料金 <b style={{ color: C.ok }}>−{Math.round((1 - slotMultiplier(slotId)) * 100)}%</b> → {fmtYen(priceForSlot(service.price, slotId))}</>}
                  </div>
                )}
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
              {slotMultiplier(slotId) !== 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "12px" }}>
                  <span style={{ color: C.faint }}>基本料金 {fmtYen(service.price)} ＋ {slotMultiplier(slotId) > 1 ? "特急" : "お得"}調整</span>
                  <span style={{ color: slotMultiplier(slotId) > 1 ? "#e5484d" : C.ok, fontWeight: 600 }}>
                    {slotMultiplier(slotId) > 1 ? "+" : "−"}{Math.abs(Math.round((slotMultiplier(slotId) - 1) * 100))}%
                  </span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "14px", paddingTop: "16px", borderTop: `1px solid ${C.line}` }}>
                <span style={{ fontSize: "13px", color: C.faint }}>お支払い目安</span>
                <span style={{ fontSize: "24px", fontWeight: 700 }}>{fmtYen(priceForSlot(service.price, slotId))}〜</span>
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
