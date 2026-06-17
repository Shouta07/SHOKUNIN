// His Recoveries — Improvement Library shared module
// 改善体験検索エンジンのデータ・ロジック層。
// 将来的に Supabase / 画像AI に差し替え可能な設計。

// ─── Design Tokens (warm, calm, premium — Aesop / Kinfolk / HafH) ───

export const C = {
  bg: "#f6f4ef",        // warm paper
  surface: "#ffffff",
  ink: "#1f1d1a",       // primary text
  sub: "#7a766e",       // secondary text
  faint: "#a8a39a",     // tertiary
  line: "rgba(31,29,26,0.10)",
  lineSoft: "rgba(31,29,26,0.06)",
  accent: "#3d4f43",    // deep sage — hope, calm
  accentSoft: "rgba(61,79,67,0.08)",
};

export const SANS = "'Inter', 'Hiragino Sans', 'Noto Sans JP', sans-serif";
export const SERIF = "'Lora', 'Hiragino Mincho ProN', serif";

// ─── Types ──────────────────────────────────────────────────────

export type CategoryId = "back_acne" | "aga" | "hyperhidrosis" | "body_odor";

export interface CaseRecord {
  id: string;
  category: CategoryId;
  categoryLabel: string;
  ageBand: string;
  gender: string;
  severity: number;          // 1-5
  durationDays: number;
  cost: number;              // JPY
  improvementDegree: number; // 0-100 (仮)
  title: string;
  beforeNote: string;
  afterNote: string;
  whatTheyDid: string[];
  failures: string[];
  progress: { day: number; note: string }[];
  emotionChange: string;
  comment: string;
}

export interface ChallengeData {
  id: string;
  nickname: string;
  age: string;
  gender: string;
  category: string;
  severity: number;
  goal: string;
  isPublic: boolean;
  startDate: string;
  status: string;
  createdAt: string;
}

export interface DayRecord {
  id: string;
  challengeId: string;
  day: number;
  careActions: string;
  selfScore: number;     // 1-5
  vitality: {
    sleep: number;       // 1-5
    stress: number;
    energy: number;
    focus: number;
    mood: number;
  };
  note: string;
  createdAt: string;
}

export interface Report {
  id: string;
  challengeId: string;
  cost: number;
  comment: string;
  isPublished: boolean;
  recoveryScore: number;
  createdAt: string;
}

// ─── Categories ─────────────────────────────────────────────────

export const CATEGORIES: { id: CategoryId; label: string; en: string }[] = [
  { id: "back_acne", label: "背中ニキビ", en: "Back Acne" },
  { id: "aga", label: "AGA・薄毛", en: "Hair Loss" },
  { id: "hyperhidrosis", label: "多汗症", en: "Hyperhidrosis" },
  { id: "body_odor", label: "体臭", en: "Body Odor" },
];

export const AGE_BANDS = ["10代", "20代", "30代", "40代", "50代〜"];
export const GENDERS = ["男性", "女性", "その他"];

// ─── Seed Cases (改善のプロセスを見せる。完璧な成功談ではない) ───

export const SEED_CASES: CaseRecord[] = [
  {
    id: "c1",
    category: "back_acne",
    categoryLabel: "背中ニキビ",
    ageBand: "20代",
    gender: "男性",
    severity: 4,
    durationDays: 92,
    cost: 38000,
    improvementDegree: 72,
    title: "プールを諦めていた夏が、変わった",
    beforeNote: "背中全体に赤みと炎症。Tシャツの上からでも気になっていた。",
    afterNote: "炎症はほぼ収まり、色素沈着が残る程度。シャツが着られるようになった。",
    whatTheyDid: [
      "皮膚科で処方薬（外用）を継続",
      "枕カバー・シーツを週2回交換",
      "汗をかいたらすぐシャワー",
      "ビタミン中心の食事に変更",
    ],
    failures: [
      "最初の3週間、市販薬で自己流→悪化",
      "Day40あたりで一度サボって赤みが戻った",
    ],
    progress: [
      { day: 0, note: "正直、写真を撮るのが一番つらかった。" },
      { day: 30, note: "新しい炎症が減ってきた。まだ赤い。" },
      { day: 60, note: "触ってもザラつきが少ない。継続できている自分に驚く。" },
      { day: 92, note: "完璧じゃない。でも鏡を見るのが怖くなくなった。" },
    ],
    emotionChange: "「隠す」から「気にしない」へ。完治ではなく、囚われからの解放だった。",
    comment: "改善は一直線じゃなかった。サボった日もある。でも記録があったから戻ってこれた。",
  },
  {
    id: "c2",
    category: "aga",
    categoryLabel: "AGA・薄毛",
    ageBand: "30代",
    gender: "男性",
    severity: 3,
    durationDays: 180,
    cost: 96000,
    improvementDegree: 58,
    title: "進行を止められた、それで十分だった",
    beforeNote: "頭頂部と生え際が後退。風が吹くたびに手で押さえていた。",
    afterNote: "劇的な増毛はないが、進行が止まり産毛が増えた。気にする頻度が激減。",
    whatTheyDid: [
      "AGAクリニックで内服薬を処方",
      "毎日同じ時間に服用（習慣化）",
      "頭皮マッサージを夜のルーティンに",
    ],
    failures: [
      "個人輸入を検討して不安になり時間を浪費",
      "「増える」を期待しすぎて最初は落ち込んだ",
    ],
    progress: [
      { day: 0, note: "予約ボタンを押すまで半年かかった。" },
      { day: 60, note: "抜け毛が減った気がする。気のせいかも。" },
      { day: 120, note: "産毛が見える。期待しすぎないようにしている。" },
      { day: 180, note: "増えてはいない。でも減ってもいない。それが安心。" },
    ],
    emotionChange: "「いつか丸ごと失う」恐怖から、「現状維持できている」安心へ。",
    comment: "ゴールは増やすことじゃなく、怖がらなくなることだった。",
  },
  {
    id: "c3",
    category: "hyperhidrosis",
    categoryLabel: "多汗症",
    ageBand: "20代",
    gender: "女性",
    severity: 5,
    durationDays: 75,
    cost: 22000,
    improvementDegree: 65,
    title: "握手が、怖くなくなるまで",
    beforeNote: "手のひらから汗が滴るレベル。書類が湿る、人の手を握れない。",
    afterNote: "完全には止まらないが、日常で気にならない程度に。仕事中の不安が減った。",
    whatTheyDid: [
      "皮膚科で塩化アルミニウム外用",
      "緊張時の呼吸法を練習",
      "ハンカチを常備して「対処できる」安心を作った",
    ],
    failures: [
      "制汗剤を塗りすぎて手荒れ",
      "「治す」ことに執着して逆に緊張が増した時期",
    ],
    progress: [
      { day: 0, note: "人前で手を出すのが本当に嫌だった。" },
      { day: 30, note: "外用が効いてきた。手荒れに注意。" },
      { day: 75, note: "握手を求められても、前ほど身構えなくなった。" },
    ],
    emotionChange: "「バレたら終わり」という緊張から、「対処できる」という落ち着きへ。",
    comment: "ゼロにはならない。でも付き合い方を覚えた。それで人生が軽くなった。",
  },
  {
    id: "c4",
    category: "body_odor",
    categoryLabel: "体臭",
    ageBand: "30代",
    gender: "男性",
    severity: 4,
    durationDays: 60,
    cost: 15000,
    improvementDegree: 70,
    title: "電車で隣に立てるようになった",
    beforeNote: "ワキガ体質。夏は特に自分でも分かるレベルで、人との距離が怖かった。",
    afterNote: "デオドラントと生活改善で日常レベルは気にならなく。再検討で手術は見送り。",
    whatTheyDid: [
      "医療用デオドラントを継続",
      "汗をかいたら拭く習慣（汗ふきシート常備）",
      "食生活を見直し（動物性脂肪を減らす）",
      "通気性の良い素材の服に変えた",
    ],
    failures: [
      "香水で隠そうとして余計に気になった",
      "ネットの極端な情報で一時パニックに",
    ],
    progress: [
      { day: 0, note: "自分の匂いが分からなくなるくらい神経質になっていた。" },
      { day: 30, note: "対策が習慣になってきた。不安が減る。" },
      { day: 60, note: "満員電車でも、前ほど身を縮めなくなった。" },
    ],
    emotionChange: "「近づけない」恐怖から、「普通に過ごせる」日常へ。",
    comment: "手術しかないと思い込んでいた。でも日々のケアで十分変われた。",
  },
  {
    id: "c5",
    category: "back_acne",
    categoryLabel: "背中ニキビ",
    ageBand: "30代",
    gender: "女性",
    severity: 3,
    durationDays: 120,
    cost: 28000,
    improvementDegree: 60,
    title: "結婚式のドレスのために始めた100日",
    beforeNote: "肩から背中にかけてのニキビ跡。ドレス選びで初めて本気で向き合った。",
    afterNote: "新しい炎症はほぼ消失。跡は残るが、当日はメイクでカバーできる範囲に。",
    whatTheyDid: [
      "皮膚科でピーリングを月1回",
      "保湿を徹底",
      "睡眠時間を6→7.5時間に",
    ],
    failures: [
      "焦って強い市販品を使い肌が荒れた",
      "途中で結果が出ず一度心が折れかけた",
    ],
    progress: [
      { day: 0, note: "ドレスの試着で泣いた。" },
      { day: 45, note: "炎症が落ち着いてきた。跡はまだ気になる。" },
      { day: 120, note: "完璧じゃないけど、自分を許せるようになった。" },
    ],
    emotionChange: "「隠さなきゃ」から「これも私」へ。完璧主義からの解放。",
    comment: "ゴールは完璧な背中じゃなくて、自分を責めるのをやめることだった。",
  },
  {
    id: "c6",
    category: "aga",
    categoryLabel: "AGA・薄毛",
    ageBand: "20代",
    gender: "男性",
    severity: 4,
    durationDays: 150,
    cost: 72000,
    improvementDegree: 50,
    title: "28歳で始めた、早すぎないかと思いながら",
    beforeNote: "若くして生え際が後退。年齢と現実のギャップに苦しんだ。",
    afterNote: "進行が緩やかに。劇的ではないが、毎日の不安が確実に減った。",
    whatTheyDid: [
      "クリニックで内服+外用の併用",
      "記録アプリで毎日同じ角度の写真を撮影",
      "比較できることで冷静になれた",
    ],
    failures: [
      "毎日鏡を見すぎて一喜一憂",
      "最初の1ヶ月は変化がなく不安だった",
    ],
    progress: [
      { day: 0, note: "若いのにという自分への失望が一番きつかった。" },
      { day: 60, note: "写真で比較すると、悪化は止まっている。" },
      { day: 150, note: "数字や写真で見ると安心する。記録してよかった。" },
    ],
    emotionChange: "毎日の絶望から、データに基づいた冷静さへ。",
    comment: "記録が一番効いた。感情じゃなく事実で自分を見れるようになった。",
  },
];

// ─── Helpers ────────────────────────────────────────────────────

export function fmtCost(cost: number): string {
  return "¥" + cost.toLocaleString("ja-JP");
}

export function fmtDuration(days: number): string {
  if (days >= 30) return `約${Math.round(days / 30)}ヶ月`;
  return `${days}日`;
}

export function getCaseById(id: string): CaseRecord | undefined {
  const seed = SEED_CASES.find((c) => c.id === id);
  if (seed) return seed;
  return getPublishedCases().find((c) => c.id === id);
}

// 改善スコア（簡易計算）。将来は画像AIの状態変化を組み込む。
export function calcImprovementScore(records: DayRecord[]): number {
  if (records.length === 0) return 0;
  const continuity = Math.min(records.length / 12, 1) * 40; // 継続: max 40
  const avgSelf = records.reduce((s, r) => s + r.selfScore, 0) / records.length;
  const selfPart = (avgSelf / 5) * 30; // 自己評価: max 30
  // 状態変化: 後半の自己評価 - 前半の自己評価
  const half = Math.floor(records.length / 2);
  const early = records.slice(0, half || 1);
  const late = records.slice(half);
  const earlyAvg = early.reduce((s, r) => s + r.selfScore, 0) / (early.length || 1);
  const lateAvg = late.reduce((s, r) => s + r.selfScore, 0) / (late.length || 1);
  const changePart = Math.max(0, Math.min((lateAvg - earlyAvg + 1) / 2, 1)) * 30; // 状態変化: max 30
  return Math.round(continuity + selfPart + changePart);
}

// AIコメント（毎回表示・ダミー）。煽らない、善悪判断しない、継続を称賛する。
export function getAIComment(records: DayRecord[], latest: DayRecord): string {
  const comments: string[] = [];
  if (records.length === 1) {
    return "記録ありがとうございます。最初の一歩が、一番むずかしい一歩でした。あなたの記録は、未来の誰かの助けになります。";
  }
  const prev = records[records.length - 2];
  if (prev && latest.selfScore > prev.selfScore) {
    comments.push("前回より自己評価が上がっています。今週のケアを続けてみましょう。");
  } else if (prev && latest.selfScore < prev.selfScore) {
    comments.push("改善は一直線ではありません。下がる日があっても、続けていること自体が土台になります。");
  } else {
    comments.push("記録ありがとうございます。変化はまだ小さくても、継続そのものが改善の土台です。");
  }
  if (records.length >= 7) {
    comments.push("7回以上の記録、よく続けています。あなたの積み重ねは確かなものです。");
  }
  return comments.join("\n");
}

// ─── LocalStorage (MVP) ─────────────────────────────────────────

const CUR_KEY = "recovery_current";
const REC_KEY = "recovery_records";

export function getCurrentChallenge(): ChallengeData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUR_KEY);
    return raw ? (JSON.parse(raw) as ChallengeData) : null;
  } catch {
    return null;
  }
}

export function getRecords(challengeId: string): DayRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(REC_KEY) || "[]") as DayRecord[];
    return all.filter((r) => r.challengeId === challengeId).sort((a, b) => a.day - b.day);
  } catch {
    return [];
  }
}

export function saveRecord(rec: DayRecord): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(REC_KEY) || "[]") as DayRecord[];
    all.push(rec);
    localStorage.setItem(REC_KEY, JSON.stringify(all));
  } catch {}
}

export function daysSince(startDate: string): number {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
}

export const MILESTONES = [0, 7, 14, 30, 60, 100];

const CHS_KEY = "recovery_challenges";
const REPORT_KEY = "recovery_reports";
const PUBLISHED_KEY = "recovery_published_cases";

export function getChallengeById(id: string): ChallengeData | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(localStorage.getItem(CHS_KEY) || "[]") as ChallengeData[];
    return all.find((c) => c.id === id) ?? getCurrentChallenge();
  } catch {
    return getCurrentChallenge();
  }
}

export function getReport(challengeId: string): Report | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(localStorage.getItem(REPORT_KEY) || "[]") as Report[];
    return all.find((r) => r.challengeId === challengeId) ?? null;
  } catch {
    return null;
  }
}

export function saveReport(report: Report): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(REPORT_KEY) || "[]") as Report[];
    const idx = all.findIndex((r) => r.challengeId === report.challengeId);
    if (idx >= 0) all[idx] = report; else all.push(report);
    localStorage.setItem(REPORT_KEY, JSON.stringify(all));
  } catch {}
}

export function getPublishedCases(): CaseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PUBLISHED_KEY) || "[]") as CaseRecord[];
  } catch {
    return [];
  }
}

// チャレンジ + 記録 + レポートから匿名症例（CaseRecord）を組成して公開する。
// 個人が特定されないよう、ニックネーム等は含めない。
export function publishAsCase(
  challenge: ChallengeData,
  records: DayRecord[],
  report: Report,
): CaseRecord {
  const catLabel = CATEGORIES.find((c) => c.id === challenge.category)?.label ?? "その他";
  const duration = records.length ? records[records.length - 1].day : daysSince(challenge.startDate);
  const uniqueCare = Array.from(new Set(
    records.flatMap((r) => r.careActions.split(/[、,\n]/).map((s) => s.trim()).filter(Boolean)),
  )).slice(0, 6);
  const firstNote = records.find((r) => r.note)?.note ?? "";
  const lastNote = [...records].reverse().find((r) => r.note)?.note ?? "";

  const caseRecord: CaseRecord = {
    id: `u_${challenge.id.slice(0, 8)}`,
    category: challenge.category as CategoryId,
    categoryLabel: catLabel,
    ageBand: challenge.age,
    gender: challenge.gender,
    severity: challenge.severity,
    durationDays: duration,
    cost: report.cost,
    improvementDegree: report.recoveryScore,
    title: challenge.goal || "100日間の記録",
    beforeNote: firstNote || "記録を始めた時点の状態。",
    afterNote: lastNote || "100日間の継続を経た現在の状態。",
    whatTheyDid: uniqueCare.length ? uniqueCare : ["毎日の記録を継続した"],
    failures: ["改善は一直線ではなく、停滞した日もあった"],
    progress: records
      .filter((r) => r.note)
      .map((r) => ({ day: r.day, note: r.note })),
    emotionChange: report.comment || "記録を通じて、少しずつ自分と向き合えるようになった。",
    comment: report.comment || "完璧じゃない。でも続けたことに意味があった。",
  };

  try {
    const all = getPublishedCases();
    const idx = all.findIndex((c) => c.id === caseRecord.id);
    if (idx >= 0) all[idx] = caseRecord; else all.unshift(caseRecord);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(all));
  } catch {}

  return caseRecord;
}

export function unpublishCase(challengeId: string): void {
  if (typeof window === "undefined") return;
  try {
    const id = `u_${challengeId.slice(0, 8)}`;
    const all = getPublishedCases().filter((c) => c.id !== id);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(all));
  } catch {}
}

// 改善手段（将来のMarketplace送客導線）— 設計のみ。
export const SOLUTION_FLOW: { step: string; label: string }[] = [
  { step: "01", label: "症例を見る" },
  { step: "02", label: "改善手段を知る" },
  { step: "03", label: "提携サロン" },
  { step: "04", label: "提携クリニック" },
  { step: "05", label: "予約する" },
];
