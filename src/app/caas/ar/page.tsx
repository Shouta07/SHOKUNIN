"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { C, SANS, getPoints, addPoints, levelOf } from "@/lib/caas";

interface Cam { id: string; x: number; y: number; }

const coverageOf = (n: number) => (n === 0 ? 0 : Math.round(100 * (1 - Math.pow(0.5, n))));

export default function ArSim() {
  const router = useRouter();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [cams, setCams] = useState<Cam[]>([]);
  const [mode, setMode] = useState<"photo" | "live">("photo");
  const [points, setPoints] = useState(0);
  const [awarded, setAwarded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setPoints(getPoints()); }, []);

  const cov = coverageOf(cams.length);
  const covColor = cov >= 80 ? C.ok : cov >= 40 ? C.amber : C.live;
  const missions = [
    { label: "カメラを2台以上 置く", done: cams.length >= 2 },
    { label: "カバー率 80% 以上にする", done: cov >= 80 },
  ];
  const allDone = missions.every((m) => m.done);

  useEffect(() => {
    if (allDone && !awarded && mounted) {
      setAwarded(true);
      setPoints(addPoints(50));
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 2600);
      return () => clearTimeout(t);
    }
  }, [allDone, awarded, mounted]);

  const place = (e: React.MouseEvent) => {
    const el = sceneRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setCams((p) => [...p, { id: crypto.randomUUID(), x, y }]);
  };
  const remove = (id: string, e: React.MouseEvent) => { e.stopPropagation(); setCams((p) => p.filter((c) => c.id !== id)); };

  if (!mounted) return <div style={{ minHeight: "100dvh", background: C.bg }} />;
  const lv = levelOf(points);

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* header + points */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: C.accent }}>AR SIMULATION</div>
            <h1 style={{ fontSize: "23px", fontWeight: 700, marginTop: "6px" }}>設置シミュレーション</h1>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "100px", padding: "8px 14px", textAlign: "right" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: C.accent }}>{points}<span style={{ fontSize: "10px" }}>pt</span></div>
            <div style={{ fontSize: "9px", color: C.faint }}>{lv.name}</div>
          </div>
        </div>

        {/* mission */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "14px 16px", marginBottom: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: C.faint, marginBottom: "10px" }}>🎯 設置ミッション（達成で +50pt）</div>
          {missions.map((m) => (
            <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: m.done ? C.ok : C.bg, border: `1.5px solid ${m.done ? C.ok : C.line}`, color: "#fff", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m.done ? "✓" : ""}</span>
              <span style={{ fontSize: "13px", color: m.done ? C.sub : C.ink, textDecoration: m.done ? "line-through" : "none" }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* mode toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          {([["photo", "📷 写真で配置"], ["live", "📡 ライブAR"]] as ["photo" | "live", string][]).map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)}
              style={{ flex: 1, fontSize: "12px", fontWeight: 700, padding: "10px", borderRadius: "10px", cursor: "pointer", fontFamily: SANS,
                background: mode === k ? C.accent : C.surface, color: mode === k ? "#fff" : C.sub, border: `1px solid ${mode === k ? C.accent : C.line}` }}>
              {l}
            </button>
          ))}
        </div>

        {/* AR scene */}
        <div ref={sceneRef} onClick={place}
          style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: "18px", overflow: "hidden", cursor: "crosshair",
            background: "linear-gradient(160deg,#3a4656 0%,#232c38 55%,#1a212b 100%)", border: `1px solid ${C.line}` }}>
          {/* perspective floor grid */}
          <svg viewBox="0 0 100 133" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
            {[...Array(7)].map((_, i) => <line key={"v" + i} x1={10 + i * 13} y1="70" x2={-20 + i * 28} y2="133" stroke="#fff" strokeWidth="0.3" />)}
            {[80, 95, 112, 133].map((y, i) => <line key={"h" + i} x1="0" x2="100" y1={y} y2={y} stroke="#fff" strokeWidth="0.3" />)}
          </svg>
          {/* room hints */}
          <div style={{ position: "absolute", top: "16%", left: "12%", width: "26%", height: "22%", border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: "4px" }} />
          <div style={{ position: "absolute", top: "17%", left: "14%", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>窓</div>
          <div style={{ position: "absolute", top: "14%", right: "14%", width: "14%", height: "40%", border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: "4px" }} />
          <div style={{ position: "absolute", top: "15%", right: "15%", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>入口</div>

          {/* camera UI badge */}
          <div style={{ position: "absolute", top: "10px", left: "12px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.35)", borderRadius: "100px", padding: "4px 10px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: mode === "live" ? C.live : "rgba(255,255,255,0.6)", animation: mode === "live" ? "arPulse 1.2s ease-in-out infinite" : "none" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>{mode === "live" ? "AR LIVE" : "PHOTO"}</span>
          </div>

          {/* coverage + cameras */}
          {cams.map((c) => (
            <div key={c.id}>
              <div style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, width: "46%", height: "46%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}55 0%, ${C.accent}22 45%, transparent 70%)`, pointerEvents: "none" }} />
              <button onClick={(e) => remove(c.id, e)}
                style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)", width: "34px", height: "34px", borderRadius: "50%", background: C.accent, border: "2px solid #fff", color: "#fff", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                📷
              </button>
            </div>
          ))}

          {/* empty hint */}
          {cams.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "rgba(255,255,255,0.7)" }}>
              <div style={{ fontSize: "30px", marginBottom: "8px" }}>👆</div>
              <div style={{ fontSize: "13px" }}>タップして、カメラを設置</div>
              <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>青い円が監視範囲です</div>
            </div>
          )}

          {/* celebration */}
          {celebrate && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(20,32,43,0.55)", animation: "arFade 300ms ease both" }}>
              <div style={{ fontSize: "44px", animation: "arPop 500ms cubic-bezier(0.22,1,0.36,1) both" }}>🎉</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginTop: "8px" }}>死角ゼロ設計 達成！</div>
              <div style={{ fontSize: "14px", color: "#fff", marginTop: "4px", fontWeight: 700 }}>+50 pt</div>
            </div>
          )}
        </div>

        {/* coverage meter */}
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "16px 18px", margin: "14px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>監視カバー率</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: covColor }}>{cov}%</span>
          </div>
          <div style={{ height: "10px", background: C.lineSoft, borderRadius: "100px", overflow: "hidden" }}>
            <div style={{ width: `${cov}%`, height: "100%", background: covColor, borderRadius: "100px", transition: "all 400ms ease" }} />
          </div>
          <div style={{ fontSize: "12px", color: C.sub, marginTop: "10px" }}>
            設置台数 <b>{cams.length}台</b>
            {cams.length > 0 && <button onClick={() => setCams([])} style={{ marginLeft: "10px", fontSize: "11px", color: C.faint, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>リセット</button>}
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => router.push("/caas")}
          style={{ width: "100%", fontSize: "15px", fontWeight: 700, color: "#fff", background: cams.length ? C.accent : C.lineSoft, border: "none", borderRadius: "14px", padding: "16px", cursor: cams.length ? "pointer" : "default" }}>
          この配置で見積もる（{cams.length}台）
        </button>
        <p style={{ fontSize: "11px", color: C.faint, textAlign: "center", marginTop: "12px", lineHeight: 1.7 }}>
          本番はスマホのカメラをかざして、実際の部屋にカメラを重ねて配置できます。
        </p>
      </div>

      <style>{`
        @keyframes arPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes arPop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes arFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
