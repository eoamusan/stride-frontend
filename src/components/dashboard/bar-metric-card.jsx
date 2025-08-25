import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card } from '../ui/card';

export default function BarChartOverview({
  title,
  chartConfig,
  chartData,
  className,
}) {
  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
          MORE
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={true}
              vertical={true}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="value"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </Card>
  );
}
