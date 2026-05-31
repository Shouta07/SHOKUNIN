import type { Question, DiagnosisResult } from "./types";

export const colorQuestions: Question[] = [
  {
    id: "c1",
    text: "手首の内側の血管の色は？",
    options: [
      { label: "緑っぽい", value: "a", score: { spring: 1, summer: 0, autumn: 1, winter: 0 } },
      { label: "青・紫っぽい", value: "b", score: { spring: 0, summer: 1, autumn: 0, winter: 1 } },
      { label: "どちらとも言えない", value: "c", score: { spring: 1, summer: 1, autumn: 0, winter: 0 } },
    ],
  },
  {
    id: "c2",
    text: "日焼けしたとき肌はどうなる？",
    options: [
      { label: "赤くなってすぐ戻る", value: "a", score: { spring: 1, summer: 2, autumn: 0, winter: 0 } },
      { label: "すぐ黒くなる", value: "b", score: { spring: 0, summer: 0, autumn: 2, winter: 1 } },
      { label: "少し赤くなってから黒くなる", value: "c", score: { spring: 1, summer: 0, autumn: 1, winter: 0 } },
      { label: "赤くなりやすく白い肌に戻る", value: "d", score: { spring: 0, summer: 1, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c3",
    text: "瞳の色は？",
    options: [
      { label: "明るい茶色・キラキラしている", value: "a", score: { spring: 2, summer: 0, autumn: 0, winter: 0 } },
      { label: "柔らかい黒・グレーがかった茶色", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "深い茶色・ダークブラウン", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "はっきりした黒", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c4",
    text: "地毛の色は？",
    options: [
      { label: "明るめの茶色", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "アッシュがかった茶色・柔らかい黒", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "暗めのこげ茶", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "真っ黒でツヤがある", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c5",
    text: "似合うと言われるアクセサリーの色は？",
    options: [
      { label: "ゴールド（明るめ）", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "シルバー（マットな質感）", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "ゴールド（アンティーク調）", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "シルバー（光沢あり）・プラチナ", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c6",
    text: "白いシャツを着たとき、しっくりくるのは？",
    options: [
      { label: "アイボリーやクリーム色", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "薄いラベンダーがかった白", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "生成り・オフホワイト", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "真っ白（ピュアホワイト）", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c7",
    text: "肌の色味の傾向は？",
    options: [
      { label: "黄味があり明るい・血色がいい", value: "a", score: { spring: 2, summer: 0, autumn: 0, winter: 0 } },
      { label: "ピンクがかって明るい・繊細", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "黄味があり暗め・マットな質感", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "青白い・色白でコントラストが強い", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
];

export const colorResults: Record<string, DiagnosisResult> = {
  spring: {
    type: "spring",
    label: "スプリング（イエベ春）",
    description: "明るく暖かみのある色が似合う。フレッシュで若々しい印象を活かすカラーリング。",
    features: [
      "肌に黄味があり、ツヤっぽい",
      "瞳がキラキラと明るい",
      "明るい色を着ると顔色が良くなる",
      "ゴールドアクセが似合う",
    ],
    fashion: [
      "キャメル・コーラルピンク",
      "アイボリー・ライトベージュ",
      "明るいオレンジ・サーモンピンク",
      "黄緑・ターコイズブルー",
      "ブラウン系のグラデーション",
    ],
    ngItems: [
      "真っ黒のワントーンコーデ",
      "青みの強いグレー",
      "ネイビー×白の組み合わせ",
      "くすんだ暗い色全般",
    ],
    celebrities: ["木村拓哉", "佐藤健", "岡田将生"],
  },
  summer: {
    type: "summer",
    label: "サマー（ブルベ夏）",
    description: "涼しげで柔らかい色が似合う。上品で知的な印象を活かすカラーリング。",
    features: [
      "肌にピンク味があり透明感がある",
      "瞳が柔らかいグレーや赤みのある茶色",
      "パステルカラーが映える",
      "シルバーアクセが似合う",
    ],
    fashion: [
      "ラベンダー・ローズピンク",
      "スカイブルー・ペールブルー",
      "グレー・ブルーグレー",
      "ネイビー・ベビーピンク",
      "オフホワイト",
    ],
    ngItems: [
      "オレンジやキャメル",
      "鮮やかすぎる黄色",
      "カーキ",
      "ゴールドアクセ",
    ],
    celebrities: ["向井理", "福士蒼汰", "三浦春馬"],
  },
  autumn: {
    type: "autumn",
    label: "オータム（イエベ秋）",
    description: "深みのある暖かい色が似合う。落ち着いた大人の雰囲気を活かすカラーリング。",
    features: [
      "肌に黄味がありマットな質感",
      "瞳が深みのあるダークブラウン",
      "アースカラーが映える",
      "アンティークゴールドが似合う",
    ],
    fashion: [
      "カーキ・オリーブ",
      "テラコッタ・マスタード",
      "ダークブラウン・チョコレート",
      "バーガンディ・ワインレッド",
      "ダークオレンジ",
    ],
    ngItems: [
      "パステルピンクやラベンダー",
      "ビビッドな青",
      "真っ白",
      "シルバーアクセ",
    ],
    celebrities: ["竹野内豊", "長瀬智也", "松田翔太"],
  },
  winter: {
    type: "winter",
    label: "ウィンター（ブルベ冬）",
    description: "鮮やかでコントラストの強い色が似合う。モダンで華やかな印象を活かすカラーリング。",
    features: [
      "肌が青白く色白、もしくは褐色",
      "瞳がはっきりした黒",
      "モノトーンが映える",
      "プラチナ・シルバーが似合う",
    ],
    fashion: [
      "ブラック・ピュアホワイト",
      "ロイヤルブルー・ネイビー",
      "ワインレッド・フューシャピンク",
      "シルバーグレー",
      "ビビッドな原色",
    ],
    ngItems: [
      "ベージュ・キャメル",
      "くすんだパステルカラー",
      "オレンジ",
      "アースカラー全般",
    ],
    celebrities: ["松本潤", "山下智久", "平野紫耀"],
  },
};
