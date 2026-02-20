import MetricCard from '../metric-card';

export default function MetricsSummary({ metricsData }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          percentage={metric.percentage}
          isPositive={metric.isPositive}
          chartData={metric.chartData}
        />
      ))}
    </div>
  );
}
