import type { Question, DiagnosisResult } from "./types";

export const faceQuestions: Question[] = [
  {
    id: "f1",
    text: "顔の形は？",
    options: [
      { label: "丸顔・横幅がある", value: "a", score: { fresh: 1, cute: 1, cool: 0, elegant: 0 } },
      { label: "面長・縦に長い", value: "b", score: { fresh: 0, cute: 0, cool: 1, elegant: 1 } },
      { label: "ベース型・エラが張っている", value: "c", score: { fresh: 1, cute: 0, cool: 1, elegant: 0 } },
      { label: "卵型・バランスが良い", value: "d", score: { fresh: 0, cute: 1, cool: 0, elegant: 1 } },
    ],
  },
  {
    id: "f2",
    text: "目の印象は？",
    options: [
      { label: "丸くて大きい", value: "a", score: { fresh: 1, cute: 2, cool: 0, elegant: 0 } },
      { label: "切れ長でシャープ", value: "b", score: { fresh: 0, cute: 0, cool: 2, elegant: 1 } },
      { label: "穏やかで優しい印象", value: "c", score: { fresh: 2, cute: 1, cool: 0, elegant: 0 } },
      { label: "力強く印象的", value: "d", score: { fresh: 0, cute: 0, cool: 1, elegant: 2 } },
    ],
  },
  {
    id: "f3",
    text: "眉の形は？",
    options: [
      { label: "アーチ型・丸みがある", value: "a", score: { fresh: 1, cute: 2, cool: 0, elegant: 0 } },
      { label: "直線的・角度がある", value: "b", score: { fresh: 0, cute: 0, cool: 2, elegant: 1 } },
      { label: "太めでナチュラル", value: "c", score: { fresh: 2, cute: 0, cool: 1, elegant: 0 } },
      { label: "細めで整っている", value: "d", score: { fresh: 0, cute: 1, cool: 0, elegant: 2 } },
    ],
  },
  {
    id: "f4",
    text: "鼻の特徴は？",
    options: [
      { label: "小さめで丸い", value: "a", score: { fresh: 1, cute: 2, cool: 0, elegant: 0 } },
      { label: "筋が通って高い", value: "b", score: { fresh: 0, cute: 0, cool: 1, elegant: 2 } },
      { label: "幅があってしっかりしている", value: "c", score: { fresh: 1, cute: 0, cool: 2, elegant: 0 } },
      { label: "標準的で目立たない", value: "d", score: { fresh: 1, cute: 1, cool: 0, elegant: 1 } },
    ],
  },
  {
    id: "f5",
    text: "口元の印象は？",
    options: [
      { label: "唇が薄め・口角が上がっている", value: "a", score: { fresh: 2, cute: 1, cool: 0, elegant: 0 } },
      { label: "唇が厚め・セクシーな印象", value: "b", score: { fresh: 0, cute: 0, cool: 0, elegant: 2 } },
      { label: "口が大きく存在感がある", value: "c", score: { fresh: 0, cute: 0, cool: 2, elegant: 0 } },
      { label: "小さめで控えめ", value: "d", score: { fresh: 0, cute: 2, cool: 0, elegant: 1 } },
    ],
  },
  {
    id: "f6",
    text: "顔全体の印象を一言で表すと？",
    options: [
      { label: "爽やか・親しみやすい", value: "a", score: { fresh: 3, cute: 0, cool: 0, elegant: 0 } },
      { label: "かわいい・童顔っぽい", value: "b", score: { fresh: 0, cute: 3, cool: 0, elegant: 0 } },
      { label: "クール・男らしい", value: "c", score: { fresh: 0, cute: 0, cool: 3, elegant: 0 } },
      { label: "大人っぽい・色気がある", value: "d", score: { fresh: 0, cute: 0, cool: 0, elegant: 3 } },
    ],
  },
];

export const faceResults: Record<string, DiagnosisResult> = {
  fresh: {
    type: "fresh",
    label: "フレッシュタイプ",
    description: "爽やかで親しみやすい印象。直線と曲線のバランスが取れた、好感度の高い顔立ち。",
    features: [
      "爽やかで清潔感のある印象",
      "親しみやすく万人受けする",
      "若く見られやすい",
      "ナチュラルな雰囲気",
    ],
    fashion: [
      "カジュアルなシャツ＋チノパン",
      "ボーダーやストライプ柄",
      "デニムジャケット",
      "白Tシャツ＋きれいめパンツ",
      "スニーカー（白・ネイビー）",
    ],
    ngItems: [
      "モード系の全身黒コーデ",
      "派手な柄シャツ",
      "ドレッシーすぎるスーツスタイル",
    ],
    celebrities: ["佐藤健", "竹内涼真", "中村倫也"],
  },
  cute: {
    type: "cute",
    label: "キュートタイプ",
    description: "丸みのあるパーツと柔らかい印象が特徴。可愛らしさと人懐っこさを持つ顔立ち。",
    features: [
      "丸みがあり柔らかい印象",
      "親しみやすく話しかけやすい",
      "実年齢より若く見える",
      "笑顔が特に魅力的",
    ],
    fashion: [
      "丸首ニット・スウェット",
      "パーカー＋テーパードパンツ",
      "柔らかい素材のカーディガン",
      "カジュアルなセットアップ",
      "ローカットスニーカー",
    ],
    ngItems: [
      "ハードなレザージャケット",
      "シャープすぎるスーツ",
      "ゴツいアクセサリー",
    ],
    celebrities: ["千葉雄大", "神木隆之介", "吉沢亮"],
  },
  cool: {
    type: "cool",
    label: "クールタイプ",
    description: "直線的でシャープな印象。男らしさと存在感を兼ね備えた、かっこいい系の顔立ち。",
    features: [
      "シャープで男らしい印象",
      "存在感・オーラがある",
      "第一印象がクールで知的",
      "大人っぽく見られる",
    ],
    fashion: [
      "モノトーンコーデ",
      "レザージャケット",
      "ストレートシルエットのパンツ",
      "タートルネックニット",
      "ブーツ・革靴",
    ],
    ngItems: [
      "パステルカラーの服",
      "ゆるすぎるシルエット",
      "かわいい系の柄物",
    ],
    celebrities: ["山下智久", "福山雅治", "玉木宏"],
  },
  elegant: {
    type: "elegant",
    label: "エレガントタイプ",
    description: "整った顔立ちと上品な雰囲気。大人の色気と華やかさを持つ、洗練された印象。",
    features: [
      "上品で華やかな印象",
      "大人っぽく落ち着いて見える",
      "フォーマルな場が似合う",
      "色気・品のある雰囲気",
    ],
    fashion: [
      "テーラードジャケット＋スラックス",
      "Vネック・ハイゲージニット",
      "ロングコート（チェスター・ステンカラー）",
      "シルクやカシミヤ等の上質素材",
      "革靴・ローファー",
    ],
    ngItems: [
      "スポーティすぎるカジュアル",
      "安っぽい素材の服",
      "派手なストリート系",
    ],
    celebrities: ["斎藤工", "ディーン・フジオカ", "及川光博"],
  },
};
