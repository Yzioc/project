import { pgTable, serial, text, timestamp, index, integer, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("blog_posts_created_at_idx").on(table.created_at),
  ]
);

export const gameRecords = pgTable(
  "game_records",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull(),
    scenario: varchar("scenario", { length: 100 }).notNull(),
    final_score: integer("final_score").notNull(),
    result: varchar("result", { length: 10 }).notNull(),
    played_at: timestamp("played_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("game_records_user_id_idx").on(table.user_id),
    index("game_records_played_at_idx").on(table.played_at),
  ]
);
