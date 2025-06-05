import { FastifyRequest, FastifyReply } from 'fastify'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { eq, desc, sql, and, gte } from 'drizzle-orm'
import { sleepRecords } from '../db/schema'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import env from '../config/env'

const sqlite = new Database(env.DATABASE_URL)
const db = drizzle(sqlite)

// 수면 통계 조회
export const getSleepStatistics = async (
  request: FastifyRequest<{ Querystring: { days?: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = request.user?.id
    const days = parseInt(request.query.days || '30')

    if (!userId) {
      return reply.status(401).send(createErrorResponse('로그인이 필요합니다.'))
    }

    // 날짜 범위 계산
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]

    // 기본 수면 기록 조회
    const records = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.userId, userId), gte(sleepRecords.date, startDateStr)))
      .orderBy(desc(sleepRecords.date))

    if (records.length === 0) {
      return reply.send(
        createSuccessResponse(
          {
            totalRecords: 0,
            averageSleepDuration: 0,
            averageQuality: 0,
            sleepTrend: [],
            qualityDistribution: [],
            insights: []
          },
          '수면 통계를 가져왔습니다.'
        )
      )
    }

    // 기본 통계 계산
    const totalRecords = records.length
    const totalDuration = records.reduce((sum, record) => sum + record.duration, 0)
    const averageSleepDuration = Math.round(totalDuration / totalRecords)

    const totalQuality = records.reduce((sum, record) => sum + record.quality, 0)
    const averageQuality = Math.round((totalQuality / totalRecords) * 10) / 10

    // 수면 시간 추이 (최근 30일)
    const sleepTrend = records
      .slice(0, 30)
      .reverse()
      .map(record => ({
        date: record.date,
        duration: record.duration,
        quality: record.quality
      }))

    // 수면 품질 분포
    const qualityCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    records.forEach(record => {
      qualityCount[record.quality as keyof typeof qualityCount]++
    })

    const qualityDistribution = [
      { quality: '매우 나쁨', value: qualityCount[1], count: qualityCount[1] },
      { quality: '나쁨', value: qualityCount[2], count: qualityCount[2] },
      { quality: '보통', value: qualityCount[3], count: qualityCount[3] },
      { quality: '좋음', value: qualityCount[4], count: qualityCount[4] },
      { quality: '매우 좋음', value: qualityCount[5], count: qualityCount[5] }
    ]

    // 인사이트 생성
    const insights = generateInsights(records, averageSleepDuration, averageQuality)

    // 주간 패턴 분석
    const weeklyPattern = analyzeWeeklyPattern(records)

    reply.send(
      createSuccessResponse(
        {
          totalRecords,
          averageSleepDuration,
          averageQuality,
          sleepTrend,
          qualityDistribution,
          weeklyPattern,
          insights
        },
        '수면 통계를 가져왔습니다.'
      )
    )
  } catch (error) {
    console.error('수면 통계 조회 중 오류:', error)
    reply.status(500).send(createErrorResponse('수면 통계 조회 중 오류가 발생했습니다.'))
  }
}

// 인사이트 생성 함수
function generateInsights(
  records: any[],
  averageDuration: number,
  averageQuality: number
): string[] {
  const insights: string[] = []

  // 수면 시간 분석
  if (averageDuration >= 480) {
    // 8시간 이상
    insights.push('충분한 수면 시간을 유지하고 있습니다! 👏')
  } else if (averageDuration >= 420) {
    // 7시간 이상
    insights.push('적정 수면 시간에 근접합니다. 조금 더 일찍 잠자리에 들어보세요.')
  } else {
    insights.push('수면 시간이 부족합니다. 더 일찍 잠자리에 드는 것을 권장합니다.')
  }

  // 수면 품질 분석
  if (averageQuality >= 4.0) {
    insights.push('수면 품질이 우수합니다! 현재 패턴을 유지하세요.')
  } else if (averageQuality >= 3.0) {
    insights.push('수면 품질을 개선할 여지가 있습니다. 수면 환경을 점검해보세요.')
  } else {
    insights.push('수면 품질 개선이 필요합니다. 스트레스 관리와 수면 습관을 검토해보세요.')
  }

  // 최근 7일 분석
  const recentRecords = records.slice(0, 7)
  if (recentRecords.length >= 7) {
    const recentAvgDuration = recentRecords.reduce((sum, r) => sum + r.duration, 0) / 7
    const overallAvg = records.reduce((sum, r) => sum + r.duration, 0) / records.length

    if (recentAvgDuration > overallAvg + 30) {
      insights.push('최근 수면 패턴이 개선되고 있습니다! 🌙')
    } else if (recentAvgDuration < overallAvg - 30) {
      insights.push('최근 수면이 불규칙해지고 있습니다. 생활 패턴을 점검해보세요.')
    }
  }

  return insights
}

// 주간 패턴 분석
function analyzeWeeklyPattern(records: any[]) {
  const weeklyData = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] } as Record<number, any[]>

  records.forEach(record => {
    const date = new Date(record.date)
    const dayOfWeek = date.getDay() // 0: 일요일, 1: 월요일, ...
    weeklyData[dayOfWeek].push(record)
  })

  return Object.keys(weeklyData).map(day => {
    const dayRecords = weeklyData[parseInt(day)]
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']

    if (dayRecords.length === 0) {
      return {
        day: dayNames[parseInt(day)],
        averageDuration: 0,
        averageQuality: 0,
        count: 0
      }
    }

    const avgDuration = Math.round(
      dayRecords.reduce((sum, r) => sum + r.duration, 0) / dayRecords.length
    )
    const avgQuality =
      Math.round((dayRecords.reduce((sum, r) => sum + r.quality, 0) / dayRecords.length) * 10) / 10

    return {
      day: dayNames[parseInt(day)],
      averageDuration: avgDuration,
      averageQuality: avgQuality,
      count: dayRecords.length
    }
  })
}
