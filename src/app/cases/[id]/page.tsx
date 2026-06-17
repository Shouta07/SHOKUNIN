"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  C, SANS, SERIF, getCaseById, fmtCost, fmtDuration, SOLUTION_FLOW,
  type CaseRecord,
} from "@/lib/recovery";

// 安心感のあるBefore/After表示。写真は大きく扱いすぎず、抽象的なプレースホルダで。
function PhotoFrame({ label, degree }: { label: string; degree?: number }) {
  const after = label === "After";
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        aspectRatio: "3/4", borderRadius: "12px", overflow: "hidden",
        background: after
          ? "linear-gradient(160deg, #e8ebe6 0%, #dde3da 100%)"
          : "linear-gradient(160deg, #ece8e2 0%, #e3ddd4 100%)",
        border: `1px solid ${C.line}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", color: C.faint }}>
          {label.toUpperCase()}
        </span>
        {after && degree !== undefined && (
          <span style={{
            position: "absolute", bottom: "10px", right: "10px",
            fontSize: "11px", fontWeight: 500, color: C.accent,
            background: "rgba(255,255,255,0.8)", padding: "4px 10px", borderRadius: "100px",
          }}>
            改善度 {degree}%
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h3 style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.15em", color: C.faint, textTransform: "uppercase", marginBottom: "16px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // 公開済み症例はlocalStorageにあるためマウント後に解決する（SSRで404にしない）
  const [c, setC] = useState<CaseRecord | null | undefined>(undefined);
  useEffect(() => { setC(getCaseById(id) ?? null); }, [id]);

  if (c === undefined) {
    return <div style={{ minHeight: "100dvh", background: C.bg }} />;
  }

  if (c === null) {
    return (
      <div style={{ fontFamily: SANS, color: C.ink, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontSize: "18px", marginBottom: "20px" }}>この症例は見つかりませんでした</p>
          <Link href="/cases" style={{ fontSize: "14px", color: "#fff", background: C.accent, borderRadius: "100px", padding: "14px 36px", textDecoration: "none" }}>改善事例一覧へ</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px 120px" }}>

        {/* Back */}
        <Link href="/cases" style={{ fontSize: "13px", color: C.sub, textDecoration: "none", display: "inline-block", marginBottom: "32px" }}>
          ← 改善事例一覧
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, color: C.accent, background: C.accentSoft, padding: "5px 12px", borderRadius: "100px" }}>
              {c.categoryLabel}
            </span>
            {c.verified && <span style={{ fontSize: "10px", fontWeight: 500, color: C.accent, border: `1px solid ${C.accent}`, borderRadius: "100px", padding: "4px 10px" }}>✓ 検証済み</span>}
            <span style={{ fontSize: "12px", color: C.faint }}>{c.ageBand}・{c.gender}・重症度{c.severity}</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 500, lineHeight: 1.5 }}>
            {c.title}
          </h1>
        </div>

        {/* Clinic / procedure — 口コミより深い核 */}
        {(c.clinic || c.procedure || c.worthIt !== undefined) && (
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "20px 22px", marginBottom: "28px" }}>
            {c.procedure && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: c.clinic || c.worthIt !== undefined ? "12px" : 0 }}>
                <span style={{ fontSize: "12px", color: C.faint }}>受けた施術・方法</span>
                <span style={{ fontSize: "13px", color: C.ink, textAlign: "right", flex: 1 }}>{c.procedure}</span>
              </div>
            )}
            {c.clinic && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: c.worthIt !== undefined ? "12px" : 0 }}>
                <span style={{ fontSize: "12px", color: C.faint }}>場所</span>
                <span style={{ fontSize: "13px", color: C.ink, textAlign: "right", flex: 1 }}>{c.clinic}</span>
              </div>
            )}
            {c.worthIt !== undefined && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: C.faint }}>また受けるか</span>
                <span style={{ fontSize: "13px", fontWeight: 500, color: c.worthIt ? C.accent : C.sub, textAlign: "right", flex: 1 }}>
                  {c.worthIt ? "はい、また受ける" : "いいえ"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Before / After */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <PhotoFrame label="Before" />
          <PhotoFrame label="After" degree={c.improvementDegree} />
        </div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          <p style={{ flex: 1, fontSize: "12px", color: C.sub, lineHeight: 1.7 }}>{c.beforeNote}</p>
          <p style={{ flex: 1, fontSize: "12px", color: C.sub, lineHeight: 1.7 }}>{c.afterNote}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: C.line, borderRadius: "12px", overflow: "hidden", marginBottom: "44px" }}>
          {[
            { label: "改善期間", value: fmtDuration(c.durationDays) },
            { label: "費用", value: fmtCost(c.cost) },
            { label: "改善度", value: `${c.improvementDegree}%` },
          ].map((m) => (
            <div key={m.label} style={{ background: C.surface, padding: "18px 8px", textAlign: "center" }}>
              <span style={{ fontSize: "10px", color: C.faint, display: "block", marginBottom: "6px" }}>{m.label}</span>
              <span style={{ fontSize: "16px", fontWeight: 500, fontFamily: SERIF }}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* What they did */}
        <Section title="やったこと">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {c.whatTheyDid.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: C.accent, fontSize: "13px", lineHeight: 1.7 }}>—</span>
                <span style={{ fontSize: "14px", color: C.ink, lineHeight: 1.7 }}>{w}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Failures — プロセスを見せる */}
        <Section title="失敗したこと・遠回り">
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "14px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {c.failures.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: C.faint, fontSize: "13px", lineHeight: 1.7 }}>×</span>
                <span style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7 }}>{f}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Progress timeline */}
        <Section title="途中経過">
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            <div style={{ position: "absolute", left: "5px", top: "6px", bottom: "6px", width: "1px", background: C.line }} />
            {c.progress.map((p, i) => (
              <div key={i} style={{ position: "relative", marginBottom: i < c.progress.length - 1 ? "24px" : 0 }}>
                <div style={{ position: "absolute", left: "-24px", top: "4px", width: "11px", height: "11px", borderRadius: "50%", background: C.bg, border: `2px solid ${C.accent}` }} />
                <span style={{ fontSize: "11px", fontWeight: 500, color: C.accent, letterSpacing: "0.05em" }}>Day {p.day}</span>
                <p style={{ fontSize: "14px", color: C.ink, lineHeight: 1.7, marginTop: "4px" }}>{p.note}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Emotion change */}
        <Section title="感情の変化">
          <p style={{ fontFamily: SERIF, fontSize: "16px", color: C.ink, lineHeight: 1.9, fontStyle: "italic" }}>
            {c.emotionChange}
          </p>
        </Section>

        {/* Comment */}
        <Section title="本人コメント">
          <div style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: "18px" }}>
            <p style={{ fontSize: "15px", color: C.ink, lineHeight: 1.9 }}>{c.comment}</p>
          </div>
        </Section>

        {/* Solutions / future marketplace (design only) */}
        <Section title="改善手段を探す">
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: "16px", padding: "22px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {SOLUTION_FLOW.map((s, i) => (
                <div key={s.step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "9px", color: C.faint, display: "block" }}>{s.step}</span>
                    <span style={{ fontSize: "11px", color: C.sub }}>{s.label}</span>
                  </div>
                  {i < SOLUTION_FLOW.length - 1 && <span style={{ color: C.faint, fontSize: "10px" }}>›</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", paddingTop: "14px", borderTop: `1px solid ${C.lineSoft}` }}>
              <span style={{ fontSize: "12px", color: C.faint }}>提携サロン・クリニックへの予約導線は近日公開</span>
            </div>
          </div>
        </Section>

        {/* CTA */}
        <div style={{ marginTop: "16px", textAlign: "center", padding: "40px 24px", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "20px" }}>
          <p style={{ fontFamily: SERIF, fontSize: "18px", lineHeight: 1.6, marginBottom: "8px" }}>
            あなたも、<br />誰かの地図になれる。
          </p>
          <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.8, marginBottom: "28px" }}>
            この人と同じ悩みなら、<br />あなたの100日も誰かの希望になる。
          </p>
          <Link href="/recovery/join" style={{
            display: "inline-block", fontSize: "14px", fontWeight: 500, letterSpacing: "0.08em",
            background: C.accent, color: "#fff", borderRadius: "100px", padding: "16px 48px", textDecoration: "none",
          }}>
            私も挑戦する
          </Link>
        </div>

      </div>
    </div>
  );
}
