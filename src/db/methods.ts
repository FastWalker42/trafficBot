import db from './config'
import { channelsTable, usersTable } from './schema'
import { eq, sql } from 'drizzle-orm'
import { User } from './types'

export async function checkUser(
  user_id: number,
  invited_by: number | undefined = undefined
): Promise<(User & { is_newbie: boolean }) | null> {
  // 1. Проверяем, есть ли пользователь
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.user_id, user_id))

  // 2. Если есть — возвращаем его и is_newbie: false
  if (existing.length > 0) {
    return { ...existing[0], is_newbie: false }
  }

  // 3. Если нет — создаём и возвращаем is_newbie: true
  await db
    .insert(usersTable)
    .values({ user_id, invited_by: invited_by })
    .run()

  const inserted = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.user_id, user_id))

  return inserted.length > 0
    ? { ...inserted[0], is_newbie: true }
    : null
}

export async function addAdmin(user_id: number): Promise<boolean> {
  const result = await db
    .update(usersTable)
    .set({ is_admin: 1 })
    .where(eq(usersTable.user_id, user_id))
    .run()

  return result.rowsAffected > 0
}

export async function removeAdmin(user_id: number): Promise<boolean> {
  const result = await db
    .update(usersTable)
    .set({ is_admin: 0 })
    .where(eq(usersTable.user_id, user_id))
    .run()

  return result.rowsAffected > 0
}

export async function getAdmins(): Promise<number[]> {
  const result = await db
    .select({ user_id: usersTable.user_id })
    .from(usersTable)
    .where(eq(usersTable.is_admin, 1))

  return result.map((row) => row.user_id)
}

export async function addChannel(
  channel_id: string
): Promise<boolean> {
  const result = await db
    .insert(channelsTable)
    .values({ channel_id })
    .onConflictDoNothing()
    .run()

  return result.rowsAffected > 0
}

export async function removeChannel(
  channel_id: string
): Promise<boolean> {
  const result = await db
    .delete(channelsTable)
    .where(eq(channelsTable.channel_id, channel_id))
    .run()

  return result.rowsAffected > 0
}

export async function getAllChannels(): Promise<string[]> {
  const result = await db.select().from(channelsTable)

  return result.map((row) => row.channel_id)
}

export async function getUserById(
  user_id: number
): Promise<User | null> {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.user_id, user_id))

  return result.length > 0 ? result[0] : null
}

export async function increaseReferral(
  user_id: number
): Promise<boolean> {
  const result = await db.run(
    db
      .update(usersTable)
      .set({ referals: sql`${usersTable.referals} + 1` })
      .where(eq(usersTable.user_id, user_id))
  )

  return result.rowsAffected > 0
}

export async function getTopRandomUsers(
  limit: number = 100
): Promise<User[]> {
  const result = await db
    .select()
    .from(usersTable)
    .orderBy(
      sql`${usersTable.referals} DESC, RANDOM()` // приоритет по рефералам, затем случайность
    )
    .limit(limit)

  return result
}

export async function setUserState(
  user_id: number,
  state: string
): Promise<boolean> {
  const result = await db
    .update(usersTable)
    .set({ state })
    .where(eq(usersTable.user_id, user_id))
    .run()

  return result.rowsAffected > 0
}

export async function setUserSubscribed(
  user_id: number,
  subscribed: boolean
): Promise<boolean> {
  const result = await db
    .update(usersTable)
    .set({ subscribed: subscribed ? 1 : 0 })
    .where(eq(usersTable.user_id, user_id))
    .run()

  return result.rowsAffected > 0
}

export async function getUserCount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(usersTable)

  return result[0]?.count ?? 0
}

export async function getUsersBatch(
  offset: number,
  limit: number
): Promise<User[]> {
  const result = await db
    .select()
    .from(usersTable)
    .orderBy(usersTable.user_id)
    .limit(limit)
    .offset(offset)

  return result
}

export async function dumpDatabaseToJson() {
  const users = await db.select().from(usersTable)
  const channels = await db.select().from(channelsTable)

  return { users, channels }
}
