"use client";

import DiagnosisFlow from "@/components/DiagnosisFlow";
import { faceQuestions, faceResults } from "@/lib/diagnosis/face-data";

export default function FaceDiagnosisPage() {
  return (
    <DiagnosisFlow
      title="顔タイプ診断"
      questions={faceQuestions}
      results={faceResults}
      accentColor="#8b5cf6"
    />
  );
}
