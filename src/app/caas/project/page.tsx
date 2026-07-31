"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  STAGES,
  LIVE_TIMELINE,
  RATING_AXES,
  CROSS_SELL,
  AI_DOC_SECTIONS,
  getProject,
  saveProject,
  clearProject,
  getService,
  getCraftsman,
  fmtSlot,
  fmtYen,
  type Project,
} from "@/lib/caas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Meter, LiveDot, Badge, Row } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <Eyebrow>{title}</Eyebrow>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function CaasProject() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [livePct, setLivePct] = useState(0);
  const [recording, setRecording] = useState(true);

  useEffect(() => {
    setMounted(true);
    setProject(getProject());
  }, []);

  useEffect(() => {
    if (!project || STAGES[project.stage].id !== "live") return;
    setLivePct(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setLivePct(LIVE_TIMELINE[Math.min(step, LIVE_TIMELINE.length - 1)].pct);
      if (step >= LIVE_TIMELINE.length - 1) clearInterval(iv);
    }, 1500);
    return () => clearInterval(iv);
  }, [project?.stage]);

  if (!mounted) return <div className="min-h-dvh bg-canvas" />;

  /* Empty state — one clear action */
  if (!project) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <h1 className="text-xl font-semibold text-ink">
          進行中の工事はありません
        </h1>
        <p className="mt-2 text-sm text-muted">
          依頼するとここに進捗が表示されます。
        </p>
        <Button size="lg" className="mt-7" onClick={() => router.push("/caas")}>
          工事を依頼する
        </Button>
      </div>
    );
  }

  const service = getService(project.serviceId)!;
  const craftsman = getCraftsman(project.craftsmanId)!;
  const stage = STAGES[project.stage];
  const shown = LIVE_TIMELINE.filter((t) => t.pct <= (livePct || 5));

  const advance = () => {
    if (project.stage >= STAGES.length - 1) return;
    const p = { ...project, stage: project.stage + 1 };
    saveProject(p);
    setProject(p);
  };

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16 lg:px-10">
      {/* ── Header ── */}
      <header className="pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{service.label}</h1>
            <p className="mt-1.5 text-sm text-muted">
              {fmtSlot(project.slotId)}・{fmtYen(service.price)}〜
            </p>
          </div>
          <span className="tnum shrink-0 pt-1 text-[12px] text-subtle">
            #{project.id.slice(0, 6).toUpperCase()}
          </span>
        </div>

        {/* Stage tracker */}
        <ol className="mt-7 flex">
          {STAGES.map((s, i) => {
            const done = i < project.stage;
            const cur = i === project.stage;
            return (
              <li key={s.id} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  <span
                    className={cn(
                      "h-px flex-1",
                      i === 0 ? "bg-transparent" : done || cur ? "bg-ink" : "bg-line",
                    )}
                  />
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-semibold",
                      done
                        ? "border-ink bg-ink text-white"
                        : cur
                          ? "border-ink bg-surface text-ink"
                          : "border-line bg-surface text-subtle",
                    )}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "h-px flex-1",
                      i === STAGES.length - 1
                        ? "bg-transparent"
                        : done
                          ? "bg-ink"
                          : "bg-line",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[11px]",
                    cur ? "font-semibold text-ink" : "text-subtle",
                  )}
                >
                  {s.short}
                </span>
              </li>
            );
          })}
        </ol>
      </header>

      {/* ── Site & contact ── */}
      {project.contact && (
        <Card className="mt-8 p-5">
          <Eyebrow>施工先</Eyebrow>
          <p className="mt-2.5 text-sm leading-relaxed text-ink">
            〒{project.contact.postal}
            <br />
            {project.contact.address}
            {project.contact.building && ` ${project.contact.building}`}
          </p>
          <dl className="mt-4 space-y-2 border-t border-line-2 pt-3.5">
            <div className="flex justify-between gap-4">
              <dt className="text-[13px] text-muted">ご担当</dt>
              <dd className="text-[13px] font-medium text-ink">
                {project.contact.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[13px] text-muted">連絡先</dt>
              <dd className="tnum text-[13px] font-medium text-ink">
                <a href={`tel:${project.contact.phone}`} className="text-brand">
                  {project.contact.phone}
                </a>
              </dd>
            </div>
            {project.contact.parking && (
              <div className="flex justify-between gap-4">
                <dt className="text-[13px] text-muted">駐車</dt>
                <dd className="text-[13px] font-medium text-ink">
                  {project.contact.parking}
                </dd>
              </div>
            )}
          </dl>
          {project.contact.note && (
            <p className="mt-4 border-l border-line pl-3.5 text-[13px] leading-relaxed text-muted">
              {project.contact.note}
            </p>
          )}
        </Card>
      )}

      {/* ── Assigned craftsman ── */}
      <Card className="mt-3 flex items-center gap-3.5 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">
          {craftsman.initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">
            {craftsman.name}
          </div>
          <div className="tnum mt-0.5 text-[13px] text-muted">
            ★ {craftsman.rating}・{craftsman.area}
          </div>
        </div>
        <Button variant="secondary" size="sm">
          メッセージ
        </Button>
      </Card>

      {/* ── Recording consent (pre / live) ── */}
      {(stage.id === "pre" || stage.id === "live") && (
        <Card className="mt-3 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {recording && <LiveDot />}
                <span className="text-sm font-semibold text-ink">
                  現場レコーディング
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                お客様の許可のもと映像と音声を記録し、完成図書を自動作成します。
              </p>
            </div>
            <button
              role="switch"
              aria-checked={recording}
              aria-label="現場レコーディング"
              onClick={() => setRecording(!recording)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                recording ? "bg-ink" : "bg-line",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-[left] shadow-[var(--shadow-e1)]",
                  recording ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </div>
          {recording && (
            <dl className="mt-4 grid grid-cols-3 border-t border-line-2 pt-3.5 text-center">
              {[
                ["職人", "書類作成が不要に"],
                ["お客様", "証跡と説明が残る"],
                ["会社", "ナレッジが蓄積"],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="text-[12px] font-semibold text-ink">{t}</dt>
                  <dd className="mt-1 text-[11px] leading-snug text-muted">
                    {d}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Card>
      )}

      {/* ── Stage: booked ── */}
      {stage.id === "booked" && (
        <Section title="当日の流れ">
          <Card className="divide-y divide-line-2">
            {[
              "到着・ご挨拶",
              "設置場所の最終確認",
              "施工（映像を配信）",
              "動作確認・使い方の説明",
              "完了報告・お引渡し",
            ].map((t, i) => (
              <div key={t} className="flex items-center gap-3 px-5 py-3">
                <span className="tnum grid size-5 shrink-0 place-items-center rounded-full bg-line-2 text-[11px] font-semibold text-muted">
                  {i + 1}
                </span>
                <span className="text-sm text-ink">{t}</span>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {/* ── Stage: pre ── */}
      {stage.id === "pre" && (
        <Section title="事前のご準備">
          <Card className="divide-y divide-line-2">
            {[
              "設置場所の周辺を空ける",
              "Wi-Fiのパスワードを準備",
              "駐車スペースの有無を共有",
            ].map((t) => (
              <label
                key={t}
                className="tap flex cursor-pointer items-center gap-3 px-5"
              >
                <input
                  type="checkbox"
                  className="size-4 shrink-0 rounded border-line accent-[var(--color-ink)]"
                />
                <span className="text-sm text-ink">{t}</span>
              </label>
            ))}
          </Card>
        </Section>
      )}

      {/* ── Stage: live ── */}
      {stage.id === "live" && (
        <>
          <Section title="現場の映像">
            <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink">
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1">
                <LiveDot />
                <span className="text-[11px] font-semibold tracking-wide text-white">
                  LIVE
                </span>
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-[13px] text-white/50">配信中</span>
              </div>
              <p className="absolute inset-x-3 bottom-3 text-[13px] font-medium text-white">
                {shown.at(-1)?.label ?? "まもなく開始します"}
              </p>
            </div>
          </Section>

          <Card className="mt-3 p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-ink">進捗</span>
              <span className="tnum text-lg font-semibold text-ink">
                {livePct}%
              </span>
            </div>
            <Meter value={livePct} className="mt-3" />
          </Card>

          <Section title="作業記録">
            <div className="space-y-2">
              {[...shown].reverse().map((t) => (
                <Card key={t.time} className="flex items-center gap-3 p-3">
                  <div className="size-12 shrink-0 rounded-md bg-line-2" />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-ink">
                      {t.label}
                    </div>
                    <div className="tnum mt-0.5 text-[12px] text-muted">
                      {t.time}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ── Stage: done ── */}
      {stage.id === "done" && (
        <>
          <Card className="mt-8 p-5">
            <h2 className="text-lg font-semibold text-ink">工事が完了しました</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              完了報告書と保証書をお届けします。
            </p>
          </Card>

          <Section title="Before / After">
            <div className="grid grid-cols-2 gap-3">
              {["Before", "After"].map((l) => (
                <div
                  key={l}
                  className="grid aspect-[4/3] place-items-center rounded-[var(--radius-card)] border border-line bg-line-2 text-[11px] font-medium uppercase tracking-wider text-subtle"
                >
                  {l}
                </div>
              ))}
            </div>
          </Section>

          <Section title="完成図書（自動作成）">
            <Card className="p-5">
              <p className="text-[13px] leading-relaxed text-muted">
                現場の映像・音声から自動生成しました。職人の手入力はありません。
              </p>
              <dl className="mt-4 space-y-4">
                {AI_DOC_SECTIONS.map((sec) => (
                  <div key={sec.title} className="border-t border-line-2 pt-3.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                      {sec.title}
                    </dt>
                    <dd className="mt-2 space-y-1.5">
                      {sec.items.map((it) => (
                        <p
                          key={it}
                          className="text-[13px] leading-relaxed text-ink"
                        >
                          {it}
                        </p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex gap-2">
                <Button full>PDFで受け取る</Button>
                <Button variant="secondary" full>
                  内容を修正
                </Button>
              </div>
            </Card>
          </Section>

          <Section title="保証">
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">保証書</span>
                <Badge tone="positive">1年間</Badge>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                施工箇所の不具合は1年間無償で対応します。
              </p>
            </Card>
          </Section>

          <Section title="担当者の評価">
            <Card className="p-5">
              <p className="text-sm font-medium text-ink">
                {craftsman.name} はいかがでしたか
              </p>
              <p className="mt-1 text-[12px] text-muted">
                評価は担当者のランクに反映されます。
              </p>
              <div className="mt-4 space-y-1">
                {RATING_AXES.map((ax) => (
                  <div
                    key={ax.key}
                    className="flex items-center justify-between border-b border-line-2 py-2.5 last:border-0"
                  >
                    <span className="text-[13px] text-ink">{ax.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          aria-label={`${ax.label} ${n}点`}
                          className="text-lg leading-none text-subtle transition-colors hover:text-ink"
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Section>
        </>
      )}

      {/* ── Stage: maintenance ── */}
      {stage.id === "maintenance" && (
        <>
          <Section title="次回の点検">
            <Card className="flex items-center justify-between p-5">
              <div>
                <div className="text-[13px] text-muted">推奨時期</div>
                <div className="mt-0.5 text-lg font-semibold text-ink">
                  6ヶ月後
                </div>
              </div>
              <Button variant="secondary" size="sm">
                リマインド
              </Button>
            </Card>
          </Section>

          <Section title="もう一度依頼する">
            <Card className="p-5">
              <p className="text-[13px] leading-relaxed text-muted">
                前回と同じ {craftsman.name} に依頼できます。設定と履歴は引き継がれます。
              </p>
              <Button
                full
                className="mt-4"
                onClick={() => {
                  clearProject();
                  router.push("/caas");
                }}
              >
                同じ担当者に依頼する
              </Button>
            </Card>
          </Section>
        </>
      )}

      {/* ── Cross-sell ── */}
      {(stage.id === "done" || stage.id === "maintenance") && (
        <Section title="あわせて検討されています">
          <div className="border-t border-line">
            {CROSS_SELL.filter((x) => x.serviceId !== project.serviceId)
              .slice(0, 3)
              .map((x) => {
                const svc = getService(x.serviceId)!;
                return (
                  <Row
                    key={x.serviceId}
                    onClick={() => {
                      clearProject();
                      router.push("/caas");
                    }}
                  >
                    <span className="flex-1">
                      <span className="block text-[15px] font-medium text-ink">
                        {svc.label}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted">
                        {x.hook}
                      </span>
                    </span>
                    <span className="tnum shrink-0 text-[15px] font-semibold text-ink">
                      {fmtYen(svc.price)}
                      <span className="text-[12px] font-normal text-muted">
                        〜
                      </span>
                    </span>
                  </Row>
                );
              })}
          </div>
        </Section>
      )}

      {/* ── Demo control ── */}
      <div className="mt-10 border-t border-dashed border-line pt-5">
        {project.stage < STAGES.length - 1 ? (
          <Button variant="ghost" size="sm" full onClick={advance}>
            デモ：次の段階へ（{STAGES[project.stage + 1].label}）
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            full
            onClick={() => {
              clearProject();
              router.push("/caas");
            }}
          >
            デモをリセット
          </Button>
        )}
      </div>
    </div>
  );
}
