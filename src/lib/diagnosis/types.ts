export interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    score: Record<string, number>;
  }[];
}

export interface ProductRecommendation {
  name: string;
  description: string;
  price: string;
  affiliateUrl: string;
  tag: string;
}

export interface SalonCta {
  heading: string;
  description: string;
  buttonLabel: string;
  url: string;
}

export interface DiagnosisResult {
  type: string;
  label: string;
  description: string;
  features: string[];
  fashion: string[];
  ngItems: string[];
  celebrities: string[];
  products: ProductRecommendation[];
  salonCta: SalonCta;
}
