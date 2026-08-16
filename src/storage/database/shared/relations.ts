import { relations } from "drizzle-orm/relations";
import { users, wallMessages } from "./schema";

export const wallMessagesRelations = relations(wallMessages, ({one, many}) => ({
	user: one(users, {
		fields: [wallMessages.userId],
		references: [users.id]
	}),
	wallMessage: one(wallMessages, {
		fields: [wallMessages.parentId],
		references: [wallMessages.id],
		relationName: "wallMessages_parentId_wallMessages_id"
	}),
	wallMessages: many(wallMessages, {
		relationName: "wallMessages_parentId_wallMessages_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	wallMessages: many(wallMessages),
}));