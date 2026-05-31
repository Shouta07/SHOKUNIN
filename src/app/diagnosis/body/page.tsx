"use client";

import DiagnosisFlow from "@/components/DiagnosisFlow";
import { bodyQuestions, bodyResults } from "@/lib/diagnosis/body-data";

export default function BodyDiagnosisPage() {
  return (
    <DiagnosisFlow
      title="骨格診断"
      questions={bodyQuestions}
      results={bodyResults}
      accentColor="#3b82f6"
    />
  );
}
