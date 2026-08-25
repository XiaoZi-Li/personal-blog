-- =====================================================
-- 增量迁移：学习专区 + 博客（教程 / 文章 / 日记）
-- 使用方法：在 Supabase Dashboard → SQL Editor 中粘贴执行
-- 日期：2026-08-25
-- =====================================================

-- 1. 内容表（教程 / 文章 / 日记 统一存储）
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'article' CHECK (type IN ('tutorial', 'article', 'diary')),
  category TEXT,                -- 教程分区：'51mcu' | 'stm32' | 'esp32' | 'dcdc'（文章/日记为 NULL）
  summary TEXT,
  content TEXT NOT NULL,        -- Markdown 正文
  cover TEXT,                   -- 封面 emoji
  tags TEXT,                    -- 逗号分隔标签
  difficulty TEXT,              -- 教程难度：'beginner' | 'intermediate' | 'advanced'
  mood TEXT,                    -- 日记心情 emoji
  weather TEXT,                 -- 日记天气
  views INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 内容点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_posts_type_category ON posts(type, category, is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user ON post_likes(post_id, user_id);

-- updated_at 触发器
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开读取内容" ON posts FOR SELECT USING (is_published = true OR is_published = false);
CREATE POLICY "管理内容" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "更新内容" ON posts FOR UPDATE USING (true);
CREATE POLICY "删除内容" ON posts FOR DELETE USING (true);

CREATE POLICY "查看内容点赞" ON post_likes FOR SELECT USING (true);
CREATE POLICY "内容点赞" ON post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "取消内容点赞" ON post_likes FOR DELETE USING (true);

-- GRANT（与初始化脚本保持一致）
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
