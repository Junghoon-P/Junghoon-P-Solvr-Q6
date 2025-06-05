import { FastifyRequest, FastifyReply } from 'fastify'
import aiService from '../services/ai.service.js'
import { SleepAnalysisRequest, AIResponse } from '../types/ai.types.js'

export const analyzeSleep = async (
  request: FastifyRequest<{ Body: SleepAnalysisRequest }>,
  reply: FastifyReply
): Promise<AIResponse> => {
  const startTime = Date.now()

  try {
    const { sleepData, period } = request.body

    if (!sleepData || sleepData.length === 0) {
      request.log.warn('수면 분석 요청: 데이터 없음')
      return reply.status(400).send({
        success: false,
        error: '분석할 수면 데이터가 필요합니다.'
      })
    }

    if (sleepData.length > 30) {
      request.log.warn(`수면 분석 요청: 데이터 개수 초과 (${sleepData.length}개)`)
      return reply.status(400).send({
        success: false,
        error: '최대 30일간의 데이터만 분석 가능합니다.'
      })
    }

    request.log.info(`수면 분석 시작: ${sleepData.length}일간 데이터, 기간: ${period || 'default'}`)

    const analysis = await aiService.analyzeSleepData(sleepData)

    const processingTime = Date.now() - startTime
    request.log.info(`수면 분석 완료: ${processingTime}ms, 점수: ${analysis.score}`)

    return reply.status(200).send({
      success: true,
      data: {
        ...analysis,
        metadata: {
          analyzedDays: sleepData.length,
          period: period || 'custom',
          processingTime,
          timestamp: new Date().toISOString()
        }
      }
    })
  } catch (error) {
    const processingTime = Date.now() - startTime

    if (error instanceof Error) {
      if (
        error.message.includes('데이터') ||
        error.message.includes('시간') ||
        error.message.includes('품질')
      ) {
        request.log.warn(`수면 분석 검증 오류: ${error.message}`)
        return reply.status(400).send({
          success: false,
          error: error.message
        })
      }

      if (error.message.includes('API') || error.message.includes('AI')) {
        request.log.error(`AI 서비스 오류: ${error.message}`)
        return reply.status(503).send({
          success: false,
          error: '분석 서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해주세요.'
        })
      }
    }

    request.log.error('수면 분석 예상치 못한 오류:', error)
    return reply.status(500).send({
      success: false,
      error: '수면 분석 중 오류가 발생했습니다. 관리자에게 문의해주세요.'
    })
  }
}

export const getAnalysisStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const status = {
      service: 'healthy',
      model: 'gemma-3-1b-it',
      timestamp: new Date().toISOString(),
      features: {
        sleepAnalysis: true,
        fallbackMode: true,
        dataValidation: true
      }
    }

    return reply.status(200).send({
      success: true,
      data: status
    })
  } catch (error) {
    request.log.error('AI 상태 확인 오류:', error)
    return reply.status(500).send({
      success: false,
      error: '서비스 상태를 확인할 수 없습니다.'
    })
  }
}
