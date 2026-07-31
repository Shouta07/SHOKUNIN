"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INDUSTRIES } from "@/lib/caas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Badge, Meter } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export default function Industries() {
  const router = useRouter();
  const [sel, setSel] = useState(INDUSTRIES[0].id);
  const ind = INDUSTRIES.find((i) => i.id === sel)!;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 lg:px-10">
      {/* ── Header ── */}
      <header className="pt-8">
        <Eyebrow>業界別の価値</Eyebrow>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          設備が、価値になる。
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          同業がどう使い、何を得たかを見る。
        </p>
      </header>

      {/* ── Industry picker ── */}
      <div
        role="tablist"
        aria-label="業界"
        className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0"
      >
        {INDUSTRIES.map((i) => {
          const on = sel === i.id;
          return (
            <button
              key={i.id}
              role="tab"
              id={`tab-${i.id}`}
              aria-selected={on}
              aria-controls="industry-panel"
              onClick={() => setSel(i.id)}
              className={cn(
                "tap shrink-0 whitespace-nowrap rounded-[var(--radius-control)] border px-4 text-[13px] font-medium transition-colors",
                on
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-ink hover:border-subtle",
              )}
            >
              {i.label}
            </button>
          );
        })}
      </div>

      <div
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`tab-${ind.id}`}
        className="animate-rise"
        key={ind.id}
      >
        {/* ── Adoption ── */}
        <Card className="mt-4 p-5">
          <Eyebrow>{ind.label}の導入率</Eyebrow>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="tnum text-4xl font-semibold leading-none text-ink">
              {ind.adoption}
              <span className="text-xl font-normal text-muted">%</span>
            </span>
            <span className="text-[13px] text-muted">が導入済み</span>
          </div>
          <Meter value={ind.adoption} className="mt-4" />
          <p className="mt-3 text-[12px] text-warning">
            貴社は未導入 — 同業に先行されています
          </p>
        </Card>

        {/* ── Value metrics ── */}
        <section className="mt-6">
          <Eyebrow>導入で得られる価値</Eyebrow>
          <dl className="mt-3 grid grid-cols-3 gap-3">
            {ind.values.map((v) => {
              const delta = v.value.includes("%");
              return (
                <Card key={v.label} className="p-4 text-center">
                  <dt
                    className={cn(
                      "tnum text-lg font-semibold",
                      delta ? "text-positive" : "text-ink",
                    )}
                  >
                    {v.value}
                  </dt>
                  <dd className="mt-1 text-[11px] leading-snug text-muted">
                    {v.label}
                  </dd>
                </Card>
              );
            })}
          </dl>
        </section>

        {/* ── Typical setup ── */}
        <section className="mt-6">
          <Eyebrow>この業界の定番構成</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {ind.setup.map((s) => (
              <Badge key={s} className="px-2.5 py-1 text-[12px]">
                {s}
              </Badge>
            ))}
          </div>
        </section>

        {/* ── Insight ── */}
        <p className="mt-6 border-l border-line pl-4 text-sm leading-relaxed text-ink">
          {ind.insight}
        </p>
      </div>

      {/* ── CTA ── */}
      <Button
        size="lg"
        full
        className="mt-8"
        onClick={() => router.push("/caas")}
      >
        {ind.label}向けの見積を出す
      </Button>

      <p className="mt-4 border-l border-line pl-4 text-[12px] leading-relaxed text-muted">
        ログイン後は、貴社の業種・規模に合わせて似た会社の導入例を自動で比較表示します。
      </p>
    </div>
  );
}
