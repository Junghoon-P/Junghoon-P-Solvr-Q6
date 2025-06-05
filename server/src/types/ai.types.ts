export interface SleepData {
  date: string
  sleepTime: string
  wakeTime: string
  duration: number
  quality: number
}

export interface SleepAnalysisRequest {
  sleepData: SleepData[]
  period: 'week' | 'month'
}

export interface SleepAdvice {
  analysis: string
  recommendations: string[]
  score: number
  insights: string[]
}

export interface AIResponse {
  success: boolean
  data?: SleepAdvice
  error?: string
}
