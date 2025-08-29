import AreaMetricCard from '@/components/dashboard/area-metric-card';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import MetricCard from '@/components/dashboard/metric-card';
import QuickActionsCard from '@/components/dashboard/accounting/overview/quick-actions-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';

// Sample data for area chart
const sampleChartData = [
  { date: '2024-01-01', revenue: 10000, expenses: 5000 },
  { date: '2024-02-01', revenue: 9700, expenses: 97000 },
  { date: '2024-03-01', revenue: 1600, expenses: 15000 },
  { date: '2024-04-01', revenue: 24200, expenses: 10000 },
  { date: '2024-05-01', revenue: 37300, expenses: 40000 },
  { date: '2024-06-01', revenue: 30100, expenses: 35000 },
  { date: '2024-07-01', revenue: 245, expenses: 180 },
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

const simpleChartConfig = [
  {
    dataKey: 'cashflow',
    label: 'Cash flow',
    color: '#8979FF',
  },
];
const simpleChartData = [
  { date: '2024-01-01', value: 10000 },
  { date: '2024-02-01', value: 97000 },
  { date: '2024-03-01', value: 16000 },
  { date: '2024-04-01', value: 24200 },
  { date: '2024-05-01', value: 37300 },
  { date: '2024-06-01', value: 30100 },
  { date: '2024-07-01', value: 245 },
];

const pieChartData = [
  { name: 'Travel', value: 82, percentage: 59.42, color: '#6366F1' },
  { name: 'Workers', value: 46, percentage: 33.33, color: '#10B981' },
  { name: 'Marketing', value: 10, percentage: 7.25, color: '#F59E0B' },
  { name: 'Office', value: 10, percentage: 7.25, color: '#FFAE4C' },
];

const pieChartConfig = {
  Travel: {
    label: 'Travel',
    color: '#6366F1',
  },
  Workers: {
    label: 'Workers',
    color: '#10B981',
  },
  Marketing: {
    label: 'Marketing',
    color: '#F59E0B',
  },
  Office: {
    label: 'Office',
    color: '#FFAE4C',
  },
};

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
      <div className="mt-6 flex flex-col justify-items-stretch gap-6 lg:h-[528px] lg:flex-row 2xl:h-[564px]">
        <AreaMetricCard
          className={'h-full w-full lg:w-[59%]'}
          title={'Revenue & Expenses'}
          description={'Monthly comparison over the past year'}
          chartData={sampleChartData}
          chartConfig={sampleChartConfig}
        />

        <SimpleAreaMetricCard
          className={'h-full w-full lg:w-[39%]'}
          title={'Cash Flow'}
          chartData={simpleChartData}
          chartConfig={simpleChartConfig}
        />
      </div>
      <div className="mt-6 flex flex-col justify-items-stretch gap-6 lg:flex-row">
        <QuickActionsCard className={'w-full lg:w-[59%]'} />
        <PieMetricCard
          title={'Expenses'}
          chartData={pieChartData}
          chartConfig={pieChartConfig}
          className={'w-full lg:w-[39%]'}
        />
      </div>
    </div>
  );
}
