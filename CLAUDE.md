# CLAUDE.md

## サービス概要

SHOKUNIN（職人）は、建築・設備系の職人と消費者を直接つなぐスキルシェアプラットフォーム。
中間業者を排除し、職人の技術を正当に評価することを目的とする。

主な機能:
- **施工パッケージ出品**: 職人がサービスを出品し、消費者が予約・決済
- **AI出品支援**: Claude API で口語入力からプロ仕様の説明文を自動生成
- **職人検索**: 郵便番号 + PostGIS で近隣の職人を距離順に表示
- **動画学習**: 職人が技術動画コースを販売、チャプター単位で進捗管理
- **2段階決済**: Stripe で与信確保 → 施工完了時にキャプチャ

---

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (App Router) + React 19 + TypeScript 5.9 (strict) |
| スタイリング | Tailwind CSS 4 + PostCSS |
| DB | PostgreSQL + PostGIS (Supabase マネージド) |
| 認証 | Supabase Auth (SSR Cookie ベース) |
| ストレージ | Supabase Storage (動画・施工写真) |
| 決済 | Stripe (PaymentIntent, manual capture) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| 自動化 | n8n Webhook (任意) |
| デプロイ | Vercel (東京リージョン hnd1) |

---

## ディレクトリ構成

```
src/
├── app/                     # Next.js App Router
│   ├── page.tsx             # LP（ランディングページ）
│   ├── layout.tsx           # ルートレイアウト + メタデータ
│   ├── globals.css          # デザイントークン (CSS変数 + Tailwind)
│   ├── services/page.tsx    # 施工パッケージ一覧
│   ├── search/page.tsx      # 郵便番号で職人検索 (client component)
│   ├── courses/page.tsx     # 動画コース一覧
│   ├── dashboard/page.tsx   # 職人ダッシュボード (client component)
│   └── api/
│       ├── services/route.ts          # GET/POST 施工パッケージ
│       ├── matching/route.ts          # POST 地理検索マッチング
│       ├── generate-description/route.ts  # POST AI説明文生成
│       ├── orders/route.ts            # GET/POST 注文
│       ├── orders/[id]/complete/route.ts  # POST 施工完了+決済キャプチャ
│       ├── courses/route.ts           # GET/POST コース
│       ├── courses/[id]/progress/route.ts # GET/POST 学習進捗
│       ├── courses/[id]/video/route.ts    # GET 署名付き動画URL
│       └── webhooks/stripe/route.ts   # POST Stripe Webhook
├── components/
│   ├── ui/                  # 汎用UIコンポーネント (Button, Card)
│   └── layout/              # レイアウト系 (BottomNav)
├── lib/
│   ├── stripe.ts            # Stripe シングルトン
│   └── supabase/
│       ├── server.ts        # サーバー用クライアント (anon / service role)
│       └── client.ts        # ブラウザ用クライアント
└── types/
    └── database.ts          # DB型定義 (CraftsmanProfile, Order, etc.)

supabase/migrations/
└── 001_initial_schema.sql   # 全テーブル + RLS + PostGIS関数
```

---

## よく使うコマンド

```bash
npm run dev       # 開発サーバー起動
npm run build     # 本番ビルド (デプロイ前に必ず確認)
npm run lint      # ESLint (next lint)
npm run start     # 本番サーバー起動
```

テストフレームワークは未導入。

---

## 設計上の制約・ルール

### パスエイリアス
- `@/*` → `src/*` で統一。相対パスは使わない。

### 命名規則
- 変数・関数: camelCase (`postalCode`, `handleSearch`)
- 型・インターフェース: PascalCase (`CraftsmanProfile`, `ServicePackage`)
- DBカラム: snake_case (`craftsman_id`, `is_active`)
- ファイル: PascalCase (コンポーネント) / kebab-case (その他)

### コンポーネント規約
- Server Component がデフォルト。`"use client"` は状態管理が必要なページのみ。
- UIコンポーネントは `className` prop を受け取り、外部からスタイル拡張可能にする。
- BottomNav (4タブ: ホーム / 検索 / ダッシュボード / コース) が全ページ共通ナビゲーション。

### API Route 規約
- 認証チェックは各ルートの先頭で `supabase.auth.getUser()` を呼ぶ。
- レスポンス形式: `{ data: ... }` (成功) / `{ error: "メッセージ" }` (失敗)。
- 管理者操作・Webhook は `createServiceRoleSupabase()` (RLS バイパス) を使用。
- n8n Webhook は fire-and-forget (`fetch().catch(console.error)`)。

### DB・認証
- 全テーブルに RLS (Row Level Security) が有効。ポリシー変更時は migration ファイルに追記。
- UUID 主キー (`gen_random_uuid()`)、TIMESTAMPTZ (`now()`)。
- 外部キーは ON DELETE CASCADE。
- JSONB は Schema.org JSON-LD の格納に使用。

### 決済
- 施工サービス: Stripe PaymentIntent の `capture_method: "manual"` で2段階決済。
- 動画コース: 即時決済。Webhook (`payment_intent.succeeded`) で `course_purchases` に記録。
- 通貨は JPY 固定 (少数点なし)。

### スタイリング
- Tailwind CSS 4 ユーティリティクラスを直接使用。
- テーマカラー: `--color-primary: #1a365d` (紺) / `--color-accent: #ed8936` (橙)。
- タッチターゲット最小 48×48px (`.touch-target`)。現場での手袋着用を想定。
- フォント: `"Hiragino Sans", "Noto Sans JP", sans-serif`。

### 画像
- `next/image` の `remotePatterns` は `*.supabase.co` のみ許可。
- 外部画像ソースを追加する場合は `next.config.ts` を更新すること。

---

## 環境変数

`.env.local.example` を参照。必須:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
ANTHROPIC_API_KEY
```

任意: `N8N_WEBHOOK_URL`, `NEXT_PUBLIC_APP_URL`

---

## 作業時の注意点

1. **ビルド確認**: 変更後は `npm run build` が通ることを確認する。TypeScript strict モード。
2. **DB変更**: テーブル追加・変更は `supabase/migrations/` に新しい SQL ファイルを作成。既存ファイルは編集しない。
3. **RLS**: 新テーブルには必ず RLS ポリシーを設定する。ポリシーなしだと全データアクセス不可になる。
4. **Stripe**: テスト環境では `sk_test_` / `pk_test_` キーを使用。本番キーをコードにハードコードしない。
5. **ジオコーディング**: 現在は郵便番号→座標変換がダミー実装（東京付近のランダムオフセット）。本番運用前に Google Geocoding API 等への差し替えが必要。
6. **エラーメッセージ**: ユーザー向けメッセージは日本語で統一。
7. **`NEXT_PUBLIC_` プレフィックス**: クライアントに露出して良い値のみに付与。秘密鍵には絶対に付けない。
8. **動画URL**: Supabase Storage の署名付き URL は60分で失効する。長時間再生を考慮した再取得ロジックが必要な場合がある。
9. **未実装機能**: レビュー投稿、管理者画面、手数料システム、本人確認 (eKYC) は未実装。実装優先度は `docs/requirements.md` を参照。
