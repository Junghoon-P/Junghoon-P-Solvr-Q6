import { GoogleGenAI } from '@google/genai'
import { SleepData, SleepAdvice } from '../types/ai.types.js'

class AIService {
  private ai: GoogleGenAI
  private model = 'gemma-3-1b-it'

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!
    })
  }

  async analyzeSleepData(sleepData: SleepData[]): Promise<SleepAdvice> {
    // 데이터 검증
    this.validateSleepData(sleepData)

    const analysisPrompt = this.createAnalysisPrompt(sleepData)
    const sleepMetrics = this.calculateMetrics(sleepData)

    const config = {
      responseMimeType: 'application/json'
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: analysisPrompt
          }
        ]
      }
    ]

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        config,
        contents
      })

      const result = this.parseAndValidateResponse(response.text)

      return {
        analysis: result.analysis,
        recommendations: result.recommendations,
        score: this.calculateOverallScore(sleepData, sleepMetrics),
        insights: result.insights
      }
    } catch (error) {
      console.error('AI 분석 오류:', error)
      // 폴백 분석 제공
      return this.generateFallbackAnalysis(sleepData, sleepMetrics)
    }
  }

  private validateSleepData(sleepData: SleepData[]): void {
    if (!sleepData || sleepData.length === 0) {
      throw new Error('수면 데이터가 없습니다.')
    }

    if (sleepData.length > 30) {
      throw new Error('최대 30일간의 데이터만 분석 가능합니다.')
    }

    for (const data of sleepData) {
      if (!data.date || !data.sleepTime || !data.wakeTime) {
        throw new Error('필수 수면 데이터가 누락되었습니다.')
      }

      if (data.duration < 0 || data.duration > 24) {
        throw new Error('잘못된 수면 시간입니다.')
      }

      if (data.quality < 1 || data.quality > 5) {
        throw new Error('수면 품질은 1-5 사이여야 합니다.')
      }
    }
  }

  private calculateMetrics(sleepData: SleepData[]) {
    const avgDuration = sleepData.reduce((sum, data) => sum + data.duration, 0) / sleepData.length
    const avgQuality = sleepData.reduce((sum, data) => sum + data.quality, 0) / sleepData.length

    const consistencyScore = this.calculateConsistency(sleepData)
    const idealDurationCount = sleepData.filter(
      data => data.duration >= 7 && data.duration <= 9
    ).length
    const goodQualityCount = sleepData.filter(data => data.quality >= 4).length

    return {
      avgDuration: Math.round(avgDuration * 100) / 100,
      avgQuality: Math.round(avgQuality * 100) / 100,
      consistencyScore,
      idealDurationRate: (idealDurationCount / sleepData.length) * 100,
      goodQualityRate: (goodQualityCount / sleepData.length) * 100,
      totalDays: sleepData.length
    }
  }

  private calculateConsistency(sleepData: SleepData[]): number {
    if (sleepData.length < 2) return 100

    const sleepTimes = sleepData.map(data => this.timeToMinutes(data.sleepTime))
    const wakeTimes = sleepData.map(data => this.timeToMinutes(data.wakeTime))

    const sleepVariance = this.calculateVariance(sleepTimes)
    const wakeVariance = this.calculateVariance(wakeTimes)

    // 낮은 분산일수록 높은 일관성 점수
    const maxVariance = 180 // 3시간 분산을 최대로 가정
    const consistency = Math.max(0, 100 - ((sleepVariance + wakeVariance) / 2 / maxVariance) * 100)

    return Math.round(consistency)
  }

  private timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length
    return Math.sqrt(variance)
  }

  private calculateOverallScore(sleepData: SleepData[], metrics: any): number {
    // 다양한 요소를 고려한 종합 점수 계산
    const durationScore = Math.min(100, (metrics.avgDuration / 8) * 100)
    const qualityScore = (metrics.avgQuality / 5) * 100
    const consistencyScore = metrics.consistencyScore
    const regularityBonus = metrics.idealDurationRate > 70 ? 10 : 0

    const totalScore =
      durationScore * 0.3 + qualityScore * 0.4 + consistencyScore * 0.3 + regularityBonus

    return Math.min(100, Math.max(1, Math.round(totalScore)))
  }

  private createAnalysisPrompt(sleepData: SleepData[]): string {
    const metrics = this.calculateMetrics(sleepData)
    const dataString = sleepData
      .map(
        data =>
          `${data.date}: ${data.sleepTime}-${data.wakeTime} (${data.duration}h, 품질${data.quality}/5)`
      )
      .join('\n')

    return `
수면 전문가로서 다음 ${metrics.totalDays}일간의 수면 데이터를 분석해주세요:

${dataString}

현재 수면 지표:
- 평균 수면시간: ${metrics.avgDuration}시간
- 평균 수면품질: ${metrics.avgQuality}/5
- 수면 일관성: ${metrics.consistencyScore}%
- 이상적 수면시간(7-9h) 비율: ${metrics.idealDurationRate.toFixed(1)}%
- 좋은 품질(4점 이상) 비율: ${metrics.goodQualityRate.toFixed(1)}%

다음 JSON 형식으로 전문적이고 개인화된 분석을 제공해주세요:

{
  "analysis": "수면 패턴의 주요 특징과 문제점을 구체적으로 분석 (3-4문장)",
  "recommendations": [
    "가장 우선순위가 높은 개선방법",
    "실천 가능한 구체적 조치",
    "장기적 수면 습관 개선 방법"
  ],
  "insights": [
    "데이터에서 발견한 중요한 패턴",
    "개선이 필요한 구체적 영역"
  ]
}

한국어로 친근하면서도 전문적인 톤으로 작성해주세요.
    `
  }

  private parseAndValidateResponse(responseText: string): any {
    try {
      const result = JSON.parse(responseText)

      // 필수 필드 검증
      if (!result.analysis || !result.recommendations || !result.insights) {
        throw new Error('AI 응답 형식이 올바르지 않습니다.')
      }

      // 배열 검증
      if (!Array.isArray(result.recommendations) || !Array.isArray(result.insights)) {
        throw new Error('AI 응답의 배열 형식이 올바르지 않습니다.')
      }

      return result
    } catch (error) {
      console.error('AI 응답 파싱 오류:', error)
      throw new Error('AI 응답을 처리할 수 없습니다.')
    }
  }

  private generateFallbackAnalysis(sleepData: SleepData[], metrics: any): SleepAdvice {
    // AI 실패 시 기본 분석 제공
    const analysis = this.generateBasicAnalysis(metrics)
    const recommendations = this.generateBasicRecommendations(metrics)
    const insights = this.generateBasicInsights(metrics)

    return {
      analysis,
      recommendations,
      score: this.calculateOverallScore(sleepData, metrics),
      insights
    }
  }

  private generateBasicAnalysis(metrics: any): string {
    let analysis = `${metrics.totalDays}일간의 수면 데이터를 분석한 결과, `

    if (metrics.avgDuration < 7) {
      analysis += '수면 시간이 권장량보다 부족합니다. '
    } else if (metrics.avgDuration > 9) {
      analysis += '수면 시간이 권장량보다 깁니다. '
    } else {
      analysis += '수면 시간은 적절한 수준입니다. '
    }

    if (metrics.avgQuality < 3) {
      analysis += '수면 품질 개선이 필요합니다.'
    } else if (metrics.avgQuality >= 4) {
      analysis += '수면 품질은 양호한 편입니다.'
    } else {
      analysis += '수면 품질은 보통 수준입니다.'
    }

    return analysis
  }

  private generateBasicRecommendations(metrics: any): string[] {
    const recommendations: string[] = []

    if (metrics.avgDuration < 7) {
      recommendations.push('매일 7-9시간의 충분한 수면을 취하세요')
    }

    if (metrics.avgQuality < 4) {
      recommendations.push('수면 환경을 개선하고 규칙적인 수면 스케줄을 유지하세요')
    }

    if (metrics.consistencyScore < 70) {
      recommendations.push('일정한 시간에 자고 일어나는 습관을 만드세요')
    }

    if (recommendations.length === 0) {
      recommendations.push('현재 수면 패턴을 계속 유지하시기 바랍니다')
    }

    return recommendations
  }

  private generateBasicInsights(metrics: any): string[] {
    const insights: string[] = []

    if (metrics.idealDurationRate < 50) {
      insights.push('이상적인 수면시간(7-9시간)을 지킨 날이 절반 미만입니다')
    }

    if (metrics.goodQualityRate < 60) {
      insights.push('수면 품질이 좋은 날(4점 이상)의 비율이 낮습니다')
    }

    if (insights.length === 0) {
      insights.push('전반적으로 양호한 수면 패턴을 보이고 있습니다')
    }

    return insights
  }
}

export default new AIService()
