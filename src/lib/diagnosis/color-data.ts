import type { Question, DiagnosisResult, DiagnosisIntro } from "./types";

export const colorIntro: DiagnosisIntro = {
  headline: "なぜパーソナルカラーを知ると\n顔の印象が変わるのか",
  problem: "同じ白シャツでも、顔色が良く見える人とくすんで見える人がいる。同じネイビースーツでも、映える人と地味に沈む人がいる。その差は「肌の色と服の色の相性」で決まる。",
  solution: "パーソナルカラーを知れば、自分の肌・髪・瞳に合う色が客観的にわかる。似合う色を身につけるだけで、顔色が明るくなり、清潔感と健康的な印象が格段に上がる。",
  benefits: [
    { icon: "✨", text: "顔色が良く見え、健康的で清潔感のある印象になる" },
    { icon: "👕", text: "服・ネクタイ・アウターの色選びで迷わなくなる" },
    { icon: "🪞", text: "「疲れてる？」と言われることが減る" },
    { icon: "📈", text: "見た目の印象がアップし、仕事や対人関係にプラスになる" },
  ],
  closingHook: "7問・約2分で、あなたのパーソナルカラーがわかります。",
};

export const colorQuestions: Question[] = [
  {
    id: "c1",
    text: "白いワイシャツを着たとき、顔色が良く見えるのはどのタイプ？",
    options: [
      { label: "アイボリーやクリーム系の白", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "薄いブルーがかった白", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "生成り・オフホワイト", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "真っ白（ピュアホワイト）", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c2",
    text: "腕時計やアクセサリーを着けたとき、肌に映えると感じるのは？",
    options: [
      { label: "明るいゴールド（イエローゴールド）", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "マットなシルバーやホワイトゴールド", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "アンティーク調のゴールド・ブロンズ", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "光沢のあるシルバーやプラチナ", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c3",
    text: "髭剃りのあと鏡で見ると、肌の色味はどう見える？",
    options: [
      { label: "黄味がかっていて血色がいい", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "ピンクがかって明るい", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 1 } },
      { label: "黄味が強く、マットな質感", value: "c", score: { spring: 1, summer: 0, autumn: 2, winter: 0 } },
      { label: "青白い・色白でコントラストが強い", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c4",
    text: "夏に日焼けしたあと、肌はどう変化する？",
    options: [
      { label: "少し赤くなるが、すぐ元の肌色に戻る", value: "a", score: { spring: 1, summer: 2, autumn: 0, winter: 0 } },
      { label: "赤くなってから薄く焼ける", value: "b", score: { spring: 1, summer: 0, autumn: 0, winter: 2 } },
      { label: "すぐに黒く焼けて、なかなか戻らない", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "あまり焼けず、赤くなって白い肌に戻る", value: "d", score: { spring: 0, summer: 1, autumn: 0, winter: 1 } },
    ],
  },
  {
    id: "c5",
    text: "スーツやジャケットの色で、周りから「似合う」と言われるのは？",
    options: [
      { label: "明るいベージュ・キャメル系", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "ライトグレー・パウダーブルー系", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "ダークブラウン・カーキ系", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "ブラック・チャコール・ネイビー系", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c6",
    text: "自分の地毛の色を光の下で見ると、どう見える？",
    options: [
      { label: "明るめの茶色・光に透ける感じ", value: "a", score: { spring: 2, summer: 0, autumn: 1, winter: 0 } },
      { label: "アッシュがかった柔らかい黒", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "暗めのこげ茶・マットな質感", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "真っ黒でツヤがある", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
    ],
  },
  {
    id: "c7",
    text: "ネクタイやマフラーで、顔色が明るく見えると感じる色は？",
    options: [
      { label: "コーラルピンク・オレンジ系の暖色", value: "a", score: { spring: 2, summer: 0, autumn: 0, winter: 0 } },
      { label: "ラベンダー・ローズ系のくすんだ色", value: "b", score: { spring: 0, summer: 2, autumn: 0, winter: 0 } },
      { label: "テラコッタ・マスタード系の深い暖色", value: "c", score: { spring: 0, summer: 0, autumn: 2, winter: 0 } },
      { label: "ロイヤルブルー・ワインレッド等の鮮やかな色", value: "d", score: { spring: 0, summer: 0, autumn: 0, winter: 2 } },
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
    products: [
      {
        name: "キャメルテーラードジャケット",
        description: "スプリングタイプに映える明るいキャメルカラー。カジュアルにもビジネスにも使える万能アウター。",
        price: "¥12,800〜",
        affiliateUrl: "https://example.com/affiliate/spring-camel-jacket",
        tag: "定番",
      },
      {
        name: "コーラルピンク ポロシャツ",
        description: "春タイプの肌色を引き立てるコーラルピンク。一枚で顔色が明るく見える鉄板カラー。",
        price: "¥4,980〜",
        affiliateUrl: "https://example.com/affiliate/spring-coral-polo",
        tag: "人気",
      },
      {
        name: "ベージュ ストレッチチノパン",
        description: "イエベ春に似合うライトベージュ。きれいめカジュアルの定番ボトムス。",
        price: "¥6,980〜",
        affiliateUrl: "https://example.com/affiliate/spring-beige-chinos",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロのカラー診断でベストカラーを見つける",
      description: "スプリングタイプは明るく暖かい色が得意。プロの診断で、あなたに似合うキャメルやコーラルの最適なトーンを見つけましょう。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/color-diagnosis",
    },
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
    products: [
      {
        name: "ラベンダー ドレスシャツ",
        description: "ブルベ夏の透明感を引き立てるラベンダーカラー。ビジネスでも休日でも上品な印象に。",
        price: "¥5,980〜",
        affiliateUrl: "https://example.com/affiliate/summer-lavender-shirt",
        tag: "定番",
      },
      {
        name: "ブルーグレー クルーネックニット",
        description: "サマータイプに映えるスモーキーなブルーグレー。柔らかい印象で知的な雰囲気を演出。",
        price: "¥7,980〜",
        affiliateUrl: "https://example.com/affiliate/summer-bluegrey-knit",
        tag: "人気",
      },
      {
        name: "ネイビー テーパードスラックス",
        description: "ブルベ夏の定番ボトムス。落ち着いたネイビーがクリーンな印象を与える一本。",
        price: "¥8,800〜",
        affiliateUrl: "https://example.com/affiliate/summer-navy-slacks",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロのカラー診断でベストカラーを見つける",
      description: "サマータイプは涼しげで柔らかいトーンが得意。プロの診断で、あなたに最適なラベンダーやブルーグレーの色味を見つけましょう。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/color-diagnosis",
    },
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
    products: [
      {
        name: "カーキ シャツジャケット",
        description: "オータムタイプの重厚感を引き立てるカーキカラー。羽織るだけで大人の余裕を演出。",
        price: "¥9,800〜",
        affiliateUrl: "https://example.com/affiliate/autumn-khaki-shacket",
        tag: "定番",
      },
      {
        name: "テラコッタ Vネックニット",
        description: "イエベ秋に映える深みのあるテラコッタ。秋冬の主役になれるアースカラー。",
        price: "¥6,980〜",
        affiliateUrl: "https://example.com/affiliate/autumn-terracotta-knit",
        tag: "人気",
      },
      {
        name: "ダークブラウン テーパードパンツ",
        description: "オータムタイプの落ち着いた雰囲気にマッチ。上品なダークブラウンで大人コーデを完成。",
        price: "¥7,800〜",
        affiliateUrl: "https://example.com/affiliate/autumn-darkbrown-pants",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロのカラー診断でベストカラーを見つける",
      description: "オータムタイプは深みのあるアースカラーが得意。プロの診断で、あなたに似合うカーキやテラコッタの最適なトーンを見つけましょう。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/color-diagnosis",
    },
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
    products: [
      {
        name: "ブラック レザージャケット",
        description: "ウィンタータイプのシャープな印象を最大限に活かす漆黒のレザー。モダンで存在感のある一着。",
        price: "¥19,800〜",
        affiliateUrl: "https://example.com/affiliate/winter-black-leather",
        tag: "定番",
      },
      {
        name: "ロイヤルブルー ドレスシャツ",
        description: "ブルベ冬に映える鮮やかなロイヤルブルー。コントラストの強い肌色を引き立てる一枚。",
        price: "¥5,980〜",
        affiliateUrl: "https://example.com/affiliate/winter-royalblue-shirt",
        tag: "人気",
      },
      {
        name: "チャコールグレー スリムパンツ",
        description: "ウィンタータイプの都会的な雰囲気にぴったり。モノトーンコーデの軸になるボトムス。",
        price: "¥7,800〜",
        affiliateUrl: "https://example.com/affiliate/winter-charcoal-pants",
        tag: "おすすめ",
      },
    ],
    salonCta: {
      heading: "プロのカラー診断でベストカラーを見つける",
      description: "ウィンタータイプはビビッドな色やモノトーンが得意。プロの診断で、あなたに最適なブラックやロイヤルブルーの組み合わせを見つけましょう。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/color-diagnosis",
    },
  },
};
