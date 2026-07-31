// CaaS (Construction as a Service) — プロトタイプ用 共有モジュール
// エンド顧客の「予約 → 施工ライブ進捗 → 完了 → メンテ再依頼」体験のデータ層。

// 見た目のトークンは src/app/globals.css の @theme に集約。
// このファイルはドメインのデータとロジックのみを持つ。

// ─── サービス（工事種別） ───
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

// ダイナミックプライシング：近日ほど高い（特急プラン）。空き枠の需給を価格に反映。
export const DAY_PRICING: Record<string, { mult: number; tag: string; color: string }> = {
  d1: { mult: 1.5, tag: "特急", color: "#e5484d" },
  d2: { mult: 1.3, tag: "特急", color: "#f59e0b" },
  d3: { mult: 1.15, tag: "やや混雑", color: "#f59e0b" },
  d4: { mult: 1.0, tag: "標準", color: "#5a6673" },
  d5: { mult: 0.9, tag: "お得", color: "#2fa96b" },
};
export function slotMultiplier(slotId: string): number {
  const d = slotId.split("|")[0];
  return DAY_PRICING[d]?.mult ?? 1;
}
export function priceForSlot(base: number, slotId: string): number {
  return Math.round(base * slotMultiplier(slotId));
}

// まとめ割引（アップセル）：点数が増えるほど安くなる
export const BUNDLE_TIERS = [
  { count: 2, rate: 0.05 },
  { count: 3, rate: 0.12 },
  { count: 4, rate: 0.18 },
  { count: 5, rate: 0.22 },
];
export function bundleRate(n: number): number {
  let r = 0;
  for (const t of BUNDLE_TIERS) if (n >= t.count) r = t.rate;
  return r;
}
// 次の割引ティアまであと何点 / その割引率
export function nextBundleTier(n: number): { need: number; rate: number } | null {
  const t = BUNDLE_TIERS.find((x) => x.count > n);
  return t ? { need: t.count - n, rate: t.rate } : null;
}

// AI完成図書（録音→自動生成のたたき）
export interface DocSection { title: string; items: string[]; }
export const AI_DOC_SECTIONS: DocSection[] = [
  { title: "実施内容", items: ["防犯カメラ 2台 設置（入口・レジ）", "クラウド録画の初期設定", "スマホアプリ連携・動作確認"] },
  { title: "使用機材・型番", items: ["屋内カメラ ×2", "PoEスイッチ 5ポート ×1", "LANケーブル CAT6 15m"] },
  { title: "お客様のご要望（録音より）", items: ["レジ手元がはっきり映るように", "夜間もカラーで見たい", "配線はできるだけ隠したい"] },
  { title: "申し送り・注意事項", items: ["屋外への増設時は防水処理が必要", "録画は30日で自動上書き設定"] },
  { title: "次回メンテナンス", items: ["6ヶ月後にレンズ清掃・画角確認を推奨"] },
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

// ─── 施工先・連絡先（派遣に必須の情報） ───
export interface Contact {
  postal: string;
  address: string;
  building: string;
  name: string;
  phone: string;
  email: string;
  parking: string;
  note: string;
}

export const EMPTY_CONTACT: Contact = {
  postal: "",
  address: "",
  building: "",
  name: "",
  phone: "",
  email: "",
  parking: "",
  note: "",
};

export const PARKING_OPTIONS = ["敷地内にあり", "近隣コインP", "なし・要相談"];

/* 検証：必須項目と形式。エラーが無ければ空オブジェクトを返す。 */
export type ContactErrors = Partial<Record<keyof Contact, string>>;

export function validateContact(c: Contact): ContactErrors {
  const e: ContactErrors = {};
  const digits = (s: string) => s.replace(/[^0-9]/g, "");

  if (!c.postal.trim()) e.postal = "郵便番号を入力してください";
  else if (digits(c.postal).length !== 7) e.postal = "7桁で入力してください";

  if (!c.address.trim()) e.address = "住所を入力してください";

  if (!c.name.trim()) e.name = "お名前を入力してください";

  if (!c.phone.trim()) e.phone = "電話番号を入力してください";
  else if (![10, 11].includes(digits(c.phone).length))
    e.phone = "10〜11桁で入力してください";

  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    e.email = "メールアドレスの形式が正しくありません";

  return e;
}

export const REQUIRED_CONTACT_FIELDS: (keyof Contact)[] = [
  "postal",
  "address",
  "name",
  "phone",
];

/* 郵便番号 → 住所。公開APIを試し、失敗時はローカル表にフォールバック。 */
const POSTAL_FALLBACK: Record<string, string> = {
  "1500043": "東京都渋谷区道玄坂",
  "1600023": "東京都新宿区西新宿",
  "1710022": "東京都豊島区南池袋",
  "1080075": "東京都港区港南",
  "2200005": "神奈川県横浜市西区南幸",
  "3300846": "埼玉県さいたま市大宮区大和田町",
};

export async function lookupPostal(raw: string): Promise<string | null> {
  const code = raw.replace(/[^0-9]/g, "");
  if (code.length !== 7) return null;
  try {
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`,
      { signal: AbortSignal.timeout(4000) },
    );
    const json = await res.json();
    const r = json?.results?.[0];
    if (r) return `${r.address1}${r.address2}${r.address3}`;
  } catch {
    /* オフライン・API不達時はフォールバック */
  }
  return POSTAL_FALLBACK[code] ?? null;
}

export interface Project {
  id: string;
  serviceId: string;
  craftsmanId: string;
  slotId: string;
  stage: number;      // index into STAGES
  createdAt: string;
  contact?: Contact;
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

// ─── 多拠点 一括日程調整（法人アカウント）× CSVエクスポート（kintone連携） ───
export type SiteStatus = "未定" | "調整中" | "確定" | "完了";
export const SITE_STATUSES: SiteStatus[] = ["未定", "調整中", "確定", "完了"];

export interface Site {
  id: string;
  name: string;
  address: string;
  serviceId: string;
  slotId: string;      // `${dayId}|${bandId}` or ""
  craftsmanId: string; // or ""
  status: SiteStatus;
}

export const SITES: Site[] = [
  { id: "st1", name: "渋谷店", address: "東京都渋谷区道玄坂1-2-3", serviceId: "camera", slotId: "d1|pm", craftsmanId: "t1", status: "確定" },
  { id: "st2", name: "新宿東口店", address: "東京都新宿区新宿3-1-1", serviceId: "camera_add", slotId: "d2|am", craftsmanId: "t2", status: "調整中" },
  { id: "st3", name: "横浜西口店", address: "神奈川県横浜市西区南幸2-1-1", serviceId: "sensor", slotId: "", craftsmanId: "", status: "未定" },
  { id: "st4", name: "大宮支店", address: "埼玉県さいたま市大宮区桜木町1-1", serviceId: "camera", slotId: "d4|eve", craftsmanId: "t3", status: "確定" },
  { id: "st5", name: "千葉ベイ店", address: "千葉県千葉市美浜区中瀬2-6", serviceId: "electric", slotId: "", craftsmanId: "", status: "未定" },
];

// kintone等に流し込むためのCSV（BOM付き・UTF-8）
export function buildSitesCSV(sites: Site[]): string {
  const header = ["拠点名", "住所", "工事種別", "希望日時", "担当職人", "金額(目安)", "ステータス"];
  const rows = sites.map((s) => {
    const svc = getService(s.serviceId);
    const cra = getCraftsman(s.craftsmanId);
    return [
      s.name,
      s.address,
      svc?.label ?? "",
      s.slotId ? fmtSlot(s.slotId) : "未定",
      cra?.name ?? "未割当",
      svc ? String(svc.price) : "",
      s.status,
    ];
  });
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const body = [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  return "﻿" + body; // BOM for Excel/kintone
}

// ─── マーケティング：クロスセル（他設備の依頼契機） ───
export interface CrossSell { serviceId: string; hook: string; }
export const CROSS_SELL: CrossSell[] = [
  { serviceId: "camera_add", hook: "同じ職人がそのまま増設できます" },
  { serviceId: "sensor", hook: "人感・開閉センサーで防犯を強化" },
  { serviceId: "aircon", hook: "繁忙期前に。今なら同時割引" },
  { serviceId: "electric", hook: "コンセント増設・配線もまとめて" },
];

// ─── マーケティング：紹介キャンペーン ───
export const REFERRAL = {
  code: "CAAS-2026",
  rewardYou: 5000,
  rewardFriend: 5000,
  message: "紹介した方・された方の双方に次回工事で使えるクーポンを進呈。",
};

// ─── ゲーミフィケーション（現地調査・施工をワクワクに） ───
const PTS_KEY = "caas_points";

export function getPoints(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(PTS_KEY) || "0", 10) || 0; } catch { return 0; }
}
export function addPoints(n: number): number {
  const total = getPoints() + n;
  try { localStorage.setItem(PTS_KEY, String(total)); } catch {}
  return total;
}

export const LEVELS = [
  { min: 0, name: "ビギナー" },
  { min: 100, name: "見習い設計士" },
  { min: 250, name: "設備マイスター" },
  { min: 500, name: "レジェンド" },
];
export function levelOf(points: number) {
  let lv = LEVELS[0];
  for (const l of LEVELS) if (points >= l.min) lv = l;
  const next = LEVELS.find((l) => l.min > points);
  return { name: lv.name, next: next?.min ?? null };
}

// ─── 職人ページ：ルート最適化 × 距離計算（Google Maps連携を想定） ───
export interface GeoPoint { lat: number; lng: number; }
export interface Job extends GeoPoint {
  id: string;
  name: string;
  address: string;
  serviceId: string;
  time: string;   // 予定
}

// 職人の出発点（自宅・倉庫）
export const HOME_BASE = { name: "自宅・倉庫", lat: 35.6595, lng: 139.7005 };

// 本日の割当現場（デモ：そうごう薬局の店舗を事例に）
export const TODAY_JOBS: Job[] = [
  { id: "j1", name: "そうごう薬局 渋谷店", address: "東京都渋谷区道玄坂2-1-1", serviceId: "camera", time: "10:00", lat: 35.6580, lng: 139.6994 },
  { id: "j2", name: "そうごう薬局 新宿店", address: "東京都新宿区西新宿1-1-1", serviceId: "camera_add", time: "13:00", lat: 35.6896, lng: 139.6995 },
  { id: "j3", name: "そうごう薬局 池袋店", address: "東京都豊島区南池袋1-28-1", serviceId: "sensor", time: "15:00", lat: 35.7295, lng: 139.7109 },
  { id: "j4", name: "そうごう薬局 品川店", address: "東京都港区港南2-1-1", serviceId: "camera", time: "17:00", lat: 35.6284, lng: 139.7387 },
];

// Google Maps 連携用のURL
export function mapsEmbedSrc(start: GeoPoint, stops: GeoPoint[]): string {
  const s = `${start.lat},${start.lng}`;
  const d = stops.map((p) => `${p.lat},${p.lng}`).join("+to:");
  return `https://www.google.com/maps?saddr=${s}&daddr=${d}&output=embed`;
}
export function mapsDirUrl(start: GeoPoint, stops: GeoPoint[]): string {
  const pts = [start, ...stops].map((p) => `${p.lat},${p.lng}`).join("/");
  return `https://www.google.com/maps/dir/${pts}`;
}

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180, la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const TRAVEL_YEN_PER_KM = 40; // 交通費 目安（¥/km）
export const AVG_KMH = 24;           // 市街地 平均速度

// 最近傍法で最短ルートを組む（無駄な移動を減らす）
export function optimizeRoute(start: GeoPoint, jobs: Job[]): { order: Job[]; totalKm: number; legs: { km: number }[] } {
  const remaining = [...jobs];
  const order: Job[] = [];
  const legs: { km: number }[] = [];
  let cur: GeoPoint = start;
  let totalKm = 0;
  while (remaining.length) {
    let bi = 0, bd = Infinity;
    remaining.forEach((j, i) => { const d = haversineKm(cur, j); if (d < bd) { bd = d; bi = i; } });
    const next = remaining.splice(bi, 1)[0];
    order.push(next); legs.push({ km: bd }); totalKm += bd; cur = next;
  }
  return { order, totalKm, legs };
}

// 元の順（割当順）の総距離 — 最適化との比較用
export function naiveTotalKm(start: GeoPoint, jobs: Job[]): number {
  let cur: GeoPoint = start, total = 0;
  for (const j of jobs) { total += haversineKm(cur, j); cur = j; }
  return total;
}

// ─── リモート現調（web面談 × 施設ウォークスルー） ───
export interface SurveyZone {
  id: string;
  label: string;
  scene: string;       // 背景トーン
  hint: string;
  serviceId: string;
  reason: string;
}
export const SURVEY_ZONES: SurveyZone[] = [
  { id: "z1", label: "入口・エントランス", scene: "linear-gradient(160deg,#33414f,#212a34)", hint: "来訪者が最初に通る場所", serviceId: "camera", reason: "来訪者の記録と抑止。トラブル時の証跡になります。" },
  { id: "z2", label: "レジ・受付", scene: "linear-gradient(160deg,#3a3746,#26232e)", hint: "金銭・個人情報を扱う場所", serviceId: "camera", reason: "金銭トラブルの証跡・スタッフの安心につながります。" },
  { id: "z3", label: "バックヤード", scene: "linear-gradient(160deg,#2f3d3a,#1f2926)", hint: "在庫・裏口のある場所", serviceId: "sensor", reason: "裏口の異常検知・在庫管理を自動化できます。" },
  { id: "z4", label: "駐車場・外周", scene: "linear-gradient(160deg,#2b3542,#191f27)", hint: "屋外・死角になりやすい場所", serviceId: "camera_add", reason: "車上荒らし・不審者対策。屋外カメラで死角を消します。" },
];

// ─── 業界別の活用・価値比較（設備＝価値向上として訴求） ───
export interface Industry {
  id: string;
  label: string;
  icon: string;
  adoption: number;    // 業界の導入率(%)
  setup: string[];     // 典型的な構成
  values: { label: string; value: string }[];  // 導入で得られる価値
  insight: string;
}
export const INDUSTRIES: Industry[] = [
  { id: "food", label: "飲食店", icon: "🍽", adoption: 62,
    setup: ["客席・厨房カメラ", "レジ周りカメラ", "入口カメラ"],
    values: [{ label: "クレーム対応時間", value: "−40%" }, { label: "保険料", value: "−8%" }, { label: "深夜の安心感", value: "向上" }],
    insight: "厨房・レジ・客席の3点が定番。トラブル時の証跡で保険・クレーム対応が激減し、スタッフが辞めにくくなります。" },
  { id: "retail", label: "小売店", icon: "🛍", adoption: 71,
    setup: ["店内広域カメラ", "レジカメラ", "バックヤードセンサー"],
    values: [{ label: "万引き被害", value: "−35%" }, { label: "棚卸ロス", value: "−20%" }, { label: "資産価値", value: "向上" }],
    insight: "死角のない配置が鍵。被害の可視化そのものが抑止力になり、店舗の資産価値・売却時評価も上がります。" },
  { id: "clinic", label: "クリニック", icon: "🏥", adoption: 55,
    setup: ["待合カメラ", "入退室センサー", "夜間防犯"],
    values: [{ label: "患者の安心感", value: "向上" }, { label: "夜間侵入リスク", value: "−50%" }, { label: "スタッフ定着", value: "向上" }],
    insight: "待合と入退室の管理が中心。患者・スタッフ双方の安心が、口コミと採用力に直結します。" },
  { id: "office", label: "オフィス", icon: "🏢", adoption: 68,
    setup: ["入退室管理", "サーバー室カメラ", "共用部カメラ"],
    values: [{ label: "情報セキュリティ", value: "強化" }, { label: "勤怠管理", value: "自動化" }, { label: "企業価値", value: "向上" }],
    insight: "入退室ログは情報セキュリティ認証(ISMS等)でも評価され、取引や企業価値の向上に効きます。" },
  { id: "factory", label: "工場・倉庫", icon: "🏭", adoption: 58,
    setup: ["広域カメラ", "危険区域センサー", "外周カメラ"],
    values: [{ label: "労災", value: "−25%" }, { label: "在庫差異", value: "−30%" }, { label: "稼働可視化", value: "向上" }],
    insight: "安全と在庫の可視化が価値。労災の減少は保険・採用・行政評価すべてにプラスです。" },
  { id: "hotel", label: "ホテル・宿泊", icon: "🏨", adoption: 64,
    setup: ["共用部カメラ", "入口カメラ", "駐車場カメラ"],
    values: [{ label: "ゲストの安心感", value: "向上" }, { label: "クレーム対応", value: "−35%" }, { label: "レビュー評価", value: "向上" }],
    insight: "共用部の安心設計がレビュー評価に直結。安全性は宿泊予約サイトの評価軸そのものです。" },
];
