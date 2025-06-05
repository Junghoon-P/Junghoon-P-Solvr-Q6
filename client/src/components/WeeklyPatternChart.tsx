import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeeklyPatternData {
  day: string
  averageDuration: number
  averageQuality: number
  count: number
}

interface WeeklyPatternChartProps {
  data: WeeklyPatternData[]
}

const WeeklyPatternChart = ({ data }: WeeklyPatternChartProps) => {
  // 데이터를 차트에 적합한 형태로 변환
  const chartData = data.map(item => ({
    요일: item.day,
    수면시간: Math.round((item.averageDuration / 60) * 10) / 10, // 분을 시간으로 변환
    품질: item.averageQuality,
    기록수: item.count
  }))

  const formatTooltip = (value: number, name: string) => {
    if (name === '수면시간') {
      return [`${value}시간`, name]
    }
    if (name === '품질') {
      return [`${value}점`, name]
    }
    return [`${value}개`, name]
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="요일" fontSize={12} tick={{ fill: '#6B7280' }} />
          <YAxis
            yAxisId="duration"
            orientation="left"
            domain={[0, 12]}
            fontSize={12}
            tick={{ fill: '#6B7280' }}
            label={{ value: '평균 수면시간 (시간)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="quality"
            orientation="right"
            domain={[0, 5]}
            fontSize={12}
            tick={{ fill: '#6B7280' }}
            label={{ value: '평균 품질 (점)', angle: 90, position: 'insideRight' }}
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
          <Bar
            yAxisId="duration"
            dataKey="수면시간"
            fill="#3B82F6"
            name="수면시간"
            radius={[2, 2, 0, 0]}
          />
          <Bar yAxisId="quality" dataKey="품질" fill="#10B981" name="품질" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeeklyPatternChart
