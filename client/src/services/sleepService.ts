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

export interface SleepStatistics {
  totalRecords: number
  averageSleepDuration: number
  averageQuality: number
  sleepTrend: SleepTrendData[]
  qualityDistribution: QualityDistribution[]
  weeklyPattern: WeeklyPatternData[]
  insights: string[]
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
  }
}
