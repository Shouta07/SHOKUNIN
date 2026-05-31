import type { Question, DiagnosisResult, DiagnosisIntro } from "./types";

export const faceIntro: DiagnosisIntro = {
  headline: "なぜ顔タイプを知ると\n第一印象が変わるのか",
  problem: "髪型を変えたのにしっくりこない。オシャレな服を買ったのに「なんか違う」。それは顔の印象と服・髪のテイストがズレているから。",
  solution: "顔タイプを知れば、自分の顔が周りにどう映っているかが客観的にわかる。顔の印象に合ったファッションや髪型を選ぶだけで、「似合ってる」と言われる回数が変わる。",
  benefits: [
    { icon: "🤝", text: "第一印象で「信頼できそう」「好感が持てる」と思われる" },
    { icon: "💈", text: "美容室で「こうしてください」と自信を持って伝えられる" },
    { icon: "👔", text: "自分の顔に合う服のテイストが明確になる" },
    { icon: "📸", text: "写真映りが良くなり、SNSや仕事のプロフィールに自信が持てる" },
  ],
  closingHook: "6問・約2分で、あなたの顔タイプがわかります。",
};

export const faceQuestions: Question[] = [
  {
    id: "f1",
    text: "初対面の人に第一印象を聞くと、何と言われることが多い？",
    options: [
      { label: "「話しかけやすい」「爽やかだね」", value: "a", score: { fresh: 3, cute: 0, cool: 0, elegant: 0 } },
      { label: "「若く見える」「優しそう」", value: "b", score: { fresh: 0, cute: 3, cool: 0, elegant: 0 } },
      { label: "「怖そう」「クールだね」", value: "c", score: { fresh: 0, cute: 0, cool: 3, elegant: 0 } },
      { label: "「大人っぽい」「落ち着いてるね」", value: "d", score: { fresh: 0, cute: 0, cool: 0, elegant: 3 } },
    ],
  },
  {
    id: "f2",
    text: "鏡で横顔を見たとき、顎のラインやフェイスラインの特徴は？",
    options: [
      { label: "丸みがあり、シャープさは少ない", value: "a", score: { fresh: 1, cute: 2, cool: 0, elegant: 0 } },
      { label: "卵型で自然なカーブ", value: "b", score: { fresh: 2, cute: 0, cool: 0, elegant: 1 } },
      { label: "角ばっていてエラが張っている", value: "c", score: { fresh: 0, cute: 0, cool: 2, elegant: 1 } },
      { label: "シュッとして面長・縦に長い", value: "d", score: { fresh: 0, cute: 0, cool: 1, elegant: 2 } },
    ],
  },
  {
    id: "f3",
    text: "周りの人に「目の印象」を聞いたら、何と言われそう？",
    options: [
      { label: "「穏やかで優しい目だね」", value: "a", score: { fresh: 2, cute: 1, cool: 0, elegant: 0 } },
      { label: "「丸くて可愛い目だね」", value: "b", score: { fresh: 0, cute: 2, cool: 0, elegant: 1 } },
      { label: "「鋭くてかっこいい目だね」", value: "c", score: { fresh: 0, cute: 0, cool: 2, elegant: 1 } },
      { label: "「深みがあって印象的な目だね」", value: "d", score: { fresh: 0, cute: 0, cool: 1, elegant: 2 } },
    ],
  },
  {
    id: "f4",
    text: "髭を伸ばした（または伸ばしたと想像した）とき、どう見える？",
    options: [
      { label: "似合わなそう・清潔感が減りそう", value: "a", score: { fresh: 2, cute: 2, cool: 0, elegant: 0 } },
      { label: "無精髭くらいなら雰囲気が出そう", value: "b", score: { fresh: 1, cute: 0, cool: 1, elegant: 1 } },
      { label: "しっかりした髭がワイルドに決まりそう", value: "c", score: { fresh: 0, cute: 0, cool: 2, elegant: 0 } },
      { label: "整えた髭がダンディに映りそう", value: "d", score: { fresh: 0, cute: 0, cool: 0, elegant: 2 } },
    ],
  },
  {
    id: "f5",
    text: "美容室で提案されがちな髪型は？",
    options: [
      { label: "ナチュラルなマッシュやショート", value: "a", score: { fresh: 2, cute: 1, cool: 0, elegant: 0 } },
      { label: "パーマやふんわりしたスタイル", value: "b", score: { fresh: 0, cute: 2, cool: 0, elegant: 1 } },
      { label: "ツーブロックやフェードカット", value: "c", score: { fresh: 0, cute: 0, cool: 2, elegant: 0 } },
      { label: "オールバックやセンターパート", value: "d", score: { fresh: 0, cute: 0, cool: 1, elegant: 2 } },
    ],
  },
  {
    id: "f6",
    text: "集合写真で自分を見たとき、周りと比べてどんな印象に映っている？",
    options: [
      { label: "爽やかで親しみやすそう", value: "a", score: { fresh: 3, cute: 1, cool: 0, elegant: 0 } },
      { label: "優しそう・実年齢より若く見える", value: "b", score: { fresh: 0, cute: 3, cool: 0, elegant: 1 } },
      { label: "クールで存在感がある", value: "c", score: { fresh: 0, cute: 0, cool: 3, elegant: 1 } },
      { label: "大人っぽく落ち着いた雰囲気", value: "d", score: { fresh: 0, cute: 1, cool: 0, elegant: 3 } },
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
