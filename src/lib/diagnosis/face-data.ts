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
      { item: "カジュアルなシャツ＋チノパン", reason: "爽やかな顔立ちとカジュアルの清潔感が相乗効果を生む" },
      { item: "ボーダーやストライプ柄", reason: "親しみやすい顔の印象とカジュアル柄がマッチし、好感度が上がる" },
      { item: "デニムジャケット", reason: "程よいラフさが爽やかさを引き立て、気取らない魅力が出る" },
      { item: "白Tシャツ＋きれいめパンツ", reason: "シンプルな組み合わせが清潔感のある顔立ちを最大限に活かす" },
      { item: "白・ネイビーのスニーカー", reason: "クリーンな足元が爽やかな第一印象をさらに強化する" },
    ],
    ngItems: [
      { item: "モード系の全身黒コーデ", reason: "爽やかな印象と重い色味が矛盾し、顔だけ浮いて見える" },
      { item: "派手な柄シャツ", reason: "親しみやすい顔立ちが柄の主張に負けて、ちぐはぐになる" },
      { item: "ドレッシーすぎるスーツスタイル", reason: "カジュアルな顔の印象とフォーマルさにギャップが出て不自然に見える" },
    ],
    celebrities: ["佐藤健", "竹内涼真", "中村倫也"],
    products: [
      {
        name: "プレミアムリネンセットアップ",
        description: "誕生日ギフトにおすすめ。フレッシュタイプの爽やかな顔立ちに映える上質リネン素材のセットアップ。清潔感と品の良さを両立し、もらった瞬間から「似合う」と実感できる一着。",
        price: "¥29,800〜",
        affiliateUrl: "https://example.com/affiliate/fresh-premium-linen-setup",
        tag: "誕生日に",
      },
      {
        name: "ダニエルウェリントン クラシックウォッチ",
        description: "クリスマスの特別な贈り物に。薄型でミニマルなデザインがフレッシュタイプの爽やかさと抜群に調和。シンプルだからこそ、清潔感のある顔立ちの魅力を邪魔せず引き立てる。",
        price: "¥25,000〜",
        affiliateUrl: "https://example.com/affiliate/fresh-classic-watch",
        tag: "クリスマスに",
      },
      {
        name: "イルビゾンテ ヌメ革トートバッグ",
        description: "記念日の贈り物に最適。ナチュラルなヌメ革の風合いがフレッシュタイプの親しみやすい印象にぴったり。使い込むほどに味が出て、二人の時間とともに育つギフト。",
        price: "¥38,000〜",
        affiliateUrl: "https://example.com/affiliate/fresh-leather-tote",
        tag: "記念日に",
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
      { item: "丸首ニット・スウェット", reason: "丸みのある顔のパーツとラウンドネックの曲線が調和する" },
      { item: "パーカー＋テーパードパンツ", reason: "柔らかい印象をキープしつつ、下半身で大人っぽさを足せる" },
      { item: "柔らかい素材のカーディガン", reason: "優しい顔の雰囲気とソフトな質感が一体になり、好印象が倍増する" },
      { item: "カジュアルなセットアップ", reason: "きちんと感と可愛らしさのバランスが取れ、大人の童顔感を演出できる" },
      { item: "ローカットスニーカー", reason: "軽やかな足元が若々しい顔立ちと自然にマッチする" },
    ],
    ngItems: [
      { item: "ハードなレザージャケット", reason: "柔らかい顔の印象と硬い素材のギャップが大きく、コスプレ感が出る" },
      { item: "シャープすぎるスーツ", reason: "丸みのある顔立ちと直線的なシルエットが合わず、借り物感が出る" },
      { item: "ゴツいアクセサリー", reason: "繊細な顔のパーツに対してアクセが勝ちすぎ、バランスが崩れる" },
    ],
    celebrities: ["千葉雄大", "神木隆之介", "吉沢亮"],
    products: [
      {
        name: "カシミヤ混ラウンドネックニット",
        description: "誕生日ギフトに最適。キュートタイプの丸みのある柔らかい顔立ちと、ラウンドネックの曲線が完璧に調和。肌触り抜群のカシミヤ混素材で、触れた瞬間に上質さが伝わる贈り物。",
        price: "¥19,800〜",
        affiliateUrl: "https://example.com/affiliate/cute-cashmere-roundneck",
        tag: "誕生日に",
      },
      {
        name: "アニエスベー ボヤージュ ミニショルダーバッグ",
        description: "クリスマスプレゼントにぴったり。丸みのあるフォルムがキュートタイプの親しみやすい雰囲気とマッチ。柔らかいレザーの質感が優しい顔立ちの魅力をさらに引き出す。",
        price: "¥28,000〜",
        affiliateUrl: "https://example.com/affiliate/cute-mini-shoulder-bag",
        tag: "クリスマスに",
      },
      {
        name: "ポールスミス マルチストライプ マフラー",
        description: "記念日の贈り物におすすめ。柔らかなウール素材と丸みを感じるマルチカラーが、キュートタイプの若々しく人懐っこい印象に寄り添う。巻くだけで華やかさが加わる特別なギフト。",
        price: "¥22,000〜",
        affiliateUrl: "https://example.com/affiliate/cute-paulsmith-scarf",
        tag: "記念日に",
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
      { item: "モノトーンコーデ", reason: "シャープな顔のパーツとコントラストの効いた配色が互いを引き立てる" },
      { item: "レザージャケット", reason: "男らしい顔立ちとハードな素材が一致し、存在感が倍増する" },
      { item: "ストレートシルエットのパンツ", reason: "直線的な顔のラインと縦のシルエットが統一感を生む" },
      { item: "タートルネックニット", reason: "顎のラインが強調され、シャープな顔の輪郭が際立つ" },
      { item: "ブーツ・革靴", reason: "クールな印象に重厚な足元が加わり、全身の説得力が増す" },
    ],
    ngItems: [
      { item: "パステルカラーの服", reason: "シャープな顔立ちと甘い色味が矛盾し、ちぐはぐな印象になる" },
      { item: "ゆるすぎるシルエット", reason: "クールな顔の存在感がだらけたシルエットに埋もれてしまう" },
      { item: "かわいい系の柄物", reason: "男らしい顔立ちと可愛い柄のギャップが大きく、違和感が出る" },
    ],
    celebrities: ["山下智久", "福山雅治", "玉木宏"],
    products: [
      {
        name: "ショット ワンスター ダブルライダース",
        description: "誕生日に贈る本命ギフト。クールタイプのシャープな顔立ちと重厚なレザーの質感が互いを引き立て、圧倒的な存在感を生む。男らしい顔の印象だからこそ着こなせる一生モノの逸品。",
        price: "¥39,800〜",
        affiliateUrl: "https://example.com/affiliate/cool-schott-riders",
        tag: "誕生日に",
      },
      {
        name: "カルバンクライン ブラッククロノグラフウォッチ",
        description: "クリスマスの贈り物に。オールブラックの文字盤がクールタイプの鋭い目元・シャープな輪郭と完璧に調和。モノトーンコーデに映える、直線的なデザインの上質タイムピース。",
        price: "¥32,000〜",
        affiliateUrl: "https://example.com/affiliate/cool-black-chrono-watch",
        tag: "クリスマスに",
      },
      {
        name: "ドクターマーチン 8ホール レザーブーツ",
        description: "記念日のサプライズギフトに。クールタイプの男らしく存在感のある顔立ちに、無骨なレザーブーツが調和。足元にエッジを効かせることで全身の説得力が格段に増す。",
        price: "¥28,000〜",
        affiliateUrl: "https://example.com/affiliate/cool-drmartens-8hole",
        tag: "記念日に",
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
      { item: "テーラードジャケット＋スラックス", reason: "整った顔立ちとフォーマルな装いが相乗し、品格が自然に出る" },
      { item: "Vネック・ハイゲージニット", reason: "大人っぽい顔の印象と上品な素材感が一致し、色気が際立つ" },
      { item: "ロングコート（チェスター・ステンカラー）", reason: "面長のラインとロング丈の縦のシルエットが美しく調和する" },
      { item: "シルクやカシミヤ等の上質素材", reason: "上品な顔の雰囲気に見合う素材でないと、顔に服が負ける" },
      { item: "革靴・ローファー", reason: "足元の品の良さが、顔全体の上品な印象を最後まで裏切らない" },
    ],
    ngItems: [
      { item: "スポーティすぎるカジュアル", reason: "大人っぽい顔立ちとスポーツテイストが噛み合わず、年齢不詳に見える" },
      { item: "安っぽい素材の服", reason: "華やかな顔の印象に素材が追いつかず、全体が安く見えてしまう" },
      { item: "派手なストリート系", reason: "上品な顔の雰囲気と対極のテイストで、無理してる感が出る" },
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
