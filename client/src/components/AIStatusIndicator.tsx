import React, { useState, useEffect } from 'react'
import { aiService } from '../services/aiService'
import { AIServiceStatus } from '../types/ai.types'
import { Circle, Brain } from 'lucide-react'

export const AIStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<AIServiceStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await aiService.getStatus()
        if (response.success && response.data) {
          setStatus(response.data)
        }
      } catch (error) {
        console.error('AI 상태 확인 실패:', error)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000) // 1분마다 확인

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (service: string) => {
    switch (service) {
      case 'healthy':
        return 'text-green-500'
      case 'degraded':
        return 'text-yellow-500'
      default:
        return 'text-red-500'
    }
  }

  const getStatusText = (service: string) => {
    switch (service) {
      case 'healthy':
        return 'AI 분석 서비스 정상'
      case 'degraded':
        return 'AI 분석 서비스 지연'
      default:
        return 'AI 분석 서비스 중단'
    }
  }

  if (!status) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="relative">
        {/* 상태 인디케이터 */}
        <div className="bg-white rounded-full shadow-lg p-2 border cursor-pointer hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-purple-500" />
            <Circle className={`h-2 w-2 fill-current ${getStatusColor(status.service)}`} />
          </div>
        </div>

        {/* 상세 정보 툴팁 */}
        {isVisible && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">AI 분석 상태</span>
                <span className={`text-xs font-medium ${getStatusColor(status.service)}`}>
                  {getStatusText(status.service)}
                </span>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div>모델: {status.model}</div>
                <div>업데이트: {new Date(status.timestamp).toLocaleTimeString('ko-KR')}</div>
              </div>

              <div className="border-t pt-2">
                <div className="text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>수면 분석:</span>
                    <span
                      className={status.features.sleepAnalysis ? 'text-green-600' : 'text-red-600'}
                    >
                      {status.features.sleepAnalysis ? '활성' : '비활성'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>폴백 모드:</span>
                    <span
                      className={status.features.fallbackMode ? 'text-green-600' : 'text-red-600'}
                    >
                      {status.features.fallbackMode ? '활성' : '비활성'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
