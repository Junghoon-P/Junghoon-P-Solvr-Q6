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
    const analysisPrompt = this.createAnalysisPrompt(sleepData)

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

      const result = JSON.parse(response.text)
      return {
        analysis: result.analysis,
        recommendations: result.recommendations,
        score: result.score,
        insights: result.insights
      }
    } catch (error) {
      console.error('AI 분석 오류:', error)
      throw new Error('수면 분석 중 오류가 발생했습니다.')
    }
  }

  private createAnalysisPrompt(sleepData: SleepData[]): string {
    const dataString = sleepData
      .map(
        data =>
          `날짜: ${data.date}, 잠든시간: ${data.sleepTime}, 깬시간: ${data.wakeTime}, 수면시간: ${data.duration}시간, 수면품질: ${data.quality}/5`
      )
      .join('\n')

    return `
다음 수면 데이터를 분석하고 수면 개선 조언을 제공해주세요:

${dataString}

다음 JSON 형식으로 응답해주세요:
{
  "analysis": "전반적인 수면 패턴 분석 (2-3문장)",
  "recommendations": ["구체적인 개선 방법 1", "구체적인 개선 방법 2", "구체적인 개선 방법 3"],
  "score": 수면 건강도 점수 (1-100),
  "insights": ["주요 인사이트 1", "주요 인사이트 2"]
}

한국어로 친근하고 전문적인 톤으로 작성해주세요.
    `
  }
}

export default new AIService()
