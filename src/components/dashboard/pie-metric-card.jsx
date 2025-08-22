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
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                className="w-full pt-4"
                label
                nameKey="value"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="value" />}
                className="flex-wrap gap-2 pt-4 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
