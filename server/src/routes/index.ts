import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import healthRoutes from './healthRoutes'
import authRoutes from './authRoutes'
import sleepRoutes from './sleepRoutes'
import statisticsRoutes from './statisticsRoutes'
import aiRoutes from './ai.routes'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  // 헬스 체크 라우트
  fastify.register(healthRoutes, { prefix: '/api/health' })

  // 인증 관련 라우트
  fastify.register(authRoutes, { prefix: '/api/auth' })

  // 수면 기록 관련 라우트
  fastify.register(sleepRoutes, { prefix: '/api/sleep-records' })

  // 수면 통계 관련 라우트
  fastify.register(statisticsRoutes, { prefix: '/api/statistics' })

  // AI 분석 관련 라우트
  fastify.register(aiRoutes, { prefix: '/api/ai' })

  // 사용자 관련 라우트
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })
}
