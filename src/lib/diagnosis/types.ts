export interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    score: Record<string, number>;
  }[];
}

export interface DiagnosisResult {
  type: string;
  label: string;
  description: string;
  features: string[];
  fashion: string[];
  ngItems: string[];
  celebrities: string[];
}
