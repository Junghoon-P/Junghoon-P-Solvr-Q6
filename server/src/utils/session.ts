import { randomBytes } from 'crypto'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { eq, and, lt, gt } from 'drizzle-orm'
import { sessions, users } from '../db/schema'
import type { User } from '../db/schema'
import env from '../config/env'

const sqlite = new Database(env.DATABASE_URL)
const db = drizzle(sqlite)

// 세션 만료 시간 (7일)
const SESSION_EXPIRY_DAYS = 7

// 세션 ID 생성
export const generateSessionId = (): string => {
  return randomBytes(32).toString('hex')
}

// 세션 생성
export const createSession = async (userId: number): Promise<string> => {
  const sessionId = generateSessionId()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt: expiresAt.toISOString()
  })

  return sessionId
}

// 세션 검증 및 사용자 정보 반환
export const validateSession = async (sessionId: string): Promise<User | null> => {
  if (!sessionId) return null

  try {
    const result = await db
      .select({
        user: users
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(
        and(
          eq(sessions.id, sessionId),
          // 만료되지 않은 세션만
          gt(sessions.expiresAt, new Date().toISOString())
        )
      )
      .limit(1)

    return result[0]?.user || null
  } catch (error) {
    console.error('세션 검증 중 오류:', error)
    return null
  }
}

// 세션 삭제 (로그아웃)
export const deleteSession = async (sessionId: string): Promise<void> => {
  if (!sessionId) return

  try {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  } catch (error) {
    console.error('세션 삭제 중 오류:', error)
  }
}

// 만료된 세션 정리
export const cleanupExpiredSessions = async (): Promise<void> => {
  try {
    const now = new Date().toISOString()
    await db.delete(sessions).where(lt(sessions.expiresAt, now))
  } catch (error) {
    console.error('만료된 세션 정리 중 오류:', error)
  }
}

// 사용자의 모든 세션 삭제
export const deleteAllUserSessions = async (userId: number): Promise<void> => {
  try {
    await db.delete(sessions).where(eq(sessions.userId, userId))
  } catch (error) {
    console.error('사용자 세션 삭제 중 오류:', error)
  }
}
