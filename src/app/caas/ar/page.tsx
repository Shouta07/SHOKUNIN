"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { getPoints, addPoints, levelOf } from "@/lib/caas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Meter, Badge, LiveDot } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

interface Cam {
  id: string;
  x: number;
  y: number;
}

const coverageOf = (n: number) =>
  n === 0 ? 0 : Math.round(100 * (1 - Math.pow(0.5, n)));

export default function ArSim() {
  const router = useRouter();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [cams, setCams] = useState<Cam[]>([]);
  const [live, setLive] = useState(false);
  const [points, setPoints] = useState(0);
  const [awarded, setAwarded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPoints(getPoints());
  }, []);

  const cov = coverageOf(cams.length);
  const goals = [
    { label: "カメラを2台以上置く", done: cams.length >= 2 },
    { label: "カバー率80%以上にする", done: cov >= 80 },
  ];
  const allDone = goals.every((g) => g.done);

  useEffect(() => {
    if (allDone && !awarded && mounted) {
      setAwarded(true);
      setPoints(addPoints(50));
    }
  }, [allDone, awarded, mounted]);

  const place = (e: React.MouseEvent) => {
    const el = sceneRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCams((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      },
    ]);
  };

  if (!mounted) return <div className="min-h-dvh bg-canvas" />;
  const lv = levelOf(points);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 lg:px-10">
      <header className="flex items-start justify-between gap-4 pt-8">
        <div>
          <Eyebrow>AR設置プラン</Eyebrow>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            配置を試す
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            画面をタップしてカメラを置くと、監視範囲が表示されます。
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="tnum text-lg font-semibold text-ink">
            {points}
            <span className="text-[11px] font-normal text-muted">pt</span>
          </div>
          <div className="mt-0.5 text-[11px] text-muted">{lv.name}</div>
        </div>
      </header>

      {/* Goals */}
      <Card className="mt-6 p-5">
        <Eyebrow>目標</Eyebrow>
        <ul className="mt-3 space-y-2">
          {goals.map((g) => (
            <li key={g.label} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold",
                  g.done
                    ? "border-positive bg-positive text-white"
                    : "border-line text-transparent",
                )}
              >
                ✓
              </span>
              <span
                className={cn(
                  "text-[13px]",
                  g.done ? "text-muted line-through" : "text-ink",
                )}
              >
                {g.label}
              </span>
            </li>
          ))}
        </ul>
        {allDone && (
          <p className="mt-3 border-t border-line-2 pt-3 text-[13px] font-medium text-positive">
            死角のない配置になりました（+50pt）
          </p>
        )}
      </Card>

      {/* Mode */}
      <div
        role="tablist"
        className="mt-3 inline-flex rounded-[var(--radius-control)] bg-line-2 p-0.5"
      >
        {(
          [
            [false, "写真で配置"],
            [true, "ライブAR"],
          ] as [boolean, string][]
        ).map(([v, l]) => (
          <button
            key={l}
            role="tab"
            aria-selected={live === v}
            onClick={() => setLive(v)}
            className={cn(
              "rounded-[6px] px-4 py-2 text-[13px] font-medium transition-colors",
              live === v
                ? "bg-surface text-ink shadow-[var(--shadow-e1)]"
                : "text-muted hover:text-ink",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Scene */}
      <div
        ref={sceneRef}
        onClick={place}
        className="relative mt-3 aspect-[4/3] cursor-crosshair overflow-hidden rounded-[var(--radius-card)] bg-ink"
      >
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1">
          {live && <LiveDot />}
          <span className="text-[10px] font-semibold tracking-wide text-white">
            {live ? "AR LIVE" : "PHOTO"}
          </span>
        </div>

        {/* Room hints */}
        <div className="absolute left-[12%] top-[16%] h-[22%] w-[26%] rounded border border-white/20">
          <span className="absolute left-1.5 top-1 text-[10px] text-white/40">
            窓
          </span>
        </div>
        <div className="absolute right-[14%] top-[14%] h-[40%] w-[14%] rounded border border-white/20">
          <span className="absolute left-1.5 top-1 text-[10px] text-white/40">
            入口
          </span>
        </div>

        {/* Cameras + coverage */}
        {cams.map((c) => (
          <div key={c.id}>
            <span
              className="pointer-events-none absolute size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCams((p) => p.filter((x) => x.id !== c.id));
              }}
              aria-label="カメラを取り消す"
              className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            />
          </div>
        ))}

        {cams.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <span className="text-[13px] text-white/70">
              タップしてカメラを設置
            </span>
            <span className="mt-1 text-[11px] text-white/40">
              円が監視範囲です
            </span>
          </div>
        )}
      </div>

      {/* Coverage */}
      <Card className="mt-3 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-medium text-ink">監視カバー率</span>
          <span className="tnum text-lg font-semibold text-ink">{cov}%</span>
        </div>
        <Meter value={cov} className="mt-3" />
        <div className="mt-3 flex items-center justify-between">
          <span className="tnum text-[13px] text-muted">
            設置 {cams.length}台
          </span>
          {cams.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setCams([])}>
              リセット
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-4 text-[12px] leading-relaxed text-muted">
        本番ではスマートフォンのカメラをかざし、実際の部屋に機器を重ねて配置できます。
      </p>

      {/* Sticky CTA */}
      <div className="pb-safe fixed inset-x-0 bottom-16 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:bottom-0">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-3 lg:px-10">
          <div className="flex-1">
            <div className="text-[12px] text-muted">配置したカメラ</div>
            <div className="tnum text-[17px] font-semibold text-ink">
              {cams.length}台
            </div>
          </div>
          <Button
            size="lg"
            disabled={cams.length === 0}
            onClick={() => router.push("/caas")}
          >
            この配置で見積もる
          </Button>
        </div>
      </div>
    </div>
  );
}
