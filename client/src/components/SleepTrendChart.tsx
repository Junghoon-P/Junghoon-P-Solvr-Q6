import { memo, useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface SleepTrendData {
  date: string
  duration: number
  quality: number
}

interface SleepTrendChartProps {
  data: SleepTrendData[]
}

const SleepTrendChart = memo(({ data }: SleepTrendChartProps) => {
  // 데이터를 차트에 적합한 형태로 변환 - useMemo로 최적화
  const chartData = useMemo(
    () =>
      data.map(item => ({
        date: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        수면시간: Math.round((item.duration / 60) * 10) / 10, // 분을 시간으로 변환
        품질: item.quality
      })),
    [data]
  )

  const formatTooltip = useMemo(
    () => (value: number, name: string) => {
      if (name === '수면시간') {
        return [`${value}시간`, name]
      }
      return [`${value}점`, name]
    },
    []
  )

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" fontSize={12} tick={{ fill: '#6B7280' }} />
          <YAxis
            yAxisId="duration"
            orientation="left"
            domain={[4, 12]}
            fontSize={12}
            tick={{ fill: '#6B7280' }}
            label={{ value: '수면시간 (시간)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="quality"
            orientation="right"
            domain={[1, 5]}
            fontSize={12}
            tick={{ fill: '#6B7280' }}
            label={{ value: '수면품질 (점)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            formatter={formatTooltip}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '6px'
            }}
          />
          <Line
            yAxisId="duration"
            type="monotone"
            dataKey="수면시간"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6' }}
          />
          <Line
            yAxisId="quality"
            type="monotone"
            dataKey="품질"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: '#10B981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
})

SleepTrendChart.displayName = 'SleepTrendChart'

export default SleepTrendChart
