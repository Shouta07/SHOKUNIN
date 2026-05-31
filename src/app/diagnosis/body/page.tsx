"use client";

import DiagnosisFlow from "@/components/DiagnosisFlow";
import { bodyIntro, bodyQuestions, bodyResults } from "@/lib/diagnosis/body-data";

export default function BodyDiagnosisPage() {
  return (
    <DiagnosisFlow
      title="骨格診断"
      intro={bodyIntro}
      questions={bodyQuestions}
      results={bodyResults}
      accentColor="#3b82f6"
    />
  );
}
