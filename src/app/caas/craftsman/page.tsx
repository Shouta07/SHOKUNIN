"use client";

import { useState, useEffect, useMemo } from "react";
import {
  C, SANS, BANDS, HOME_BASE, TODAY_JOBS, TRAVEL_YEN_PER_KM, AVG_KMH,
  optimizeRoute, naiveTotalKm, getService, fmtYen, type GeoPoint,
} from "@/lib/caas";

const WEEK = [
  { k: "mon", l: "月" }, { k: "tue", l: "火" }, { k: "wed", l: "水" },
  { k: "thu", l: "木" }, { k: "fri", l: "金" }, { k: "sat", l: "土" }, { k: "sun", l: "日" },
];
// 既に予約が入っている枠（自動ロック・二重予約防止）
const BOOKED = new Set(["mon|pm", "wed|am", "thu|pm", "sat|am"]);
const AV_KEY = "caas_availability";

type Tab = "route" | "calendar";

export default function CraftsmanPage() {
  const [tab, setTab] = useState<Tab>("route");
  const [avail, setAvail] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(AV_KEY);
      setAvail(raw ? new Set(JSON.parse(raw) as string[]) : new Set(["mon|am", "tue|am", "tue|pm", "fri|am", "fri|eve"]));
    } catch { setAvail(new Set()); }
  }, []);

  const persist = (s: Set<string>) => { setAvail(new Set(s)); try { localStorage.setItem(AV_KEY, JSON.stringify([...s])); } catch {} };

  const toggle = (key: string) => {
    if (BOOKED.has(key)) return; // 予約済みはロック
    const s = new Set(avail);
    if (s.has(key)) s.delete(key); else s.add(key);
    persist(s);
  };

  const route = useMemo(() => optimizeRoute(HOME_BASE, TODAY_JOBS), []);
  const naiveKm = useMemo(() => naiveTotalKm(HOME_BASE, TODAY_JOBS), []);
  const savedKm = Math.max(0, naiveKm - route.totalKm);
  const min = (km: number) => Math.round((km / AVG_KMH) * 60);

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 20px 60px" }}>

        <div style={{ marginBottom: "18px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: C.accent }}>CRAFTSMAN</div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginTop: "6px" }}>スケジュール</h1>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {([["route", "本日のルート"], ["calendar", "空き枠カレンダー"]] as [Tab, string][]).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ flex: 1, fontSize: "13px", fontWeight: 700, padding: "12px", borderRadius: "12px", cursor: "pointer", fontFamily: SANS,
                background: tab === k ? C.accent : C.surface, color: tab === k ? "#fff" : C.sub, border: `1px solid ${tab === k ? C.accent : C.line}` }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── ROUTE ── */}
        {tab === "route" && (
          <>
            {/* savings banner */}
            <div style={{ background: "linear-gradient(135deg,#2fa96b,#28c07a)", borderRadius: "16px", padding: "18px 20px", color: "#fff", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", opacity: 0.9, fontWeight: 600 }}>最短ルートで移動を最適化</div>
              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                <div><div style={{ fontSize: "22px", fontWeight: 800 }}>{route.totalKm.toFixed(1)}<span style={{ fontSize: "12px" }}>km</span></div><div style={{ fontSize: "11px", opacity: 0.85 }}>総移動</div></div>
                <div><div style={{ fontSize: "22px", fontWeight: 800 }}>{min(route.totalKm)}<span style={{ fontSize: "12px" }}>分</span></div><div style={{ fontSize: "11px", opacity: 0.85 }}>移動時間</div></div>
                <div><div style={{ fontSize: "22px", fontWeight: 800 }}>−{savedKm.toFixed(1)}<span style={{ fontSize: "12px" }}>km</span></div><div style={{ fontSize: "11px", opacity: 0.85 }}>無駄削減</div></div>
              </div>
            </div>

            {/* schematic map */}
            <RouteMap order={route.order} />

            {/* cost */}
            <div style={{ display: "flex", gap: "10px", margin: "16px 0" }}>
              <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>{fmtYen(Math.round(route.totalKm * TRAVEL_YEN_PER_KM))}</div>
                <div style={{ fontSize: "11px", color: C.faint, marginTop: "2px" }}>交通費 目安</div>
              </div>
              <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: C.ok }}>{fmtYen(Math.round(savedKm * TRAVEL_YEN_PER_KM))}</div>
                <div style={{ fontSize: "11px", color: C.faint, marginTop: "2px" }}>削減額</div>
              </div>
            </div>

            {/* ordered stops */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <Stop idx={0} name={HOME_BASE.name} sub="出発" home />
              {route.order.map((j, i) => (
                <Stop key={j.id} idx={i + 1} name={j.name} sub={`${j.time}・${getService(j.serviceId)?.label ?? ""}`} km={route.legs[i].km} />
              ))}
            </div>

            <p style={{ fontSize: "11px", color: C.faint, textAlign: "center", marginTop: "16px", lineHeight: 1.7 }}>
              距離はGoogle Maps連携で実道路を計算します（本番）。現在は直線距離の概算。
            </p>
          </>
        )}

        {/* ── CALENDAR ── */}
        {tab === "calendar" && (
          <>
            <div style={{ display: "flex", gap: "14px", marginBottom: "14px", fontSize: "12px", color: C.sub, flexWrap: "wrap" }}>
              <span><Dot c={C.ok} /> 提供中</span>
              <span><Dot c={C.accent} /> 予約済（ロック）</span>
              <span><Dot c={C.line} /> 非提供</span>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "12px", overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: `52px repeat(7, 1fr)`, gap: "6px", minWidth: "380px" }}>
                <div />
                {WEEK.map((d) => <div key={d.k} style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: d.k === "sun" ? "#e5484d" : d.k === "sat" ? "#2f6bed" : C.ink, padding: "4px 0" }}>{d.l}</div>)}
                {BANDS.map((b) => (
                  <Row key={b.id}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>{b.label}</span>
                    </div>
                    {WEEK.map((d) => {
                      const key = `${d.k}|${b.id}`;
                      const booked = BOOKED.has(key);
                      const on = avail.has(key);
                      const bg = booked ? C.accent : on ? C.ok : C.bg;
                      const color = booked || on ? "#fff" : C.faint;
                      return (
                        <button key={key} onClick={() => toggle(key)} disabled={booked}
                          title={booked ? "予約済み（二重予約防止のためロック）" : ""}
                          style={{ aspectRatio: "1.3", borderRadius: "9px", cursor: booked ? "not-allowed" : "pointer",
                            background: bg, border: `1px solid ${booked ? C.accent : on ? C.ok : C.line}`, color, fontSize: "13px", fontWeight: 700 }}>
                          {booked ? "🔒" : on ? "○" : ""}
                        </button>
                      );
                    })}
                  </Row>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              {[{ l: "提供中", v: avail.size, c: C.ok }, { l: "予約済", v: BOOKED.size, c: C.accent }, { l: "空き枠", v: Math.max(0, avail.size), c: C.ink }].map((m) => (
                <div key={m.l} style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: m.c }}>{m.v}</div>
                  <div style={{ fontSize: "11px", color: C.faint, marginTop: "2px" }}>{m.l}</div>
                </div>
              ))}
            </div>

            <div style={{ background: C.accentSoft, borderRadius: "12px", padding: "14px 16px", marginTop: "16px", fontSize: "12px", color: C.sub, lineHeight: 1.8 }}>
              🔒 予約が入った枠は自動でロックされ、提供枠から外れます。<b>二重予約は構造的に発生しません。</b>
              提供中の枠だけが顧客の予約画面に「空き」として表示されます（カレンダー連携で常に同期）。
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ── 距離可視化：直線ルートの概念図 ──
function RouteMap({ order }: { order: GeoPoint[] & { name?: string }[] }) {
  const pts: (GeoPoint & { label: string; home?: boolean })[] = [
    { ...HOME_BASE, label: "S", home: true },
    ...order.map((j, i) => ({ lat: j.lat, lng: j.lng, label: String(i + 1) })),
  ];
  const lats = pts.map((p) => p.lat), lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const pad = 12;
  const px = (p: GeoPoint) => pad + (maxLng === minLng ? 50 : ((p.lng - minLng) / (maxLng - minLng)) * (100 - 2 * pad));
  const py = (p: GeoPoint) => pad + (maxLat === minLat ? 50 : ((maxLat - p.lat) / (maxLat - minLat)) * (100 - 2 * pad));
  const line = pts.map((p) => `${px(p).toFixed(1)},${py(p).toFixed(1)}`).join(" ");

  return (
    <div style={{ background: "#eef2f7", border: `1px solid ${C.line}`, borderRadius: "16px", overflow: "hidden", height: "220px" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
        <polyline points={line} fill="none" stroke={C.accent} strokeWidth="0.8" strokeDasharray="2 1.5" strokeLinecap="round" opacity="0.7" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={px(p)} cy={py(p)} r={p.home ? 3.4 : 3} fill={p.home ? C.ink : C.accent} />
            <text x={px(p)} y={py(p) + 1.4} fontSize="3.2" fill="#fff" fontWeight="700" textAnchor="middle">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Stop({ idx, name, sub, km, home }: { idx: number; name: string; sub: string; km?: number; home?: boolean }) {
  return (
    <div>
      {km !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "13px" }}>
          <div style={{ width: "2px", height: "18px", background: C.line }} />
          <span style={{ fontSize: "11px", color: C.faint }}>{km.toFixed(1)} km</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: home ? C.ink : C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{home ? "🏠" : idx}</div>
        <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "12px 16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: "12px", color: C.sub, marginTop: "2px" }}>{sub}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) { return <>{children}</>; }
function Dot({ c }: { c: string }) { return <span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "50%", background: c, marginRight: "3px", verticalAlign: "middle" }} />; }
