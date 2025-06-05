import { FastifyRequest, FastifyReply } from 'fastify'
import aiService from '../services/ai.service.js'
import { SleepAnalysisRequest, AIResponse } from '../types/ai.types.js'

export const analyzeSleep = async (
  request: FastifyRequest<{ Body: SleepAnalysisRequest }>,
  reply: FastifyReply
): Promise<AIResponse> => {
  try {
    const { sleepData } = request.body

    if (!sleepData || sleepData.length === 0) {
      return reply.status(400).send({
        success: false,
        error: '수면 데이터가 필요합니다.'
      })
    }

    const analysis = await aiService.analyzeSleepData(sleepData)

    return reply.status(200).send({
      success: true,
      data: analysis
    })
  } catch (error) {
    console.error('수면 분석 컨트롤러 오류:', error)
    return reply.status(500).send({
      success: false,
      error: '수면 분석 중 오류가 발생했습니다.'
    })
  }
}
