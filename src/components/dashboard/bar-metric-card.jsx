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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card } from '../ui/card';
import emptyStateImg from '@/assets/images/empty-chart-state.png';

export default function BarChartOverview({
  title,
  chartConfig,
  chartData,
  className,
  emptyState = false,
  showLegend = false,
  numberOfBars = 1,
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

      {emptyState ? (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={'max-h-[550px]'}
        >
          <ChartContainer
            config={chartConfig}
            className="relative h-full max-h-[550px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -18,
                bottom: 10,
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
            </BarChart>
            <div className="absolute top-[25%] z-10 ml-[8%] flex h-40 w-[92%] items-center justify-center bg-white">
              <img src={emptyStateImg} alt="Empty State" />
            </div>
          </ChartContainer>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={'max-h-[550px]'}
        >
          <ChartContainer
            config={chartConfig}
            className="h-full max-h-[550px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -18,
                bottom: 10,
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
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                content={<ChartTooltipContent />}
              />
              {Array.from({ length: numberOfBars }).map((_, index) => (
                <Bar
                  key={index}
                  dataKey={numberOfBars > 1 ? `value${index + 1}` : 'value'}
                  fill={
                    numberOfBars > 1
                      ? `var(--color-value${index + 1})`
                      : `var(--color-value)`
                  }
                  radius={[4, 4, 0, 0]}
                  maxBarSize={400}
                />
              ))}
              {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
