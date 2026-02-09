import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
} from 'recharts';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import { Card } from '../../ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

export default function MetricCard({
  title,
  value,
  unit,
  percentage,
  isPositive = true,
  chartData,
  className = '',
  emptyState = false,
  emojis,
}) {
  const chartConfig = {
    month1: {
      label: 'month1',
      color: isPositive ? '#16a34a' : '#dc2626',
    },
    month2: {
      label: 'month2',
      color: isPositive ? '#22c55e' : '#ef4444',
    },
    month3: {
      label: 'month3',
      color: isPositive ? '#4ade80' : '#f87171',
    },
  };

  if (emptyState) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="text-sm font-medium text-[#434343]">{title}</h3>

        <div className="flex items-end justify-between">
          <div className="flex-1">
            {/* Value */}
            <div className="mb-2 text-base font-bold text-[#434343]">
              000
              {unit && <span className="text-[#7D7D7D]">{unit}</span>}
            </div>

            {/* Percentage Change */}
            <div
              className={`mt-4 flex items-center text-sm font-bold text-[#7D7D7D]`}
            >
              <img src={chevronUpIcon} alt="Increase" className="mr-1" />
              +0%
            </div>
          </div>

          {/* Chart Area */}
          {chartData && (
            <div className="ml-4 shrink-0">
              <div className="relative h-12 w-20">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart
                    accessibilityLayer
                    data={sampleChartData}
                    barCategoryGap={2}
                  >
                    <CartesianGrid vertical={false} />
                    <Bar
                      dataKey="month1"
                      stackId="a"
                      fill="var(--color-month1)"
                      radius={0}
                    />
                    <Bar
                      dataKey="month2"
                      stackId="a"
                      fill="var(--color-month2)"
                      radius={0}
                    />
                    <Bar
                      dataKey="month3"
                      stackId="a"
                      fill="var(--color-month3)"
                      radius={0}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          )}

          {/* Emojis Area */}
          {emojis && (
            <div className="ml-4 shrink-0">
              <span className="text-4xl">{emojis}</span>
            </div>
          )}

          {/* Image area */}
          {!chartData && !emojis && (
            <div className="flex flex-row items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="-ml-3">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="grayscale"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="-ml-3">
                <AvatarImage src="#" alt="@shadcn" className="grayscale" />
                <AvatarFallback>+3</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </Card>
    );
  }
  return (
    <Card className={`p-6 ${className}`}>
      {/* Title */}
      <h3 className="text-sm font-medium text-[#434343]">{title}</h3>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          {/* Value */}
          <div className="mb-2 text-base font-bold text-[#434343]">
            {new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(Number(value) || 0)}
            {unit && <span className="text-[#7D7D7D]">{unit}</span>}
          </div>

          {/* Percentage Change */}
          <div
            className={`mt-4 flex items-center text-sm font-bold ${
              isPositive ? 'text-[#24A959]' : 'text-red-600'
            }`}
          >
            {isPositive ? (
              <img src={chevronUpIcon} alt="Increase" className="mr-1" />
            ) : (
              <img src={chevronDownIcon} alt="Decrease" className="mr-1" />
            )}
            {percentage}%
          </div>
        </div>

        {/* Chart Area */}
        {chartData && (
          <div className="ml-4 shrink-0">
            <div className="relative h-12 w-20">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  barCategoryGap={2}
                >
                  <CartesianGrid vertical={false} />
                  <Bar
                    dataKey="month1"
                    stackId="a"
                    fill="var(--color-month1)"
                    radius={0}
                  />
                  <Bar
                    dataKey="month2"
                    stackId="a"
                    fill="var(--color-month2)"
                    radius={0}
                  />
                  <Bar
                    dataKey="month3"
                    stackId="a"
                    fill="var(--color-month3)"
                    radius={0}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        )}
        {/* Emojis Area */}
        {emojis && (
          <div className="ml-4 shrink-0">
            <span className="text-4xl">{emojis}</span>
          </div>
        )}
        {/* Image area */}
        {!chartData && !emojis && (
          <div className="flex flex-row items-center">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3">
              <AvatarImage src="#" alt="@shadcn" className="grayscale" />
              <AvatarFallback>+3</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </Card>
  );
}
