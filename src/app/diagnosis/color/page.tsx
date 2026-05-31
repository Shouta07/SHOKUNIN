"use client";

import DiagnosisFlow from "@/components/DiagnosisFlow";
import { colorQuestions, colorResults } from "@/lib/diagnosis/color-data";

export default function ColorDiagnosisPage() {
  return (
    <DiagnosisFlow
      title="パーソナルカラー診断"
      questions={colorQuestions}
      results={colorResults}
      accentColor="#f59e0b"
    />
  );
}
