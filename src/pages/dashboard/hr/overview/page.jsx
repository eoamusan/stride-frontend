import MetricCard from '@/components/dashboard/metric-card';

export default function Overview() {
  const metricsData = [
    {
      title: 'Number of Staffs',
      value: 30,
      percentage: 3,
    },
    {
      title: 'Turnover Rate',
      value: 50,
      unit: '%',
      percentage: -2,
      isPositive: false,
    },
    {
      title: 'Employee Sentiment',
      value: 70,
      unit: '%',
      percentage: 5,
    },
    {
      title: 'Attendance Rate',
      value: 50,
      unit: '%',
      percentage: 2,
    },
  ];

  return (
    <div className="my-10">
      <hgroup>
        <h1 className="text-2xl font-bold">Account Overview</h1>
        <p className="text-sm text-[#7D7D7D]">
          👋 Welcome back! Here's what's happening with your business.
        </p>
      </hgroup>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.title} {...metric} emptyState={true} />
        ))}
      </div>
    </div>
  );
}
