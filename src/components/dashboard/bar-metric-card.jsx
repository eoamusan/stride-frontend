import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Monday', value: 70 },
  { day: 'Tuesday', value: 17 },
  { day: 'Wednesday', value: 32 },
  { day: 'Thursday', value: 19 },
  { day: 'Friday', value: 42 },
  { day: 'Saturday', value: 11 },
  { day: 'Sunday', value: 57 },
];

const chartConfig = {
  value: {
    label: 'Hours',
    color: '#8B5CF6',
  },
};

export default function BarChartOverview() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
          MORE
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ChartContainer config={chartConfig}>
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
              vertical={false}
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
      </div>
    </div>
  );
}
