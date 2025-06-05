import { FastifyRequest, FastifyReply } from 'fastify'
import { validateSession } from '../utils/session'
import { createErrorResponse } from '../utils/response'
import type { User } from '../db/schema'

// 사용자 정보를 request에 추가하기 위한 타입 확장
declare module 'fastify' {
  interface FastifyRequest {
    user?: User
  }
}

// 인증 미들웨어
export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Authorization 헤더에서 세션 ID 가져오기
    const authHeader = request.headers.authorization
    const sessionId = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!sessionId) {
      return reply.status(401).send(createErrorResponse('인증이 필요합니다. 로그인해주세요.'))
    }

    // 세션 검증
    const user = await validateSession(sessionId)

    if (!user) {
      return reply
        .status(401)
        .send(createErrorResponse('세션이 만료되었습니다. 다시 로그인해주세요.'))
    }

    // request에 사용자 정보 추가
    request.user = user
  } catch (error) {
    console.error('인증 미들웨어 오류:', error)
    return reply.status(500).send(createErrorResponse('인증 처리 중 오류가 발생했습니다.'))
  }
}

// 선택적 인증 미들웨어 (로그인하지 않아도 접근 가능하지만, 로그인한 경우 사용자 정보 제공)
export const optionalAuthMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization
    const sessionId = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (sessionId) {
      const user = await validateSession(sessionId)
      if (user) {
        request.user = user
      }
    }
  } catch (error) {
    console.error('선택적 인증 미들웨어 오류:', error)
    // 오류가 발생해도 요청을 계속 진행
  }
}
