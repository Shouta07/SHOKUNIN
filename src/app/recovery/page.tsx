"use client";

import Link from "next/link";

const F = "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif";

const STEPS = [
  { n: "01", title: "参加登録", desc: "ニックネームと悩みカテゴリを選択。個人情報は不要。" },
  { n: "02", title: "Before写真を記録", desc: "今の状態を1枚撮影。あなただけが見れる、変化の起点。" },
  { n: "03", title: "100日間、記録を続ける", desc: "Day 7, 14, 30, 60, 100 の節目に写真とケアを記録。" },
  { n: "04", title: "改善レポートが届く", desc: "Before/Afterの比較と変化の可視化。あなた専用のレポート。" },
  { n: "05", title: "匿名症例として公開", desc: "希望者のみ。あなたの記録が、次に悩む誰かの地図になる。" },
];

const PROMISES = [
  { text: "写真は暗号化して保存。本人以外アクセス不可。", icon: "🔒" },
  { text: "匿名公開は完全任意。非公開のまま完走できる。", icon: "👤" },
  { text: "改善しなくても、継続そのものを記録として称賛する。", icon: "📝" },
];

const FAQ = [
  { q: "写真は誰かに見られますか？", a: "いいえ。匿名公開を選ばない限り、あなた以外の誰も見ることはできません。" },
  { q: "途中で辞められますか？", a: "はい。いつでも辞められます。記録は残りますが、削除も可能です。" },
  { q: "改善しなかったらどうなりますか？", a: "何も変わりません。記録と継続そのものに価値があると考えています。" },
  { q: "背中ニキビ以外のテーマはありますか？", a: "Season 1は背中ニキビです。Season 2以降、他のテーマを予定しています。" },
];

export default function RecoveryLP() {
  return (
    <div style={{ fontFamily: F, color: "#fff" }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100dvh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 28px 60px",
        textAlign: "center",
        position: "relative",
        background: "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(30,15,60,0.3) 0%, transparent 70%)",
      }}>
        <span style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "0.4em", color: "rgba(139,92,246,0.5)", marginBottom: "32px" }}>
          RECOVERY CHALLENGE · SEASON 1
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: 200, letterSpacing: "0.06em", lineHeight: 1.8, marginBottom: "24px" }}>
          100日後、<br />別人になれるか。
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 2, maxWidth: "320px", marginBottom: "48px" }}>
          恥ずかしかったBeforeを、<br />未来の誰かの地図に変える。
        </p>

        <div style={{ display: "flex", gap: "24px", marginBottom: "48px" }}>
          {[
            { label: "期間", value: "100日" },
            { label: "テーマ", value: "背中ニキビ" },
            { label: "定員", value: "100名" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", display: "block", marginBottom: "6px" }}>{s.label}</span>
              <span style={{ fontSize: "18px", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>{s.value}</span>
            </div>
          ))}
        </div>

        <Link href="/recovery/join"
          style={{
            fontSize: "14px", fontWeight: 400, letterSpacing: "0.12em",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "100px", padding: "18px 56px",
            color: "#fff", textDecoration: "none",
            transition: "all 400ms ease",
          }}>
          チャレンジに参加する
        </Link>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", marginTop: "16px", letterSpacing: "0.1em" }}>
          無料 · 匿名 · いつでも辞められる
        </p>
      </section>

      {/* ── Concept ── */}
      <section style={{ padding: "80px 28px", maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(255,255,255,0.15)" }}>CONCEPT</span>
        <h2 style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 2, margin: "24px 0" }}>
          あなたの記録が、<br />誰かの希望になる。
        </h2>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 2.2 }}>
          誰にも見せられなかった身体の悩みを、<br />
          100日間の改善チャレンジとして記録する。<br /><br />
          改善してもしなくても、<br />
          記録すること自体に意味がある。<br /><br />
          そしてその記録は、<br />
          同じ悩みを抱える誰かにとって<br />
          「自分だけじゃなかった」という希望になる。
        </p>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "60px 28px 80px", maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(255,255,255,0.15)" }}>HOW IT WORKS</span>
          <h2 style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.8, margin: "24px 0 0" }}>
            参加の流れ
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              display: "flex", gap: "20px", padding: "28px 0",
              borderBottom: i < STEPS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 400, color: "rgba(139,92,246,0.4)", letterSpacing: "0.1em", minWidth: "24px", paddingTop: "2px" }}>{s.n}</span>
              <div>
                <span style={{ fontSize: "15px", fontWeight: 400, display: "block", marginBottom: "6px" }}>{s.title}</span>
                <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Before Photo ── */}
      <section style={{ padding: "60px 28px 80px", maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(255,255,255,0.15)" }}>ABOUT PHOTOS</span>
        <h2 style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.8, margin: "24px 0 36px" }}>
          写真を撮ることは、<br />変化の証拠を残すこと。
        </h2>

        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px", padding: "32px 24px", textAlign: "left",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 2.2, marginBottom: "28px" }}>
            「恥ずかしくて撮れない」<br />
            その気持ちを知っています。<br /><br />
            だから写真は、<br />
            あなた以外の誰にも見せません。<br /><br />
            100日後に振り返ったとき、<br />
            その1枚が変化の証拠になる。
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {PROMISES.map((p) => (
              <div key={p.text} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "14px" }}>{p.icon}</span>
                <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Report ── */}
      <section style={{ padding: "60px 28px 80px", maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(255,255,255,0.15)" }}>AFTER 100 DAYS</span>
        <h2 style={{ fontSize: "20px", fontWeight: 200, letterSpacing: "0.04em", lineHeight: 1.8, margin: "24px 0 36px" }}>
          あなた専用の<br />改善レポートが届く。
        </h2>

        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px", padding: "32px 24px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
            {[
              { title: "Before / After 比較", desc: "Day 0 と Day 100 の写真を並べて変化を可視化" },
              { title: "変化グラフ", desc: "赤み・範囲・自己評価の推移を3軸で表示" },
              { title: "100日間の記録", desc: "やったケア、食事、睡眠、すべての記録をまとめて" },
              { title: "匿名症例として公開", desc: "希望者のみ。個人が特定されないUIで安全に公開" },
            ].map((r) => (
              <div key={r.title}>
                <span style={{ fontSize: "14px", fontWeight: 400, display: "block", marginBottom: "4px" }}>{r.title}</span>
                <span style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "60px 28px 80px", maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.35em", color: "rgba(255,255,255,0.15)" }}>FAQ</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {FAQ.map((f, i) => (
            <div key={i} style={{
              padding: "24px 0",
              borderBottom: i < FAQ.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <p style={{ fontSize: "14px", fontWeight: 400, marginBottom: "8px" }}>{f.q}</p>
              <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: "80px 28px 100px", textAlign: "center",
        background: "radial-gradient(ellipse 100% 60% at 50% 70%, rgba(30,15,60,0.2) 0%, transparent 70%)",
      }}>
        <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.3)", lineHeight: 2, marginBottom: "36px" }}>
          変わるかどうかは、わからない。<br />
          でも記録することはできる。<br /><br />
          その記録が、<br />
          未来の誰かの一歩目になる。
        </p>
        <Link href="/recovery/join"
          style={{
            display: "inline-block",
            fontSize: "14px", fontWeight: 400, letterSpacing: "0.12em",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "100px", padding: "18px 56px",
            color: "#fff", textDecoration: "none",
            transition: "all 400ms ease",
          }}>
          チャレンジに参加する
        </Link>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)", marginTop: "16px", letterSpacing: "0.1em" }}>
          Season 1 · 100名限定 · 無料
        </p>
      </section>

    </div>
  );
}
