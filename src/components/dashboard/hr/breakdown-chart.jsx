'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import emptyStateImg from '@/assets/images/empty-chart-state.png';
const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  engineering: {
    label: 'Engineering',
    color: 'var(--chart-1)',
  },
  design: {
    label: 'Design',
    color: 'var(--chart-2)',
  },
  marketing: {
    label: 'Marketing',
    color: 'var(--chart-3)',
  },
  sales: {
    label: 'Sales',
    color: 'var(--chart-4)',
  },
  permanent: {
    label: 'Permanent',
    color: 'var(--chart-1)',
  },
  intern: {
    label: 'Intern',
    color: 'var(--chart-2)',
  },
  probation: {
    label: 'Probation',
    color: 'var(--chart-3)',
  },
};

export function ChartPieDonutText({
  title,
  label,
  text,
  newClass,

  emptyState = true,
  chartData,
}) {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const processedData = React.useMemo(() => {
    return chartData.map((item) => ({ ...item, fill: item.color }));
  }, [chartData]);

  return (
    <Card className="flex min-h-80 flex-col justify-between">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{text}</CardDescription>
      </CardHeader>
      {emptyState ? (
        <div className="flex h-40 w-40 w-full justify-center">
          <img src={emptyStateImg} alt="Empty State" />
        </div>
      ) : (
        <CardContent
          className={`flex items-center pb-0 ${newClass ? 'flex-col' : 'flex-col md:flex-row'} `}
        >
          <ChartContainer
            config={chartConfig}
            className="aspect-square h-64 max-h-64 w-64 max-w-64 flex-1 items-center justify-center"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="label"
                innerRadius={80}
                outerRadius={100}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {label}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div
            className={`flex flex-wrap justify-center gap-3 ${newClass ? '' : 'md:flex-col md:justify-center'}`}
          >
            {chartData.map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <span
                  className={newClass ? 'h-2 w-2 rounded-full' : 'h-4.5 w-2'}
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground text-xs font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
