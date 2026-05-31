"use client";

import DiagnosisFlow from "@/components/DiagnosisFlow";
import { faceIntro, faceQuestions, faceResults } from "@/lib/diagnosis/face-data";

export default function FaceDiagnosisPage() {
  return (
    <DiagnosisFlow
      title="顔タイプ診断"
      diagnosisKey="face"
      intro={faceIntro}
      questions={faceQuestions}
      results={faceResults}
      accentColor="#8b5cf6"
    />
  );
}
