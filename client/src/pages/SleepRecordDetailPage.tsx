import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { sleepService, SleepRecord } from '../services/sleepService'

const SleepRecordDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [record, setRecord] = useState<SleepRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchRecord(Number(id))
    }
  }, [id])

  const fetchRecord = async (recordId: number) => {
    try {
      const data = await sleepService.getSleepRecord(recordId)
      setRecord(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : '기록을 불러올 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!record || !confirm('이 기록을 삭제하시겠습니까?')) {
      return
    }

    try {
      await sleepService.deleteSleepRecord(record.id)
      navigate('/')
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

    if (wake < bed) {
      wake = new Date(`2000-01-02T${wakeTime}`)
    }

    const duration = wake.getTime() - bed.getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}시간 ${minutes}분`
  }

  const getQualityText = (quality: number) => {
    const qualities = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음']
    return qualities[quality - 1] || '알 수 없음'
  }

  const getQualityEmoji = (quality: number) => {
    const emojis = ['😴', '😪', '😐', '😊', '😄']
    return emojis[quality - 1] || '😐'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !record) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || '기록을 찾을 수 없습니다.'}</div>
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
          ← 목록으로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">수면 기록 상세</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{getQualityEmoji(record.quality)}</div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {new Date(record.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </h2>
                <p className="text-sm text-gray-500">수면 질: {getQualityText(record.quality)}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/sleep/${record.id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">취침 시간</h3>
              <p className="text-2xl font-bold text-gray-900">{formatTime(record.sleepTime)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">기상 시간</h3>
              <p className="text-2xl font-bold text-gray-900">{formatTime(record.wakeTime)}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-700 mb-2">총 수면 시간</h3>
            <p className="text-2xl font-bold text-blue-900">
              {calculateSleepDuration(record.sleepTime, record.wakeTime)}
            </p>
          </div>

          {record.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">특이사항</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>생성일: {new Date(record.createdAt).toLocaleString('ko-KR')}</p>
            {record.updatedAt !== record.createdAt && (
              <p>수정일: {new Date(record.updatedAt).toLocaleString('ko-KR')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SleepRecordDetailPage
