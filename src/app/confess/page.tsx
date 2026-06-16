"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── Data ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "smell" as const, label: "体臭・ワキガ", en: "Body Odor", sub: "近づくのが怖い" },
  { id: "sweat" as const, label: "汗", en: "Sweating", sub: "止まらない" },
  { id: "skin" as const, label: "肌・老け", en: "Skin / Aging", sub: "鏡を見たくない" },
  { id: "hair" as const, label: "薄毛", en: "Hair Loss", sub: "気づかれてる" },
  { id: "breath" as const, label: "口臭", en: "Bad Breath", sub: "距離を取ってしまう" },
];
type CategoryId = (typeof CATEGORIES)[number]["id"];

const FLOATING_FRAGMENTS = [
  "電車で隣の人が離れた",
  "握手が怖い",
  "鏡を見たくない",
  "帽子を脱げない",
  "口を閉じたまま6階まで",
  "制汗剤を3本",
  "写真のタグ付け外して",
  "夏が来るのが怖い",
  "「疲れてる？」って",
  "誰にも聞けない",
  "マスクが外せない",
  "風が吹くたびに",
  "I can't shake hands",
  "Nobody told me",
  "Am I the only one?",
  "I avoid mirrors",
  "距離を取ってしまう",
  "気づかれてる気がする",
  "3日眠れなかった",
  "いつも端の席",
];

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
  ],
  skin: [
    "同期の集合写真、俺だけ明らかに老けてた。",
    "久しぶりに会った友人に「疲れてる？」って言われた。それだけ。",
    "鏡を見るたびに、父親に似てきてる気がして怖い。",
    "日焼け止めなんて塗ったことなかった。今さら後悔してる。",
    "マッチングアプリの写真と実物が違いすぎて、会うのが怖い。",
  ],
  hair: [
    "美容師に「頭頂部、薄くなってきてますね」って言われた日のこと、今でも覚えてる。",
    "風が吹くたびに、手で押さえてしまう。",
    "父親がハゲてるから、いつか来るって分かってた。でも28は早すぎる。",
    "帽子を脱げない。どこでも。",
    "後ろから撮られた写真を見て、初めて現実を知った。",
    "AGAクリニックのサイトを何回開いたか分からない。でも予約できない。",
  ],
  breath: [
    "話しかけた時、相手が少し引いた。あの0.5秒が忘れられない。",
    "エレベーターで2人きりになると、口を閉じたまま黙ってしまう。",
    "歯磨きは1日3回してる。それでも不安が消えない。",
    "打ち合わせ中、手で口を覆ってしまう癖がついた。",
    "飲み会で近くで話すのが怖くて、端の席を選ぶようになった。",
  ],
};

const SEED_COUNTS: Record<CategoryId, number> = {
  smell: 47, sweat: 38, skin: 52, hair: 63, breath: 41,
};

const CHALLENGE = {
  title: "孤独チャレンジ",
  price: "500",
  capacity: "5",
  duration: "90",
  format: "オンライン",
  contents: [
    "今抱えていることを共有",
    "同じ悩みを持つ人と出会う",
    "次の1週間でやることを決める",
    "振り返り方法を受け取る",
  ],
  canExpect: [
    "自分だけではないと知る",
    "行動のきっかけを作る",
    "同じ悩みを持つ仲間と出会う",
  ],
  cannotGuarantee: [
    "悩みの解決",
    "人生の劇的な変化",
  ],
  bookUrl: "https://line.me/ti/p/placeholder",
};

// ─── Hooks / Utils ───────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function useTypewriter(text: string, speed = 80, startDelay = 0, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay, active]);

  return { displayed, done };
}

function getCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("confess_visitor_count") || "0", 10);
}
function incCount(): number {
  const n = getCount() + 1;
  localStorage.setItem("confess_visitor_count", String(n));
  return n;
}

const F = "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif";

// ─── Floating Fragments ─────────────────────────────────────────

function FloatingWorld() {
  const particles = useMemo(() => {
    return FLOATING_FRAGMENTS.map((text, i) => ({
      text,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      size: 10 + Math.random() * 4,
      opacity: 0.04 + Math.random() * 0.08,
      duration: 20 + Math.random() * 30,
      delay: -(Math.random() * 40),
      dx: (Math.random() - 0.5) * 30,
      dy: (Math.random() - 0.5) * 20,
      blur: Math.random() > 0.6 ? 1 : 0,
      key: i,
    }));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map((p) => (
        <div
          key={p.key}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            fontWeight: 300,
            fontFamily: F,
            color: `rgba(255,255,255,${p.opacity})`,
            whiteSpace: "nowrap",
            filter: p.blur ? "blur(1px)" : "none",
            animation: `drift${p.key % 4} ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.text}
        </div>
      ))}
      <style>{`
        @keyframes drift0 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(15px,-20px); } }
        @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,12px); } }
        @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(10px,18px); } }
        @keyframes drift3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-12px,-15px); } }
      `}</style>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────

const CSS = `
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleUp { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
@keyframes voiceSlide { from { opacity:0; transform:translateY(12px); } to { opacity:0.55; transform:translateY(0); } }
@keyframes blink { 0%,50%{opacity:1;} 51%,100%{opacity:0;} }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.05);} 50%{box-shadow:0 0 0 12px rgba(255,255,255,0);} }
@keyframes matchGlow { 0%,100%{border-color:rgba(139,92,246,0.15);} 50%{border-color:rgba(139,92,246,0.4);} }
.a-fadeUp { animation: fadeUp 800ms cubic-bezier(0.22,1,0.36,1) both; }
.a-fadeIn { animation: fadeIn 700ms ease both; }
.a-scaleUp { animation: scaleUp 700ms cubic-bezier(0.22,1,0.36,1) both; }
.a-voice { animation: voiceSlide 600ms ease both; }
.d1{animation-delay:80ms;} .d2{animation-delay:160ms;} .d3{animation-delay:240ms;}
.d4{animation-delay:320ms;} .d5{animation-delay:400ms;} .d6{animation-delay:480ms;}
`;

// ─── Page ────────────────────────────────────────────────────────

export default function ConfessPage() {
  const [step, setStep] = useState<Step>(0);
  const [cat, setCat] = useState<CategoryId | null>(null);
  const [msg, setMsg] = useState("");
  const [vc, setVc] = useState(0);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(false);
  const [cta0, setCta0] = useState(false);
  const [vShown, setVShown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const ta = useRef<HTMLTextAreaElement>(null);

  const tw1 = useTypewriter("誰にも言えないこと、", 90, 1200);
  const tw2 = useTypewriter("ありますか？", 110, 3200);

  useEffect(() => { setMounted(true); setVc(getCount()); }, []);
  useEffect(() => { if (tw2.done) { const t = setTimeout(() => setCta0(true), 800); return () => clearTimeout(t); } }, [tw2.done]);
  useEffect(() => { if (step === 1) { const t = setTimeout(() => ta.current?.focus(), 600); return () => clearTimeout(t); } }, [step]);
  useEffect(() => { if (step === 2) { const t = setTimeout(() => go(3), 3000); return () => clearTimeout(t); } }, [step]);
  useEffect(() => {
    if (step !== 4 || !cat) return;
    if (vShown >= SEED_VOICES[cat].length) return;
    const t = setTimeout(() => setVShown((v) => v + 1), vShown === 0 ? 1000 : 700);
    return () => clearTimeout(t);
  }, [step, cat, vShown]);
  useEffect(() => {
    if (step === 5 && cat) {
      setMatchCount(0);
      const target = Math.floor(SEED_COUNTS[cat] * 0.3) + Math.floor(Math.random() * 5);
      let c = 0;
      const iv = setInterval(() => { c++; setMatchCount(c); if (c >= target) clearInterval(iv); }, 60);
      return () => clearInterval(iv);
    }
  }, [step, cat]);

  const go = useCallback((n: Step) => { setOut(true); setTimeout(() => { setStep(n); setOut(false); }, 450); }, []);

  const submit = useCallback(async () => {
    if (busy || !msg) return;
    setBusy(true);
    const p = { message: msg };
    try { const a = JSON.parse(localStorage.getItem("confess_submissions") || "[]") as unknown[]; a.push({ ...p, ts: new Date().toISOString() }); localStorage.setItem("confess_submissions", JSON.stringify(a)); } catch {}
    try { await fetch("/confess/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }); } catch {}
    setVc(incCount());
    setBusy(false);
    go(2);
  }, [busy, msg, go]);

  const catLabel = cat ? CATEGORIES.find((c) => c.id === cat)?.label ?? "" : "";

  if (!mounted) return <div style={{ minHeight: "100dvh", background: "#000" }} />;

  const Pill = ({ children, onClick, disabled, className = "" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) => (
    <button onClick={onClick} disabled={disabled} className={className}
      style={{ fontSize: "14px", fontWeight: 300, letterSpacing: "0.1em", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", padding: "14px 48px", cursor: "pointer", transition: "all 400ms ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
      {children}
    </button>
  );

  const Sub = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const, marginBottom: "12px" }}>{children}</p>
  );

  const H = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h2 className={className} style={{ fontSize: "22px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.7 }}>{children}</h2>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#000", fontFamily: F, color: "#fff" }}>
      <style>{CSS}</style>
      <FloatingWorld />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100dvh", padding: "48px 28px",
        opacity: out ? 0 : 1, transform: out ? "translateY(-8px)" : "translateY(0)",
        transition: "opacity 450ms ease, transform 450ms ease",
      }}>
        <div style={{ width: "100%", maxWidth: "380px", textAlign: "center" }}>

          {/* ── 0: Entry ── */}
          {step === 0 && (
            <>
              <div style={{ marginBottom: "16px", opacity: 0, animation: "fadeIn 2s ease 0.3s forwards" }}>
                <span style={{ fontSize: "10px", fontWeight: 300, letterSpacing: "0.3em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase" }}>
                  {vc + 241} confessions and counting
                </span>
              </div>

              <h1 style={{ fontSize: "28px", fontWeight: 200, lineHeight: 2.2, letterSpacing: "0.04em", marginBottom: "56px" }}>
                {tw1.displayed}
                {!tw1.done && <span style={{ animation: "blink 1s step-end infinite", marginLeft: "2px" }}>|</span>}
                {tw1.done && <br />}
                {tw1.done && tw2.displayed}
                {tw1.done && !tw2.done && <span style={{ animation: "blink 1s step-end infinite", marginLeft: "2px" }}>|</span>}
              </h1>

              <div style={{ opacity: cta0 ? 1 : 0, transform: cta0 ? "translateY(0)" : "translateY(16px)", transition: "all 1000ms cubic-bezier(0.22,1,0.36,1)" }}>
                <button onClick={() => go(1)}
                  style={{
                    fontSize: "14px", fontWeight: 300, letterSpacing: "0.15em",
                    background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "100px", padding: "16px 64px",
                    cursor: "pointer", transition: "all 500ms ease",
                    animation: "pulse 3s ease-in-out infinite",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  覗いてみる
                </button>
              </div>
            </>
          )}

          {/* ── 1: Write (30秒で完結) ── */}
          {step === 1 && (
            <>
              <Sub><span className="a-fadeUp">leave it here</span></Sub>
              <H className="a-fadeUp d1">ここに、<br />置いていってください。</H>
              <div className="a-fadeUp d2" style={{ marginTop: "32px" }}>
                <textarea ref={ta} value={msg} onChange={(e) => setMsg(e.target.value)}
                  placeholder="誰にも見せません。" rows={5}
                  style={{ width: "100%", fontFamily: F, fontSize: "15px", fontWeight: 300, lineHeight: 2, color: "#fff", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", padding: "20px 22px", resize: "none", outline: "none", transition: "border-color 500ms ease", caretColor: "rgba(255,255,255,0.5)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }} />
                <div style={{ marginTop: "28px", opacity: msg.length > 0 ? 1 : 0, transform: msg.length > 0 ? "translateY(0)" : "translateY(8px)", transition: "all 600ms ease" }}>
                  <Pill onClick={submit} disabled={busy || !msg}>{busy ? "..." : "置いていく"}</Pill>
                </div>
              </div>
            </>
          )}

          {/* ── 2: Thanks ── */}
          {step === 2 && (
            <div className="a-scaleUp">
              <h2 style={{ fontSize: "36px", fontWeight: 200, letterSpacing: "0.15em" }}>ありがとう。</h2>
              <p style={{ marginTop: "28px", fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.5)", opacity: 0, animation: "fadeIn 800ms ease 1.5s forwards" }}>
                あなただけじゃない。
              </p>
            </div>
          )}

          {/* ── 3: Browse Categories (投稿後の体験) ── */}
          {step === 3 && (
            <>
              <Sub><span className="a-fadeUp">explore</span></Sub>
              <H className="a-fadeUp d1">みんなの悩みを覗く</H>
              <p className="a-fadeUp d2" style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", margin: "8px 0 32px" }}>
                同じ痛みを抱えている人がいる
              </p>
              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {CATEGORIES.map((c, i) => (
                  <button key={c.id} className={`a-fadeUp d${Math.min(i + 2, 5)}`}
                    onClick={() => { setCat(c.id); setVShown(0); go(4); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", padding: "18px 22px", cursor: "pointer", transition: "all 350ms ease", color: "#fff" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 400, display: "block" }}>{c.label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)", marginTop: "4px", display: "block" }}>{c.sub}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em", display: "block" }}>{c.en}</span>
                      <span style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.1)", marginTop: "4px", display: "block" }}>{SEED_COUNTS[c.id]}人</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── 4: Voices ── */}
          {step === 4 && cat && (
            <>
              <Sub><span className="a-fadeUp">you&apos;re not alone</span></Sub>
              <div className="a-fadeUp d1" style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "48px", fontWeight: 200 }}>{SEED_COUNTS[cat]}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginLeft: "6px" }}>人</span>
              </div>
              <p className="a-fadeUp d2" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "32px" }}>「{catLabel}」で悩んでいる人</p>
              <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 auto 28px" }} />
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "16px" }}>
                {SEED_VOICES[cat].slice(0, vShown).map((v, i) => (
                  <div key={i} className="a-voice" style={{ paddingLeft: "16px", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.55)" }}>{v}</p>
                  </div>
                ))}
              </div>
              {vShown >= SEED_VOICES[cat].length && (
                <div style={{ opacity: 0, animation: "fadeUp 800ms ease 0.6s forwards" }}>
                  <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.08)", margin: "32px auto 24px" }} />
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.9, marginBottom: "28px" }}>あなたの声も、<br />誰かの「俺だけじゃなかった」になる。</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                    <Pill onClick={() => go(5)}>同じ仲間を見る</Pill>
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <button onClick={() => go(3)} style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.15)"; }}>他のジャンルを見る</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── 5: Match ── */}
          {step === 5 && cat && (
            <>
              <Sub><span className="a-fadeUp">matched</span></Sub>

              <div className="a-fadeUp d1" style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "52px", fontWeight: 200, color: "rgba(139,92,246,0.8)" }}>{matchCount}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginLeft: "6px" }}>人</span>
              </div>
              <p className="a-fadeUp d2" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.8, marginBottom: "32px" }}>
                同じ「{catLabel}」で悩む仲間が見つかりました
              </p>

              <div style={{ width: "24px", height: "1px", background: "rgba(139,92,246,0.15)", margin: "0 auto 28px" }} />

              <div className="a-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button onClick={() => go(6)}
                  style={{
                    width: "100%", textAlign: "left",
                    background: "rgba(139,92,246,0.04)",
                    border: "1px solid rgba(139,92,246,0.12)",
                    borderRadius: "16px", padding: "22px 24px",
                    cursor: "pointer", transition: "all 400ms ease", color: "#fff",
                    animation: "matchGlow 3s ease-in-out infinite",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.04)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                  <span style={{ fontSize: "16px", fontWeight: 400, display: "block" }}>一緒に変わる</span>
                  <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.35)", marginTop: "6px", display: "block" }}>
                    同じ悩みの仲間と、改善チャレンジに参加する
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 300, color: "rgba(139,92,246,0.5)", marginTop: "8px", display: "block", letterSpacing: "0.12em" }}>
                    RECOVERY CHALLENGE →
                  </span>
                </button>

                <a href="https://discord.gg/placeholder" target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", width: "100%", textAlign: "left", background: "rgba(88,101,242,0.04)", border: "1px solid rgba(88,101,242,0.12)", borderRadius: "16px", padding: "22px 24px", textDecoration: "none", transition: "all 400ms ease", color: "#fff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(88,101,242,0.1)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(88,101,242,0.04)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                  <span style={{ fontSize: "16px", fontWeight: 400, display: "block" }}>まず話してみる</span>
                  <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.3)", marginTop: "6px", display: "block" }}>匿名で、同じ痛みを知ってる人と</span>
                  <span style={{ fontSize: "10px", fontWeight: 300, color: "rgba(255,255,255,0.12)", marginTop: "8px", display: "block", letterSpacing: "0.1em" }}>DISCORD →</span>
                </a>
              </div>

              <div className="a-fadeUp d4" style={{ marginTop: "24px" }}>
                <button onClick={() => go(3)} style={{ fontSize: "12px", color: "rgba(255,255,255,0.12)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.12)"; }}>他のジャンルを見る</button>
              </div>
            </>
          )}

          {/* ── 6: Recovery Challenge ── */}
          {step === 6 && (
            <>
              <Sub><span className="a-fadeUp">recovery challenge</span></Sub>
              <H className="a-fadeUp d1">改善チャレンジ</H>
              <p className="a-fadeUp d2" style={{ fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 2, margin: "16px 0 48px" }}>
                同じことで悩む人たちと<br />最初の一歩を踏み出す体験
              </p>

              <div className="a-fadeUp d3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "32px 28px", textAlign: "left" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 400, letterSpacing: "0.04em", marginBottom: "24px", textAlign: "center" }}>
                  {CHALLENGE.title}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", overflow: "hidden", marginBottom: "28px" }}>
                  {([
                    { label: "参加費", value: `${CHALLENGE.price}円` },
                    { label: "定員", value: `${CHALLENGE.capacity}名` },
                    { label: "時間", value: `${CHALLENGE.duration}分` },
                    { label: "開催形式", value: CHALLENGE.format },
                  ]).map((s) => (
                    <div key={s.label} style={{ background: "#000", padding: "16px", textAlign: "center" }}>
                      <span style={{ fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", display: "block", marginBottom: "6px" }}>{s.label}</span>
                      <span style={{ fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", display: "block", marginBottom: "14px" }}>内容</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {CHALLENGE.contents.map((c) => (
                      <div key={c} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.12)", lineHeight: 1.8 }}>・</span>
                        <span style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.04)", marginBottom: "28px" }} />

                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", display: "block", marginBottom: "14px" }}>期待できること</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {CHALLENGE.canExpect.map((c) => (
                      <div key={c} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.12)", lineHeight: 1.8 }}>・</span>
                        <span style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.04)", marginBottom: "28px" }} />

                <div style={{ marginBottom: "28px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 400, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", display: "block", marginBottom: "14px" }}>保証できないこと</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {CHALLENGE.cannotGuarantee.map((c) => (
                      <div key={c} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.12)", lineHeight: 1.8 }}>・</span>
                        <span style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.04)", marginBottom: "28px" }} />

                <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 2, textAlign: "center", marginBottom: "32px" }}>
                  ただし<br />
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>何も変わらない日常を<br />少し前に進めることを目指す</span>
                </p>

                <a href={CHALLENGE.bookUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "8px",
                    fontSize: "14px", fontWeight: 400, letterSpacing: "0.08em",
                    background: "rgba(6,199,85,0.08)", border: "1px solid rgba(6,199,85,0.2)",
                    borderRadius: "100px", padding: "16px",
                    color: "rgba(255,255,255,0.85)", textDecoration: "none",
                    transition: "all 400ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(6,199,85,0.18)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(6,199,85,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(6,199,85,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; e.currentTarget.style.borderColor = "rgba(6,199,85,0.2)"; }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .348-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .349-.281.63-.63.63h-2.386c-.345 0-.627-.281-.627-.63V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.627-.631.627-.346 0-.626-.283-.626-.627V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.627-.631.627-.345 0-.627-.283-.627-.627V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.627H4.917c-.345 0-.63-.283-.63-.627V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .346-.281.63-.629.63M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                  LINEで予約する
                </a>
                <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.15)", marginTop: "12px", textAlign: "center", lineHeight: 1.8 }}>
                  友だち追加後「チャレンジ参加」と送信
                </p>
              </div>

              <div className="a-fadeUp d4" style={{ marginTop: "28px" }}>
                <button onClick={() => go(5)} style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.15)"; }}>← 戻る</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
