"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SURVEY_ZONES, getService, fmtYen } from "@/lib/caas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Steps, LiveDot } from "@/components/ui/primitives";

export default function RemoteSurvey() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [zone, setZone] = useState(0);
  const [plan, setPlan] = useState<string[]>([]);

  const z = SURVEY_ZONES[zone];
  const svc = getService(z.serviceId);
  const inPlan = plan.includes(z.id);
  const total = plan.reduce(
    (s, id) =>
      s +
      (getService(SURVEY_ZONES.find((x) => x.id === id)?.serviceId ?? "")
        ?.price ?? 0),
    0,
  );
  const last = zone === SURVEY_ZONES.length - 1;

  const toggle = () =>
    setPlan((p) => (inPlan ? p.filter((x) => x !== z.id) : [...p, z.id]));

  /* ── Intro ── */
  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-16 lg:px-10">
        <header className="pt-12 lg:pt-20">
          <Eyebrow>リモート現地調査</Eyebrow>
          <h1 className="mt-4 text-[30px] font-semibold leading-[1.25] text-ink lg:text-[38px]">
            現地に行かずに、
            <br />
            設備プランを決める。
          </h1>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.8] text-muted">
            ビデオ通話をつなぎ、施設を映すだけ。担当者と一緒にその場でプランを組み立てます。
          </p>
        </header>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink">
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1">
            <LiveDot />
            <span className="text-[11px] font-semibold text-white">
              担当者が待機中
            </span>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-[13px] text-white/50">
              ビデオ通話で現地をご案内
            </span>
          </div>
        </div>

        <div className="mt-8">
          <Button size="lg" onClick={() => setStarted(true)}>
            調査をはじめる
          </Button>
          <p className="mt-3 text-[13px] text-muted">所要 約10分・無料</p>
        </div>
      </div>
    );
  }

  /* ── Walkthrough ── */
  return (
    <div className="mx-auto max-w-2xl px-5 pb-40 lg:px-10">
      <div className="pt-6">
        <Steps total={SURVEY_ZONES.length} current={zone + 1} />
        <p className="mt-3 text-[12px] text-muted">
          {zone + 1} / {SURVEY_ZONES.length}
        </p>
      </div>

      {/* Video */}
      <div className="relative mt-4 aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink">
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1">
          <LiveDot />
          <span className="text-[11px] font-semibold text-white">調査中</span>
        </div>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="text-base font-semibold text-white">{z.label}</span>
          <span className="mt-1 text-[12px] text-white/60">{z.hint}</span>
        </div>
      </div>

      {/* Recommendation */}
      <Card className="mt-3 p-5">
        <Eyebrow>担当者の提案</Eyebrow>
        <p className="mt-2.5 text-sm leading-relaxed text-ink">
          ここには <span className="font-semibold">{svc?.label}</span> をおすすめします。{z.reason}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-line-2 pt-4">
          <span className="tnum text-[15px] font-semibold text-ink">
            {fmtYen(svc?.price ?? 0)}
          </span>
          <Button
            variant={inPlan ? "secondary" : "primary"}
            onClick={toggle}
            aria-pressed={inPlan}
          >
            {inPlan ? "プランから外す" : "プランに追加"}
          </Button>
        </div>
      </Card>

      {/* Plan summary */}
      <section className="mt-6">
        <Eyebrow>現在のプラン</Eyebrow>
        <Card className="mt-3">
          {plan.length === 0 ? (
            <p className="p-5 text-[13px] text-muted">
              追加した設備がここに表示されます。
            </p>
          ) : (
            <dl className="divide-y divide-line-2">
              {plan.map((id) => {
                const zz = SURVEY_ZONES.find((x) => x.id === id)!;
                const s = getService(zz.serviceId);
                return (
                  <div
                    key={id}
                    className="flex justify-between gap-4 px-5 py-3"
                  >
                    <dt className="text-[13px] text-muted">
                      {zz.label}・{s?.label}
                    </dt>
                    <dd className="tnum text-[13px] font-medium text-ink">
                      {fmtYen(s?.price ?? 0)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}
        </Card>
      </section>

      {/* Sticky nav */}
      <div className="pb-safe fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:bottom-0">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3 lg:px-10">
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-muted">
              {plan.length}件のプラン
            </div>
            <div className="tnum text-[17px] font-semibold text-ink">
              {fmtYen(total)}
              <span className="text-[12px] font-normal text-muted">〜</span>
            </div>
          </div>
          {zone > 0 && (
            <Button variant="secondary" onClick={() => setZone(zone - 1)}>
              戻る
            </Button>
          )}
          {!last ? (
            <Button size="lg" onClick={() => setZone(zone + 1)}>
              次へ
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={plan.length === 0}
              onClick={() => router.push("/caas")}
            >
              見積に進む
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
