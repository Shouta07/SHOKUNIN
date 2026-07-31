"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SERVICES,
  CRAFTSMEN,
  DAYS,
  BANDS,
  AVAILABILITY,
  RATING_AXES,
  DAY_PRICING,
  fmtSlot,
  slotMultiplier,
  priceForSlot,
  saveProject,
  fmtYen,
  type Service,
  type Craftsman,
} from "@/lib/caas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Steps, Row, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Phase = "intro" | "service" | "slot" | "craftsman" | "confirm";
const FLOW: Phase[] = ["service", "slot", "craftsman", "confirm"];

export default function CaasBooking() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [service, setService] = useState<Service | null>(null);
  const [slotId, setSlotId] = useState("");
  const [craftsman, setCraftsman] = useState<Craftsman | null>(null);

  const step = FLOW.indexOf(phase) + 1;
  const total = service ? priceForSlot(service.price, slotId) : 0;
  const mult = slotId ? slotMultiplier(slotId) : 1;

  const confirm = () => {
    if (!service || !slotId || !craftsman) return;
    saveProject({
      id: crypto.randomUUID(),
      serviceId: service.id,
      craftsmanId: craftsman.id,
      slotId,
      stage: 0,
      createdAt: new Date().toISOString(),
    });
    router.push("/caas/project");
  };

  /* ══════════════ INTRO — the 3-second test ══════════════ */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-5 lg:px-10">
        {/* Hero: what it is · who it's for · one action */}
        <section className="pt-14 pb-16 lg:pt-24 lg:pb-20">
          <Eyebrow>防犯カメラ・電気設備の工事</Eyebrow>
          <h1 className="mt-5 text-[34px] font-semibold leading-[1.2] text-ink lg:text-[46px]">
            見積から施工完了まで、
            <br />
            電話ゼロで。
          </h1>
          <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.8] text-muted lg:text-base">
            店舗・拠点をもつ事業者のための工事プラットフォーム。担当職人を選び、施工の様子を画面で確認できます。
          </p>

          {/* Single primary CTA */}
          <div className="mt-9">
            <Button size="lg" onClick={() => setPhase("service")}>
              見積を出す
            </Button>
            <p className="mt-3 text-[13px] text-muted">
              所要30秒・登録不要・費用は事前に確定
            </p>
          </div>

          {/* Trust, not decoration */}
          <dl className="mt-12 flex gap-8 border-t border-line pt-6">
            {[
              ["12,800", "施工実績"],
              ["98%", "満足度"],
              ["1年", "工事保証"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="tnum text-lg font-semibold text-ink">{v}</dt>
                <dd className="mt-0.5 text-[12px] text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Secondary entries — below the fold, visually quiet */}
        <section className="border-t border-line py-10">
          <Eyebrow>そのほかの機能</Eyebrow>
          <div className="mt-4">
            {[
              ["/caas/ar", "AR設置プラン", "画面上に機器を置いて配置を検討"],
              ["/caas/survey", "リモート現地調査", "オンラインで施設を映しながら相談"],
              ["/caas/industries", "業界別の導入例", "同業種の構成と導入効果"],
              ["/caas/sites", "多拠点の一括管理", "まとめて日程調整・CSV書き出し"],
            ].map(([href, title, desc]) => (
              <Link key={href} href={href} className="block">
                <Row>
                  <span className="flex-1">
                    <span className="block text-[15px] font-medium text-ink">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {desc}
                    </span>
                  </span>
                  <span aria-hidden className="text-subtle">
                    →
                  </span>
                </Row>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ══════════════ BOOKING FLOW ══════════════ */
  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 lg:px-10">
      {/* Flow header: progress + escape hatch */}
      <div className="sticky top-[57px] z-30 -mx-5 bg-canvas/90 px-5 pt-4 pb-3 backdrop-blur-md lg:top-0 lg:-mx-10 lg:px-10 lg:pt-8">
        <Steps total={FLOW.length} current={step} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] text-muted">
            ステップ {step} / {FLOW.length}
          </span>
          <button
            onClick={() =>
              setPhase(step === 1 ? "intro" : FLOW[step - 2])
            }
            className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            戻る
          </button>
        </div>
      </div>

      {/* ── 1. Service — price disclosed upfront ── */}
      {phase === "service" && (
        <section className="animate-rise pt-8">
          <h2 className="text-2xl font-semibold text-ink">
            どんな工事ですか
          </h2>
          <p className="mt-2 text-sm text-muted">
            表示価格は標準工事の目安です。追加費用は施工前に必ず確認します。
          </p>
          <div className="mt-7 border-t border-line">
            {SERVICES.map((s) => (
              <Row
                key={s.id}
                onClick={() => {
                  setService(s);
                  setPhase("slot");
                }}
              >
                <span className="flex-1">
                  <span className="block text-[15px] font-medium text-ink">
                    {s.label}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted">
                    {s.duration}・{s.desc}
                  </span>
                </span>
                <span className="tnum shrink-0 text-[15px] font-semibold text-ink">
                  {fmtYen(s.price)}
                  <span className="text-[12px] font-normal text-muted">〜</span>
                </span>
              </Row>
            ))}
          </div>
        </section>
      )}

      {/* ── 2. Slot — availability + dynamic pricing ── */}
      {phase === "slot" && service && (
        <section className="animate-rise pt-8">
          <h2 className="text-2xl font-semibold text-ink">日時を選ぶ</h2>
          <p className="mt-2 text-sm text-muted">
            職人の空き枠です。近日は特急料金、先の日程は割安になります。
          </p>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[360px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-14" />
                  {DAYS.map((d) => {
                    const p = DAY_PRICING[d.id];
                    return (
                      <th key={d.id} className="pb-1 text-center font-normal">
                        <div className="text-[13px] font-medium text-ink">
                          {d.label}
                        </div>
                        <div className="text-[11px] text-subtle">{d.dow}</div>
                        {p && (
                          <div
                            className={cn(
                              "mt-0.5 text-[10px] font-medium",
                              p.mult > 1
                                ? "text-warning"
                                : p.mult < 1
                                  ? "text-positive"
                                  : "text-subtle",
                            )}
                          >
                            {p.mult > 1
                              ? `+${Math.round((p.mult - 1) * 100)}%`
                              : p.mult < 1
                                ? `−${Math.round((1 - p.mult) * 100)}%`
                                : "標準"}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {BANDS.map((b) => (
                  <tr key={b.id}>
                    <th className="pr-2 text-left align-middle">
                      <div className="text-[13px] font-medium text-ink">
                        {b.label}
                      </div>
                    </th>
                    {DAYS.map((d) => {
                      const n = AVAILABILITY[d.id][b.id];
                      const id = `${d.id}|${b.id}`;
                      const sel = slotId === id;
                      const full = n === 0;
                      return (
                        <td key={id}>
                          <button
                            onClick={() => !full && setSlotId(id)}
                            disabled={full}
                            aria-pressed={sel}
                            aria-label={`${d.label} ${b.label} ${full ? "満枠" : "空きあり"}`}
                            className={cn(
                              "aspect-square w-full rounded-[var(--radius-control)] border text-[15px] font-medium transition-colors",
                              full
                                ? "cursor-not-allowed border-line-2 bg-line-2 text-subtle"
                                : sel
                                  ? "border-ink bg-ink text-white"
                                  : "border-line bg-surface text-ink hover:border-subtle",
                            )}
                          >
                            {full ? "×" : n === 1 ? "△" : "○"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[12px] text-muted">
            ○ 空きあり　△ 残りわずか　× 満枠
          </p>
        </section>
      )}

      {/* ── 3. Craftsman ── */}
      {phase === "craftsman" && (
        <section className="animate-rise pt-8">
          <h2 className="text-2xl font-semibold text-ink">担当を選ぶ</h2>
          <p className="mt-2 text-sm text-muted">
            評価は施工後のお客様アンケートに基づきます。
          </p>
          <div className="mt-7 space-y-3">
            {CRAFTSMEN.map((c) => {
              const sel = craftsman?.id === c.id;
              return (
                <Card
                  key={c.id}
                  interactive
                  selected={sel}
                  role="radio"
                  aria-checked={sel}
                  tabIndex={0}
                  onClick={() => setCraftsman(c)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setCraftsman(c)
                  }
                  className="p-5"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-[15px] font-semibold text-white">
                      {c.initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold text-ink">
                          {c.name}
                        </span>
                        <Badge>{c.level}</Badge>
                      </div>
                      <div className="mt-0.5 text-[13px] text-muted">
                        <span className="tnum font-medium text-ink">
                          ★ {c.rating}
                        </span>
                        <span className="tnum"> ・{c.reviews}件・{c.area}</span>
                      </div>
                    </div>
                    {sel && (
                      <span aria-hidden className="text-ink">
                        ✓
                      </span>
                    )}
                  </div>

                  <dl className="mt-4 grid grid-cols-4 border-t border-line-2 pt-3.5">
                    {RATING_AXES.map((ax) => (
                      <div key={ax.key} className="text-center">
                        <dt className="tnum text-sm font-semibold text-ink">
                          {c.axes[ax.key].toFixed(1)}
                        </dt>
                        <dd className="mt-0.5 text-[11px] text-muted">
                          {ax.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    {c.hospitalityQuote}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 4. Confirm ── */}
      {phase === "confirm" && service && craftsman && (
        <section className="animate-rise pt-8">
          <h2 className="text-2xl font-semibold text-ink">内容の確認</h2>
          <Card className="mt-7 divide-y divide-line-2">
            {[
              ["工事", service.label],
              ["日時", fmtSlot(slotId)],
              ["担当", `${craftsman.name}（★${craftsman.rating}）`],
              ["所要時間", service.duration],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between gap-6 px-5 py-3.5">
                <dt className="shrink-0 text-[13px] text-muted">{l}</dt>
                <dd className="text-right text-[14px] font-medium text-ink">
                  {v}
                </dd>
              </div>
            ))}

            <div className="space-y-2 px-5 py-4">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">標準工事費</span>
                <span className="tnum text-ink">{fmtYen(service.price)}</span>
              </div>
              {mult !== 1 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted">
                    {mult > 1 ? "特急料金" : "早期割引"}
                  </span>
                  <span
                    className={cn(
                      "tnum",
                      mult > 1 ? "text-warning" : "text-positive",
                    )}
                  >
                    {mult > 1 ? "+" : "−"}
                    {Math.abs(Math.round((mult - 1) * 100))}%
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="text-[13px] font-medium text-ink">合計</span>
                <span className="tnum text-2xl font-semibold text-ink">
                  {fmtYen(total)}
                  <span className="text-[13px] font-normal text-muted">〜</span>
                </span>
              </div>
            </div>
          </Card>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            現地状況により追加工事が必要な場合は、着工前に必ずご確認します。同意なく費用が増えることはありません。
          </p>
        </section>
      )}

      {/* ── Sticky action bar: one CTA, always reachable ── */}
      <div className="pb-safe fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:bottom-0">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-3 lg:px-10">
          {service && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] text-muted">
                {service.label}
                {slotId && ` · ${fmtSlot(slotId)}`}
              </div>
              <div className="tnum text-[17px] font-semibold text-ink">
                {fmtYen(total || service.price)}
                <span className="text-[12px] font-normal text-muted">〜</span>
              </div>
            </div>
          )}
          {phase === "slot" && (
            <Button
              size="lg"
              disabled={!slotId}
              onClick={() => setPhase("craftsman")}
            >
              担当を選ぶ
            </Button>
          )}
          {phase === "craftsman" && (
            <Button
              size="lg"
              disabled={!craftsman}
              onClick={() => setPhase("confirm")}
            >
              確認へ
            </Button>
          )}
          {phase === "confirm" && (
            <Button size="lg" onClick={confirm}>
              予約を確定する
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
