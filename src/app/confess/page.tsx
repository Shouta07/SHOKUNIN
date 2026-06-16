"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const CATEGORIES = [
  { id: "smell", label: "体臭・ワキガ", sub: "近づくのが怖い" },
  { id: "sweat", label: "汗", sub: "手が、服が、止まらない" },
  { id: "skin", label: "肌・老け", sub: "鏡を見たくない" },
  { id: "hair", label: "薄毛", sub: "気づかれてる気がする" },
  { id: "breath", label: "口臭", sub: "距離を取ってしまう" },
] as const;
type CategoryId = (typeof CATEGORIES)[number]["id"];

const SEED_VOICES: Record<CategoryId, string[]> = {
  smell: [
    "電車で隣の人が離れた瞬間、全部わかった。",
    "彼女に「なんか匂う」って言われて、3日眠れなかった。",
    "制汗剤を3本持ち歩いてる。それでも不安。",
    "夏が来るのが怖い。毎年。",
    "誰にも聞けないから、ずっと一人で調べてた。",
    "職場でデスクの配置が変わった日、俺のせいだと思った。",
  ],
  sweat: [
    "握手を求められた瞬間、頭が真っ白になった。",
    "書類を渡す時、紙が湿るのが恥ずかしい。",
    "スーツの脇が変色してるのを、後輩に見られた。",
    "好きな人の手を握れない。それだけのことができない。",
    "面接で手汗がひどくて、何も集中できなかった。",
    "「暑くないのに何で汗かいてるの？」が一番辛い。",
    "エアコン効いてる部屋でも、一人だけ汗が止まらない。",
  ],
  skin: [
    "同期の集合写真、俺だけ明らかに老けてた。",
    "久しぶりに会った友人に「疲れてる？」って言われた。それだけ。",
    "鏡を見るたびに、父親に似てきてる気がして怖い。",
    "日焼け止めなんて塗ったことなかった。今さら後悔してる。",
    "マッチングアプリの写真と実物が違いすぎて、会うのが怖い。",
    "「肌きれいだね」って言われる同僚が羨ましい。男なのに。",
  ],
  hair: [
    "美容師に「頭頂部、ちょっと薄くなってきてますね」って言われた日のこと、今でも覚えてる。",
    "風が吹くたびに、手で押さえてしまう自分がいる。",
    "父親がハゲてるから、いつか来るって分かってた。でも28は早すぎる。",
    "帽子を脱げない。どこでも。",
    "後ろから撮られた写真を見て、初めて現実を知った。",
    "AGAクリニックのサイトを何回開いたか分からない。でも予約できない。",
    "「短めで」しか言えない。本当は相談したい。",
  ],
  breath: [
    "話しかけた時、相手が少し引いた。あの0.5秒が忘れられない。",
    "エレベーターで2人きりになると、口を閉じたまま黙ってしまう。",
    "歯磨きは1日3回してる。それでも不安が消えない。",
    "打ち合わせ中、手で口を覆ってしまう癖がついた。",
    "飲み会で近くで話すのが怖くて、端の席を選ぶようになった。",
    "マスク生活が終わって、一番困ったのは俺だった。",
  ],
};

const SEED_COUNTS: Record<CategoryId, number> = {
  smell: 47,
  sweat: 38,
  skin: 52,
  hair: 63,
  breath: 41,
};

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function useTypewriter(text: string, speed = 80, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function Cursor() {
  return (
    <span className="animate-pulse ml-0.5 inline-block w-[2px] h-[1.1em] bg-white/60 align-middle" />
  );
}

function getVisitorCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("confess_visitor_count");
  return stored ? parseInt(stored, 10) : 0;
}

function incrementVisitorCount(): number {
  const current = getVisitorCount();
  const next = current + 1;
  localStorage.setItem("confess_visitor_count", String(next));
  return next;
}

export default function ConfessPage() {
  const [step, setStep] = useState<Step>(0);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [contactDiscord, setContactDiscord] = useState("");
  const [contactX, setContactX] = useState("");
  const [contactOther, setContactOther] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showEntryButton, setShowEntryButton] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [voicesRevealed, setVoicesRevealed] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const line1 = useTypewriter("誰にも言えないこと、", 100, 800);
  const line2 = useTypewriter("ありますか？", 120, 2600);

  useEffect(() => {
    setMounted(true);
    setVisitorCount(getVisitorCount());
  }, []);

  useEffect(() => {
    if (line2.done) {
      const t = setTimeout(() => setShowEntryButton(true), 600);
      return () => clearTimeout(t);
    }
  }, [line2.done]);

  useEffect(() => {
    if (step === 3 && textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 800);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Step 6: reveal voices one by one
  useEffect(() => {
    if (step !== 6 || !category) return;
    const voices = SEED_VOICES[category];
    if (voicesRevealed >= voices.length) return;

    const t = setTimeout(() => {
      setVoicesRevealed((v) => v + 1);
    }, voicesRevealed === 0 ? 1200 : 800);
    return () => clearTimeout(t);
  }, [step, category, voicesRevealed]);

  const goToStep = useCallback((next: Step) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTimeout(() => setTransitioning(false), 50);
    }, 500);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      category,
      painLevel,
      message,
      contact: {
        discord: contactDiscord || undefined,
        x: contactX || undefined,
        other: contactOther || undefined,
      },
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("confess_submissions") || "[]"
      ) as unknown[];
      existing.push({ ...payload, timestamp: new Date().toISOString() });
      localStorage.setItem("confess_submissions", JSON.stringify(existing));
    } catch {}

    try {
      await fetch("/confess/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}

    const count = incrementVisitorCount();
    setVisitorCount(count);
    setSubmitting(false);
    goToStep(5);
  }, [submitting, category, painLevel, message, contactDiscord, contactX, contactOther, goToStep]);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setShowEntryButton(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowEntryButton(false);
  }, [step]);

  // Step 5 → Step 6 auto-advance
  useEffect(() => {
    if (step !== 5) return;
    const t = setTimeout(() => {
      setVoicesRevealed(0);
      goToStep(6);
    }, 3500);
    return () => clearTimeout(t);
  }, [step, goToStep]);

  const categoryLabel = category
    ? CATEGORIES.find((c) => c.id === category)?.label ?? ""
    : "";

  if (!mounted) {
    return <div className="min-h-[100dvh] bg-black" />;
  }

  return (
    <div className="relative min-h-[100dvh] bg-black overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes voiceIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-up { animation: slideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in { animation: fadeIn 800ms ease forwards; }
        .scale-in { animation: scaleIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .voice-in { animation: voiceIn 500ms ease forwards; }
        .stagger-1 { animation-delay: 100ms; opacity: 0; }
        .stagger-2 { animation-delay: 200ms; opacity: 0; }
        .stagger-3 { animation-delay: 300ms; opacity: 0; }
        .stagger-4 { animation-delay: 400ms; opacity: 0; }
        .stagger-5 { animation-delay: 500ms; opacity: 0; }
      `}</style>

      <div
        className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6 py-12"
        style={{
          fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(-10px)" : "translateY(0)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
        <div className="w-full max-w-sm text-center">

          {/* Step 0: Typewriter Entry */}
          {step === 0 && (
            <div>
              <h1
                className="text-white mb-16"
                style={{ fontSize: "26px", fontWeight: 200, lineHeight: 2, letterSpacing: "0.08em" }}
              >
                {line1.displayed}
                {!line1.done && <Cursor />}
                {line1.done && <br />}
                {line1.done && line2.displayed}
                {line1.done && !line2.done && <Cursor />}
              </h1>
              <div
                style={{
                  opacity: showEntryButton ? 1 : 0,
                  transform: showEntryButton ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 800ms ease, transform 800ms ease",
                }}
              >
                <button
                  onClick={() => goToStep(1)}
                  className="group relative text-white/80 hover:text-white"
                  style={{
                    fontSize: "15px", fontWeight: 300, background: "none",
                    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "40px",
                    padding: "14px 56px", cursor: "pointer", transition: "all 400ms ease",
                  }}
                >
                  はい
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Categories */}
          {step === 1 && (
            <div>
              <h2
                className="text-white mb-10 slide-up"
                style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.06em", lineHeight: 1.8 }}
              >
                何に、一番苦しんでいる？
              </h2>
              <div className="space-y-3">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategory(cat.id); goToStep(2); }}
                    className={`slide-up stagger-${i + 1} w-full text-left`}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", padding: "16px 20px",
                      cursor: "pointer", transition: "all 300ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    <span className="text-white/90 block" style={{ fontSize: "16px", fontWeight: 400 }}>
                      {cat.label}
                    </span>
                    <span className="text-white/30 block mt-1" style={{ fontSize: "12px", fontWeight: 300 }}>
                      {cat.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pain scale */}
          {step === 2 && (
            <div>
              <h2 className="text-white mb-4 slide-up"
                style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.06em" }}>
                今、どれくらい辛い？
              </h2>
              <p className="text-white/25 mb-10 slide-up stagger-1" style={{ fontSize: "12px" }}>
                直感で選んでください
              </p>
              <div className="flex justify-center gap-[6px] slide-up stagger-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const isSelected = painLevel === n;
                  const intensity = n / 10;
                  return (
                    <button
                      key={n}
                      onClick={() => { setPainLevel(n); setTimeout(() => goToStep(3), 600); }}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        border: isSelected ? "1.5px solid rgba(255,255,255,0.8)" : "1px solid rgba(255,255,255,0.12)",
                        background: isSelected ? `rgba(255,${Math.round(100 - intensity * 80)},${Math.round(80 - intensity * 80)},0.3)` : "none",
                        color: isSelected ? "white" : `rgba(255,255,255,${0.3 + intensity * 0.3})`,
                        fontSize: "13px", fontWeight: isSelected ? 500 : 300,
                        cursor: "pointer", transition: "all 300ms ease",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: isSelected ? "0 0 16px rgba(255,100,80,0.3)" : "none",
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Free text */}
          {step === 3 && (
            <div>
              <h2 className="text-white mb-8 slide-up"
                style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.06em", lineHeight: 1.8 }}>
                ここに、<br />置いていってください。
              </h2>
              <div className="slide-up stagger-2">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="誰にも見せません。ただ、書くだけでいい。"
                  rows={5}
                  className="w-full text-white placeholder-white/20 focus:outline-none"
                  style={{
                    fontSize: "15px", fontWeight: 300, lineHeight: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px", padding: "20px", resize: "none",
                    transition: "border-color 400ms ease",
                    caretColor: "rgba(255,255,255,0.6)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                />
                <div className="mt-8"
                  style={{
                    opacity: message.length > 0 ? 1 : 0,
                    transform: message.length > 0 ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 500ms ease, transform 500ms ease",
                  }}>
                  <button
                    onClick={() => goToStep(4)}
                    disabled={message.length === 0}
                    className="text-white/70 hover:text-white"
                    style={{
                      fontSize: "15px", fontWeight: 300, background: "none",
                      border: "1px solid rgba(255,255,255,0.2)", borderRadius: "40px",
                      padding: "12px 44px", cursor: "pointer", transition: "all 400ms ease",
                    }}
                  >
                    置いていく
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Optional contact */}
          {step === 4 && (
            <div>
              <h2 className="text-white mb-3 slide-up"
                style={{ fontSize: "18px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.8 }}>
                同じ悩みを持つ人と、<br />つながれる場所があります。
              </h2>
              <p className="text-white/20 mb-8 slide-up stagger-1" style={{ fontSize: "12px" }}>
                任意です。スキップできます。
              </p>
              <div className="space-y-4 text-left slide-up stagger-2">
                {[
                  { label: "Discord", value: contactDiscord, set: setContactDiscord, ph: "username" },
                  { label: "X (Twitter)", value: contactX, set: setContactX, ph: "@username" },
                  { label: "その他", value: contactOther, set: setContactOther, ph: "LINE, Instagramなど" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1.5 block text-white/25" style={{ fontSize: "12px", fontWeight: 300 }}>
                      {field.label}
                    </label>
                    <input
                      type="text" value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.ph}
                      className="w-full text-white placeholder-white/15 focus:outline-none"
                      style={{
                        fontSize: "15px", fontWeight: 300,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "10px", padding: "12px 16px",
                        transition: "border-color 400ms ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col items-center gap-5 slide-up stagger-3">
                <button onClick={handleSubmit} disabled={submitting}
                  className="text-white/70 hover:text-white"
                  style={{
                    fontSize: "15px", fontWeight: 300, background: "none",
                    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "40px",
                    padding: "12px 44px", cursor: "pointer", transition: "all 400ms ease",
                  }}>
                  {submitting ? "..." : "つながる"}
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="text-white/20 hover:text-white/40"
                  style={{
                    fontSize: "13px", fontWeight: 300, background: "none",
                    border: "none", cursor: "pointer", transition: "color 300ms ease",
                  }}>
                  スキップ
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Thank you (auto-advances to step 6) */}
          {step === 5 && (
            <div>
              <h2 className="text-white scale-in"
                style={{ fontSize: "32px", fontWeight: 200, letterSpacing: "0.12em" }}>
                ありがとう。
              </h2>
              <div className="mt-10" style={{ opacity: 0, animation: "fadeIn 1000ms ease 1.5s forwards" }}>
                <p className="text-white/70" style={{ fontSize: "16px", fontWeight: 300, letterSpacing: "0.06em" }}>
                  あなただけじゃない。
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Others' voices */}
          {step === 6 && category && (
            <div>
              <div className="slide-up mb-3">
                <p className="text-white/30" style={{ fontSize: "12px", fontWeight: 300, letterSpacing: "0.04em" }}>
                  「{categoryLabel}」を選んだ人
                </p>
              </div>
              <div className="slide-up stagger-1 mb-8">
                <p className="text-white/80" style={{ fontSize: "36px", fontWeight: 200 }}>
                  {SEED_COUNTS[category]}
                  <span className="text-white/40" style={{ fontSize: "14px", marginLeft: "4px" }}>人</span>
                </p>
              </div>

              <div className="mb-6">
                <div
                  style={{
                    width: "32px", height: "1px",
                    background: "rgba(255,255,255,0.1)",
                    margin: "0 auto 24px",
                  }}
                />
                <p className="text-white/25 mb-6" style={{ fontSize: "12px", fontWeight: 300 }}>
                  同じ悩みを持つ人の声
                </p>
              </div>

              <div className="space-y-4 text-left">
                {SEED_VOICES[category].slice(0, voicesRevealed).map((voice, i) => (
                  <div
                    key={i}
                    className="voice-in"
                    style={{
                      borderLeft: "2px solid rgba(255,255,255,0.08)",
                      paddingLeft: "16px",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                    }}
                  >
                    <p className="text-white/60" style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.8 }}>
                      {voice}
                    </p>
                  </div>
                ))}
              </div>

              {voicesRevealed >= SEED_VOICES[category].length && (
                <div style={{ opacity: 0, animation: "fadeIn 800ms ease 0.5s forwards" }}>
                  <div
                    style={{
                      width: "32px", height: "1px",
                      background: "rgba(255,255,255,0.1)",
                      margin: "32px auto 24px",
                    }}
                  />
                  <p className="text-white/40 mb-8" style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.8 }}>
                    あなたの声も、<br />
                    誰かの「俺だけじゃなかった」になる。
                  </p>
                  <button
                    onClick={() => goToStep(7)}
                    className="text-white/60 hover:text-white"
                    style={{
                      fontSize: "14px", fontWeight: 300, background: "none",
                      border: "1px solid rgba(255,255,255,0.15)", borderRadius: "40px",
                      padding: "12px 36px", cursor: "pointer", transition: "all 400ms ease",
                    }}
                  >
                    次へ
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Community CTA */}
          {step === 7 && (
            <div>
              <h2 className="text-white mb-4 scale-in"
                style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.06em", lineHeight: 1.8 }}>
                ここに集まり始めています。
              </h2>

              <p className="text-white/30 mb-10"
                style={{ opacity: 0, animation: "fadeIn 600ms ease 0.5s forwards", fontSize: "13px", fontWeight: 300, lineHeight: 1.8 }}>
                名前も顔も出さなくていい。<br />
                ただ、同じ痛みを知ってる人がいる場所。
              </p>

              <div style={{ opacity: 0, animation: "slideUp 700ms ease 1s forwards" }}>
                <a
                  href="https://discord.gg/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white/80 hover:text-white"
                  style={{
                    fontSize: "15px", fontWeight: 300,
                    background: "rgba(88,101,242,0.15)",
                    border: "1px solid rgba(88,101,242,0.3)",
                    borderRadius: "12px", padding: "16px 32px",
                    transition: "all 400ms ease",
                    textDecoration: "none",
                  }}
                >
                  匿名で会話する
                  <span className="block text-white/30 mt-1" style={{ fontSize: "11px" }}>
                    Discord（匿名OK）
                  </span>
                </a>
              </div>

              <div style={{ opacity: 0, animation: "fadeIn 600ms ease 2s forwards" }} className="mt-8">
                <button
                  onClick={() => {}}
                  className="text-white/15 hover:text-white/30"
                  style={{
                    fontSize: "13px", fontWeight: 300,
                    background: "none", border: "none",
                    cursor: "pointer", transition: "color 300ms ease",
                  }}
                >
                  まだいい
                </button>
              </div>

              <div
                className="mt-16"
                style={{ opacity: 0, animation: "fadeIn 600ms ease 3s forwards" }}
              >
                <div style={{
                  width: "1px", height: "30px",
                  background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))",
                  margin: "0 auto 12px",
                }} />
                <p className="text-white/15" style={{ fontSize: "11px", fontWeight: 300 }}>
                  これまでに {visitorCount + SEED_COUNTS[category ?? "smell"]}人 がここに来ました
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
