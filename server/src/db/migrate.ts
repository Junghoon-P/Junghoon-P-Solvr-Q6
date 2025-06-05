import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import env from '../config/env'
import { users, sleepRecords, sessions } from './schema'
import { UserRole } from '../types'

// 데이터베이스 디렉토리 생성 함수
async function ensureDatabaseDirectory() {
  const dir = dirname(env.DATABASE_URL)
  try {
    await mkdir(dir, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

// 초기 사용자 데이터
const initialUsers = [
  {
    name: '관리자',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '일반 사용자',
    email: 'user@example.com',
    password: 'user123',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '게스트',
    email: 'guest@example.com',
    password: 'guest123',
    role: UserRole.GUEST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '테스트 사용자',
    email: 'test@test.com',
    password: 'test123',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 더미 수면 기록 데이터 생성 함수
function generateDummySleepRecords(userId: number, days: number = 60) {
  const records = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // 다양한 수면 패턴 생성
    const patterns = [
      // 일반적인 패턴
      { sleepHour: 23, sleepMin: 0, wakeHour: 7, wakeMin: 0, quality: 4 },
      { sleepHour: 22, sleepMin: 30, wakeHour: 6, wakeMin: 30, quality: 4 },
      { sleepHour: 0, sleepMin: 0, wakeHour: 8, wakeMin: 0, quality: 3 },
      // 늦게 자는 패턴
      { sleepHour: 1, sleepMin: 30, wakeHour: 9, wakeMin: 0, quality: 3 },
      { sleepHour: 2, sleepMin: 0, wakeHour: 9, wakeMin: 30, quality: 2 },
      // 일찍 자는 패턴
      { sleepHour: 21, sleepMin: 30, wakeHour: 5, wakeMin: 30, quality: 5 },
      { sleepHour: 22, sleepMin: 0, wakeHour: 6, wakeMin: 0, quality: 4 },
      // 불규칙한 패턴
      { sleepHour: 3, sleepMin: 0, wakeHour: 11, wakeMin: 0, quality: 2 },
      { sleepHour: 0, sleepMin: 30, wakeHour: 6, wakeMin: 0, quality: 3 }
    ]

    // 랜덤하게 패턴 선택하되, 최근일수록 더 규칙적으로
    const patternIndex =
      i < 7
        ? Math.floor(Math.random() * 4) // 최근 일주일은 규칙적
        : Math.floor(Math.random() * patterns.length) // 나머지는 다양하게

    const pattern = patterns[patternIndex]

    // 약간의 랜덤 변화 추가
    const sleepHour = pattern.sleepHour + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)
    const sleepMin = pattern.sleepMin + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 30 : -30) : 0)
    const wakeHour = pattern.wakeHour + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)
    const wakeMin = pattern.wakeMin + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 30 : -30) : 0)

    // 시간 정규화
    const normalizedSleepTime = `${String(Math.max(0, Math.min(23, sleepHour))).padStart(2, '0')}:${String(Math.abs(sleepMin) % 60).padStart(2, '0')}`
    const normalizedWakeTime = `${String(Math.max(0, Math.min(23, wakeHour))).padStart(2, '0')}:${String(Math.abs(wakeMin) % 60).padStart(2, '0')}`

    // 수면 시간 계산
    const duration = calculateSleepDuration(normalizedSleepTime, normalizedWakeTime)

    // 품질에 랜덤 변화 추가
    const quality = Math.max(
      1,
      Math.min(5, pattern.quality + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))
    )

    // 메모 생성 (가끔씩)
    const notes = Math.random() > 0.8 ? generateRandomNote() : null

    records.push({
      userId,
      date: dateStr,
      sleepTime: normalizedSleepTime,
      wakeTime: normalizedWakeTime,
      duration,
      quality,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  return records
}

// 수면 시간 계산 함수
function calculateSleepDuration(sleepTime: string, wakeTime: string): number {
  const [sleepHour, sleepMin] = sleepTime.split(':').map(Number)
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number)

  let sleepMinutes = sleepHour * 60 + sleepMin
  let wakeMinutes = wakeHour * 60 + wakeMin

  if (wakeMinutes <= sleepMinutes) {
    wakeMinutes += 24 * 60
  }

  return wakeMinutes - sleepMinutes
}

// 랜덤 메모 생성
function generateRandomNote(): string {
  const notes = [
    '카페인 섭취로 잠들기 어려웠음',
    '운동 후라 깊게 잠들었음',
    '스트레스로 자주 깼음',
    '꿈을 많이 꾸었음',
    '컨디션이 좋았음',
    '늦은 저녁 식사',
    '일찍 잠자리에 들었음',
    '휴대폰 사용으로 늦잠',
    '숙면을 취했음',
    '중간에 여러 번 깸'
  ]
  return notes[Math.floor(Math.random() * notes.length)]
}

// 더미 사용자들 추가 (테스트용)
const additionalDummyUsers = [
  {
    name: '김수면',
    email: 'kim.sleep@example.com',
    password: 'sleep123',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '이꿈나라',
    email: 'lee.dream@example.com',
    password: 'dream123',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '박잠자기',
    email: 'park.sleep@example.com',
    password: 'good123',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 데이터베이스 마이그레이션 및 초기 데이터 삽입
async function runMigration() {
  try {
    // 데이터베이스 디렉토리 생성
    await ensureDatabaseDirectory()

    // 데이터베이스 연결
    const sqlite = new Database(env.DATABASE_URL)
    const db = drizzle(sqlite)

    // 스키마 생성
    console.log('데이터베이스 스키마 생성 중...')

    // users 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'USER',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // sleep_records 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sleep_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        sleep_time TEXT NOT NULL,
        wake_time TEXT NOT NULL,
        duration INTEGER NOT NULL,
        quality INTEGER NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, date)
      )
    `)

    // sessions 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // 초기 데이터 삽입
    console.log('초기 데이터 삽입 중...')

    // 기존 데이터 확인
    const existingUsers = db.select().from(users)
    const existingUsersList = await existingUsers

    if (existingUsersList.length === 0) {
      // 초기 사용자 데이터 삽입
      const allUsers = [...initialUsers, ...additionalDummyUsers]
      for (const user of allUsers) {
        await db.insert(users).values(user)
      }
      console.log(`${allUsers.length}명의 사용자가 추가되었습니다.`)
    } else {
      console.log('사용자 데이터가 이미 존재합니다. 초기 데이터 삽입을 건너뜁니다.')
    }

    // 더미 수면 기록 데이터 삽입
    const existingSleepRecords = await db.select().from(sleepRecords)

    if (existingSleepRecords.length === 0) {
      console.log('더미 수면 기록 데이터 생성 중...')

      // 모든 사용자의 ID 가져오기
      const allUsers = await db.select().from(users)

      for (const user of allUsers) {
        // 사용자 종류에 따라 다른 양의 데이터 생성
        const recordDays = user.role === UserRole.ADMIN ? 90 : 60
        const sleepRecordsData = generateDummySleepRecords(user.id, recordDays)

        // 배치로 삽입
        for (const record of sleepRecordsData) {
          try {
            await db.insert(sleepRecords).values(record)
          } catch (error: unknown) {
            // 중복 날짜는 무시
            const errorMessage = error instanceof Error ? error.message : String(error)
            if (!errorMessage.includes('UNIQUE constraint failed')) {
              console.error('수면 기록 삽입 오류:', error)
            }
          }
        }
        console.log(`${user.name}님의 ${sleepRecordsData.length}개 수면 기록이 추가되었습니다.`)
      }
    } else {
      console.log('수면 기록 데이터가 이미 존재합니다. 더미 데이터 삽입을 건너뜁니다.')
    }

    console.log('데이터베이스 마이그레이션이 완료되었습니다.')
  } catch (error) {
    console.error('데이터베이스 마이그레이션 중 오류가 발생했습니다:', error)
    process.exit(1)
  }
}

// 스크립트가 직접 실행된 경우에만 마이그레이션 실행
if (require.main === module) {
  runMigration()
}

export default runMigration
