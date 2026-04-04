-- =============================================
-- 人工見積AI スキーマ
-- 建設人材会社向け見積管理
-- =============================================

-- 職種別単価マスタ
CREATE TABLE unit_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,           -- 職種名（型枠大工、鳶、鉄筋工 等）
  base_price INTEGER NOT NULL,      -- 基本単価（円/人工）
  cost_price INTEGER NOT NULL,      -- 原価（職人への支払い単価）
  night_multiplier NUMERIC(3,2) DEFAULT 1.25,  -- 夜間割増率
  overtime_multiplier NUMERIC(3,2) DEFAULT 1.25, -- 残業割増率
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_unit_prices_user ON unit_prices(user_id);
CREATE INDEX idx_unit_prices_job_type ON unit_prices(user_id, job_type) WHERE is_active = true;

-- 案件（元請からの依頼）
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                -- 案件名（○○ビル新築工事 等）
  client_name TEXT NOT NULL,         -- 元請会社名
  site_address TEXT DEFAULT '',      -- 現場住所
  start_date DATE,                   -- 工期開始
  end_date DATE,                     -- 工期終了
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected', 'completed')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(user_id, status);

-- 見積書
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  estimate_number TEXT NOT NULL,      -- 見積番号（自動採番）
  title TEXT NOT NULL,                -- 見積件名
  client_name TEXT NOT NULL,          -- 提出先
  issue_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,                   -- 見積有効期限
  subtotal INTEGER DEFAULT 0,         -- 小計
  tax_rate NUMERIC(4,2) DEFAULT 10.00, -- 消費税率
  tax_amount INTEGER DEFAULT 0,       -- 消費税額
  total_amount INTEGER DEFAULT 0,     -- 合計金額
  cost_total INTEGER DEFAULT 0,       -- 原価合計
  gross_profit INTEGER DEFAULT 0,     -- 粗利
  gross_margin NUMERIC(5,2) DEFAULT 0, -- 粗利率（%）
  notes TEXT DEFAULT '',               -- 備考
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_estimates_user ON estimates(user_id);
CREATE INDEX idx_estimates_project ON estimates(project_id);
CREATE INDEX idx_estimates_number ON estimates(user_id, estimate_number);

-- 見積明細行（職種×人数×日数）
CREATE TABLE estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  job_type TEXT NOT NULL,              -- 職種
  workers INTEGER NOT NULL DEFAULT 1,  -- 人数
  days NUMERIC(5,1) NOT NULL DEFAULT 1, -- 日数（0.5日単位対応）
  unit_price INTEGER NOT NULL,         -- 出し値単価（円/人工）
  cost_price INTEGER NOT NULL,         -- 原価単価
  amount INTEGER NOT NULL DEFAULT 0,   -- 小計（workers × days × unit_price）
  cost_amount INTEGER NOT NULL DEFAULT 0, -- 原価小計
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_estimate_items_estimate ON estimate_items(estimate_id);

-- 過去見積の実績（AI学習用）
CREATE TABLE estimate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  cost_price INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  region TEXT DEFAULT '',              -- 地域
  accepted BOOLEAN DEFAULT false,      -- 受注できたか
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_estimate_history_user ON estimate_history(user_id);
CREATE INDEX idx_estimate_history_job ON estimate_history(user_id, job_type);

-- =============================================
-- RLS ポリシー
-- =============================================

ALTER TABLE unit_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_history ENABLE ROW LEVEL SECURITY;

-- unit_prices: 自分のデータのみ
CREATE POLICY "unit_prices_select" ON unit_prices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "unit_prices_insert" ON unit_prices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "unit_prices_update" ON unit_prices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "unit_prices_delete" ON unit_prices FOR DELETE USING (auth.uid() = user_id);

-- projects: 自分のデータのみ
CREATE POLICY "projects_select" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (auth.uid() = user_id);

-- estimates: 自分のデータのみ
CREATE POLICY "estimates_select" ON estimates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "estimates_insert" ON estimates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "estimates_update" ON estimates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "estimates_delete" ON estimates FOR DELETE USING (auth.uid() = user_id);

-- estimate_items: 見積書の所有者のみ
CREATE POLICY "estimate_items_select" ON estimate_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));
CREATE POLICY "estimate_items_insert" ON estimate_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));
CREATE POLICY "estimate_items_update" ON estimate_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));
CREATE POLICY "estimate_items_delete" ON estimate_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM estimates WHERE estimates.id = estimate_items.estimate_id AND estimates.user_id = auth.uid()));

-- estimate_history: 自分のデータのみ
CREATE POLICY "estimate_history_select" ON estimate_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "estimate_history_insert" ON estimate_history FOR INSERT WITH CHECK (auth.uid() = user_id);
