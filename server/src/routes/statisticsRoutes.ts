import { FastifyInstance } from 'fastify'
import { getSleepStatistics } from '../controllers/statisticsController'
import { authMiddleware } from '../middleware/auth'

export default async function statisticsRoutes(fastify: FastifyInstance) {
  // 수면 통계 조회 - 인증 필요
  fastify.get<{ Querystring: { days?: string } }>('/', {
    preHandler: authMiddleware,
    handler: getSleepStatistics
  })
}
