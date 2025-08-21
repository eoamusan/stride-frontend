import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { name: 'To Do', value: 82, percentage: 59.42, color: '#6366F1' },
  { name: 'Completed', value: 46, percentage: 33.33, color: '#10B981' },
  { name: 'In progress', value: 10, percentage: 7.25, color: '#F59E0B' },
];

const chartConfig = {
  'To Do': {
    label: 'To Do',
    color: '#6366F1',
  },
  Completed: {
    label: 'Completed',
    color: '#10B981',
  },
  'In progress': {
    label: 'In progress',
    color: '#F59E0B',
  },
};

export default function PieMetricCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      {/* Header */}
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Task summary</h3>

      {/* Chart Container */}
      <div className="relative">
        <div className="mb-6 h-64">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={0}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* Data Labels positioned around the chart */}
        <div className="absolute top-4 left-8">
          <div className="text-xs text-gray-500">In progress</div>
          <div className="text-sm font-medium text-orange-500">10 7.25%</div>
        </div>

        <div className="absolute bottom-8 left-4">
          <div className="text-xs text-gray-500">Completed</div>
          <div className="text-sm font-medium text-green-500">46 33.33%</div>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
          <div className="text-xs text-gray-500">To Do</div>
          <div className="text-sm font-medium text-blue-500">82 59.42%</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
