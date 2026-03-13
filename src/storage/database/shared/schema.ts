import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  serial,
} from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

// 系统健康检查表（保留原有定义）
export const healthCheck = pgTable("health_check", {
  id: serial("id").notNull().primaryKey(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable(
  "users",
  {
    id: serial("id").notNull().primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    nickname: varchar("nickname", { length: 100 }),
    avatar: varchar("avatar", { length: 500 }),
    role: varchar("role", { length: 20 }).default("user").notNull(), // 'user' or 'admin'
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

// 留言墙表（使用 wall_messages 避免与旧的 messages 表冲突）
export const wallMessages = pgTable(
  "wall_messages",
  {
    id: serial("id").notNull().primaryKey(),
    userId: integer("user_id").references(() => users.id),
    nickname: varchar("nickname", { length: 100 }).default("匿名用户").notNull(),
    content: text("content").notNull(),
    isPublic: boolean("is_public").default(true).notNull(), // 公开或私密
    parentId: integer("parent_id").references((): any => wallMessages.id), // 回复的留言ID
    isAdminReply: boolean("is_admin_reply").default(false).notNull(), // 是否是管理员回复
    isPinned: boolean("is_pinned").default(false).notNull(), // 是否置顶
    likeCount: integer("like_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("messages_user_id_idx").on(table.userId),
    index("messages_parent_id_idx").on(table.parentId),
    index("messages_created_at_idx").on(table.createdAt),
    index("messages_is_public_idx").on(table.isPublic),
  ]
);

// 使用 createSchemaFactory 配置 date coercion
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// 用户的 Zod schemas
export const insertUserSchema = createCoercedInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  nickname: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(1, "密码不能为空"),
});

// 留言的 Zod schemas
export const insertMessageSchema = createCoercedInsertSchema(wallMessages).pick({
  nickname: true,
  content: true,
  isPublic: true,
  parentId: true,
});

export const replyMessageSchema = createCoercedInsertSchema(wallMessages).pick({
  content: true,
  parentId: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Message = typeof wallMessages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type ReplyMessage = z.infer<typeof replyMessageSchema>;
