import { FastifyRequest, FastifyReply } from 'fastify'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { createSession, deleteSession } from '../utils/session'
import { successResponse, errorResponse } from '../utils/response'
import env from '../config/env'

const sqlite = new Database(env.DATABASE_URL)
const db = drizzle(sqlite)

// 로그인 요청 타입
interface LoginRequest {
  email: string
}

// 로그인
export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { email } = request.body

    if (!email) {
      return reply.status(400).send(errorResponse('이메일을 입력해주세요.'))
    }

    // 사용자 조회 (간단한 이메일 기반 로그인)
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1)

    const user = userResult[0]

    if (!user) {
      return reply.status(401).send(errorResponse('등록되지 않은 이메일입니다.'))
    }

    // 세션 생성
    const sessionId = await createSession(user.id)

    reply.send(
      successResponse('로그인되었습니다.', {
        sessionId,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    )
  } catch (error) {
    console.error('로그인 중 오류:', error)
    reply.status(500).send(errorResponse('로그인 처리 중 오류가 발생했습니다.'))
  }
}

// 로그아웃
export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const sessionId = request.headers.authorization?.replace('Bearer ', '')

    if (sessionId) {
      // 세션 삭제
      await deleteSession(sessionId)
    }

    reply.send(successResponse('로그아웃되었습니다.'))
  } catch (error) {
    console.error('로그아웃 중 오류:', error)
    reply.status(500).send(errorResponse('로그아웃 처리 중 오류가 발생했습니다.'))
  }
}

// 현재 사용자 정보 조회
export const getCurrentUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const user = request.user

    if (!user) {
      return reply.status(401).send(errorResponse('로그인이 필요합니다.'))
    }

    reply.send(
      successResponse('사용자 정보를 가져왔습니다.', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    )
  } catch (error) {
    console.error('사용자 정보 조회 중 오류:', error)
    reply.status(500).send(errorResponse('사용자 정보 조회 중 오류가 발생했습니다.'))
  }
}
