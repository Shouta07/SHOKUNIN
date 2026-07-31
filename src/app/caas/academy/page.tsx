"use client";

import { useState } from "react";
import {
  SKILL_CATEGORIES,
  RATING_AXES,
  CRAFTSMEN,
  skillProgress,
} from "@/lib/caas";
import { Card } from "@/components/ui/card";
import { Eyebrow, Badge, Meter } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export default function CaasAcademy() {
  const me = CRAFTSMEN[0];
  const [openCat, setOpenCat] = useState<string>(SKILL_CATEGORIES[0].id);
  const [playing, setPlaying] = useState<string | null>(null);

  const done = SKILL_CATEGORIES.reduce(
    (s, c) => s + c.modules.filter((m) => m.done).length,
    0,
  );
  const totalMods = SKILL_CATEGORIES.reduce((s, c) => s + c.modules.length, 0);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 lg:px-10">
      <header className="pt-8">
        <Eyebrow>アカデミー</Eyebrow>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          学びと評価
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          動画マニュアルで学び、現場の評価で磨く。
        </p>
      </header>

      {/* ── Profile + hospitality score ── */}
      <Card className="mt-7 p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-base font-semibold text-white">
            {me.initial}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold text-ink">
              {me.name}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Badge>{me.level}</Badge>
              <span className="tnum text-[13px] text-muted">
                ★ {me.rating}（{me.reviews}件）
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-4 border-t border-line-2 pt-4">
          {RATING_AXES.map((ax) => (
            <div key={ax.key} className="text-center">
              <dt className="tnum text-base font-semibold text-ink">
                {me.axes[ax.key].toFixed(1)}
              </dt>
              <dd className="mt-0.5 text-[11px] text-muted">{ax.label}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 border-l border-line pl-3.5 text-[13px] leading-relaxed text-muted">
          {me.hospitalityQuote}
        </p>
      </Card>

      {/* ── Skill map ── */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <Eyebrow>スキルマップ</Eyebrow>
          <span className="tnum text-[12px] text-muted">
            {done} / {totalMods} 修了
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {SKILL_CATEGORIES.map((cat) => {
            const pct = skillProgress(cat);
            const open = openCat === cat.id;
            return (
              <Card key={cat.id}>
                <button
                  onClick={() => setOpenCat(open ? "" : cat.id)}
                  aria-expanded={open}
                  className="w-full px-5 py-4 text-left"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-medium text-ink">
                      {cat.label}
                    </span>
                    <span
                      className={cn(
                        "tnum text-[13px] font-semibold",
                        pct === 100 ? "text-positive" : "text-ink",
                      )}
                    >
                      {pct}%
                    </span>
                  </div>
                  <Meter value={pct} className="mt-3" />
                </button>

                {open && (
                  <div className="animate-rise border-t border-line-2 px-5 pb-4">
                    {cat.modules.map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setPlaying(playing === m.id ? null : m.id)
                        }
                        className="tap flex w-full items-center gap-3 border-b border-line-2 text-left last:border-0"
                      >
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-md text-[12px] font-semibold",
                            m.done
                              ? "bg-positive/10 text-positive"
                              : "bg-line-2 text-muted",
                          )}
                        >
                          {m.done ? "✓" : "▶"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block truncate text-[13px]",
                              m.done ? "text-muted" : "font-medium text-ink",
                            )}
                          >
                            {m.title}
                          </span>
                          <span className="tnum mt-0.5 block text-[11px] text-subtle">
                            {m.duration}
                            {m.done && "・修了"}
                          </span>
                        </span>
                      </button>
                    ))}

                    {playing && cat.modules.some((m) => m.id === playing) && (
                      <div className="mt-3 grid aspect-video place-items-center rounded-[var(--radius-control)] bg-ink">
                        <span className="px-4 text-center text-[12px] text-white/60">
                          ▶ {cat.modules.find((m) => m.id === playing)?.title}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Quality loop ── */}
      <Card className="mt-8 p-5">
        <Eyebrow>品質改善のしくみ</Eyebrow>
        <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
          動画で学び、現場で実践し、お客様の評価を受ける。評価が低い項目には次に見るべき動画が提示されます。修了すると認定バッジが付き、お客様の画面に表示されます。
        </p>
      </Card>
    </div>
  );
}
