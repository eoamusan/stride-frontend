import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import emptyStateImg from '@/assets/images/empty-chart-state.png';

export default function SimpleAreaMetricCard({
  emptyState = false,
  className,
  description,
  title,
  chartConfig,
  chartData,
}) {
  return (
    <Card className={`h-full p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-xs text-[#434343]">{description}</p>
          )}
        </div>
        <button className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
          MORE
        </button>
      </div>

      {emptyState ? (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className={'h-full max-h-[550px]'}
        >
          <ChartContainer
            config={chartConfig}
            className="relative h-full max-h-[550px] w-full"
          >
            <AreaChart
              data={chartData}
              className="h-full w-full"
              margin={{
                top: 10,
                right: 0,
                left: -12,
                bottom: 10,
              }}
            >
              <defs>
                {chartConfig.map((config) => (
                  <linearGradient
                    key={config.dataKey}
                    id={`fill${config.dataKey}`}
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
          className={'max-h-[550px]'}
        >
          <ChartContainer
            config={chartConfig}
            className="h-full max-h-[550px] w-full"
          >
            <AreaChart
              className="h-full w-full"
              data={chartData}
              margin={{
                top: 10,
                left: -10,
              }}
            >
              <defs>
                {chartConfig.map((config) => (
                  <linearGradient
                    key={config.dataKey}
                    id={`fill${config.dataKey}`}
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
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {chartConfig.map((config) => (
                <Area
                  key={config.dataKey}
                  dataKey="value"
                  type="natural"
                  fill={`url(#fill${config.dataKey})`}
                  stroke={config.color}
                  strokeWidth={2}
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
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
