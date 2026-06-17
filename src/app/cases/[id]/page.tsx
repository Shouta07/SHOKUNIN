"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import {
  C, SANS, SERIF, getCaseById, fmtCost, fmtDuration,
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
  const c = getCaseById(id);
  if (!c) return notFound();

  return (
    <div style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px 120px" }}>

        {/* Back */}
        <Link href="/cases" style={{ fontSize: "13px", color: C.sub, textDecoration: "none", display: "inline-block", marginBottom: "32px" }}>
          ← 改善事例一覧
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 500, color: C.accent, background: C.accentSoft, padding: "5px 12px", borderRadius: "100px" }}>
              {c.categoryLabel}
            </span>
            <span style={{ fontSize: "12px", color: C.faint }}>{c.ageBand}・{c.gender}・重症度{c.severity}</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: 500, lineHeight: 1.5 }}>
            {c.title}
          </h1>
        </div>

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

        {/* CTA */}
        <div style={{ marginTop: "56px", textAlign: "center", padding: "40px 24px", background: C.surface, border: `1px solid ${C.line}`, borderRadius: "20px" }}>
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
