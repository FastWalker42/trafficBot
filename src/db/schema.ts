import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const usersTable = sqliteTable('users', {
  user_id: int().notNull().unique(),
  state: text().notNull().default('none'),
  invited_by: int().notNull().default(0),

  referals: int().notNull().default(0),
  last_activity: text()
    .notNull()
    .default(sql`(current_timestamp)`),

  subscribed: int().notNull().default(0),
  is_admin: int().notNull().default(0), // 0 = false, 1 = true
})

export const channelsTable = sqliteTable('channels', {
  channel_id: text().notNull().unique(),
})
