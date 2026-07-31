"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BANDS,
  HOME_BASE,
  TODAY_JOBS,
  TRAVEL_YEN_PER_KM,
  AVG_KMH,
  optimizeRoute,
  naiveTotalKm,
  getService,
  fmtYen,
  mapsEmbedSrc,
  mapsDirUrl,
} from "@/lib/caas";
import { Card } from "@/components/ui/card";
import { Eyebrow, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const WEEK = [
  { k: "mon", l: "月" },
  { k: "tue", l: "火" },
  { k: "wed", l: "水" },
  { k: "thu", l: "木" },
  { k: "fri", l: "金" },
  { k: "sat", l: "土" },
  { k: "sun", l: "日" },
];
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
      setAvail(
        raw
          ? new Set(JSON.parse(raw) as string[])
          : new Set(["mon|am", "tue|am", "tue|pm", "fri|am", "fri|eve"]),
      );
    } catch {
      setAvail(new Set());
    }
  }, []);

  const toggle = (key: string) => {
    if (BOOKED.has(key)) return;
    const s = new Set(avail);
    s.has(key) ? s.delete(key) : s.add(key);
    setAvail(s);
    try {
      localStorage.setItem(AV_KEY, JSON.stringify([...s]));
    } catch {}
  };

  const route = useMemo(() => optimizeRoute(HOME_BASE, TODAY_JOBS), []);
  const naiveKm = useMemo(() => naiveTotalKm(HOME_BASE, TODAY_JOBS), []);
  const savedKm = Math.max(0, naiveKm - route.totalKm);
  const mins = (km: number) => Math.round((km / AVG_KMH) * 60);

  if (!mounted) return <div className="min-h-dvh bg-canvas" />;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 lg:px-10">
      <header className="pt-8">
        <Eyebrow>職人ポータル</Eyebrow>
        <h1 className="mt-2 text-2xl font-semibold text-ink">スケジュール</h1>
      </header>

      {/* Tabs */}
      <div
        role="tablist"
        className="mt-6 inline-flex rounded-[var(--radius-control)] bg-line-2 p-0.5"
      >
        {(
          [
            ["route", "本日のルート"],
            ["calendar", "空き枠"],
          ] as [Tab, string][]
        ).map(([k, l]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "rounded-[6px] px-4 py-2 text-[13px] font-medium transition-colors",
              tab === k
                ? "bg-surface text-ink shadow-[var(--shadow-e1)]"
                : "text-muted hover:text-ink",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ══ Route ══ */}
      {tab === "route" && (
        <div className="animate-rise">
          <Card className="mt-6 p-5">
            <Eyebrow>最短ルートで最適化済み</Eyebrow>
            <dl className="mt-4 grid grid-cols-3 gap-4">
              {[
                [route.totalKm.toFixed(1), "km", "総移動", false],
                [String(mins(route.totalKm)), "分", "移動時間", false],
                [`−${savedKm.toFixed(1)}`, "km", "削減", true],
              ].map(([v, u, l, good]) => (
                <div key={l as string}>
                  <dt
                    className={cn(
                      "tnum text-xl font-semibold",
                      good ? "text-positive" : "text-ink",
                    )}
                  >
                    {v}
                    <span className="text-[12px] font-normal text-muted">
                      {u}
                    </span>
                  </dt>
                  <dd className="mt-0.5 text-[12px] text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] border border-line">
            <iframe
              title="本日のルート"
              src={mapsEmbedSrc(HOME_BASE, route.order)}
              className="block h-60 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={mapsDirUrl(HOME_BASE, route.order)}
            target="_blank"
            rel="noopener noreferrer"
            className="tap mt-2 flex items-center justify-center text-[13px] font-medium text-brand"
          >
            Google マップで経路を開く →
          </a>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="tnum text-lg font-semibold text-ink">
                {fmtYen(Math.round(route.totalKm * TRAVEL_YEN_PER_KM))}
              </div>
              <div className="mt-0.5 text-[12px] text-muted">交通費の目安</div>
            </Card>
            <Card className="p-4">
              <div className="tnum text-lg font-semibold text-positive">
                {fmtYen(Math.round(savedKm * TRAVEL_YEN_PER_KM))}
              </div>
              <div className="mt-0.5 text-[12px] text-muted">削減額</div>
            </Card>
          </div>

          <ol className="mt-6">
            <li className="flex items-center gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
                出
              </span>
              <span className="text-sm font-medium text-ink">
                {HOME_BASE.name}
              </span>
            </li>
            {route.order.map((j, i) => (
              <li key={j.id}>
                <div className="ml-3.5 flex items-center gap-3 border-l border-line py-2 pl-6">
                  <span className="tnum text-[12px] text-muted">
                    {route.legs[i].km.toFixed(1)} km
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-ink bg-surface text-[11px] font-semibold text-ink">
                    {i + 1}
                  </span>
                  <Card className="flex-1 p-3.5">
                    <div className="text-sm font-medium text-ink">{j.name}</div>
                    <div className="tnum mt-0.5 text-[12px] text-muted">
                      {j.time}・{getService(j.serviceId)?.label}
                    </div>
                  </Card>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ══ Calendar ══ */}
      {tab === "calendar" && (
        <div className="animate-rise">
          <div className="mt-6 flex flex-wrap gap-4 text-[12px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-brand" />提供中
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-line-2 ring-1 ring-line" />
              非提供
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-ink" />予約済（変更不可）
            </span>
          </div>

          <Card className="mt-3 overflow-x-auto p-3">
            <table className="w-full min-w-[380px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-12" />
                  {WEEK.map((d) => (
                    <th
                      key={d.k}
                      className={cn(
                        "pb-1 text-center text-[13px] font-medium",
                        d.k === "sun"
                          ? "text-critical"
                          : d.k === "sat"
                            ? "text-brand"
                            : "text-ink",
                      )}
                    >
                      {d.l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BANDS.map((b) => (
                  <tr key={b.id}>
                    <th className="pr-1 text-left text-[13px] font-medium text-ink">
                      {b.label}
                    </th>
                    {WEEK.map((d) => {
                      const key = `${d.k}|${b.id}`;
                      const booked = BOOKED.has(key);
                      const on = avail.has(key);
                      return (
                        <td key={key}>
                          <button
                            onClick={() => toggle(key)}
                            disabled={booked}
                            aria-pressed={on}
                            aria-label={`${d.l} ${b.label} ${booked ? "予約済み" : on ? "提供中" : "非提供"}`}
                            title={booked ? "予約済みのため変更できません" : ""}
                            className={cn(
                              "aspect-[1.3] w-full rounded-[var(--radius-control)] border text-[12px] font-semibold transition-colors",
                              booked
                                ? "cursor-not-allowed border-ink bg-ink text-white"
                                : on
                                  ? "border-brand bg-brand text-brand-fg"
                                  : "border-line bg-surface text-subtle hover:border-subtle",
                            )}
                          >
                            {booked ? "予" : on ? "○" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="tnum text-xl font-semibold text-ink">
                {avail.size}
              </div>
              <div className="mt-0.5 text-[12px] text-muted">提供中の枠</div>
            </Card>
            <Card className="p-4">
              <div className="tnum text-xl font-semibold text-ink">
                {BOOKED.size}
              </div>
              <div className="mt-0.5 text-[12px] text-muted">予約済み</div>
            </Card>
          </div>

          <Card className="mt-3 p-5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">二重予約の防止</span>
              <Badge tone="brand">自動</Badge>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              予約が入った枠は自動でロックされ、提供枠から外れます。顧客の予約画面には提供中の枠だけが表示されるため、重複は発生しません。
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
