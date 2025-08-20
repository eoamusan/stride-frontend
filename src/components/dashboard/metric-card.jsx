import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import chevronUpIcon from '@/assets/icons/chevron-up.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

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
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow ${className}`}
    >
      {/* Title */}
      <h3 className="mb-4 text-sm font-medium text-[#434343]">{title}</h3>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          {/* Value */}
          <div className="mb-2 text-base font-bold text-[#434343]">
            {value}
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
          <div className="ml-4 flex-shrink-0">
            <div className="relative h-12 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData.map((value, index) => ({
                    index,
                    value,
                  }))}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id={`colorGradient-${title.replace(/\s+/g, '-')}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#24A959' : '#ef4444'}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#24A959' : '#ef4444'}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? '#24A959' : '#ef4444'}
                    strokeWidth={3}
                    fill={`url(#colorGradient-${title.replace(/\s+/g, '-')})`}
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
