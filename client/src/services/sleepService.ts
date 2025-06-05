const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// 세션 ID 관리
const getSessionId = () => localStorage.getItem('sessionId')

// 인증 헤더 생성
const getAuthHeaders = (includeContentType = true): Record<string, string> => {
  const sessionId = getSessionId()
  const headers: Record<string, string> = {}

  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }

  if (sessionId) {
    headers['Authorization'] = `Bearer ${sessionId}`
  }

  return headers
}

export interface SleepRecord {
  id: number
  userId: number
  date: string
  sleepTime: string
  wakeTime: string
  duration: number
  quality: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSleepRecord {
  date: string
  sleepTime: string
  wakeTime: string
  quality: number
  notes?: string
}

// 통계 관련 타입 정의
export interface SleepTrendData {
  date: string
  duration: number
  quality: number
}

export interface QualityDistribution {
  quality: string
  value: number
  count: number
}

export interface WeeklyPatternData {
  day: string
  averageDuration: number
  averageQuality: number
  count: number
}

export interface MonthlyStats {
  month: string
  averageDuration: number
  averageQuality: number
  totalRecords: number
}

export interface SleepGoalProgress {
  targetDuration: number
  currentAverage: number
  achievementRate: number
  daysAchieved: number
  totalDays: number
}

export interface DetailedInsights {
  sleepDebt: number
  consistency: number
  bestSleepDay: string
  worstSleepDay: string
  recommendations: string[]
}

export interface SleepStatistics {
  totalRecords: number
  averageSleepDuration: number
  averageQuality: number
  sleepTrend: SleepTrendData[]
  qualityDistribution: QualityDistribution[]
  weeklyPattern: WeeklyPatternData[]
  insights: string[]
}

export interface ExtendedSleepStatistics extends SleepStatistics {
  monthlyStats: MonthlyStats[]
  goalProgress: SleepGoalProgress
  detailedInsights: DetailedInsights
  sleepEfficiency: number
  longestSleep: number
  shortestSleep: number
}

export const sleepService = {
  async getSleepRecords(): Promise<SleepRecord[]> {
    const response = await fetch(`${API_BASE_URL}/sleep-records`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('수면 기록을 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data?.records || []
  },

  async getSleepRecord(id: number): Promise<SleepRecord> {
    const response = await fetch(`${API_BASE_URL}/sleep-records/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('수면 기록을 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data?.record
  },

  async createSleepRecord(data: CreateSleepRecord): Promise<SleepRecord> {
    const response = await fetch(`${API_BASE_URL}/sleep-records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '수면 기록 생성에 실패했습니다.')
    }

    const result = await response.json()
    return result.data?.record
  },

  async updateSleepRecord(id: number, data: Partial<CreateSleepRecord>): Promise<SleepRecord> {
    const response = await fetch(`${API_BASE_URL}/sleep-records/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '수면 기록 수정에 실패했습니다.')
    }

    const result = await response.json()
    return result.data?.record
  },

  async deleteSleepRecord(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sleep-records/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '수면 기록 삭제에 실패했습니다.')
    }
  },

  async getSleepStatistics(days: number = 30): Promise<SleepStatistics> {
    const response = await fetch(`${API_BASE_URL}/statistics?days=${days}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('수면 통계를 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  },

  // 확장된 통계 정보 조회
  async getExtendedStatistics(days: number = 30): Promise<ExtendedSleepStatistics> {
    const response = await fetch(`${API_BASE_URL}/statistics/extended?days=${days}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('확장 통계를 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  },

  // 월간 통계 조회
  async getMonthlyStatistics(year: number, month: number): Promise<MonthlyStats> {
    const response = await fetch(`${API_BASE_URL}/statistics/monthly?year=${year}&month=${month}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('월간 통계를 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  },

  // 수면 목표 설정 및 조회
  async setSleepGoal(targetDuration: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sleep-goal`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetDuration })
    })

    if (!response.ok) {
      throw new Error('수면 목표 설정에 실패했습니다.')
    }
  },

  async getSleepGoal(): Promise<{ targetDuration: number }> {
    const response = await fetch(`${API_BASE_URL}/sleep-goal`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('수면 목표를 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  },

  // 수면 품질 추이 분석
  async getQualityTrend(days: number = 30): Promise<SleepTrendData[]> {
    const response = await fetch(`${API_BASE_URL}/statistics/quality-trend?days=${days}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('수면 품질 추이를 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  },

  // 수면 패턴 분석
  async getSleepPattern(period: 'week' | 'month' = 'week'): Promise<WeeklyPatternData[]> {
    const response = await fetch(`${API_BASE_URL}/statistics/pattern?period=${period}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('수면 패턴을 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  },

  // AI 기반 수면 분석 및 추천
  async getAIInsights(days: number = 30): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/statistics/ai-insights?days=${days}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('AI 분석을 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data?.insights || []
  },

  // 수면 데이터 내보내기
  async exportSleepData(format: 'csv' | 'json' = 'csv', days?: number): Promise<Blob> {
    const params = new URLSearchParams({ format })
    if (days) params.append('days', days.toString())

    const response = await fetch(`${API_BASE_URL}/sleep-records/export?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(false)
    })

    if (!response.ok) {
      throw new Error('데이터 내보내기에 실패했습니다.')
    }

    return response.blob()
  }
}

// 클라이언트 사이드 유틸리티 함수들
export const sleepUtils = {
  // 수면 시간을 분 단위로 변환
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  },

  // 분 단위를 시간:분 형식으로 변환
  convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  },

  // 수면 시간 계산 (크로스 미드나이트 고려)
  calculateSleepDuration(bedtime: string, wakeTime: string): number {
    const bedMinutes = this.convertTimeToMinutes(bedtime)
    let wakeMinutes = this.convertTimeToMinutes(wakeTime)

    // 다음 날 깬 경우
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60
    }

    return wakeMinutes - bedMinutes
  },

  // 수면 효율성 계산
  calculateSleepEfficiency(records: SleepRecord[]): number {
    if (records.length === 0) return 0

    const totalDuration = records.reduce((sum, record) => sum + record.duration, 0)
    const averageDuration = totalDuration / records.length
    const idealDuration = 8 * 60 // 8시간을 분으로 변환

    return Math.min((averageDuration / idealDuration) * 100, 100)
  },

  // 수면 품질 등급 변환
  getQualityLabel(quality: number): string {
    const labels = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음']
    return labels[quality - 1] || '알 수 없음'
  },

  // 수면 품질 색상 코드
  getQualityColor(quality: number): string {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']
    return colors[quality - 1] || '#6b7280'
  },

  // 수면 일관성 계산 (표준편차 기반)
  calculateSleepConsistency(records: SleepRecord[]): number {
    if (records.length < 2) return 0

    const durations = records.map(record => record.duration)
    const average = durations.reduce((sum, duration) => sum + duration, 0) / durations.length
    const variance =
      durations.reduce((sum, duration) => sum + Math.pow(duration - average, 2), 0) /
      durations.length
    const standardDeviation = Math.sqrt(variance)

    // 일관성 점수 (0-100, 낮은 표준편차가 높은 점수)
    return Math.max(0, 100 - (standardDeviation / 60) * 10)
  },

  // 주간 패턴 분석
  analyzeWeeklyPattern(records: SleepRecord[]): {
    [key: string]: { avgDuration: number; avgQuality: number; count: number }
  } {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const pattern: { [key: string]: { durations: number[]; qualities: number[]; count: number } } =
      {}

    // 초기화
    weekdays.forEach(day => {
      pattern[day] = { durations: [], qualities: [], count: 0 }
    })

    // 데이터 수집
    records.forEach(record => {
      const dayOfWeek = new Date(record.date).getDay()
      const dayName = weekdays[dayOfWeek]
      pattern[dayName].durations.push(record.duration)
      pattern[dayName].qualities.push(record.quality)
      pattern[dayName].count++
    })

    // 평균 계산
    const result: { [key: string]: { avgDuration: number; avgQuality: number; count: number } } = {}
    Object.entries(pattern).forEach(([day, data]) => {
      result[day] = {
        avgDuration:
          data.durations.length > 0
            ? data.durations.reduce((sum, d) => sum + d, 0) / data.durations.length
            : 0,
        avgQuality:
          data.qualities.length > 0
            ? data.qualities.reduce((sum, q) => sum + q, 0) / data.qualities.length
            : 0,
        count: data.count
      }
    })

    return result
  },

  // 수면 부채 계산
  calculateSleepDebt(records: SleepRecord[], idealDuration: number = 480): number {
    if (records.length === 0) return 0

    const totalDeficit = records.reduce((debt, record) => {
      const deficit = Math.max(0, idealDuration - record.duration)
      return debt + deficit
    }, 0)

    return totalDeficit
  },

  // 월별 통계 생성
  generateMonthlyStats(records: SleepRecord[]): MonthlyStats[] {
    const monthlyData: { [key: string]: SleepRecord[] } = {}

    records.forEach(record => {
      const date = new Date(record.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = []
      }
      monthlyData[monthKey].push(record)
    })

    return Object.entries(monthlyData)
      .map(([month, monthRecords]) => ({
        month,
        averageDuration: monthRecords.reduce((sum, r) => sum + r.duration, 0) / monthRecords.length,
        averageQuality: monthRecords.reduce((sum, r) => sum + r.quality, 0) / monthRecords.length,
        totalRecords: monthRecords.length
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  },

  // 수면 추천 생성
  generateRecommendations(records: SleepRecord[]): string[] {
    if (records.length === 0) return ['더 많은 수면 데이터가 필요합니다.']

    const recommendations: string[] = []
    const avgDuration = records.reduce((sum, r) => sum + r.duration, 0) / records.length
    const avgQuality = records.reduce((sum, r) => sum + r.quality, 0) / records.length
    const consistency = this.calculateSleepConsistency(records)

    // 수면 시간 권장사항
    if (avgDuration < 420) {
      // 7시간 미만
      recommendations.push('수면 시간이 부족합니다. 최소 7-8시간의 수면을 취하세요.')
    } else if (avgDuration > 540) {
      // 9시간 초과
      recommendations.push('수면 시간이 과도할 수 있습니다. 8시간 내외의 수면을 권장합니다.')
    }

    // 수면 품질 권장사항
    if (avgQuality < 3) {
      recommendations.push('수면 품질 개선이 필요합니다. 규칙적인 수면 스케줄을 유지하세요.')
    }

    // 일관성 권장사항
    if (consistency < 70) {
      recommendations.push('수면 패턴의 일관성을 높이세요. 매일 같은 시간에 잠자리에 드세요.')
    }

    // 주간 패턴 분석 권장사항
    const weeklyPattern = this.analyzeWeeklyPattern(records)
    const weekendAvg = (weeklyPattern['토'].avgDuration + weeklyPattern['일'].avgDuration) / 2
    const weekdayAvg =
      Object.entries(weeklyPattern)
        .filter(([day]) => !['토', '일'].includes(day))
        .reduce((sum, [, data]) => sum + data.avgDuration, 0) / 5

    if (Math.abs(weekendAvg - weekdayAvg) > 60) {
      recommendations.push('주말과 평일의 수면 패턴 차이를 줄이세요.')
    }

    return recommendations.length > 0
      ? recommendations
      : ['현재 수면 패턴이 양호합니다. 계속 유지하세요!']
  }
}
