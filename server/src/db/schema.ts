import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 사용자 테이블 스키마
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['ADMIN', 'USER', 'GUEST'] })
    .notNull()
    .default('USER'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 수면 기록 테이블 스키마
export const sleepRecords = sqliteTable('sleep_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  date: text('date').notNull(), // YYYY-MM-DD 형식
  sleepTime: text('sleep_time').notNull(), // HH:MM 형식
  wakeTime: text('wake_time').notNull(), // HH:MM 형식
  duration: integer('duration').notNull(), // 수면 시간 (분)
  quality: integer('quality').notNull(), // 수면 품질 (1-5점)
  notes: text('notes'), // 특이사항 (선택사항)
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 세션 테이블 스키마 (인증 관리)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 사용자 타입 정의
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UpdateUser = Partial<Omit<NewUser, 'id' | 'createdAt'>>

// 수면 기록 타입 정의
export type SleepRecord = typeof sleepRecords.$inferSelect
export type NewSleepRecord = typeof sleepRecords.$inferInsert
export type UpdateSleepRecord = Partial<Omit<NewSleepRecord, 'id' | 'userId' | 'createdAt'>>

// 세션 타입 정의
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
