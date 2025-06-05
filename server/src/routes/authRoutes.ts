import { FastifyInstance } from 'fastify'
import { login, logout, getCurrentUser, register } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'

export default async function authRoutes(fastify: FastifyInstance) {
  // 회원가입
  fastify.post('/register', register)

  // 로그인
  fastify.post('/login', login)

  // 로그아웃
  fastify.post('/logout', logout)

  // 현재 사용자 정보 조회 (인증 필요)
  fastify.get('/me', { preHandler: authMiddleware }, getCurrentUser)
}
