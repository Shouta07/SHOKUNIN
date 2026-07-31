"use client";

import { useState } from "react";
import {
  SITES,
  SITE_STATUSES,
  DAYS,
  BANDS,
  CRAFTSMEN,
  SERVICES,
  REFERRAL,
  buildSitesCSV,
  fmtYen,
  type Site,
  type SiteStatus,
} from "@/lib/caas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Badge, Field, Input, Select } from "@/components/ui/primitives";

const SLOT_OPTIONS = DAYS.flatMap((d) =>
  BANDS.map((b) => ({
    value: `${d.id}|${b.id}`,
    label: `${d.label}(${d.dow}) ${b.label}`,
  })),
);

const statusTone: Record<
  SiteStatus,
  "neutral" | "brand" | "positive" | "warning"
> = {
  未定: "neutral",
  調整中: "warning",
  確定: "brand",
  完了: "positive",
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
    a.href = url;
    a.download = "caas_schedule.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const addSite = () => {
    if (!newName) return;
    setSites((prev) => [
      ...prev,
      {
        id: crypto.randomUUID().slice(0, 6),
        name: newName,
        address: newAddr,
        serviceId: "camera",
        slotId: "",
        craftsmanId: "",
        status: "未定",
      },
    ]);
    setNewName("");
    setNewAddr("");
    setAdding(false);
  };

  const stat = (s: SiteStatus) => sites.filter((x) => x.status === s).length;

  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 lg:px-10">
      {/* ── Header ── */}
      <header className="pt-8">
        <Eyebrow>多拠点管理</Eyebrow>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          拠点 一括スケジュール
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          複数拠点の日程をまとめて調整し、CSVで書き出せます。
        </p>
      </header>

      {/* ── Summary ── */}
      <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["拠点数", sites.length],
          ["確定", stat("確定")],
          ["調整中", stat("調整中")],
          ["未定", stat("未定")],
        ].map(([label, value]) => (
          <Card key={label as string} className="p-4">
            <dt className="tnum text-xl font-semibold text-ink">{value}</dt>
            <dd className="mt-0.5 text-[12px] text-muted">{label}</dd>
          </Card>
        ))}
      </dl>

      {/* ── Actions ── */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={exportCSV}>CSVエクスポート</Button>
        <Button
          variant="secondary"
          aria-expanded={adding}
          onClick={() => setAdding(!adding)}
        >
          拠点を追加
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard?.writeText(buildSitesCSV(sites));
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "コピーしました" : "クリップボードにコピー"}
        </Button>
      </div>

      {/* ── Add site ── */}
      {adding && (
        <Card className="animate-rise mt-3 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="拠点名">
              <Input
                placeholder="渋谷店"
                aria-label="拠点名"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Field>
            <Field label="住所">
              <Input
                placeholder="東京都渋谷区…"
                aria-label="住所"
                value={newAddr}
                onChange={(e) => setNewAddr(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Button disabled={!newName} onClick={addSite}>
              追加
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              キャンセル
            </Button>
          </div>
        </Card>
      )}

      {/* ── Site list ── */}
      <div className="mt-3 space-y-3">
        {sites.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-medium text-ink">
                  {s.name}
                </div>
                <div className="mt-0.5 truncate text-[12px] text-muted">
                  {s.address || "住所未登録"}
                </div>
              </div>
              <Badge tone={statusTone[s.status]} className="shrink-0">
                {s.status}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 border-t border-line-2 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="工事">
                <Select
                  aria-label={`${s.name} の工事種別`}
                  value={s.serviceId}
                  onChange={(e) => update(s.id, { serviceId: e.target.value })}
                >
                  {SERVICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="日時">
                <Select
                  aria-label={`${s.name} の希望日時`}
                  value={s.slotId}
                  onChange={(e) =>
                    update(s.id, {
                      slotId: e.target.value,
                      status:
                        e.target.value && s.status === "未定"
                          ? "調整中"
                          : s.status,
                    })
                  }
                >
                  <option value="">未定</option>
                  {SLOT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="担当">
                <Select
                  aria-label={`${s.name} の担当職人`}
                  value={s.craftsmanId}
                  onChange={(e) => update(s.id, { craftsmanId: e.target.value })}
                >
                  <option value="">未割当</option>
                  {CRAFTSMEN.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="ステータス">
                <Select
                  aria-label={`${s.name} のステータス`}
                  value={s.status}
                  onChange={(e) =>
                    update(s.id, { status: e.target.value as SiteStatus })
                  }
                >
                  {SITE_STATUSES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>
        ))}
      </div>

      {/* ── CSV note ── */}
      <p className="mt-4 border-l border-line pl-4 text-[12px] leading-relaxed text-muted">
        CSVはUTF-8・BOM付き。kintone等の基幹システムにそのまま取り込めます。将来はAPI連携で自動同期にも対応します。
      </p>

      {/* ── Referral ── */}
      <Card className="mt-8 p-5">
        <Eyebrow>紹介プログラム</Eyebrow>
        <h2 className="mt-2 text-[15px] font-semibold text-ink">
          紹介で双方に
          <span className="tnum"> {fmtYen(REFERRAL.rewardYou)} </span>
          分クーポン
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          {REFERRAL.message}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <code className="tnum rounded-[var(--radius-control)] border border-line bg-canvas px-4 py-2.5 font-mono text-[15px] font-medium tracking-[0.08em] text-ink">
            {REFERRAL.code}
          </code>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard?.writeText(REFERRAL.code)}
          >
            コードをコピー
          </Button>
        </div>
      </Card>
    </div>
  );
}
