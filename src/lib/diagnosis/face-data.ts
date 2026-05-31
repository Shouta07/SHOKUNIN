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
    products: [
      {
        name: "オックスフォード カジュアルシャツ",
        description: "爽やかな印象を引き立てる定番オックスフォードシャツ。洗いざらしの風合いが清潔感を演出。",
        price: "¥5,990〜",
        affiliateUrl: "https://example.com/affiliate/fresh-oxford-shirt",
        tag: "定番",
      },
      {
        name: "デニムジャケット（ライトブルー）",
        description: "フレッシュタイプの爽やかさを最大限に活かすライトブルーのGジャン。カジュアルからきれいめまで万能。",
        price: "¥8,900〜",
        affiliateUrl: "https://example.com/affiliate/fresh-denim-jacket",
        tag: "人気",
      },
      {
        name: "ホワイトレザースニーカー",
        description: "清潔感のある白スニーカーはフレッシュタイプの必須アイテム。どんなコーデにも合わせやすい。",
        price: "¥7,500〜",
        affiliateUrl: "https://example.com/affiliate/fresh-white-sneakers",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの顔タイプ診断で似合うスタイルを極める",
      description: "フレッシュタイプの爽やかさを最大限に活かすヘアスタイル・ファッションを、プロのスタイリストが提案します。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/face-diagnosis",
    },
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
    products: [
      {
        name: "丸首コットンスウェット",
        description: "キュートタイプの柔らかい雰囲気にぴったりの丸首スウェット。リラックス感がありつつも上品な印象。",
        price: "¥4,990〜",
        affiliateUrl: "https://example.com/affiliate/cute-crewneck-sweat",
        tag: "定番",
      },
      {
        name: "ニットカーディガン",
        description: "優しい印象を引き立てるミドルゲージのカーディガン。羽織るだけでこなれた雰囲気に。",
        price: "¥6,500〜",
        affiliateUrl: "https://example.com/affiliate/cute-cardigan",
        tag: "人気",
      },
      {
        name: "ローカットキャンバススニーカー",
        description: "カジュアルで親しみやすいローカットスニーカー。キュートタイプの可愛らしさを足元から演出。",
        price: "¥5,500〜",
        affiliateUrl: "https://example.com/affiliate/cute-lowcut-sneakers",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの顔タイプ診断で似合うスタイルを極める",
      description: "キュートタイプの柔らかさと親しみやすさを活かすヘアスタイル・ファッションを、プロのスタイリストが提案します。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/face-diagnosis",
    },
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
    products: [
      {
        name: "ダブルライダースレザージャケット",
        description: "クールタイプの男らしさを際立たせるレザージャケット。無骨でありながら洗練された存在感。",
        price: "¥19,800〜",
        affiliateUrl: "https://example.com/affiliate/cool-leather-jacket",
        tag: "定番",
      },
      {
        name: "ハイゲージタートルネックニット",
        description: "シャープな顔立ちをさらに引き立てるタートルネック。モノトーンで合わせれば知的な印象に。",
        price: "¥6,900〜",
        affiliateUrl: "https://example.com/affiliate/cool-turtleneck",
        tag: "人気",
      },
      {
        name: "サイドジップレザーブーツ",
        description: "クールタイプの足元を引き締めるレザーブーツ。全身のシルエットを一段格上げする。",
        price: "¥15,800〜",
        affiliateUrl: "https://example.com/affiliate/cool-leather-boots",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの顔タイプ診断で似合うスタイルを極める",
      description: "クールタイプのシャープさと存在感を活かすヘアスタイル・ファッションを、プロのスタイリストが提案します。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/face-diagnosis",
    },
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
    products: [
      {
        name: "ウールチェスターコート",
        description: "エレガントタイプの上品さを格上げするチェスターコート。洗練されたシルエットでフォーマルにもカジュアルにも。",
        price: "¥24,800〜",
        affiliateUrl: "https://example.com/affiliate/elegant-chester-coat",
        tag: "定番",
      },
      {
        name: "カシミヤVネックニット",
        description: "上質なカシミヤ素材が品格を演出。エレガントタイプの大人の色気を引き出すVネックシルエット。",
        price: "¥12,800〜",
        affiliateUrl: "https://example.com/affiliate/elegant-cashmere-knit",
        tag: "人気",
      },
      {
        name: "スエードローファー",
        description: "上品な足元を完成させるスエードローファー。ドレスにもカジュアルにも対応する万能シューズ。",
        price: "¥14,500〜",
        affiliateUrl: "https://example.com/affiliate/elegant-suede-loafer",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの顔タイプ診断で似合うスタイルを極める",
      description: "エレガントタイプの上品さと華やかさを活かすヘアスタイル・ファッションを、プロのスタイリストが提案します。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/face-diagnosis",
    },
  },
};
