import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

export default function PieMetricCard({
  className,
  title,
  chartConfig,
  chartData,
  emptyState = false,
}) {
  return (
    <Card className={cn('w-full p-6', className)}>
      {/* Header */}
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* Chart Container */}
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={chartConfig}
            className="h-full min-h-64 w-full"
          >
            {emptyState ? (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="mx-auto aspect-square h-[80%] rounded-full bg-[#f4f4f4]"></div>
                <div className="mt-6 w-full">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {Object.values(chartConfig)?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  className="w-full pt-4"
                  label
                  nameKey="name"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="value" />}
                  className="flex flex-wrap items-center justify-center gap-4 pt-4"
                />
              </PieChart>
            )}
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
