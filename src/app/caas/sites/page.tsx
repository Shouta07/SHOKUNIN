"use client";

import { useState } from "react";
import {
  C, SANS, SITES, SITE_STATUSES, DAYS, BANDS, CRAFTSMEN, SERVICES, REFERRAL,
  buildSitesCSV, fmtSlot, fmtYen, type Site, type SiteStatus,
} from "@/lib/caas";

const SLOT_OPTIONS = DAYS.flatMap((d) => BANDS.map((b) => ({ value: `${d.id}|${b.id}`, label: `${d.label}(${d.dow}) ${b.label}` })));

const statusColor: Record<SiteStatus, string> = {
  未定: "#9aa4b0", 調整中: "#f59e0b", 確定: "#2f6bed", 完了: "#2fa96b",
};

export default function CaasSites() {
  const [sites, setSites] = useState<Site[]>(SITES);
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddr, setNewAddr] = useState("");

  const update = (id: string, patch: Partial<Site>) =>
    setSites((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const exportCSV = () => {
    const csv = buildSitesCSV(sites);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "caas_schedule.csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const addSite = () => {
    if (!newName) return;
    setSites((prev) => [...prev, { id: crypto.randomUUID().slice(0, 6), name: newName, address: newAddr, serviceId: "camera", slotId: "", craftsmanId: "", status: "未定" }]);
    setNewName(""); setNewAddr(""); setAdding(false);
  };

  const stat = (s: SiteStatus) => sites.filter((x) => x.status === s).length;

  const sel: React.CSSProperties = { fontFamily: SANS, fontSize: "12px", color: C.ink, background: C.bg, border: `1px solid ${C.line}`, borderRadius: "8px", padding: "7px 8px", outline: "none", width: "100%" };

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "28px 20px 60px" }}>

        <div style={{ marginBottom: "22px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: C.accent }}>MULTI-SITE</div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginTop: "6px" }}>拠点 一括スケジュール</h1>
          <p style={{ fontSize: "13px", color: C.sub, marginTop: "6px", lineHeight: 1.7 }}>複数拠点の工事日程をまとめて調整。CSVで書き出して、いつでも社内システム（kintone等）へ。</p>
        </div>

        {/* summary */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          {[{ l: "拠点数", v: sites.length, c: C.ink }, { l: "確定", v: stat("確定"), c: statusColor["確定"] }, { l: "調整中", v: stat("調整中"), c: statusColor["調整中"] }, { l: "未定", v: stat("未定"), c: statusColor["未定"] }].map((m) => (
            <div key={m.l} style={{ flex: "1 1 90px", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: m.c }}>{m.v}</div>
              <div style={{ fontSize: "11px", color: C.faint, marginTop: "2px" }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
          <button onClick={exportCSV} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: C.ink, border: "none", borderRadius: "2px", padding: "11px 20px", cursor: "pointer" }}>
            CSVエクスポート
          </button>
          <button onClick={() => setAdding(!adding)} style={{ fontSize: "13px", fontWeight: 600, color: C.ink, background: C.surface, border: `1px solid ${C.line}`, borderRadius: "2px", padding: "11px 18px", cursor: "pointer" }}>
            拠点を追加
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(buildSitesCSV(sites)); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
            style={{ fontSize: "13px", fontWeight: 600, color: C.sub, background: "none", border: `1px solid ${C.line}`, borderRadius: "10px", padding: "11px 18px", cursor: "pointer" }}>
            {copied ? "コピーしました ✓" : "クリップボードにコピー"}
          </button>
        </div>

        {adding && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "12px", padding: "14px" }}>
            <input placeholder="拠点名" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ ...sel, flex: "1 1 140px", fontSize: "14px", padding: "10px 12px" }} />
            <input placeholder="住所" value={newAddr} onChange={(e) => setNewAddr(e.target.value)} style={{ ...sel, flex: "2 1 200px", fontSize: "14px", padding: "10px 12px" }} />
            <button onClick={addSite} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: C.accent, border: "none", borderRadius: "10px", padding: "10px 18px", cursor: "pointer" }}>追加</button>
          </div>
        )}

        {/* site list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sites.map((s) => (
            <div key={s.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: "12px", color: C.faint, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.address || "住所未登録"}</div>
                </div>
                <span style={{ flexShrink: 0, fontSize: "11px", fontWeight: 700, color: "#fff", background: statusColor[s.status], borderRadius: "100px", padding: "4px 12px" }}>{s.status}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px" }}>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "4px" }}>工事</span>
                  <select value={s.serviceId} onChange={(e) => update(s.id, { serviceId: e.target.value })} style={sel}>
                    {SERVICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "4px" }}>日時</span>
                  <select value={s.slotId} onChange={(e) => update(s.id, { slotId: e.target.value, status: e.target.value && s.status === "未定" ? "調整中" : s.status })} style={sel}>
                    <option value="">未定</option>
                    {SLOT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "4px" }}>担当</span>
                  <select value={s.craftsmanId} onChange={(e) => update(s.id, { craftsmanId: e.target.value })} style={sel}>
                    <option value="">未割当</option>
                    {CRAFTSMEN.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "4px" }}>ステータス</span>
                  <select value={s.status} onChange={(e) => update(s.id, { status: e.target.value as SiteStatus })} style={sel}>
                    {SITE_STATUSES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* CSV / kintone note */}
        <div style={{ borderLeft: `2px solid ${C.line}`, paddingLeft: "14px", marginTop: "18px", fontSize: "12px", color: C.sub, lineHeight: 1.8 }}>
          エクスポートしたCSV（UTF-8・BOM付き）は、kintoneや基幹システムにそのまま取り込めます。将来はAPI連携で自動同期も可能です。
        </div>

        {/* Referral campaign */}
        <div style={{ marginTop: "28px", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "4px", padding: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", color: C.faint, textTransform: "uppercase" }}>Referral</div>
          <h2 style={{ fontSize: "19px", fontWeight: 700, margin: "10px 0 8px", lineHeight: 1.4 }}>紹介で、双方に {fmtYen(REFERRAL.rewardYou)} 分クーポン</h2>
          <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7, marginBottom: "16px" }}>{REFERRAL.message}</p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: "2px", padding: "12px 18px", fontSize: "17px", fontWeight: 700, letterSpacing: "0.08em" }}>{REFERRAL.code}</div>
            <button onClick={() => { navigator.clipboard?.writeText(REFERRAL.code); }} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: C.ink, border: "none", borderRadius: "2px", padding: "13px 20px", cursor: "pointer" }}>
              コードをコピー
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
