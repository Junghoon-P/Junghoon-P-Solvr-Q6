import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { User } from '../types/user'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser.user)
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login(email, password)
      setUser(userData.user)
      setIsAuthenticated(true)
      return userData
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      setUser(null)
      setIsAuthenticated(false)
      navigate('/login')
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth
  }
}
