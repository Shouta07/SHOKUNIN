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

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function useTypewriter(text: string, speed = 80, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const startTimer = setTimeout(() => {
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
    return () => clearTimeout(startTimer);
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

  if (!mounted) {
    return <div className="min-h-[100dvh] bg-black" />;
  }

  return (
    <div className="relative min-h-[100dvh] bg-black overflow-hidden">
      {/* Ambient breathing glow */}
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
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
          50% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
        }
        .slide-up { animation: slideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in { animation: fadeIn 800ms ease forwards; }
        .scale-in { animation: scaleIn 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .stagger-1 { animation-delay: 100ms; opacity: 0; }
        .stagger-2 { animation-delay: 200ms; opacity: 0; }
        .stagger-3 { animation-delay: 300ms; opacity: 0; }
        .stagger-4 { animation-delay: 400ms; opacity: 0; }
        .stagger-5 { animation-delay: 500ms; opacity: 0; }
      `}</style>

      <div
        className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6"
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
                    fontSize: "15px",
                    fontWeight: 300,
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "40px",
                    padding: "14px 56px",
                    cursor: "pointer",
                    transition: "all 400ms ease",
                  }}
                >
                  <span className="relative z-10">はい</span>
                  <div
                    className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      transition: "opacity 400ms ease",
                    }}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Categories (narrowed to 5) */}
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
                    onClick={() => {
                      setCategory(cat.id);
                      goToStep(2);
                    }}
                    className={`slide-up stagger-${i + 1} group w-full text-left`}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "16px 20px",
                      cursor: "pointer",
                      transition: "all 300ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
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
              <h2
                className="text-white mb-4 slide-up"
                style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.06em" }}
              >
                今、どれくらい辛い？
              </h2>
              <p
                className="text-white/25 mb-10 slide-up stagger-1"
                style={{ fontSize: "12px", fontWeight: 300 }}
              >
                直感で選んでください
              </p>

              <div className="flex justify-center gap-[6px] slide-up stagger-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const isSelected = painLevel === n;
                  const intensity = n / 10;
                  return (
                    <button
                      key={n}
                      onClick={() => {
                        setPainLevel(n);
                        setTimeout(() => goToStep(3), 600);
                      }}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: isSelected
                          ? "1.5px solid rgba(255,255,255,0.8)"
                          : "1px solid rgba(255,255,255,0.12)",
                        background: isSelected
                          ? `rgba(255, ${Math.round(100 - intensity * 80)}, ${Math.round(80 - intensity * 80)}, 0.3)`
                          : "none",
                        color: isSelected ? "white" : `rgba(255,255,255,${0.3 + intensity * 0.3})`,
                        fontSize: "13px",
                        fontWeight: isSelected ? 500 : 300,
                        cursor: "pointer",
                        transition: "all 300ms ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: isSelected ? `0 0 16px rgba(255,100,80,0.3)` : "none",
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              {painLevel && (
                <p className="text-white/20 mt-6 fade-in" style={{ fontSize: "11px" }}>
                  {painLevel >= 8 ? "...辛いですね。" : painLevel >= 5 ? "" : ""}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Free text */}
          {step === 3 && (
            <div>
              <h2
                className="text-white mb-8 slide-up"
                style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.06em", lineHeight: 1.8 }}
              >
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
                    fontSize: "15px",
                    fontWeight: 300,
                    lineHeight: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "20px",
                    resize: "none",
                    transition: "border-color 400ms ease",
                    caretColor: "rgba(255,255,255,0.6)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                />

                <div
                  className="mt-8"
                  style={{
                    opacity: message.length > 0 ? 1 : 0,
                    transform: message.length > 0 ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 500ms ease, transform 500ms ease",
                  }}
                >
                  <button
                    onClick={() => goToStep(4)}
                    disabled={message.length === 0}
                    className="text-white/70 hover:text-white"
                    style={{
                      fontSize: "15px",
                      fontWeight: 300,
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "40px",
                      padding: "12px 44px",
                      cursor: "pointer",
                      transition: "all 400ms ease",
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
              <h2
                className="text-white mb-3 slide-up"
                style={{ fontSize: "18px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.8 }}
              >
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
                      type="text"
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.ph}
                      className="w-full text-white placeholder-white/15 focus:outline-none"
                      style={{
                        fontSize: "15px",
                        fontWeight: 300,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        transition: "border-color 400ms ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-5 slide-up stagger-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="text-white/70 hover:text-white"
                  style={{
                    fontSize: "15px",
                    fontWeight: 300,
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "40px",
                    padding: "12px 44px",
                    cursor: "pointer",
                    transition: "all 400ms ease",
                  }}
                >
                  {submitting ? "..." : "つながる"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="text-white/20 hover:text-white/40"
                  style={{
                    fontSize: "13px",
                    fontWeight: 300,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 300ms ease",
                  }}
                >
                  スキップ
                </button>
              </div>
            </div>
          )}

          {/* Step 5: End */}
          {step === 5 && (
            <div>
              <h2
                className="text-white scale-in"
                style={{ fontSize: "32px", fontWeight: 200, letterSpacing: "0.12em" }}
              >
                ありがとう。
              </h2>

              <div
                className="mt-10"
                style={{ opacity: 0, animation: "fadeIn 1000ms ease 2s forwards" }}
              >
                <p className="text-white/70" style={{ fontSize: "16px", fontWeight: 300, letterSpacing: "0.06em" }}>
                  あなただけじゃない。
                </p>
              </div>

              <div
                className="mt-16"
                style={{ opacity: 0, animation: "slideUp 800ms ease 4s forwards" }}
              >
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))",
                    margin: "0 auto 16px",
                  }}
                />
                <p className="text-white/20" style={{ fontSize: "12px", fontWeight: 300 }}>
                  これまでに {visitorCount}人 がここに来ました
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
