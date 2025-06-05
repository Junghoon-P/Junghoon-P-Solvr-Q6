import React, { useState, useEffect } from 'react'
import { aiService } from '../services/aiService'
import { SleepData, SleepAdvice } from '../types/ai.types'
import { Loader, Brain, TrendingUp, Lightbulb, Star } from 'lucide-react'

interface SleepAnalysisProps {
  sleepData: SleepData[]
  period?: 'week' | 'month'
}

export const SleepAnalysis: React.FC<SleepAnalysisProps> = ({ sleepData, period = 'week' }) => {
  const [advice, setAdvice] = useState<SleepAdvice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeSleep = async () => {
    if (!sleepData || sleepData.length === 0) {
      setError('분석할 수면 데이터가 없습니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await aiService.analyzeSleep({ sleepData, period })

      if (response.success && response.data) {
        setAdvice(response.data)
      } else {
        setError(response.error || 'AI 분석에 실패했습니다.')
      }
    } catch (err) {
      setError('분석 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sleepData.length > 0) {
      analyzeSleep()
    }
  }, [sleepData, period])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '우수'
    if (score >= 60) return '보통'
    return '개선 필요'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin h-8 w-8 text-blue-500 mr-3" />
          <span className="text-gray-600">AI가 수면 패턴을 분석 중입니다...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI 수면 분석
          </h3>
          <button
            onClick={analyzeSleep}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            다시 분석
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!advice) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI 수면 분석
          </h3>
          <button
            onClick={analyzeSleep}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            disabled={sleepData.length === 0}
          >
            분석 시작
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          AI가 제공하는 개인화된 수면 분석을 받아보세요
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          AI 수면 분석
        </h3>
        <button
          onClick={analyzeSleep}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          다시 분석
        </button>
      </div>

      {/* 수면 점수 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">종합 수면 점수</h4>
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getScoreColor(advice.score)}`}>
                {advice.score}
              </span>
              <span className="text-lg text-gray-500 ml-1">/ 100</span>
              <span
                className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(advice.score)}`}
              >
                {getScoreLabel(advice.score)}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.ceil(advice.score / 20)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 분석 결과 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          수면 패턴 분석
        </h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{advice.analysis}</p>
        </div>
      </div>

      {/* 개선 방법 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          개선 방법
        </h4>
        <div className="space-y-3">
          {advice.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start bg-blue-50 rounded-lg p-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 인사이트 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3">주요 인사이트</h4>
        <div className="space-y-2">
          {advice.insights.map((insight, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 메타데이터 */}
      {advice.metadata && (
        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 space-y-1">
            <p>분석 기간: {advice.metadata.analyzedDays}일</p>
            <p>처리 시간: {advice.metadata.processingTime}ms</p>
            <p>분석 일시: {new Date(advice.metadata.timestamp).toLocaleString('ko-KR')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
