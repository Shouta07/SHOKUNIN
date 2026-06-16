"use client";

import { useState, useEffect, useCallback } from "react";

const CATEGORIES = ["外見", "恋愛", "孤独", "キャリア", "お金", "健康"] as const;
type Category = (typeof CATEGORIES)[number];

type Step = 0 | 1 | 2 | 3 | 4 | 5;

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

function FadeIn({
  show,
  delay = 0,
  children,
  className = "",
}: {
  show: boolean;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [show, delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease",
      }}
    >
      {children}
    </div>
  );
}

export default function ConfessPage() {
  const [step, setStep] = useState<Step>(0);
  const [stepVisible, setStepVisible] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [contactDiscord, setContactDiscord] = useState("");
  const [contactX, setContactX] = useState("");
  const [contactOther, setContactOther] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVisitorCount(getVisitorCount());
  }, []);

  const goToStep = useCallback((nextStep: Step) => {
    setStepVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setStepVisible(true);
    }, 400);
  }, []);

  const handleCategorySelect = useCallback(
    (cat: Category) => {
      setCategory(cat);
      goToStep(2);
    },
    [goToStep]
  );

  const handlePainSelect = useCallback(
    (level: number) => {
      setPainLevel(level);
      setTimeout(() => goToStep(3), 500);
    },
    [goToStep]
  );

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

    // Save to localStorage as backup
    try {
      const existing = JSON.parse(
        localStorage.getItem("confess_submissions") || "[]"
      ) as unknown[];
      existing.push({ ...payload, timestamp: new Date().toISOString() });
      localStorage.setItem("confess_submissions", JSON.stringify(existing));
    } catch {
      // localStorage might be full or unavailable
    }

    try {
      await fetch("/confess/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // fire-and-forget for MVP
    }

    const count = incrementVisitorCount();
    setVisitorCount(count);
    setSubmitting(false);
    goToStep(5);
  }, [
    submitting,
    category,
    painLevel,
    message,
    contactDiscord,
    contactX,
    contactOther,
    goToStep,
  ]);

  // Step 0: show button after delay
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setShowButton(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowButton(false);
  }, [step]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black px-6"
      style={{
        fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      }}
    >
      <div
        className="w-full max-w-md text-center"
        style={{
          opacity: stepVisible ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        {/* Step 0: Entry */}
        {step === 0 && (
          <div>
            <FadeIn show className="mb-16">
              <h1
                className="text-white"
                style={{
                  fontSize: "24px",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  letterSpacing: "0.05em",
                }}
              >
                誰にも言えないこと、
                <br />
                ありますか？
              </h1>
            </FadeIn>
            <FadeIn show delay={2000}>
              <button
                onClick={() => goToStep(1)}
                className="text-white"
                style={{
                  fontSize: "16px",
                  fontWeight: 300,
                  background: "none",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "8px",
                  padding: "14px 48px",
                  cursor: "pointer",
                  opacity: showButton ? 1 : 0,
                  transition: "opacity 600ms ease",
                }}
              >
                はい
              </button>
            </FadeIn>
          </div>
        )}

        {/* Step 1: Category */}
        {step === 1 && (
          <div>
            <FadeIn show className="mb-12">
              <h2
                className="text-white"
                style={{
                  fontSize: "22px",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                今のあなたに
                <br />
                一番近いもの
              </h2>
            </FadeIn>
            <FadeIn show delay={300}>
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="text-white"
                    style={{
                      fontSize: "16px",
                      fontWeight: 300,
                      background: "none",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      cursor: "pointer",
                      transition: "border-color 200ms ease",
                      minWidth: "80px",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.borderColor =
                        "rgba(255, 255, 255, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.borderColor =
                        "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>
        )}

        {/* Step 2: Pain scale */}
        {step === 2 && (
          <div>
            <FadeIn show className="mb-12">
              <h2
                className="text-white"
                style={{
                  fontSize: "22px",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                今、どれくらい辛い？
              </h2>
            </FadeIn>
            <FadeIn show delay={300}>
              <div className="flex justify-center gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePainSelect(n)}
                    className="text-white"
                    style={{
                      fontSize: "16px",
                      fontWeight: painLevel === n ? 500 : 300,
                      background:
                        painLevel === n
                          ? "rgba(255, 255, 255, 0.15)"
                          : "none",
                      border:
                        painLevel === n
                          ? "1px solid rgba(255, 255, 255, 0.6)"
                          : "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </FadeIn>
          </div>
        )}

        {/* Step 3: Free text */}
        {step === 3 && (
          <div>
            <FadeIn show className="mb-8">
              <h2
                className="text-white"
                style={{
                  fontSize: "22px",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                  lineHeight: 1.7,
                }}
              >
                よければ、
                <br />
                ここに置いていってください。
              </h2>
            </FadeIn>
            <FadeIn show delay={400}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="誰にも見せなくていい。ただ、書くだけでいい。"
                rows={6}
                className="w-full text-white placeholder-gray-600 focus:outline-none"
                style={{
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  background: "#111",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "16px",
                  resize: "none",
                }}
              />
              <div
                className="mt-8"
                style={{
                  opacity: message.length > 0 ? 1 : 0,
                  transition: "opacity 600ms ease",
                }}
              >
                <button
                  onClick={() => goToStep(4)}
                  disabled={message.length === 0}
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontWeight: 300,
                    background: "none",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "14px 48px",
                    cursor: "pointer",
                  }}
                >
                  置いていく
                </button>
              </div>
            </FadeIn>
          </div>
        )}

        {/* Step 4: Optional contact */}
        {step === 4 && (
          <div>
            <FadeIn show className="mb-10">
              <h2
                className="text-white"
                style={{
                  fontSize: "20px",
                  fontWeight: 300,
                  letterSpacing: "0.03em",
                  lineHeight: 1.8,
                }}
              >
                同じ悩みを持つ人と、
                <br />
                つながれる場所があります。
              </h2>
            </FadeIn>
            <FadeIn show delay={400}>
              <div className="space-y-4 text-left">
                <div>
                  <label
                    className="mb-1 block text-gray-500"
                    style={{ fontSize: "13px", fontWeight: 300 }}
                  >
                    Discord
                  </label>
                  <input
                    type="text"
                    value={contactDiscord}
                    onChange={(e) => setContactDiscord(e.target.value)}
                    placeholder="username#1234"
                    className="w-full text-white placeholder-gray-700 focus:outline-none"
                    style={{
                      fontSize: "16px",
                      fontWeight: 300,
                      background: "#111",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-gray-500"
                    style={{ fontSize: "13px", fontWeight: 300 }}
                  >
                    X (Twitter)
                  </label>
                  <input
                    type="text"
                    value={contactX}
                    onChange={(e) => setContactX(e.target.value)}
                    placeholder="@username"
                    className="w-full text-white placeholder-gray-700 focus:outline-none"
                    style={{
                      fontSize: "16px",
                      fontWeight: 300,
                      background: "#111",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-gray-500"
                    style={{ fontSize: "13px", fontWeight: 300 }}
                  >
                    その他
                  </label>
                  <input
                    type="text"
                    value={contactOther}
                    onChange={(e) => setContactOther(e.target.value)}
                    placeholder="LINE, Instagram など"
                    className="w-full text-white placeholder-gray-700 focus:outline-none"
                    style={{
                      fontSize: "16px",
                      fontWeight: 300,
                      background: "#111",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                    }}
                  />
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontWeight: 300,
                    background: "none",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "14px 48px",
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "..." : "つながる"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="text-gray-600 hover:text-gray-400"
                  style={{
                    fontSize: "14px",
                    fontWeight: 300,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 200ms ease",
                  }}
                >
                  スキップ
                </button>
              </div>
            </FadeIn>
          </div>
        )}

        {/* Step 5: End */}
        {step === 5 && (
          <div>
            <FadeIn show>
              <h2
                className="text-white"
                style={{
                  fontSize: "28px",
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                }}
              >
                ありがとう。
              </h2>
            </FadeIn>
            <FadeIn show delay={2000} className="mt-8">
              <p
                className="text-white"
                style={{
                  fontSize: "18px",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                あなただけじゃない。
              </p>
            </FadeIn>
            <FadeIn show delay={4000} className="mt-16">
              <p
                className="text-gray-600"
                style={{
                  fontSize: "13px",
                  fontWeight: 300,
                }}
              >
                これまでに {visitorCount}人 がここに来ました
              </p>
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
}
