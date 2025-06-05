const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// 세션 ID 관리
const getSessionId = () => localStorage.getItem('sessionId')
const setSessionId = (sessionId: string) => localStorage.setItem('sessionId', sessionId)
const removeSessionId = () => localStorage.removeItem('sessionId')

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

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '로그인에 실패했습니다.')
    }

    const result = await response.json()

    // 세션 ID 저장
    if (result.data && result.data.sessionId) {
      setSessionId(result.data.sessionId)
    }

    return result.data
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(false) // Content-Type 헤더 제외
    })

    // 성공하든 실패하든 로컬 세션 제거
    removeSessionId()

    if (!response.ok) {
      throw new Error('로그아웃에 실패했습니다.')
    }

    return response.json()
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(false) // GET 요청에는 Content-Type 불필요
    })

    if (!response.ok) {
      throw new Error('사용자 정보를 가져올 수 없습니다.')
    }

    const result = await response.json()
    return result.data
  }
}
