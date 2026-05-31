import type { Question, DiagnosisResult } from "./types";

export const bodyQuestions: Question[] = [
  {
    id: "b1",
    text: "ジャケットやシャツを試着したとき、肩周りはどう収まる？",
    options: [
      { label: "肩幅ぴったりで、胸板の厚みが目立つ", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "肩が余りがちで、上半身が薄く見える", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "肩幅が広く、骨のフレーム感が出る", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b2",
    text: "腕時計をつけたとき、手首はどう見える？",
    options: [
      { label: "手首に厚みがあり、時計がしっかり収まる", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "手首が細く、時計が少しゆるく感じる", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "手首の骨が目立ち、時計がゴツく映える", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b3",
    text: "Tシャツ1枚で撮った写真を見ると、自分はどう映っている？",
    options: [
      { label: "上半身にボリュームがあり、がっしりして見える", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "すっきりして見えるが、やや華奢な印象", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "肩幅や骨格のフレーム感が強調される", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b4",
    text: "体重が増えたとき、まずどこに変化が出る？",
    options: [
      { label: "お腹周りに立体的につく（ビール腹タイプ）", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "太ももやお尻など下半身中心につく", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "あまり太らず、骨っぽさが残る", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b5",
    text: "スーツを試着したとき、店員に言われがちなことは？",
    options: [
      { label: "「胸回りに余裕があるサイズがいいですね」", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "「細身のシルエットがお似合いです」", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "「肩幅に合わせると身幅が余りますね」", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b6",
    text: "首元が開いた服を着たとき、鎖骨はどう見える？",
    options: [
      { label: "あまり目立たず、首が短めに見える", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "細く繊細に出ている", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "太くしっかりと骨が浮き出る", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b7",
    text: "ハーフパンツを履いたとき、膝周りはどう見える？",
    options: [
      { label: "膝が小さめで太ももにハリがある", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "膝が出ていて、すねが細い", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "膝の骨が大きくゴツい印象", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
];

export const bodyResults: Record<string, DiagnosisResult> = {
  straight: {
    type: "straight",
    label: "ストレートタイプ",
    description: "筋肉がつきやすく、身体に厚みがあるメリハリボディ。上半身に重心があり、グラマラスな印象。",
    features: [
      "上半身に厚みとボリュームがある",
      "肌にハリと弾力がある",
      "腰の位置が高め",
      "首が短めで太い",
    ],
    fashion: [
      "ジャストサイズのテーラードジャケット",
      "シンプルなVネックニット",
      "ストレートパンツ・センタープレスパンツ",
      "レザーシューズ",
      "シャツ（きれいめスタイル）",
    ],
    ngItems: [
      "オーバーサイズすぎる服",
      "丈の長すぎるカーディガン",
      "ローライズのパンツ",
      "チュニックなど長い着丈のトップス",
    ],
    celebrities: ["EXILE TAKAHIRO", "鈴木亮平", "阿部寛"],
    products: [
      {
        name: "テーラードジャケット（ネイビー）",
        description: "ジャストサイズで上半身の厚みを活かす王道アイテム",
        price: "¥12,800〜",
        affiliateUrl: "https://example.com/affiliate/straight-jacket",
        tag: "定番",
      },
      {
        name: "Vネックニット（グレー）",
        description: "首元をすっきり見せてストレート体型を最大限に活かす",
        price: "¥5,980〜",
        affiliateUrl: "https://example.com/affiliate/straight-vneck",
        tag: "人気",
      },
      {
        name: "センタープレスパンツ",
        description: "Iラインシルエットで脚長効果。ストレートの鉄板",
        price: "¥7,980〜",
        affiliateUrl: "https://example.com/affiliate/straight-pants",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの骨格診断で似合う服をもっと詳しく",
      description: "セルフ診断の結果をベースに、プロのスタイリストが対面であなたの骨格を分析。似合う素材・シルエット・ブランドまで具体的にアドバイス。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/body-diagnosis",
    },
  },
  wave: {
    type: "wave",
    label: "ウェーブタイプ",
    description: "華奢で柔らかな曲線的ボディライン。下半身に重心があり、ソフトで繊細な印象。",
    features: [
      "上半身が薄く華奢に見える",
      "肌が柔らかくきめ細かい",
      "腰の位置が低め",
      "首が長めで細い",
    ],
    fashion: [
      "タイトめのニットやカットソー",
      "スキニーパンツ・テーパードパンツ",
      "ショート丈のジャケット",
      "ソフトな素材のシャツ",
      "クロスボディバッグ",
    ],
    ngItems: [
      "ざっくりしたローゲージニット",
      "オーバーサイズのダウンジャケット",
      "ワイドパンツ",
      "硬い素材のアウター",
    ],
    celebrities: ["田中圭", "向井理", "星野源"],
    products: [
      {
        name: "リブニット（ブラック）",
        description: "体のラインに沿うタイトフィットで華奢な体型を綺麗に見せる",
        price: "¥4,980〜",
        affiliateUrl: "https://example.com/affiliate/wave-knit",
        tag: "定番",
      },
      {
        name: "テーパードパンツ（ダークグレー）",
        description: "下半身をすっきり見せるシルエット。ウェーブの味方",
        price: "¥6,980〜",
        affiliateUrl: "https://example.com/affiliate/wave-pants",
        tag: "人気",
      },
      {
        name: "ショート丈MA-1ジャケット",
        description: "着丈が短いから重心が上がり、スタイルアップ効果",
        price: "¥9,800〜",
        affiliateUrl: "https://example.com/affiliate/wave-ma1",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの骨格診断で似合う服をもっと詳しく",
      description: "ウェーブタイプは素材選びが特に重要。プロが似合うテクスチャー・フィット感まで丁寧にアドバイスします。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/body-diagnosis",
    },
  },
  natural: {
    type: "natural",
    label: "ナチュラルタイプ",
    description: "骨格のフレームがしっかりしたスタイリッシュなボディ。肩幅が広く、ラフな着こなしが似合う。",
    features: [
      "肩幅が広くフレーム感がある",
      "関節や骨が大きく目立つ",
      "手足が長い",
      "鎖骨がしっかり出ている",
    ],
    fashion: [
      "オーバーサイズのシャツ・ジャケット",
      "ワイドパンツ・カーゴパンツ",
      "ざっくりニット・パーカー",
      "デニム・リネン等の天然素材",
      "スニーカー・ブーツ",
    ],
    ngItems: [
      "タイトすぎるスーツ",
      "ジャストサイズのVネック",
      "光沢のある素材",
      "きっちりしすぎたコーデ",
    ],
    celebrities: ["窪田正孝", "綾野剛", "オダギリジョー"],
    products: [
      {
        name: "オーバーサイズリネンシャツ",
        description: "天然素材のざっくり感がナチュラル体型にぴったりハマる",
        price: "¥5,980〜",
        affiliateUrl: "https://example.com/affiliate/natural-shirt",
        tag: "定番",
      },
      {
        name: "ワイドカーゴパンツ",
        description: "骨格のフレーム感を活かすゆったりシルエット",
        price: "¥7,480〜",
        affiliateUrl: "https://example.com/affiliate/natural-cargo",
        tag: "人気",
      },
      {
        name: "ローゲージニット",
        description: "ざっくり編みがナチュラルの骨感をカバーしつつオシャレに",
        price: "¥6,980〜",
        affiliateUrl: "https://example.com/affiliate/natural-knit",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロの骨格診断で似合う服をもっと詳しく",
      description: "ナチュラルタイプは着こなしの「抜け感」がカギ。プロが素材・サイズ感・コーデの黄金バランスを教えます。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/body-diagnosis",
    },
  },
};
