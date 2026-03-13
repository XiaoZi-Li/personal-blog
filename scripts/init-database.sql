-- ============================================
-- 个人博客数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- 创建用户表索引
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- 创建留言墙表
CREATE TABLE IF NOT EXISTS wall_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  nickname VARCHAR(100) NOT NULL DEFAULT '匿名用户',
  content TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  parent_id INTEGER REFERENCES wall_messages(id),
  is_admin_reply BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建留言墙表索引
CREATE INDEX IF NOT EXISTS wall_messages_user_id_idx ON wall_messages(user_id);
CREATE INDEX IF NOT EXISTS wall_messages_parent_id_idx ON wall_messages(parent_id);
CREATE INDEX IF NOT EXISTS wall_messages_created_at_idx ON wall_messages(created_at);
CREATE INDEX IF NOT EXISTS wall_messages_is_public_idx ON wall_messages(is_public);

-- ============================================
-- 插入管理员账户
-- 请修改下面的密码为你自己的密码
-- 密码需要先用 bcrypt 加密，这里提供一个示例密码 "admin123"
-- ============================================

-- 插入管理员账户 (密码: admin123)
-- 注意：建议部署后立即修改密码
INSERT INTO users (username, email, password, nickname, role, is_active)
VALUES (
  'admin',
  'purplemist@qq.com',
  '$2b$10$Qfq15aRGJ4vrvAOHKnk7KeUFMBQK1plPRM2fpC0ne3kZJ72jyNFCO',
  '李俊杰',
  'admin',
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 完成！
-- ============================================
