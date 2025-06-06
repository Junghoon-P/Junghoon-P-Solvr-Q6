import { useState, useEffect, useMemo, useCallback } from 'react'
import { sleepService, SleepStatistics } from '../services/sleepService'
import { SleepTrendChart, SleepQualityChart, WeeklyPatternChart } from '../components/charts'
import { SleepAnalysis } from '../components/SleepAnalysis'
import { SleepData } from '../types/ai.types'

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState<SleepStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState(30)

  const periodOptions = useMemo(
    () => [
      { value: 7, label: '최근 7일' },
      { value: 30, label: '최근 30일' },
      { value: 60, label: '최근 60일' },
      { value: 90, label: '최근 90일' }
    ],
    []
  )

  const fetchStatistics = useCallback(async (days: number) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await sleepService.getSleepStatistics(days)
      setStatistics(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : '통계를 가져올 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatistics(selectedPeriod)
  }, [selectedPeriod, fetchStatistics])

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }, [])

  // 수면 통계 데이터를 AI 분석용 데이터로 변환 - useMemo로 최적화
  const convertToAIData = useMemo((): SleepData[] => {
    if (!statistics?.sleepTrend) return []

    return statistics.sleepTrend.map(item => ({
      date: item.date,
      sleepTime: '23:00', // 기본값 (실제 데이터가 있다면 사용)
      wakeTime: '07:00', // 기본값 (실제 데이터가 있다면 사용)
      duration: item.duration / 60, // 분을 시간으로 변환
      quality: item.quality
    }))
  }, [statistics?.sleepTrend])

  // AI 분석 기간 결정 - useMemo로 최적화
  const getAIPeriod = useMemo(() => {
    if (selectedPeriod <= 7) return 'week'
    return 'month'
  }, [selectedPeriod])

  // 통계 카드 데이터 - useMemo로 최적화
  const statisticsCards = useMemo(() => {
    if (!statistics) return []

    return [
      {
        title: '총 기록',
        value: `${statistics.totalRecords}일`,
        icon: (
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
        bgColor: 'bg-blue-100'
      },
      {
        title: '평균 수면시간',
        value: formatDuration(statistics.averageSleepDuration),
        icon: (
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
        bgColor: 'bg-purple-100'
      },
      {
        title: '평균 수면 품질',
        value: `${statistics.averageQuality.toFixed(1)}점`,
        icon: (
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ),
        bgColor: 'bg-green-100'
      }
    ]
  }, [statistics, formatDuration])

  const handlePeriodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(Number(e.target.value))
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
    )
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">통계 데이터를 불러올 수 없습니다</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수면 분석</h1>
          <p className="mt-1 text-sm text-gray-600">
            당신의 수면 패턴을 분석하고 개선점을 찾아보세요
          </p>
        </div>

        {/* 기간 선택 */}
        <div className="flex items-center space-x-2">
          <label htmlFor="period" className="text-sm font-medium text-gray-700">
            기간:
          </label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI 수면 분석 섹션 */}
      <SleepAnalysis sleepData={convertToAIData} period={getAIPeriod} />

      {/* 기본 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statisticsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 ${card.bgColor} rounded-full`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 수면 시간 추이 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">수면 시간 추이</h3>
          <SleepTrendChart data={statistics.sleepTrend} />
        </div>

        {/* 수면 품질 분포 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">수면 품질 분포</h3>
          <SleepQualityChart data={statistics.qualityDistribution} />
        </div>
      </div>

      {/* 주간 패턴 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">주간 수면 패턴</h3>
        <WeeklyPatternChart data={statistics.weeklyPattern} />
      </div>

      {/* 인사이트 */}
      {statistics.insights && statistics.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">수면 인사이트</h3>
          <div className="space-y-3">
            {statistics.insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StatisticsPage
