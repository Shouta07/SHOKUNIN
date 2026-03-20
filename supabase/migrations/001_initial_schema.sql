-- SHOKUNIN MVPデータベーススキーマ
-- PostGIS拡張を有効化（地理空間検索用）
CREATE EXTENSION IF NOT EXISTS postgis;

-- ==========================================
-- 職人プロフィール
-- ==========================================
CREATE TABLE craftsman_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  specialty TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  location GEOGRAPHY(POINT, 4326), -- PostGIS地理座標
  service_radius_km INTEGER NOT NULL DEFAULT 30,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_craftsman_location ON craftsman_profiles USING GIST(location);
CREATE INDEX idx_craftsman_specialty ON craftsman_profiles(specialty);

-- ==========================================
-- 施工パッケージ（出品）
-- ==========================================
CREATE TABLE service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id UUID NOT NULL REFERENCES craftsman_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  description_html TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0), -- 円
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  category TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  schema_json_ld JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_category ON service_packages(category) WHERE is_active = true;

-- ==========================================
-- 動画コース
-- ==========================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craftsman_id UUID NOT NULL REFERENCES craftsman_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0),
  thumbnail_url TEXT,
  schema_json_ld JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- コースのチャプター
-- ==========================================
CREATE TABLE course_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_path TEXT NOT NULL, -- Supabase Storage上のパス
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chapters_course ON course_chapters(course_id, sort_order);

-- ==========================================
-- コース購入
-- ==========================================
CREATE TABLE course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- ==========================================
-- 学習進捗
-- ==========================================
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES course_chapters(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  watched_seconds INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

-- ==========================================
-- 注文（施工サービス）
-- ==========================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  craftsman_id UUID NOT NULL REFERENCES craftsman_profiles(id),
  service_package_id UUID NOT NULL REFERENCES service_packages(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','authorized','scheduled','in_progress','completed','invoiced','paid','cancelled')),
  stripe_payment_intent_id TEXT,
  scheduled_date DATE,
  total_price INTEGER NOT NULL,
  completion_photo_url TEXT,
  invoice_pdf_url TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_craftsman ON orders(craftsman_id, status);
CREATE INDEX idx_orders_customer ON orders(customer_id, status);

-- ==========================================
-- RLS (Row Level Security)
-- ==========================================
ALTER TABLE craftsman_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 職人プロフィール: 誰でも閲覧可、本人のみ編集
CREATE POLICY "craftsman_profiles_select" ON craftsman_profiles FOR SELECT USING (true);
CREATE POLICY "craftsman_profiles_update" ON craftsman_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "craftsman_profiles_insert" ON craftsman_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 施工パッケージ: アクティブなものは誰でも閲覧、職人のみ管理
CREATE POLICY "service_packages_select" ON service_packages FOR SELECT USING (is_active = true);
CREATE POLICY "service_packages_manage" ON service_packages FOR ALL
  USING (craftsman_id IN (SELECT id FROM craftsman_profiles WHERE user_id = auth.uid()));

-- コース: 公開コースは誰でも閲覧
CREATE POLICY "courses_select" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "courses_manage" ON courses FOR ALL
  USING (craftsman_id IN (SELECT id FROM craftsman_profiles WHERE user_id = auth.uid()));

-- チャプター: コースが公開されていれば閲覧可
CREATE POLICY "chapters_select" ON course_chapters FOR SELECT
  USING (course_id IN (SELECT id FROM courses WHERE is_published = true));
CREATE POLICY "chapters_manage" ON course_chapters FOR ALL
  USING (course_id IN (SELECT id FROM courses WHERE craftsman_id IN (SELECT id FROM craftsman_profiles WHERE user_id = auth.uid())));

-- 購入記録: 本人のみ閲覧
CREATE POLICY "purchases_select" ON course_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "purchases_insert" ON course_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 学習進捗: 本人のみ
CREATE POLICY "progress_select" ON learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_upsert" ON learning_progress FOR ALL USING (auth.uid() = user_id);

-- 注文: 顧客と職人が閲覧可
CREATE POLICY "orders_select" ON orders FOR SELECT
  USING (auth.uid() = customer_id OR craftsman_id IN (SELECT id FROM craftsman_profiles WHERE user_id = auth.uid()));
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "orders_update" ON orders FOR UPDATE
  USING (auth.uid() = customer_id OR craftsman_id IN (SELECT id FROM craftsman_profiles WHERE user_id = auth.uid()));

-- ==========================================
-- 地理空間検索用の関数
-- ==========================================
CREATE OR REPLACE FUNCTION find_nearby_craftsmen(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50,
  specialty_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  specialty TEXT,
  rating NUMERIC,
  review_count INTEGER,
  distance_km DOUBLE PRECISION,
  service_radius_km INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cp.id,
    cp.display_name,
    cp.specialty,
    cp.rating,
    cp.review_count,
    ROUND(ST_Distance(
      cp.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000, 1) AS distance_km,
    cp.service_radius_km
  FROM craftsman_profiles cp
  WHERE cp.is_available = true
    AND cp.location IS NOT NULL
    AND ST_DWithin(
      cp.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
    AND (specialty_filter IS NULL OR cp.specialty ILIKE '%' || specialty_filter || '%')
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
