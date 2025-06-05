import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sleepService, SleepRecord } from '../services/sleepService'

const SleepRecordsPage = () => {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const data = await sleepService.getSleepRecords()
      setRecords(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : '기록을 불러올 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      return
    }

    try {
      await sleepService.deleteSleepRecord(id)
      await fetchRecords()
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateSleepDuration = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2000-01-01T${bedtime}`)
    let wake = new Date(`2000-01-01T${wakeTime}`)

    // 다음 날 깨었다면
    if (wake < bed) {
      wake = new Date(`2000-01-02T${wakeTime}`)
    }

    const duration = wake.getTime() - bed.getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}시간 ${minutes}분`
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return 'text-green-600'
    if (quality >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQualityText = (quality: number) => {
    const qualities = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음']
    return qualities[quality - 1] || '알 수 없음'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">수면 기록</h1>
        <Link
          to="/sleep/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          새 기록 추가
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌙</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 수면 기록이 없습니다</h3>
          <p className="text-gray-500 mb-4">첫 번째 수면 기록을 추가해보세요</p>
          <Link
            to="/sleep/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            기록 추가하기
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {records.map(record => (
              <li key={record.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {new Date(record.date).toLocaleDateString('ko-KR')}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getQualityColor(record.quality)}`}
                          >
                            {getQualityText(record.quality)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            취침: {formatTime(record.sleepTime)} → 기상:{' '}
                            {formatTime(record.wakeTime)}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            수면시간: {calculateSleepDuration(record.sleepTime, record.wakeTime)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <div className="flex space-x-2">
                            <Link
                              to={`/sleep/${record.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              보기
                            </Link>
                            <Link
                              to={`/sleep/${record.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              수정
                            </Link>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                      {record.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SleepRecordsPage
