import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

const MainLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await logout()
    }
  }

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path === '/statistics' && location.pathname === '/statistics') return true
    if (path === '/sleep' && (location.pathname === '/' || location.pathname.startsWith('/sleep')))
      return true
    return false
  }

  const getNavLinkClass = (path: string) => {
    const baseClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors'
    const activeClass = 'bg-blue-100 text-blue-700'
    const inactiveClass = 'text-gray-600 hover:text-blue-600'

    return `${baseClass} ${isActivePath(path) ? activeClass : inactiveClass}`
  }

  const getMobileNavLinkClass = (path: string) => {
    const baseClass = 'block px-3 py-2 text-base font-medium transition-colors'
    const activeClass = 'bg-blue-100 text-blue-700'
    const inactiveClass = 'text-gray-600 hover:text-blue-600'

    return `${baseClass} ${isActivePath(path) ? activeClass : inactiveClass}`
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 영역 */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <span className="text-2xl">🌙</span>
              <Link to="/" className="text-lg sm:text-xl font-bold text-blue-600 truncate">
                수면 트래커
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link to="/" className={getNavLinkClass('/sleep')}>
                  수면 기록
                </Link>
                <Link to="/statistics" className={getNavLinkClass('/statistics')}>
                  📊 분석
                </Link>
                <Link
                  to="/sleep/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  새 기록
                </Link>
              </nav>
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <span className="text-sm text-gray-600 hidden lg:block">
                  안녕하세요, {user?.name || '사용자'}님
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>

            {/* 모바일 햄버거 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">메뉴 열기</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 모바일 드롭다운 메뉴 */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                <Link
                  to="/"
                  className={getMobileNavLinkClass('/sleep')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  수면 기록
                </Link>
                <Link
                  to="/statistics"
                  className={getMobileNavLinkClass('/statistics')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📊 분석
                </Link>
                <Link
                  to="/sleep/new"
                  className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  새 기록
                </Link>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    안녕하세요, {user?.name || '사용자'}님
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 수면 트래커. 건강한 수면을 위해.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
