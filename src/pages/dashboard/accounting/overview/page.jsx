import MetricCard from '@/components/dashboard/metric-card';

const metricsData = [
  {
    title: 'Total Revenue',
    unit: '$',
  },
  {
    title: 'Net Profit',
    unit: '$',
  },
  {
    title: 'Outstanding Invoices',
    unit: '$',
  },
  {
    title: 'Invoices',
  },
];

export default function AccountingOverview() {
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
      <div className="flex">
        
      </div>
    </div>
  );
}
