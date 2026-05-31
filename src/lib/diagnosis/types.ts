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

export interface DiagnosisIntro {
  headline: string;
  problem: string;
  solution: string;
  benefits: { icon: string; text: string }[];
  closingHook: string;
}

export interface FashionItem {
  item: string;
  reason: string;
}

export interface DiagnosisResult {
  type: string;
  label: string;
  description: string;
  features: string[];
  fashion: FashionItem[];
  ngItems: FashionItem[];
  celebrities: string[];
  products: ProductRecommendation[];
  salonCta: SalonCta;
}
