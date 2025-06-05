import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AIStatusIndicator } from './components/AIStatusIndicator'

// Lazy load 페이지 컴포넌트들
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const SleepRecordsPage = lazy(() => import('./pages/SleepRecordsPage'))
const CreateSleepRecordPage = lazy(() => import('./pages/CreateSleepRecordPage'))
const SleepRecordDetailPage = lazy(() => import('./pages/SleepRecordDetailPage'))
const EditSleepRecordPage = lazy(() => import('./pages/EditSleepRecordPage'))
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// 로딩 컴포넌트
const PageLoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">페이지를 불러오는 중...</span>
  </div>
)

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoadingSpinner />}>
                <SleepRecordsPage />
              </Suspense>
            }
          />
          <Route path="sleep">
            <Route
              index
              element={
                <Suspense fallback={<PageLoadingSpinner />}>
                  <SleepRecordsPage />
                </Suspense>
              }
            />
            <Route
              path="new"
              element={
                <Suspense fallback={<PageLoadingSpinner />}>
                  <CreateSleepRecordPage />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense fallback={<PageLoadingSpinner />}>
                  <SleepRecordDetailPage />
                </Suspense>
              }
            />
            <Route
              path=":id/edit"
              element={
                <Suspense fallback={<PageLoadingSpinner />}>
                  <EditSleepRecordPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="statistics"
            element={
              <Suspense fallback={<PageLoadingSpinner />}>
                <StatisticsPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoadingSpinner />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>

      {/* AI 상태 인디케이터 */}
      <AIStatusIndicator />
    </>
  )
}

export default App
