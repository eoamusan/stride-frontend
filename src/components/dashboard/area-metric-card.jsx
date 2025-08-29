import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../ui/chart';
import emptyStateImg from '@/assets/images/empty-chart-state.png';

export default function AreaMetricCard({
  emptyState = false,
  className,
  description,
  title,
  chartConfig,
  chartData,
}) {
  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-[#434343]">{description}</p>
        </div>
        <button className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
          MORE
        </button>
      </div>

      {emptyState ? (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={'max-h-[430px]'}
        >
          <ChartContainer
            config={chartConfig}
            className="relative h-full max-h-[430px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -10,
                bottom: 10,
              }}
            >
              <defs>
                {Object.entries(chartConfig).map(([key, config]) => (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={config.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={config.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
            </AreaChart>
            <div className="absolute top-[25%] z-10 ml-[8%] flex h-40 w-[92%] items-center justify-center bg-white">
              <img src={emptyStateImg} alt="Empty State" />
            </div>
          </ChartContainer>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={'max-h-[430px]'}
        >
          <ChartContainer
            config={chartConfig}
            className="h-full max-h-[430px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                left: -15,
              }}
            >
              <defs>
                {Object.entries(chartConfig).map(([key, config]) => (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={config.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={config.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}k`;
                  } else {
                    return `$${value}`;
                  }
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {Object.entries(chartConfig).map(([key, config]) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#fill${key})`}
                  stroke={config.color}
                  strokeWidth={2}
                  stackId="a"
                  dot={{
                    fill: config.color,
                    stroke: `#f4f4f4`,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 4,
                    fill: config.color,
                    stroke: config.color,
                    strokeWidth: 2,
                  }}
                />
              ))}
              <ChartLegend
                className="mt-2 ml-6 w-fit"
                content={<ChartLegendContent />}
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
