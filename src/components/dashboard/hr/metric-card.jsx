import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import { Card } from '../../ui/card'; // Verify this path matches your project
import { ChartContainer } from '@/components/ui/chart'; // Verify this path
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'Apr', month4: 1200 }, // Ensure this has month4 key
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
  // Define colors directly here to avoid CSS variable issues
  const colors = {
    // Start Light (300) -> End Dark (600) to increase visual weight
    month1: isPositive ? '#36FF1B' : '#fca5a5',
    month2: isPositive ? '#36FF1BCC' : '#f87171',
    month3: isPositive ? '#36FF1BB2' : '#ef4444',
    month4: isPositive ? '#36FF1B80' : '#dc2626',
  };

  const chartConfig = {
    month1: { label: 'month1', color: colors.month1 },
    month2: { label: 'month2', color: colors.month2 },
    month3: { label: 'month3', color: colors.month3 },
    month4: { label: 'month4', color: colors.month4 },
  };

  // Helper: Normalize data so every bar has a 'value' and a specific HEX color
  const processData = (data) => {
    if (!data) return [];
    return data.map((item, index) => {
      // Determine which key this data point corresponds to (month1, month2, etc.)
      const key = `month${index + 1}`;
      return {
        ...item,
        // Find the numeric value
        unifiedValue: item[key] || item.value || 0,
        // FORCE the hex color directly (bypassing var(--color-x))
        fillColor: colors[key] || '#000000',
      };
    });
  };

  const activeData = processData(
    emptyState ? sampleChartData : chartData || sampleChartData
  );

  // Render function for the chart to ensure consistency
  const renderChart = () => (
    <div className="ml-4 shrink-0">
      <div className="relative h-12 w-12">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={activeData}
            barCategoryGap={0} // No space between bars
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }} // No margin
          >
            {/* XAxis is required to define the slots, but we hide it and remove padding */}
            <XAxis dataKey="month" hide padding={{ left: 0, right: 0 }} />
            <YAxis
              hide
              domain={[0, (dataMax) => (dataMax < 50 ? 50 : dataMax)]}
            />
            <Bar dataKey="unifiedValue" radius={0}>
              {activeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fillColor} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );

  if (emptyState) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="text-sm font-medium text-[#434343]">{title}</h3>
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className="mb-2 text-2xl font-bold text-[#434343]">
              00{unit && <span className="text-[#7D7D7D]">{unit}</span>}
            </div>
            <div className="mt-4 flex items-center text-sm font-bold text-[#7D7D7D]">
              <img src={chevronUpIcon} alt="Increase" className="mr-1" />
              +0%
            </div>
          </div>

          {/* Chart Area */}
          {sampleChartData && renderChart()}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-sm font-medium text-[#434343]">{title}</h3>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="mb-2 text-2xl font-bold text-[#434343]">
            {new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(Number(value) || 0)}
            {unit && <span className="text-[#7D7D7D]">{unit}</span>}
          </div>

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
        {chartData && renderChart()}

        {emojis && <div className="ml-4 shrink-0">{emojis}</div>}

        {!chartData && !emojis && (
          <div className="flex flex-row items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="https://github.com/1.png"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3 h-6 w-6">
              <AvatarImage
                src="https://github.com/8.png"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3 h-6 w-6">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3 h-6 w-6 text-xs">
              <AvatarImage src="#" className="grayscale" />
              <AvatarFallback>+27</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </Card>
  );
}
