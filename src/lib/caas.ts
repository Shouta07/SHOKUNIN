// CaaS (Construction as a Service) — プロトタイプ用 共有モジュール
// エンド顧客の「予約 → 施工ライブ進捗 → 完了 → メンテ再依頼」体験のデータ層。

export const C = {
  bg: "#f5f7fa",
  surface: "#ffffff",
  ink: "#15202b",
  sub: "#5a6673",
  faint: "#9aa4b0",
  line: "rgba(21,32,43,0.10)",
  lineSoft: "rgba(21,32,43,0.055)",
  accent: "#2f6bed",       // trust blue
  accentSoft: "#e9effe",
  live: "#e5484d",         // 現場LIVE
  ok: "#2fa96b",           // 完了
  amber: "#f59e0b",        // 注意・保証
};

export const SANS = "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif";

// ─── サービス（Safie現場に寄せた工事種別） ───
export interface Service {
  id: string;
  label: string;
  icon: string;
  price: number;       // 目安（税込）
  duration: string;
  desc: string;
}

export const SERVICES: Service[] = [
  { id: "camera", label: "防犯カメラ設置", icon: "📹", price: 38000, duration: "約2時間", desc: "屋内外カメラの設置・クラウド接続・アプリ設定まで。" },
  { id: "camera_add", label: "カメラ増設", icon: "➕", price: 22000, duration: "約1時間", desc: "既存システムへのカメラ追加と画角調整。" },
  { id: "sensor", label: "センサー・IoT機器", icon: "📡", price: 28000, duration: "約1.5時間", desc: "各種センサー・IoT機器の取付と動作確認。" },
  { id: "aircon", label: "エアコン設置", icon: "❄️", price: 16000, duration: "約2時間", desc: "取付・配管・試運転まで一括対応。" },
  { id: "electric", label: "電気・配線工事", icon: "🔌", price: 24000, duration: "約2時間", desc: "コンセント増設・LAN配線・電源工事。" },
];

// ─── 施工パートナー（職人） ───
export interface Craftsman {
  id: string;
  name: string;
  initial: string;
  rating: number;
  reviews: number;
  area: string;
  years: number;
  specialties: string[];
  blurb: string;
  color: string;
}

export const CRAFTSMEN: Craftsman[] = [
  { id: "t1", name: "田中 / 田中電設", initial: "田", rating: 4.9, reviews: 127, area: "東京・神奈川", years: 12, specialties: ["防犯カメラ", "配線"], blurb: "説明が丁寧で早い、と高評価。", color: "#2f6bed" },
  { id: "t2", name: "佐藤 / サトウ工房", initial: "佐", rating: 4.8, reviews: 89, area: "東京・埼玉", years: 8, specialties: ["IoT機器", "電気工事"], blurb: "細かい要望にも柔軟に対応。", color: "#0ea5a4" },
  { id: "t3", name: "鈴木 / 鈴木設備", initial: "鈴", rating: 5.0, reviews: 43, area: "東京23区", years: 15, specialties: ["カメラ", "エアコン"], blurb: "現場をいつもきれいに残す。", color: "#7c5cff" },
];

// ─── 予約枠 ───
export const SLOTS = [
  { id: "s1", day: "明日 (火)", time: "10:00 – 12:00" },
  { id: "s2", day: "明日 (火)", time: "14:00 – 16:00" },
  { id: "s3", day: "明後日 (水)", time: "09:00 – 11:00" },
  { id: "s4", day: "明後日 (水)", time: "13:00 – 15:00" },
  { id: "s5", day: "木曜", time: "10:00 – 12:00" },
];

// ─── プロジェクト（案件）状態 ───
export type StageId = "booked" | "pre" | "live" | "done" | "maintenance";

export const STAGES: { id: StageId; label: string; short: string }[] = [
  { id: "booked", label: "予約完了", short: "予約" },
  { id: "pre", label: "訪問前の準備", short: "準備" },
  { id: "live", label: "施工中（現場LIVE）", short: "施工" },
  { id: "done", label: "完了・お引渡し", short: "完了" },
  { id: "maintenance", label: "メンテナンス", short: "保守" },
];

// 施工中のタイムライン（写真＋進捗）
export const LIVE_TIMELINE: { time: string; label: string; pct: number }[] = [
  { time: "10:02", label: "職人が到着しました", pct: 5 },
  { time: "10:10", label: "設置場所の最終確認・養生", pct: 20 },
  { time: "10:35", label: "配線ルートの敷設", pct: 45 },
  { time: "11:05", label: "カメラ本体の取付", pct: 70 },
  { time: "11:30", label: "クラウド接続・アプリ設定", pct: 90 },
  { time: "11:48", label: "動作確認・お客様へご説明", pct: 100 },
];

export interface Project {
  id: string;
  serviceId: string;
  craftsmanId: string;
  slotId: string;
  stage: number;      // index into STAGES
  createdAt: string;
}

const KEY = "caas_project";

export function getProject(): Project | null {
  if (typeof window === "undefined") return null;
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) as Project : null; } catch { return null; }
}
export function saveProject(p: Project): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}
export function clearProject(): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(KEY); } catch {}
}

export const getService = (id: string) => SERVICES.find((s) => s.id === id);
export const getCraftsman = (id: string) => CRAFTSMEN.find((c) => c.id === id);
export const getSlot = (id: string) => SLOTS.find((s) => s.id === id);
export const fmtYen = (n: number) => "¥" + n.toLocaleString("ja-JP");
