import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SleepRecordsPage from './pages/SleepRecordsPage'
import CreateSleepRecordPage from './pages/CreateSleepRecordPage'
import SleepRecordDetailPage from './pages/SleepRecordDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import EditSleepRecordPage from './pages/EditSleepRecordPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SleepRecordsPage />} />
        <Route path="sleep">
          <Route index element={<SleepRecordsPage />} />
          <Route path="new" element={<CreateSleepRecordPage />} />
          <Route path=":id" element={<SleepRecordDetailPage />} />
          <Route path=":id/edit" element={<EditSleepRecordPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
