import type { Question, DiagnosisResult } from "./types";

export const bodyQuestions: Question[] = [
  {
    id: "b1",
    text: "首の長さ・太さは？",
    options: [
      { label: "短めで太い", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "長めで細い", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "太くて筋が目立つ", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b2",
    text: "鎖骨の出方は？",
    options: [
      { label: "ほとんど目立たない", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "細く出ている", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "大きくしっかり出ている", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b3",
    text: "手の特徴は？",
    options: [
      { label: "手のひらに厚みがある", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "手が薄く指が細い", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "手が大きく関節が目立つ", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b4",
    text: "上半身と下半身のバランスは？",
    options: [
      { label: "上半身に重心がある（胸板が厚い）", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "下半身に重心がある（腰の位置が低め）", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "肩幅が広くフレーム感がある", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b5",
    text: "体に肉がつくときの特徴は？",
    options: [
      { label: "お腹周りに立体的につく", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "下半身を中心に柔らかくつく", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "あまり太らない・骨っぽさが残る", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b6",
    text: "肌の質感は？",
    options: [
      { label: "ハリがあって弾力を感じる", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "柔らかくてきめ細かい", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "硬めで筋や関節が目立つ", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
    ],
  },
  {
    id: "b7",
    text: "膝の特徴は？",
    options: [
      { label: "膝が小さめで目立たない", value: "a", score: { straight: 2, wave: 0, natural: 0 } },
      { label: "膝が出ていて脚が細い", value: "b", score: { straight: 0, wave: 2, natural: 0 } },
      { label: "膝の骨が大きい", value: "c", score: { straight: 0, wave: 0, natural: 2 } },
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
  },
};
