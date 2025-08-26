import AreaMetricCard from '@/components/dashboard/area-metric-card';
import MetricCard from '@/components/dashboard/metric-card';

// Sample data for area chart
const sampleChartData = [
  { date: '2024-01-01', revenue: 10000, expenses: 5000 },
  { date: '2024-01-02', revenue: 9700, expenses: 97000 },
  { date: '2024-01-03', revenue: 1600, expenses: 15000 },
  { date: '2024-01-04', revenue: 24200, expenses: 10000 },
  { date: '2024-01-05', revenue: 37300, expenses: 40000 },
  { date: '2024-01-06', revenue: 30100, expenses: 35000 },
  { date: '2024-01-07', revenue: 245, expenses: 180 },
];

const sampleChartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#6FD195',
  },
  expenses: {
    label: 'Expenses',
    color: '#7086FD',
  },
};

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
      <div className="mt-6 flex">
        <div className="w-full max-w-3xl">
          <AreaMetricCard
            title={'Revenue & Expenses'}
            description={'Monthly comparison over the past year'}
            chartData={sampleChartData}
            chartConfig={sampleChartConfig}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
}
