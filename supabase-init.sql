-- =====================================================
-- 个人博客网站 Supabase 建表 SQL
-- 使用方法：在 Supabase Dashboard → SQL Editor 中粘贴执行
-- =====================================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 技术交流区留言表
CREATE TABLE IF NOT EXISTS wall_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nickname TEXT NOT NULL DEFAULT '匿名用户',
  content TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  parent_id UUID REFERENCES wall_messages(id) ON DELETE CASCADE,
  reply_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reply_to_nickname TEXT,
  is_admin_reply BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_essence BOOLEAN NOT NULL DEFAULT false,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 留言点赞表
CREATE TABLE IF NOT EXISTS message_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES wall_messages(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- 4. 项目评论表
CREATE TABLE IF NOT EXISTS project_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nickname TEXT NOT NULL DEFAULT '匿名用户',
  content TEXT NOT NULL,
  parent_id UUID REFERENCES project_comments(id) ON DELETE CASCADE,
  reply_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reply_to_nickname TEXT,
  is_admin_reply BOOLEAN NOT NULL DEFAULT false,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. 项目评论点赞表
CREATE TABLE IF NOT EXISTS project_comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES project_comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- 6. 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'reply',
  title TEXT,
  content TEXT,
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. 页面访问统计表
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  page TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. 内容表（教程 / 文章 / 日记 统一存储）
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

-- 9. 内容点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- =====================================================
-- 索引（提升查询性能）
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_wall_messages_parent ON wall_messages(parent_id);
CREATE INDEX IF NOT EXISTS idx_wall_messages_public_pinned ON wall_messages(is_public, is_pinned, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_likes_message_user ON message_likes(message_id, user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_project ON project_comments(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent ON project_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_project_comment_likes_comment_user ON project_comment_likes(comment_id, user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_ip_page_time ON page_views(ip_address, page, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_category ON posts(type, category, is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user ON post_likes(post_id, user_id);

-- =====================================================
-- 自动更新 updated_at 触发器
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wall_messages_updated_at ON wall_messages;
CREATE TRIGGER update_wall_messages_updated_at BEFORE UPDATE ON wall_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_comments_updated_at ON project_comments;
CREATE TRIGGER update_project_comments_updated_at BEFORE UPDATE ON project_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 底层 GRANT 授权（新版 Supabase 项目不再自动授予，必须显式执行）
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- =====================================================
-- Supabase RLS（行级安全策略）
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "允许注册" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "用户可查看自己" ON users FOR SELECT USING (true);
CREATE POLICY "用户可更新自己" ON users FOR UPDATE USING (true);

-- wall_messages
CREATE POLICY "公开读取留言" ON wall_messages FOR SELECT USING (is_public = true);
CREATE POLICY "登录后发表留言" ON wall_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "作者可编辑留言" ON wall_messages FOR UPDATE USING (true);
CREATE POLICY "作者可删除留言" ON wall_messages FOR DELETE USING (true);

-- message_likes
CREATE POLICY "查看点赞" ON message_likes FOR SELECT USING (true);
CREATE POLICY "发表点赞" ON message_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "取消点赞" ON message_likes FOR DELETE USING (true);

-- project_comments
CREATE POLICY "公开读取评论" ON project_comments FOR SELECT USING (true);
CREATE POLICY "发表评论" ON project_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "作者可编辑评论" ON project_comments FOR UPDATE USING (true);
CREATE POLICY "作者可删除评论" ON project_comments FOR DELETE USING (true);

-- project_comment_likes
CREATE POLICY "查看评论点赞" ON project_comment_likes FOR SELECT USING (true);
CREATE POLICY "发表评论点赞" ON project_comment_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "取消评论点赞" ON project_comment_likes FOR DELETE USING (true);

-- notifications
CREATE POLICY "查看自己的通知" ON notifications FOR SELECT USING (true);
CREATE POLICY "插入通知" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "标记已读" ON notifications FOR UPDATE USING (true);

-- page_views
CREATE POLICY "记录访问" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "查看统计" ON page_views FOR SELECT USING (true);

-- posts
CREATE POLICY "公开读取内容" ON posts FOR SELECT USING (is_published = true OR is_published = false);
CREATE POLICY "管理内容" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "更新内容" ON posts FOR UPDATE USING (true);
CREATE POLICY "删除内容" ON posts FOR DELETE USING (true);

-- post_likes
CREATE POLICY "查看内容点赞" ON post_likes FOR SELECT USING (true);
CREATE POLICY "内容点赞" ON post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "取消内容点赞" ON post_likes FOR DELETE USING (true);

-- =====================================================
-- Supabase Storage：头像存储桶（公开读，限 2MB、仅图片）
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "头像上传" ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'avatars');
