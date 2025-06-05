import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const MainLayout = () => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await logout()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌙</span>
              <Link to="/" className="text-xl font-bold text-blue-600">
                수면 트래커
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  수면 기록
                </Link>
                <Link
                  to="/sleep/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  새 기록
                </Link>
              </nav>
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <span className="text-sm text-gray-600">
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
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
