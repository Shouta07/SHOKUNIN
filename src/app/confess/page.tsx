"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "smell" as const, label: "体臭・ワキガ", en: "Body Odor", sub: "近づくのが怖い" },
  { id: "sweat" as const, label: "汗", en: "Sweating", sub: "止まらない" },
  { id: "skin" as const, label: "肌・老け", en: "Skin / Aging", sub: "鏡を見たくない" },
  { id: "hair" as const, label: "薄毛", en: "Hair Loss", sub: "気づかれてる" },
  { id: "breath" as const, label: "口臭", en: "Bad Breath", sub: "距離を取ってしまう" },
];
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
    "美容師に「頭頂部、薄くなってきてますね」って言われた日のこと、今でも覚えてる。",
    "風が吹くたびに、手で押さえてしまう。",
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
  smell: 47, sweat: 38, skin: 52, hair: 63, breath: 41,
};

// ─── Hooks ───────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const RECOVERY_SERVICES = [
  {
    id: "photo",
    title: "写真撮影",
    en: "Photo Session",
    desc: "プロに撮ってもらう体験。自分の「いい顔」を知る。",
    price: "¥5,000〜",
    provider: "Yuki",
    bookUrl: "https://line.me/ti/p/placeholder",
    bookLabel: "LINEで予約する",
  },
  {
    id: "makeup",
    title: "メイク体験",
    en: "Grooming Session",
    desc: "眉・肌・印象。プロが1時間であなたの「整え方」を教える。",
    price: "¥8,000〜",
    provider: "Rina",
    bookUrl: "https://instagram.com/placeholder",
    bookLabel: "DMで予約する",
  },
];

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
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function getVisitorCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("confess_visitor_count") || "0", 10);
}

function incrementVisitorCount(): number {
  const next = getVisitorCount() + 1;
  localStorage.setItem("confess_visitor_count", String(next));
  return next;
}

// ─── Styles ──────────────────────────────────────────────────────

const font = "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif";

const CSS = `
@keyframes breathe {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes voiceSlide {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 0.55; transform: translateY(0); }
}
@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.a-fadeUp { animation: fadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.a-fadeIn { animation: fadeIn 700ms ease both; }
.a-scaleUp { animation: scaleUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.a-voice { animation: voiceSlide 600ms ease both; }
.d1 { animation-delay: 80ms; }
.d2 { animation-delay: 160ms; }
.d3 { animation-delay: 240ms; }
.d4 { animation-delay: 320ms; }
.d5 { animation-delay: 400ms; }
`;

// ─── Component ───────────────────────────────────────────────────

export default function ConfessPage() {
  const [step, setStep] = useState<Step>(0);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [discord, setDiscord] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [other, setOther] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [out, setOut] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [voicesShown, setVoicesShown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  const tw1 = useTypewriter("誰にも言えないこと、", 90, 1000);
  const tw2 = useTypewriter("ありますか？", 110, 3000);

  useEffect(() => { setMounted(true); setVisitorCount(getVisitorCount()); }, []);

  useEffect(() => {
    if (tw2.done) { const t = setTimeout(() => setShowCta(true), 800); return () => clearTimeout(t); }
  }, [tw2.done]);

  useEffect(() => {
    if (step === 3) { const t = setTimeout(() => ta.current?.focus(), 600); return () => clearTimeout(t); }
  }, [step]);

  useEffect(() => {
    if (step === 5) { const t = setTimeout(() => go(6), 3500); return () => clearTimeout(t); }
  }, [step]);

  useEffect(() => {
    if (step !== 6 || !category) return;
    const total = SEED_VOICES[category].length;
    if (voicesShown >= total) return;
    const t = setTimeout(() => setVoicesShown((v) => v + 1), voicesShown === 0 ? 1000 : 700);
    return () => clearTimeout(t);
  }, [step, category, voicesShown]);

  const go = useCallback((next: Step) => {
    setOut(true);
    setTimeout(() => { setStep(next); setOut(false); }, 450);
  }, []);

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    const payload = { category, painLevel, message, contact: { discord: discord || undefined, x: xHandle || undefined, other: other || undefined } };
    try { const arr = JSON.parse(localStorage.getItem("confess_submissions") || "[]") as unknown[]; arr.push({ ...payload, ts: new Date().toISOString() }); localStorage.setItem("confess_submissions", JSON.stringify(arr)); } catch {}
    try { await fetch("/confess/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); } catch {}
    setVisitorCount(incrementVisitorCount());
    setSubmitting(false);
    go(5);
  }, [submitting, category, painLevel, message, discord, xHandle, other, go]);

  const catLabel = category ? CATEGORIES.find((c) => c.id === category)?.label ?? "" : "";

  if (!mounted) return <div style={{ minHeight: "100dvh", background: "#000" }} />;

  return (
    <div style={{ minHeight: "100dvh", background: "#000", fontFamily: font, color: "#fff" }}>
      <style>{CSS}</style>

      {/* Ambient */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 600px 600px at 50% 40%, rgba(255,255,255,0.015), transparent)",
        animation: "breathe 8s ease-in-out infinite",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100dvh", padding: "48px 28px",
        opacity: out ? 0 : 1,
        transform: out ? "translateY(-8px)" : "translateY(0)",
        transition: "opacity 450ms ease, transform 450ms ease",
      }}>
        <div style={{ width: "100%", maxWidth: "380px", textAlign: "center" }}>

          {/* ── Step 0: Entry ── */}
          {step === 0 && (
            <>
              <h1 style={{ fontSize: "28px", fontWeight: 200, lineHeight: 2.2, letterSpacing: "0.04em", marginBottom: "56px" }}>
                {tw1.displayed}
                {!tw1.done && <span style={{ animation: "cursorBlink 1s step-end infinite", marginLeft: "2px" }}>|</span>}
                {tw1.done && <br />}
                {tw1.done && tw2.displayed}
                {tw1.done && !tw2.done && <span style={{ animation: "cursorBlink 1s step-end infinite", marginLeft: "2px" }}>|</span>}
              </h1>

              <div style={{
                opacity: showCta ? 1 : 0,
                transform: showCta ? "translateY(0)" : "translateY(16px)",
                transition: "all 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}>
                <button onClick={() => go(1)} style={{
                  fontSize: "14px", fontWeight: 300, letterSpacing: "0.15em",
                  background: "transparent", color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "100px", padding: "16px 64px",
                  cursor: "pointer", transition: "all 500ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  はい
                </button>
              </div>
            </>
          )}

          {/* ── Step 1: Category ── */}
          {step === 1 && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "12px" }}>
                select
              </p>
              <h2 className="a-fadeUp d1" style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.6, marginBottom: "36px" }}>
                何に、一番苦しんでいる？
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.id}
                    className={`a-fadeUp d${Math.min(i + 2, 5)}`}
                    onClick={() => { setCategory(cat.id); go(2); }}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", textAlign: "left",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "14px", padding: "18px 22px",
                      cursor: "pointer", transition: "all 350ms ease",
                      color: "#fff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 400, display: "block" }}>{cat.label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", marginTop: "4px", display: "block" }}>{cat.sub}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>{cat.en}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Step 2: Pain ── */}
          {step === 2 && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "12px" }}>
                level
              </p>
              <h2 className="a-fadeUp d1" style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", marginBottom: "8px" }}>
                今、どれくらい辛い？
              </h2>
              <p className="a-fadeUp d2" style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.2)", marginBottom: "40px" }}>
                直感で
              </p>

              <div className="a-fadeUp d3" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const sel = painLevel === n;
                  return (
                    <button key={n} onClick={() => { setPainLevel(n); setTimeout(() => go(3), 500); }}
                      style={{
                        width: "34px", height: "34px", borderRadius: "50%",
                        border: sel ? "1.5px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.08)",
                        background: sel ? `rgba(255,255,255,0.12)` : "transparent",
                        color: sel ? "#fff" : `rgba(255,255,255,${0.15 + n * 0.06})`,
                        fontSize: "12px", fontWeight: sel ? 500 : 300, fontFamily: font,
                        cursor: "pointer", transition: "all 300ms ease",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >{n}</button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Step 3: Write ── */}
          {step === 3 && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "12px" }}>
                leave it here
              </p>
              <h2 className="a-fadeUp d1" style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: "32px" }}>
                ここに、<br />置いていってください。
              </h2>

              <div className="a-fadeUp d2">
                <textarea
                  ref={ta} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="誰にも見せません。"
                  rows={5}
                  style={{
                    width: "100%", fontFamily: font,
                    fontSize: "15px", fontWeight: 300, lineHeight: 2, color: "#fff",
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "14px", padding: "20px 22px", resize: "none",
                    outline: "none", transition: "border-color 500ms ease",
                    caretColor: "rgba(255,255,255,0.5)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                />
                <div style={{
                  marginTop: "28px",
                  opacity: message.length > 0 ? 1 : 0,
                  transform: message.length > 0 ? "translateY(0)" : "translateY(8px)",
                  transition: "all 600ms ease",
                }}>
                  <button onClick={() => go(4)} disabled={!message}
                    style={{
                      fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em",
                      background: "transparent", color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px",
                      padding: "14px 48px", cursor: "pointer", transition: "all 400ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                    置いていく
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Contact ── */}
          {step === 4 && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "12px" }}>
                connect
              </p>
              <h2 className="a-fadeUp d1" style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: "8px" }}>
                同じ悩みの人と、<br />つながれる場所があります。
              </h2>
              <p className="a-fadeUp d2" style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginBottom: "28px" }}>
                任意です
              </p>

              <div className="a-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                {([
                  { l: "Discord", v: discord, s: setDiscord, p: "username" },
                  { l: "X", v: xHandle, s: setXHandle, p: "@username" },
                  { l: "Other", v: other, s: setOther, p: "LINE, Instagram..." },
                ] as const).map((f) => (
                  <div key={f.l}>
                    <label style={{ fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>{f.l}</label>
                    <input type="text" value={f.v} onChange={(e) => f.s(e.target.value)} placeholder={f.p}
                      style={{
                        width: "100%", fontFamily: font, fontSize: "15px", fontWeight: 300,
                        color: "#fff", background: "rgba(255,255,255,0.015)",
                        border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px",
                        padding: "14px 16px", outline: "none", transition: "border-color 400ms ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                    />
                  </div>
                ))}
              </div>

              <div className="a-fadeUp d4" style={{ marginTop: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                <button onClick={submit} disabled={submitting}
                  style={{
                    fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em",
                    background: "transparent", color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px",
                    padding: "14px 48px", cursor: "pointer", transition: "all 400ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                  {submitting ? "..." : "つながる"}
                </button>
                <button onClick={submit} disabled={submitting}
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.15)"; }}>
                  スキップ
                </button>
              </div>
            </>
          )}

          {/* ── Step 5: Thank you ── */}
          {step === 5 && (
            <div className="a-scaleUp">
              <h2 style={{ fontSize: "36px", fontWeight: 200, letterSpacing: "0.15em" }}>
                ありがとう。
              </h2>
              <p style={{ marginTop: "28px", fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.5)", opacity: 0, animation: "fadeIn 800ms ease 1.5s forwards" }}>
                あなただけじゃない。
              </p>
            </div>
          )}

          {/* ── Step 6: Others' voices ── */}
          {step === 6 && category && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "20px" }}>
                you&apos;re not alone
              </p>

              <div className="a-fadeUp d1" style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "48px", fontWeight: 200, letterSpacing: "0.05em" }}>
                  {SEED_COUNTS[category]}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.3)", marginLeft: "6px" }}>人</span>
              </div>

              <p className="a-fadeUp d2" style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.3)", marginBottom: "32px" }}>
                「{catLabel}」を選んだ人
              </p>

              <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 auto 28px" }} />

              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "16px" }}>
                {SEED_VOICES[category].slice(0, voicesShown).map((v, i) => (
                  <div key={i} className="a-voice" style={{
                    paddingLeft: "16px",
                    borderLeft: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <p style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.55)" }}>{v}</p>
                  </div>
                ))}
              </div>

              {voicesShown >= SEED_VOICES[category].length && (
                <div style={{ opacity: 0, animation: "fadeUp 800ms ease 0.6s forwards" }}>
                  <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.08)", margin: "32px auto 24px" }} />
                  <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.3)", lineHeight: 1.9, marginBottom: "28px" }}>
                    あなたの声も、<br />
                    誰かの「俺だけじゃなかった」になる。
                  </p>
                  <button onClick={() => go(7)}
                    style={{
                      fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em",
                      background: "transparent", color: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px",
                      padding: "12px 40px", cursor: "pointer", transition: "all 400ms ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                    →
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Step 7: What's next ── */}
          {step === 7 && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "24px" }}>
                what&apos;s next
              </p>

              <h2 className="a-fadeUp d1" style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: "32px" }}>
                ここから、どうする？
              </h2>

              <div className="a-fadeUp d2" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Recovery action */}
                <button onClick={() => go(8)}
                  style={{
                    width: "100%", textAlign: "left",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "16px", padding: "22px 24px",
                    cursor: "pointer", transition: "all 400ms ease",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 400, display: "block" }}>変わってみる</span>
                  <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", marginTop: "6px", display: "block" }}>
                    写真撮影・メイク体験で、自分を知り直す
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.12)", marginTop: "8px", display: "block", letterSpacing: "0.1em" }}>
                    RECOVERY SESSION →
                  </span>
                </button>

                {/* Community */}
                <a href="https://discord.gg/placeholder" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "rgba(88,101,242,0.04)",
                    border: "1px solid rgba(88,101,242,0.12)",
                    borderRadius: "16px", padding: "22px 24px",
                    textDecoration: "none", transition: "all 400ms ease",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(88,101,242,0.1)";
                    e.currentTarget.style.borderColor = "rgba(88,101,242,0.3)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(88,101,242,0.04)";
                    e.currentTarget.style.borderColor = "rgba(88,101,242,0.12)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 400, display: "block" }}>話してみる</span>
                  <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", marginTop: "6px", display: "block" }}>
                    匿名で、同じ痛みを知ってる人と
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.12)", marginTop: "8px", display: "block", letterSpacing: "0.1em" }}>
                    DISCORD — ANONYMOUS OK →
                  </span>
                </a>
              </div>

              <div className="a-fadeUp d3" style={{ marginTop: "28px" }}>
                <button style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.12)"; }}>
                  まだいい
                </button>
              </div>

              <div className="a-fadeUp d4" style={{ marginTop: "40px" }}>
                <div style={{ width: "1px", height: "24px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06))", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.1)", letterSpacing: "0.05em" }}>
                  {visitorCount + SEED_COUNTS[category ?? "smell"]} people have been here
                </p>
              </div>
            </>
          )}

          {/* ── Step 8: Recovery Services ── */}
          {step === 8 && (
            <>
              <p className="a-fadeUp" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "12px" }}>
                recovery session
              </p>

              <h2 className="a-fadeUp d1" style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.7, marginBottom: "8px" }}>
                自分を知り直す体験。
              </h2>

              <p className="a-fadeUp d2" style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.25)", lineHeight: 1.8, marginBottom: "32px" }}>
                悩んでいた時間を、<br />変わり始める時間に。
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {RECOVERY_SERVICES.map((svc, i) => (
                  <div
                    key={svc.id}
                    className={`a-fadeUp d${Math.min(i + 3, 5)}`}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "16px", padding: "24px",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "17px", fontWeight: 400 }}>{svc.title}</span>
                      <span style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>{svc.en}</span>
                    </div>

                    <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: "16px" }}>
                      {svc.desc}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>
                        担当: {svc.provider}
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>
                        {svc.price}
                      </span>
                    </div>

                    <a href={svc.bookUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "block", width: "100%", textAlign: "center",
                        fontSize: "13px", fontWeight: 400, letterSpacing: "0.06em",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "100px", padding: "12px",
                        color: "rgba(255,255,255,0.7)", textDecoration: "none",
                        transition: "all 400ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }}
                    >
                      {svc.bookLabel}
                    </a>
                  </div>
                ))}
              </div>

              <div className="a-fadeUp d5" style={{ marginTop: "24px" }}>
                <button onClick={() => go(7)}
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.15)"; }}>
                  ← 戻る
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
