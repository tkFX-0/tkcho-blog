-- tkcho-blog Supabase テーブル作成SQL
-- Supabase Dashboard > SQL Editor で実行してください

-- いいね (Likes) テーブル
CREATE TABLE likes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_likes_unique ON likes (slug, fingerprint);
CREATE INDEX idx_likes_slug ON likes (slug);

-- ページビュー (Page Views) テーブル
CREATE TABLE page_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  count BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- likes: 誰でも読み取り・追加可能
CREATE POLICY "likes_select" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON likes FOR INSERT WITH CHECK (true);

-- page_views: 誰でも読み取り可能、追加・更新も可能（API Route経由）
CREATE POLICY "views_select" ON page_views FOR SELECT USING (true);
CREATE POLICY "views_insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "views_update" ON page_views FOR UPDATE USING (true);
