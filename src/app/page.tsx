"use client";

import { useRef, useEffect, useState } from "react";

const videos = [
  {
    id: "01",
    file: "/videos/01_manin_densha.mp4",
    title: "満員電車",
    theme: "体臭 / ワキガ",
    monologue: "「...気づかれた。」\n「毎朝、これが怖い。」",
    stat: "93.1%の人が、臭い同僚に言えない。",
  },
  {
    id: "02",
    file: "/videos/02_kaigishitsu.mp4",
    title: "会議室",
    theme: "多汗症",
    monologue: "「右手を出すのが、怖い。」",
    stat: "多汗症の受診率、たった4.6%。",
  },
  {
    id: "03",
    file: "/videos/03_shugo_shashin.mp4",
    title: "集合写真",
    theme: "肌 / 老け顔",
    monologue: "「俺だけ、老けてないか。」\n「タグ付け、外してほしい。」",
    stat: "男性の日焼け止め使用率、18.74%。",
  },
  {
    id: "04",
    file: "/videos/04_biyoushitsu.mp4",
    title: "美容室の鏡",
    theme: "薄毛",
    monologue: "「気づいてるよ。」\n「でも聞けない。」",
    stat: "30代男性の42.3%がAGA。",
  },
  {
    id: "05",
    file: "/videos/05_elevator.mp4",
    title: "エレベーター",
    theme: "口臭",
    monologue: "「あの反応、もしかして。」",
    stat: "口臭に気づいても伝える人、3.9%。",
  },
];

function VideoCard({
  video,
  isVisible,
}: {
  video: (typeof videos)[number];
  isVisible: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isVisible]);

  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      <video
        ref={videoRef}
        src={video.file}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      <div className="absolute top-4 left-4 right-4">
        <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">
          His Recoveries
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
        <p className="text-[10px] font-mono tracking-wider text-[var(--color-accent)] mb-1">
          vol.{video.id} ── {video.theme}
        </p>
        <h2 className="text-xl font-black text-white mb-3">
          {video.title}
        </h2>
        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line mb-4">
          {video.monologue}
        </p>
        <p className="text-[11px] text-white/50 border-t border-white/10 pt-3">
          {video.stat}
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [visibleId, setVisibleId] = useState<string>("01");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-video-id");
            if (id) setVisibleId(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const cards = containerRef.current?.querySelectorAll("[data-video-id]");
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 py-3 text-center">
        <h1 className="text-base font-black text-[var(--color-accent)] tracking-tight">
          His Recoveries
        </h1>
        <p className="text-[10px] font-mono tracking-[0.15em] text-white/40">
          誰にも言えなかった、あの瞬間
        </p>
      </header>

      <div ref={containerRef} className="px-4 py-6 space-y-6">
        {videos.map((v) => (
          <div key={v.id} data-video-id={v.id}>
            <VideoCard video={v} isVisible={visibleId === v.id} />
          </div>
        ))}
      </div>

      <div className="px-4 pb-28 pt-2">
        <div className="border border-white/10 rounded-xl p-5 text-center">
          <p className="text-xs text-white/40 leading-relaxed">
            「あいつも、同じだったのか。」<br />
            そう思えたとき、恥は少しだけ軽くなる。
          </p>
        </div>
      </div>
    </div>
  );
}
