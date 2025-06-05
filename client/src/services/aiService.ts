import api from './api'
import { SleepAnalysisRequest, AIResponse, AIServiceStatus } from '../types/ai.types'

export const aiService = {
  // 수면 데이터 AI 분석
  async analyzeSleep(request: SleepAnalysisRequest): Promise<AIResponse> {
    try {
      const response = await api.post('/ai/analyze', request)
      return response.data
    } catch (error: any) {
      console.error('AI 분석 API 오류:', error)

      if (error.response?.data) {
        return error.response.data
      }

      return {
        success: false,
        error: '수면 분석 서비스에 연결할 수 없습니다.'
      }
    }
  },

  // AI 서비스 상태 확인
  async getStatus(): Promise<{ success: boolean; data?: AIServiceStatus; error?: string }> {
    try {
      const response = await api.get('/ai/status')
      return response.data
    } catch (error: any) {
      console.error('AI 상태 확인 오류:', error)

      return {
        success: false,
        error: 'AI 서비스 상태를 확인할 수 없습니다.'
      }
    }
  }
}
