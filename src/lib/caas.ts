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

// ─── 施工パートナー（職人）— Uber型の多軸評価（ホスピタリティ査定） ───
export interface RatingAxes {
  skill: number;       // 技術
  hospitality: number; // 丁寧さ・ホスピタリティ
  punctual: number;    // 時間厳守
  clean: number;       // 現場の清潔さ
}
export interface Craftsman {
  id: string;
  name: string;
  initial: string;
  rating: number;      // 総合
  reviews: number;
  area: string;
  years: number;
  specialties: string[];
  blurb: string;
  color: string;
  axes: RatingAxes;
  badges: string[];    // 認定スキル（動画マニュアル修了で付与）
  level: string;       // ホスピタリティ・ランク
  hospitalityQuote: string;
}

export const RATING_AXES: { key: keyof RatingAxes; label: string; icon: string }[] = [
  { key: "skill", label: "技術", icon: "🛠" },
  { key: "hospitality", label: "丁寧さ", icon: "🤝" },
  { key: "punctual", label: "時間厳守", icon: "⏱" },
  { key: "clean", label: "清潔さ", icon: "✨" },
];

export const CRAFTSMEN: Craftsman[] = [
  { id: "t1", name: "田中 / 田中電設", initial: "田", rating: 4.9, reviews: 127, area: "東京・神奈川", years: 12, specialties: ["防犯カメラ", "配線"], blurb: "説明が丁寧で早い、と高評価。", color: "#2f6bed",
    axes: { skill: 4.9, hospitality: 5.0, punctual: 4.8, clean: 4.9 }, badges: ["防犯カメラ設置 認定", "高所作業 認定"], level: "ゴールド", hospitalityQuote: "「作業前後の説明が本当に丁寧でした」" },
  { id: "t2", name: "佐藤 / サトウ工房", initial: "佐", rating: 4.8, reviews: 89, area: "東京・埼玉", years: 8, specialties: ["IoT機器", "電気工事"], blurb: "細かい要望にも柔軟に対応。", color: "#0ea5a4",
    axes: { skill: 4.9, hospitality: 4.7, punctual: 4.9, clean: 4.6 }, badges: ["IoT機器 認定", "電気工事士"], level: "シルバー", hospitalityQuote: "「無理なお願いにも笑顔で対応してくれた」" },
  { id: "t3", name: "鈴木 / 鈴木設備", initial: "鈴", rating: 5.0, reviews: 43, area: "東京23区", years: 15, specialties: ["カメラ", "エアコン"], blurb: "現場をいつもきれいに残す。", color: "#7c5cff",
    axes: { skill: 5.0, hospitality: 4.9, punctual: 5.0, clean: 5.0 }, badges: ["防犯カメラ設置 認定", "エアコン設置 認定", "接客マナー 認定"], level: "プラチナ", hospitalityQuote: "「帰った後、来たのが分からないほどきれいだった」" },
];

// ─── 日程調整（調整さん型・空き枠グリッド） ───
export const DAYS = [
  { id: "d1", label: "6/28", dow: "土" },
  { id: "d2", label: "6/29", dow: "日" },
  { id: "d3", label: "6/30", dow: "月" },
  { id: "d4", label: "7/1", dow: "火" },
  { id: "d5", label: "7/2", dow: "水" },
];
export const BANDS = [
  { id: "am", label: "午前", time: "9:00–12:00" },
  { id: "pm", label: "午後", time: "13:00–16:00" },
  { id: "eve", label: "夕方", time: "16:00–19:00" },
];
// 各枠に空いている職人数（0=×, 1=△, 2以上=○）
export const AVAILABILITY: Record<string, Record<string, number>> = {
  d1: { am: 3, pm: 2, eve: 0 },
  d2: { am: 1, pm: 3, eve: 2 },
  d3: { am: 0, pm: 1, eve: 1 },
  d4: { am: 2, pm: 2, eve: 3 },
  d5: { am: 3, pm: 0, eve: 1 },
};

export function fmtSlot(slotId: string): string {
  const [d, b] = slotId.split("|");
  const day = DAYS.find((x) => x.id === d);
  const band = BANDS.find((x) => x.id === b);
  if (!day || !band) return slotId;
  return `${day.label}(${day.dow}) ${band.label} ${band.time}`;
}

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
export const fmtYen = (n: number) => "¥" + n.toLocaleString("ja-JP");

// ─── 職人向け 動画マニュアル（tebiki型）× スキル可視化（skill-puzzle型） ───
export interface VideoModule { id: string; title: string; duration: string; done: boolean; }
export interface SkillCategory { id: string; label: string; icon: string; modules: VideoModule[]; }

export const SKILL_CATEGORIES: SkillCategory[] = [
  { id: "camera", label: "防犯カメラ設置", icon: "📹", modules: [
    { id: "c1", title: "設置場所の選定と画角の基本", duration: "6分", done: true },
    { id: "c2", title: "配線の隠蔽ルート敷設", duration: "9分", done: true },
    { id: "c3", title: "クラウド接続・アプリ初期設定", duration: "7分", done: true },
    { id: "c4", title: "屋外設置の防水処理", duration: "8分", done: false },
  ]},
  { id: "hospitality", label: "接客・ホスピタリティ", icon: "🤝", modules: [
    { id: "h1", title: "訪問時の挨拶と身だしなみ", duration: "4分", done: true },
    { id: "h2", title: "作業前後の説明の仕方", duration: "5分", done: true },
    { id: "h3", title: "養生と現場をきれいに保つ", duration: "6分", done: false },
    { id: "h4", title: "クレームを生まない一言", duration: "5分", done: false },
  ]},
  { id: "safety", label: "安全・高所作業", icon: "🦺", modules: [
    { id: "s1", title: "脚立・はしごの安全確認", duration: "5分", done: true },
    { id: "s2", title: "電源まわりの感電防止", duration: "7分", done: false },
  ]},
];

export function skillProgress(cat: SkillCategory): number {
  if (cat.modules.length === 0) return 0;
  return Math.round(cat.modules.filter((m) => m.done).length / cat.modules.length * 100);
}
