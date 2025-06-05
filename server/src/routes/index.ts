import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import healthRoutes from './healthRoutes'
import authRoutes from './authRoutes'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  // 헬스 체크 라우트
  fastify.register(healthRoutes, { prefix: '/api/health' })

  // 인증 관련 라우트
  fastify.register(authRoutes, { prefix: '/api/auth' })

  // 사용자 관련 라우트
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })
}
