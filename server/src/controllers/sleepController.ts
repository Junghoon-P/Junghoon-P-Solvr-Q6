import { FastifyRequest, FastifyReply } from 'fastify'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { eq, and, desc } from 'drizzle-orm'
import { sleepRecords } from '../db/schema'
import { successResponse, errorResponse } from '../utils/response'
import env from '../config/env'

const sqlite = new Database(env.DATABASE_URL)
const db = drizzle(sqlite)

// 수면 기록 생성 요청 타입
interface CreateSleepRecordRequest {
  date: string // YYYY-MM-DD
  sleepTime: string // HH:MM
  wakeTime: string // HH:MM
  quality: number // 1-5
  notes?: string // 특이사항
}

// 수면 기록 수정 요청 타입
interface UpdateSleepRecordRequest {
  date?: string
  sleepTime?: string
  wakeTime?: string
  quality?: number
  notes?: string
}

// 수면 시간 계산 함수 (분 단위)
const calculateDuration = (sleepTime: string, wakeTime: string): number => {
  const [sleepHour, sleepMin] = sleepTime.split(':').map(Number)
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number)

  let sleepMinutes = sleepHour * 60 + sleepMin
  let wakeMinutes = wakeHour * 60 + wakeMin

  // 다음날 기상인 경우 (예: 23:00 ~ 07:00)
  if (wakeMinutes <= sleepMinutes) {
    wakeMinutes += 24 * 60
  }

  return wakeMinutes - sleepMinutes
}

// 수면 기록 목록 조회
export const getSleepRecords = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = request.user?.id

    if (!userId) {
      return reply.status(401).send(errorResponse('로그인이 필요합니다.'))
    }

    const records = await db
      .select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(desc(sleepRecords.date))

    reply.send(successResponse('수면 기록을 가져왔습니다.', { records }))
  } catch (error) {
    console.error('수면 기록 조회 중 오류:', error)
    reply.status(500).send(errorResponse('수면 기록 조회 중 오류가 발생했습니다.'))
  }
}

// 수면 기록 생성
export const createSleepRecord = async (
  request: FastifyRequest<{ Body: CreateSleepRecordRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = request.user?.id
    const { date, sleepTime, wakeTime, quality, notes } = request.body

    if (!userId) {
      return reply.status(401).send(errorResponse('로그인이 필요합니다.'))
    }

    // 필수 필드 검증
    if (!date || !sleepTime || !wakeTime || !quality) {
      return reply
        .status(400)
        .send(errorResponse('날짜, 취침시간, 기상시간, 수면품질은 필수입니다.'))
    }

    // 수면 품질 범위 검증
    if (quality < 1 || quality > 5) {
      return reply.status(400).send(errorResponse('수면 품질은 1-5 사이의 값이어야 합니다.'))
    }

    // 수면 시간 계산
    const duration = calculateDuration(sleepTime, wakeTime)

    // 중복 날짜 확인
    const existingRecord = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.userId, userId), eq(sleepRecords.date, date)))
      .limit(1)

    if (existingRecord.length > 0) {
      return reply.status(409).send(errorResponse('해당 날짜의 수면 기록이 이미 존재합니다.'))
    }

    // 수면 기록 생성
    const newRecord = await db
      .insert(sleepRecords)
      .values({
        userId,
        date,
        sleepTime,
        wakeTime,
        duration,
        quality,
        notes: notes || null
      })
      .returning()

    reply.status(201).send(successResponse('수면 기록이 생성되었습니다.', { record: newRecord[0] }))
  } catch (error) {
    console.error('수면 기록 생성 중 오류:', error)
    reply.status(500).send(errorResponse('수면 기록 생성 중 오류가 발생했습니다.'))
  }
}

// 수면 기록 수정
export const updateSleepRecord = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateSleepRecordRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = request.user?.id
    const recordId = parseInt(request.params.id)
    const updateData = request.body

    if (!userId) {
      return reply.status(401).send(errorResponse('로그인이 필요합니다.'))
    }

    if (isNaN(recordId)) {
      return reply.status(400).send(errorResponse('잘못된 기록 ID입니다.'))
    }

    // 기존 기록 확인 (소유권 체크)
    const existingRecord = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.id, recordId), eq(sleepRecords.userId, userId)))
      .limit(1)

    if (existingRecord.length === 0) {
      return reply.status(404).send(errorResponse('수면 기록을 찾을 수 없습니다.'))
    }

    const currentRecord = existingRecord[0]

    // 수정할 데이터 준비
    const updatedData: any = {
      updatedAt: new Date().toISOString()
    }

    if (updateData.date) updatedData.date = updateData.date
    if (updateData.sleepTime) updatedData.sleepTime = updateData.sleepTime
    if (updateData.wakeTime) updatedData.wakeTime = updateData.wakeTime
    if (updateData.quality) {
      if (updateData.quality < 1 || updateData.quality > 5) {
        return reply.status(400).send(errorResponse('수면 품질은 1-5 사이의 값이어야 합니다.'))
      }
      updatedData.quality = updateData.quality
    }
    if (updateData.notes !== undefined) updatedData.notes = updateData.notes

    // 수면 시간이 변경된 경우 duration 재계산
    if (updateData.sleepTime || updateData.wakeTime) {
      const sleepTime = updateData.sleepTime || currentRecord.sleepTime
      const wakeTime = updateData.wakeTime || currentRecord.wakeTime
      updatedData.duration = calculateDuration(sleepTime, wakeTime)
    }

    // 수면 기록 수정
    const updatedRecord = await db
      .update(sleepRecords)
      .set(updatedData)
      .where(eq(sleepRecords.id, recordId))
      .returning()

    reply.send(successResponse('수면 기록이 수정되었습니다.', { record: updatedRecord[0] }))
  } catch (error) {
    console.error('수면 기록 수정 중 오류:', error)
    reply.status(500).send(errorResponse('수면 기록 수정 중 오류가 발생했습니다.'))
  }
}

// 수면 기록 삭제
export const deleteSleepRecord = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = request.user?.id
    const recordId = parseInt(request.params.id)

    if (!userId) {
      return reply.status(401).send(errorResponse('로그인이 필요합니다.'))
    }

    if (isNaN(recordId)) {
      return reply.status(400).send(errorResponse('잘못된 기록 ID입니다.'))
    }

    // 기존 기록 확인 (소유권 체크)
    const existingRecord = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.id, recordId), eq(sleepRecords.userId, userId)))
      .limit(1)

    if (existingRecord.length === 0) {
      return reply.status(404).send(errorResponse('수면 기록을 찾을 수 없습니다.'))
    }

    // 수면 기록 삭제
    await db.delete(sleepRecords).where(eq(sleepRecords.id, recordId))

    reply.send(successResponse('수면 기록이 삭제되었습니다.'))
  } catch (error) {
    console.error('수면 기록 삭제 중 오류:', error)
    reply.status(500).send(errorResponse('수면 기록 삭제 중 오류가 발생했습니다.'))
  }
}

// 특정 수면 기록 조회
export const getSleepRecord = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userId = request.user?.id
    const recordId = parseInt(request.params.id)

    if (!userId) {
      return reply.status(401).send(errorResponse('로그인이 필요합니다.'))
    }

    if (isNaN(recordId)) {
      return reply.status(400).send(errorResponse('잘못된 기록 ID입니다.'))
    }

    const record = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.id, recordId), eq(sleepRecords.userId, userId)))
      .limit(1)

    if (record.length === 0) {
      return reply.status(404).send(errorResponse('수면 기록을 찾을 수 없습니다.'))
    }

    reply.send(successResponse('수면 기록을 가져왔습니다.', { record: record[0] }))
  } catch (error) {
    console.error('수면 기록 조회 중 오류:', error)
    reply.status(500).send(errorResponse('수면 기록 조회 중 오류가 발생했습니다.'))
  }
}
