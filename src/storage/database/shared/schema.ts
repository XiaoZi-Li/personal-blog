import { pgTable, unique, serial, varchar, text, boolean, integer, timestamp, index, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 通知表
export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: varchar({ length: 20 }).notNull(), // 'reply', 'system'
	title: varchar({ length: 255 }).notNull(),
	content: text(),
	isRead: boolean("is_read").default(false).notNull(),
	relatedId: integer("related_id"), // 关联的留言/回复ID
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notifications_user_id_idx").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	index("notifications_is_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("notifications_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_fkey"
		}),
]);

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const techNews = pgTable("tech_news", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 500 }).notNull(),
	url: text().notNull(),
	source: varchar({ length: 255 }),
	summary: text(),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	fetchedAt: timestamp("fetched_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	nickname: varchar({ length: 100 }),
	avatar: varchar({ length: 500 }),
	role: varchar({ length: 20 }).default('user').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("users_role_idx").using("btree", table.role.asc().nullsLast().op("text_ops")),
	index("users_username_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	unique("users_username_key").on(table.username),
	unique("users_email_key").on(table.email),
]);

export const wallMessages = pgTable("wall_messages", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	nickname: varchar({ length: 100 }).notNull(),
	content: text().notNull(),
	isPublic: boolean("is_public").default(true).notNull(),
	parentId: integer("parent_id"),
	replyToUserId: integer("reply_to_user_id"),
	replyToNickname: varchar("reply_to_nickname", { length: 100 }),
	isAdminReply: boolean("is_admin_reply").default(false).notNull(),
	isPinned: boolean("is_pinned").default(false).notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("wall_messages_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("wall_messages_is_public_idx").using("btree", table.isPublic.asc().nullsLast().op("bool_ops")),
	index("wall_messages_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("wall_messages_user_id_idx").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "messages_user_id_fkey"
		}),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "messages_parent_id_fkey"
		}),
	foreignKey({
			columns: [table.replyToUserId],
			foreignColumns: [users.id],
			name: "messages_reply_to_user_id_fkey"
		}),
]);

export const pageViews = pgTable("page_views", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	page: varchar({ length: 255 }).notNull(),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	referrer: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("page_views_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("page_views_page_idx").using("btree", table.page.asc().nullsLast().op("text_ops")),
	index("page_views_user_id_idx").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
]);

// 内容表（教程 / 文章 / 日记）
export const posts = pgTable("posts", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	title: varchar({ length: 500 }).notNull(),
	type: varchar({ length: 20 }).default('article').notNull(), // 'tutorial' | 'article' | 'diary'
	category: varchar({ length: 20 }), // '51mcu' | 'stm32' | 'esp32' | 'dcdc'
	summary: text(),
	content: text().notNull(),
	cover: varchar({ length: 20 }),
	tags: text(),
	difficulty: varchar({ length: 20 }), // 'beginner' | 'intermediate' | 'advanced'
	mood: varchar({ length: 20 }),
	weather: varchar({ length: 20 }),
	views: integer("views").default(0).notNull(),
	likeCount: integer("like_count").default(0).notNull(),
	isPublished: boolean("is_published").default(true).notNull(),
	isPinned: boolean("is_pinned").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("posts_type_category_idx").using("btree", table.type.asc().nullsLast(), table.category.asc().nullsLast(), table.createdAt.desc().nullsFirst()),
	index("posts_published_idx").using("btree", table.isPublished.asc().nullsLast(), table.createdAt.desc().nullsFirst()),
]);

// 内容点赞表
export const postLikes = pgTable("post_likes", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	postId: varchar("post_id", { length: 36 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("post_likes_post_user_idx").using("btree", table.postId.asc().nullsLast(), table.userId.asc().nullsLast()),
]);

// 媒体记录表（作品集照片/视频）
export const media = pgTable("media", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	title: varchar({ length: 500 }).notNull(),
	description: text(),
	type: varchar({ length: 10 }).default('image').notNull(), // 'image' | 'video'
	url: text().notNull(),
	thumbnail: text(),
	category: varchar({ length: 20 }).default('works').notNull(), // 'works' | 'competition' | 'life'
	isPublished: boolean("is_published").default(true).notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("media_category_idx").using("btree", table.category.asc().nullsLast(), table.isPublished.asc().nullsLast(), table.sortOrder.desc().nullsFirst()),
]);
