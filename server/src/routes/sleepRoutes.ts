import { FastifyInstance } from 'fastify'
import {
  getSleepRecords,
  getSleepRecord,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord
} from '../controllers/sleepController'
import { authMiddleware } from '../middleware/auth'

export default async function sleepRoutes(fastify: FastifyInstance) {
  // 모든 수면 기록 라우트는 인증이 필요

  // 수면 기록 목록 조회
  fastify.get('/', {
    preHandler: authMiddleware,
    handler: getSleepRecords
  })

  // 특정 수면 기록 조회
  fastify.get<{ Params: { id: string } }>('/:id', {
    preHandler: authMiddleware,
    handler: getSleepRecord
  })

  // 수면 기록 생성
  fastify.post<{ Body: any }>('/', {
    preHandler: authMiddleware,
    handler: createSleepRecord
  })

  // 수면 기록 수정
  fastify.put<{ Params: { id: string }; Body: any }>('/:id', {
    preHandler: authMiddleware,
    handler: updateSleepRecord
  })

  // 수면 기록 삭제
  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: authMiddleware,
    handler: deleteSleepRecord
  })
}
