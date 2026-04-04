/** 職人プロフィール */
export interface CraftsmanProfile {
  id: string;
  user_id: string;
  display_name: string;
  specialty: string; // 例: "エアコン設置", "電気工事"
  bio: string;
  avatar_url: string | null;
  latitude: number | null;
  longitude: number | null;
  service_radius_km: number; // 対応可能エリア半径
  rating: number;
  review_count: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

/** 施工パッケージ（出品） */
export interface ServicePackage {
  id: string;
  craftsman_id: string;
  title: string;
  description: string;
  description_html: string;
  price: number; // 円
  duration_minutes: number; // 施工目安時間
  category: string;
  tags: string[];
  schema_json_ld: Record<string, unknown>; // Schema.org JSON-LD
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** 動画コース */
export interface Course {
  id: string;
  craftsman_id: string;
  title: string;
  description: string;
  price: number;
  thumbnail_url: string | null;
  schema_json_ld: Record<string, unknown>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/** コースのチャプター */
export interface CourseChapter {
  id: string;
  course_id: string;
  title: string;
  video_path: string; // Supabase Storage path
  duration_seconds: number;
  sort_order: number;
  created_at: string;
}

/** 学習進捗 */
export interface LearningProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  course_id: string;
  watched_seconds: number;
  is_completed: boolean;
  updated_at: string;
}

/** 注文 */
export interface Order {
  id: string;
  customer_id: string;
  craftsman_id: string;
  service_package_id: string;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  scheduled_date: string | null;
  total_price: number;
  completion_photo_url: string | null;
  invoice_pdf_url: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "authorized"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "invoiced"
  | "paid"
  | "cancelled";

/** コース購入 */
export interface CoursePurchase {
  id: string;
  user_id: string;
  course_id: string;
  stripe_payment_intent_id: string;
  created_at: string;
}

// =============================================
// 人工見積AI 型定義
// =============================================

/** 職種別単価マスタ */
export interface UnitPrice {
  id: string;
  user_id: string;
  job_type: string;
  base_price: number;
  cost_price: number;
  night_multiplier: number;
  overtime_multiplier: number;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** 案件 */
export interface Project {
  id: string;
  user_id: string;
  name: string;
  client_name: string;
  site_address: string;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = "draft" | "submitted" | "accepted" | "rejected" | "completed";

/** 見積書 */
export interface Estimate {
  id: string;
  user_id: string;
  project_id: string | null;
  estimate_number: string;
  title: string;
  client_name: string;
  issue_date: string;
  valid_until: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  cost_total: number;
  gross_profit: number;
  gross_margin: number;
  notes: string;
  status: EstimateStatus;
  created_at: string;
  updated_at: string;
  items?: EstimateItem[];
}

export type EstimateStatus = "draft" | "submitted" | "accepted" | "rejected";

/** 見積明細行 */
export interface EstimateItem {
  id: string;
  estimate_id: string;
  sort_order: number;
  job_type: string;
  workers: number;
  days: number;
  unit_price: number;
  cost_price: number;
  amount: number;
  cost_amount: number;
  notes: string;
  created_at: string;
}
