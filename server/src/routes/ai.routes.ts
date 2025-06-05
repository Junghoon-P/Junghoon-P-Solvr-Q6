import { FastifyPluginAsync } from 'fastify'
import { analyzeSleep, getAnalysisStatus } from '../controllers/ai.controller.js'

const aiRoutes: FastifyPluginAsync = async fastify => {
  // 수면 분석 API
  fastify.post(
    '/analyze',
    {
      schema: {
        body: {
          type: 'object',
          required: ['sleepData'],
          properties: {
            sleepData: {
              type: 'array',
              items: {
                type: 'object',
                required: ['date', 'sleepTime', 'wakeTime', 'duration', 'quality'],
                properties: {
                  date: { type: 'string' },
                  sleepTime: { type: 'string' },
                  wakeTime: { type: 'string' },
                  duration: { type: 'number', minimum: 0, maximum: 24 },
                  quality: { type: 'integer', minimum: 1, maximum: 5 }
                }
              },
              minItems: 1,
              maxItems: 30
            },
            period: {
              type: 'string',
              enum: ['week', 'month']
            }
          }
        }
      }
    },
    analyzeSleep
  )

  // AI 서비스 상태 확인 API
  fastify.get('/status', getAnalysisStatus)
}

export default aiRoutes
