"use client";

import { useState } from "react";

const videos = [
  {
    id: "01",
    file: "/videos/01_manin_densha.mp4",
    title: "満員電車",
    theme: "体臭 / ワキガ",
    monologue: "「...気づかれた。」「毎朝、これが怖い。」",
  },
  {
    id: "02",
    file: "/videos/02_kaigishitsu.mp4",
    title: "会議室",
    theme: "多汗症",
    monologue: "「右手を出すのが、怖い。」",
  },
  {
    id: "03",
    file: "/videos/03_shugo_shashin.mp4",
    title: "集合写真",
    theme: "肌 / 老け顔",
    monologue: "「俺だけ、老けてないか。」「タグ付け、外してほしい。」",
  },
  {
    id: "04",
    file: "/videos/04_biyoushitsu.mp4",
    title: "美容室の鏡",
    theme: "薄毛",
    monologue: "「気づいてるよ。」「でも聞けない。」",
  },
  {
    id: "05",
    file: "/videos/05_elevator.mp4",
    title: "エレベーター",
    theme: "口臭",
    monologue: "「あの反応、もしかして。」",
  },
];

export default function HomePage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="px-4 pt-8 pb-24">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-[var(--color-accent)] tracking-tight">
          His Recoveries
        </h1>
        <p className="mt-1 text-xs font-mono tracking-[0.2em] text-[var(--color-text-muted)]">
          ── 誰にも言えなかった、あの瞬間 ──
        </p>
      </header>

      <div className="space-y-4">
        {videos.map((v) => (
          <div key={v.id}>
            <button
              onClick={() =>
                setActiveVideo(activeVideo === v.id ? null : v.id)
              }
              className="w-full text-left"
            >
              <div className="dq-window p-4 hover:brightness-110 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-accent)] text-xs">
                    {activeVideo === v.id ? "▼" : "▶"}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-base font-bold">
                      vol.{v.id} 「{v.title}」
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {v.theme}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 italic">
                      {v.monologue}
                    </p>
                  </div>
                </div>
              </div>
            </button>

            {activeVideo === v.id && (
              <div className="mt-2 flex justify-center">
                <div className="w-[270px] h-[480px] bg-black rounded-xl overflow-hidden shadow-2xl">
                  <video
                    src={v.file}
                    autoPlay
                    playsInline
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 dq-window-gold p-5 rounded-2xl">
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          「あいつも、同じだったのか。」<br />
          そう思えたとき、恥は少しだけ軽くなる。<br /><br />
          His Recoveries は、<br />
          誰にも言えなかった悩みに、共感で寄り添うメディアです。
        </p>
      </div>
    </div>
  );
}
