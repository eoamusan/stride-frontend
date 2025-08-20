import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  unit,
  percentage,
  isPositive = true,
  chartData,
  className = '',
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}
    >
      {/* Title */}
      <h3 className="mb-4 text-sm font-medium text-gray-600">{title}</h3>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          {/* Value */}
          <div className="mb-2 text-3xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-xl text-gray-600">{unit}</span>}
          </div>

          {/* Percentage Change */}
          <div
            className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4" />
            )}
            {percentage}%
          </div>
        </div>

        {/* Chart Area */}
        {chartData && (
          <div className="ml-4 flex-shrink-0">
            <div className="relative h-12 w-20">
              {/* Simple SVG Chart */}
              <svg
                width="80"
                height="48"
                viewBox="0 0 80 48"
                className="h-full w-full"
              >
                {/* Gradient Definition */}
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={isPositive ? '#10b981' : '#ef4444'}
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? '#10b981' : '#ef4444'}
                      stopOpacity="0.1"
                    />
                  </linearGradient>
                </defs>

                {/* Chart Path */}
                <path
                  d={generateChartPath(chartData, 80, 48)}
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                  fill="url(#chartGradient)"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to generate SVG path for chart
function generateChartPath(data, width, height) {
  if (!data || data.length === 0) return '';

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  });

  // Create a filled path
  const pathData = [
    `M 0,${height}`, // Start at bottom left
    `L ${points[0]}`, // Line to first point
    ...points.slice(1).map((point) => `L ${point}`), // Line to each subsequent point
    `L ${width},${height}`, // Line to bottom right
    'Z', // Close path
  ].join(' ');

  return pathData;
}
