"use client";

import Link from "next/link";
import { C, SANS, SERIF } from "@/lib/recovery";

const STEPS = [
  { n: "01", title: "まず、似た人を検索する", desc: "年齢・悩み・期間・費用で、あなたと似た人の改善体験を探す。" },
  { n: "02", title: "改善のプロセスを見る", desc: "完璧な成功談ではなく、失敗も遠回りも含めた本当の記録。" },
  { n: "03", title: "私も挑戦する", desc: "見た後に参加。Before写真を匿名で記録し、100日が始まる。" },
  { n: "04", title: "変化を記録し続ける", desc: "節目ごとに写真・ケア・気持ちを記録。AIが毎回そっと寄り添う。" },
  { n: "05", title: "あなたの記録が、誰かの地図に", desc: "希望すれば匿名症例として公開。次に悩む誰かの希望になる。" },
];

export default function RecoveryLP() {
  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>

      {/* Hero */}
      <section style={{ minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 28px 60px", textAlign: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.3em", color: C.accent, marginBottom: "32px" }}>
          HIS RECOVERIES
        </span>
        <h1 style={{ fontFamily: SERIF, fontSize: "32px", fontWeight: 500, letterSpacing: "0.01em", lineHeight: 1.5, marginBottom: "24px" }}>
          あなたと同じ悩みを持った人は、<br />どうやって前に進んだのか。
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: C.sub, lineHeight: 2, maxWidth: "340px", marginBottom: "48px" }}>
          改善とは、昨日より少し自由になること。<br />
          His Recoveriesは、改善体験を検索可能にする。
        </p>

        <Link href="/cases" style={{
          fontSize: "14px", fontWeight: 500, letterSpacing: "0.1em",
          background: C.accent, color: "#fff", borderRadius: "100px", padding: "18px 56px", textDecoration: "none",
        }}>
          改善事例を検索する
        </Link>
        <Link href="/recovery/join" style={{ fontSize: "13px", color: C.sub, marginTop: "20px", textDecoration: "underline" }}>
          先に挑戦から始める
        </Link>
      </section>

      {/* Concept */}
      <section style={{ padding: "72px 28px", maxWidth: "560px", margin: "0 auto", textAlign: "center", borderTop: `1px solid ${C.line}` }}>
        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.faint }}>CONCEPT</span>
        <h2 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 500, lineHeight: 1.7, margin: "24px 0" }}>
          あなたの記録が、<br />誰かの希望になる。
        </h2>
        <p style={{ fontSize: "14px", fontWeight: 300, color: C.sub, lineHeight: 2.2 }}>
          ユーザーは情報を探しているのではない。<br />
          「自分と似た人がどう改善したか」を探している。<br /><br />
          GoogleがWebを、Tripadvisorが旅を検索可能にしたように、<br />
          His Recoveriesは改善体験を検索可能にする。
        </p>
      </section>

      {/* How it works */}
      <section style={{ padding: "60px 28px 80px", maxWidth: "560px", margin: "0 auto", borderTop: `1px solid ${C.line}` }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.faint }}>HOW IT WORKS</span>
          <h2 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 500, margin: "20px 0 0" }}>検索し、比較し、挑戦する</h2>
        </div>
        <div>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: "flex", gap: "20px", padding: "26px 0", borderBottom: i < STEPS.length - 1 ? `1px solid ${C.lineSoft}` : "none" }}>
              <span style={{ fontSize: "12px", fontWeight: 500, color: C.accent, minWidth: "24px", paddingTop: "2px" }}>{s.n}</span>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 500, display: "block", marginBottom: "6px" }}>{s.title}</span>
                <span style={{ fontSize: "13px", fontWeight: 300, color: C.sub, lineHeight: 1.8 }}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community philosophy */}
      <section style={{ padding: "60px 28px 80px", maxWidth: "560px", margin: "0 auto", textAlign: "center", borderTop: `1px solid ${C.line}` }}>
        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.25em", color: C.faint }}>OUR PRINCIPLE</span>
        <h2 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 500, lineHeight: 1.7, margin: "24px 0" }}>
          人を追わない。<br />変化を追う。
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "28px" }}>
          {["フォローなし", "ランキングなし", "いいね競争なし", "承認ではなく改善"].map((t) => (
            <span key={t} style={{ fontSize: "12px", color: C.sub, border: `1px solid ${C.line}`, borderRadius: "100px", padding: "8px 18px" }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "72px 28px 100px", textAlign: "center", borderTop: `1px solid ${C.line}` }}>
        <p style={{ fontFamily: SERIF, fontSize: "20px", lineHeight: 1.7, marginBottom: "32px" }}>
          人は検索する。比較する。<br />挑戦する。改善する。<br />そして次の誰かの希望になる。
        </p>
        <Link href="/cases" style={{
          display: "inline-block", fontSize: "14px", fontWeight: 500, letterSpacing: "0.1em",
          background: C.accent, color: "#fff", borderRadius: "100px", padding: "18px 56px", textDecoration: "none",
        }}>
          改善事例を検索する
        </Link>
      </section>

    </div>
  );
}
