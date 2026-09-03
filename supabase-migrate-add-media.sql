-- =====================================================
-- 增量迁移：作品集（照片 / 视频）
-- 使用方法：在 Supabase Dashboard → SQL Editor 中粘贴执行
-- 日期：2026-09-03
-- =====================================================

-- 1. 媒体记录表
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,                       -- 文件直链（Supabase Storage 公开地址或外部链接）
  thumbnail TEXT,                          -- 视频封面图（可选）
  category TEXT NOT NULL DEFAULT 'works',  -- 'works' 作品 | 'competition' 竞赛 | 'life' 生活
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_category ON media(category, is_published, sort_order DESC, created_at DESC);

-- RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开读取媒体" ON media FOR SELECT USING (is_published = true OR is_published = false);
CREATE POLICY "管理媒体" ON media FOR INSERT WITH CHECK (true);
CREATE POLICY "更新媒体" ON media FOR UPDATE USING (true);
CREATE POLICY "删除媒体" ON media FOR DELETE USING (true);

-- 2. 存储桶（公开可读；上传走服务端签名的临时 URL，只有管理员能拿到）
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "公开读取媒体文件" ON storage.objects;
CREATE POLICY "公开读取媒体文件" ON storage.objects FOR SELECT USING (bucket_id = 'media');

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
