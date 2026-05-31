import type { Question, DiagnosisResult, DiagnosisIntro } from "./types";

export const bodyIntro: DiagnosisIntro = {
  headline: "骨格の試練",
  problem: "骨格の試練が あなたの前に\n立ちはだかった！\n\n同じ装備でも 体型に合えば「信頼感+20」。\n合わなければ「清潔感-15」。\n装備選びを間違えるだけで\nステータスは 大きく下がってしまう。",
  solution: "この試練をクリアすれば\nあなたの骨格タイプが判明し\n装備適性が解放される。\n強みを活かす装備、弱みをカバーする装備が\nすべてわかるようになる。",
  benefits: [
    { icon: "🗡️", text: "体型の弱点をカバーし 強みを際立たせる装備が解放される" },
    { icon: "💰", text: "「買ったけど似合わなかった」のゴールド損失がなくなる" },
    { icon: "⚡", text: "毎朝の装備選択が 即座に完了する" },
    { icon: "🪞", text: "鏡を見たとき「いい感じだ」と 自信がレベルアップする" },
  ],
  closingHook: "7 STAGES / 所要時間: 2分",
};

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
    stats: { 存在感: 85, 清潔感: 75, 信頼感: 80, 色気: 70, 親しみ: 60 },
    features: [
      "上半身に厚みとボリュームがある",
      "肌にハリと弾力がある",
      "腰の位置が高め",
      "首が短めで太い",
    ],
    fashion: [
      { item: "ジャストサイズのテーラードジャケット", reason: "上半身の厚みがそのまま活き、体の立体感がシルエットに映える", stat: "信頼感+20" },
      { item: "シンプルなVネックニット", reason: "首が短めでもV字の開きで顔周りがすっきりし、小顔効果が出る", stat: "清潔感+15" },
      { item: "ストレートパンツ・センタープレスパンツ", reason: "縦のラインが強調され、上半身のボリュームとバランスが取れる", stat: "存在感+15" },
      { item: "ハリのある素材のシャツ", reason: "筋肉質な肌のハリ感と素材のハリが調和し、清潔感が増す", stat: "清潔感+20" },
      { item: "レザーシューズ", reason: "重厚な体格に負けない存在感が足元に出て、全体が引き締まる", stat: "信頼感+10" },
    ],
    ngItems: [
      { item: "オーバーサイズすぎる服", reason: "厚みのある体がさらに膨張して見え、太った印象になる", stat: "清潔感-15" },
      { item: "丈の長すぎるカーディガン", reason: "上半身の重心がぼやけて、だらしなく見える", stat: "信頼感-10" },
      { item: "ローライズのパンツ", reason: "せっかくの腰位置の高さが活かせず、脚が短く見える", stat: "存在感-15" },
      { item: "長い着丈のトップス", reason: "上半身の立体感が隠れ、全体がもっさりした印象になる", stat: "清潔感-10" },
    ],
    celebrities: ["EXILE TAKAHIRO", "鈴木亮平", "阿部寛"],
    products: [
      {
        name: "オーダーメイド テーラードジャケット",
        description: "採寸データから仕立てる一着。ストレート体型の胸板の厚み・肩幅に完全フィットし、既製品では出せない立体的なシルエットが手に入る。誕生日や昇進祝いに。",
        price: "¥39,800〜",
        affiliateUrl: "https://example.com/affiliate/straight-order-jacket",
        tag: "誕生日に",
      },
      {
        name: "カシミヤ100% Vネックニット",
        description: "最高級カシミヤが肌のハリ感と調和。Vネックが首の短さをカバーし、顔周りをすっきり見せる。肌触りの良さに驚く、贈って間違いない一枚。",
        price: "¥24,800〜",
        affiliateUrl: "https://example.com/affiliate/straight-cashmere-vneck",
        tag: "クリスマスに",
      },
      {
        name: "イタリア製 本革ビジネスバッグ",
        description: "重厚感のある体格に見合う上質な革の存在感。ジャストサイズの服と合わせたとき、全身の格が一段上がる。記念日のサプライズに最適。",
        price: "¥34,800〜",
        affiliateUrl: "https://example.com/affiliate/straight-leather-bag",
        tag: "記念日に",
      },
    ],
    salonCta: {
      heading: "プロの採寸で、もっと似合う一着を",
      description: "ストレートタイプは既製品のサイズ選びが難しい体型。プロの骨格診断で、あなたの胸板・肩幅に最適なサイズ感とブランドを見つけましょう。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/body-diagnosis",
    },
  },
  wave: {
    type: "wave",
    label: "ウェーブタイプ",
    description: "華奢で柔らかな曲線的ボディライン。下半身に重心があり、ソフトで繊細な印象。",
    stats: { 存在感: 55, 清潔感: 85, 信頼感: 70, 色気: 65, 親しみ: 80 },
    features: [
      "上半身が薄く華奢に見える",
      "肌が柔らかくきめ細かい",
      "腰の位置が低め",
      "首が長めで細い",
    ],
    fashion: [
      { item: "タイトめのニットやカットソー", reason: "華奢な上半身に沿うことで、スタイリッシュに見える", stat: "清潔感+15" },
      { item: "スキニーパンツ・テーパードパンツ", reason: "細い脚のラインがきれいに出てスタイルアップする", stat: "存在感+15" },
      { item: "ショート丈のジャケット", reason: "重心が上がり、腰位置の低さをカバーできる", stat: "信頼感+15" },
      { item: "ソフトな素材のシャツ", reason: "柔らかい肌質と素材の質感が調和し、上品な印象になる", stat: "色気+10" },
      { item: "クロスボディバッグ", reason: "上半身にアクセントが加わり、華奢さが「こなれ感」に変わる", stat: "親しみ+10" },
    ],
    ngItems: [
      { item: "ざっくりしたローゲージニット", reason: "華奢な体が泳いでしまい、服に着られている感じになる", stat: "存在感-15" },
      { item: "オーバーサイズのダウンジャケット", reason: "上半身の薄さが強調され、全体のバランスが崩れる", stat: "清潔感-10" },
      { item: "ワイドパンツ", reason: "下半身のボリュームが増し、重心の低さがさらに際立つ", stat: "存在感-10" },
      { item: "硬い素材のアウター", reason: "柔らかい体のラインと素材感がミスマッチし、ゴワつく", stat: "親しみ-10" },
    ],
    celebrities: ["田中圭", "向井理", "星野源"],
    products: [
      {
        name: "イタリア製 スリムフィットニットジャケット",
        description: "華奢な体型に沿う細身のシルエットで、既製品にはないフィット感。上半身が薄くても「こなれた大人」に見える。誕生日のサプライズにぴったり。",
        price: "¥34,800〜",
        affiliateUrl: "https://example.com/affiliate/wave-slim-jacket",
        tag: "誕生日に",
      },
      {
        name: "本革 コンパクトショルダーバッグ",
        description: "上半身にアクセントを加えて重心を引き上げる。ウェーブ体型のスタイルアップに直結する上質レザー。クリスマスギフトに最適。",
        price: "¥22,800〜",
        affiliateUrl: "https://example.com/affiliate/wave-leather-shoulder",
        tag: "クリスマスに",
      },
      {
        name: "高級ストレッチ テーパードスラックス",
        description: "細身の脚のラインを最も美しく見せる計算されたテーパード。ストレッチ素材で動きやすさも両立。記念日の贈り物に。",
        price: "¥19,800〜",
        affiliateUrl: "https://example.com/affiliate/wave-stretch-slacks",
        tag: "記念日に",
      },
    ],
    salonCta: {
      heading: "プロの診断で、あなたに合う素材を見極める",
      description: "ウェーブタイプは素材の選び方で見え方が激変する体型。プロが似合うテクスチャー・フィット感を具体的にアドバイスします。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/body-diagnosis",
    },
  },
  natural: {
    type: "natural",
    label: "ナチュラルタイプ",
    description: "骨格のフレームがしっかりしたスタイリッシュなボディ。肩幅が広く、ラフな着こなしが似合う。",
    stats: { 存在感: 75, 清潔感: 65, 信頼感: 65, 色気: 80, 親しみ: 70 },
    features: [
      "肩幅が広くフレーム感がある",
      "関節や骨が大きく目立つ",
      "手足が長い",
      "鎖骨がしっかり出ている",
    ],
    fashion: [
      { item: "オーバーサイズのシャツ・ジャケット", reason: "肩幅の広さをラフに活かし、こなれた雰囲気になる", stat: "色気+15" },
      { item: "ワイドパンツ・カーゴパンツ", reason: "骨格のフレーム感にゆとりのあるシルエットが自然にハマる", stat: "存在感+15" },
      { item: "ざっくりニット・パーカー", reason: "骨や関節の凹凸をカバーしつつ、ラフさが似合う体型と好相性", stat: "親しみ+15" },
      { item: "デニム・リネン等の天然素材", reason: "硬めの肌質と天然素材のザラッとした風合いが調和する", stat: "色気+10" },
      { item: "スニーカー・ブーツ", reason: "カジュアルな足元がフレーム感のある体型と自然にマッチする", stat: "親しみ+10" },
    ],
    ngItems: [
      { item: "タイトすぎるスーツ", reason: "骨格のゴツさが強調され、窮屈で不自然に見える", stat: "清潔感-15" },
      { item: "ジャストサイズのVネック", reason: "鎖骨や骨の凹凸が目立ちすぎて貧相な印象になる", stat: "色気-10" },
      { item: "光沢のある素材", reason: "骨や関節のゴツゴツ感が光で強調されてしまう", stat: "清潔感-10" },
      { item: "きっちりしすぎたコーデ", reason: "骨格のラフさとテイストが合わず、違和感が出る", stat: "親しみ-15" },
    ],
    celebrities: ["窪田正孝", "綾野剛", "オダギリジョー"],
    products: [
      {
        name: "ハンドメイド レザーブーツ",
        description: "骨格のフレーム感に負けない存在感の本革ブーツ。足元にボリュームを置くことで肩幅の広さとバランスが取れる。誕生日の特別な一足に。",
        price: "¥42,800〜",
        affiliateUrl: "https://example.com/affiliate/natural-leather-boots",
        tag: "誕生日に",
      },
      {
        name: "上質リネン オーバーサイズコート",
        description: "天然素材のラフな風合いがナチュラル体型と最も相性が良い。骨っぽさをカバーしつつ、こなれた大人の余裕を演出。クリスマスギフトに。",
        price: "¥36,800〜",
        affiliateUrl: "https://example.com/affiliate/natural-linen-coat",
        tag: "クリスマスに",
      },
      {
        name: "ヴィンテージ加工 デニムジャケット",
        description: "ラフな着こなしが映えるナチュラル体型のために作られたかのような一着。肩幅の広さが「男らしさ」に変わるシルエット。記念日に。",
        price: "¥28,800〜",
        affiliateUrl: "https://example.com/affiliate/natural-denim-jacket",
        tag: "記念日に",
      },
    ],
    salonCta: {
      heading: "プロの診断で、あなたに合うサイズ感を見極める",
      description: "ナチュラルタイプは「抜け感」の塩梅がカギ。プロが素材・サイズ感・コーデの黄金バランスを教えます。",
      buttonLabel: "近くのサロンを探す",
      url: "https://example.com/salon/body-diagnosis",
    },
  },
};
