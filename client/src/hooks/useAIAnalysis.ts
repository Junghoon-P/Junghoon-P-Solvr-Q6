import { useCallback, useState } from 'react'
import { aiService } from '../services/aiService'
import { SleepAdvice, SleepAnalysisRequest } from '../types/ai.types'

interface UseAIAnalysisResult {
  advice: SleepAdvice | null
  loading: boolean
  error: string | null
  analyzeSleep: (request: SleepAnalysisRequest) => Promise<void>
  clearError: () => void
  reset: () => void
}

export const useAIAnalysis = (): UseAIAnalysisResult => {
  const [advice, setAdvice] = useState<SleepAdvice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeSleep = useCallback(async (request: SleepAnalysisRequest) => {
    if (!request.sleepData || request.sleepData.length === 0) {
      setError('분석할 수면 데이터가 없습니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await aiService.analyzeSleep(request)

      if (response.success && response.data) {
        setAdvice(response.data)
      } else {
        setError(response.error || 'AI 분석에 실패했습니다.')
      }
    } catch (err) {
      setError('분석 중 오류가 발생했습니다.')
      console.error('AI 분석 오류:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setAdvice(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    advice,
    loading,
    error,
    analyzeSleep,
    clearError,
    reset
  }
}
