import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-center">
            <span className="text-3xl">🌙</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">수면 트래커</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            로그인하여 수면 기록을 관리하세요
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600 mb-4 block">
              계정이 없으신가요?{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                회원가입하기
              </Link>
            </span>

            <div className="text-sm text-gray-600 mb-2">테스트 계정들:</div>
            <div className="space-y-1 text-xs text-gray-500">
              <div>• test@test.com / test123 (기본 계정)</div>
              <div>• kim.sleep@example.com / sleep123 (김수면)</div>
              <div>• lee.dream@example.com / dream123 (이꿈나라)</div>
              <div>• park.sleep@example.com / good123 (박잠자기)</div>
            </div>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('kim.sleep@example.com')
                  setPassword('sleep123')
                }}
                className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
              >
                김수면 계정으로 빠른 로그인
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('test@test.com')
                  setPassword('test123')
                }}
                className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
              >
                기본 테스트 계정으로 빠른 로그인
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
