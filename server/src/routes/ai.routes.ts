import { FastifyPluginAsync } from 'fastify'
import { analyzeSleep } from '../controllers/ai.controller.js'

const aiRoutes: FastifyPluginAsync = async fastify => {
  // 수면 분석 API
  fastify.post('/analyze', analyzeSleep)
}

export default aiRoutes
