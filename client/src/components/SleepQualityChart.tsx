import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface QualityDistribution {
  quality: string
  value: number
  count: number
}

interface SleepQualityChartProps {
  data: QualityDistribution[]
}

const SleepQualityChart = ({ data }: SleepQualityChartProps) => {
  // 색상 팔레트 정의
  const COLORS = {
    '매우 나쁨': '#EF4444', // red-500
    나쁨: '#F97316', // orange-500
    보통: '#EAB308', // yellow-500
    좋음: '#22C55E', // green-500
    '매우 좋음': '#3B82F6' // blue-500
  }

  // 0이 아닌 데이터만 필터링
  const filteredData = data.filter(item => item.count > 0)

  const formatTooltip = (value: number, name: string) => {
    const total = data.reduce((sum, item) => sum + item.count, 0)
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0
    return [`${value}회 (${percentage}%)`, name]
  }

  const renderCustomLabel = (entry: any) => {
    const total = data.reduce((sum, item) => sum + item.count, 0)
    const percentage = total > 0 ? Math.round((entry.count / total) * 100) : 0
    return percentage > 5 ? `${percentage}%` : '' // 5% 이상일 때만 라벨 표시
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            animationBegin={0}
            animationDuration={800}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.quality as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '6px'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SleepQualityChart
