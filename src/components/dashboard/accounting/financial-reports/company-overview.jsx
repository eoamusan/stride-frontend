import Metrics from '../invoicing/plain-metrics';
import AreaMetricCard from '@/components/dashboard/area-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';

export default function CompanyOverview({ data }) {
  const metrics = [
    { title: 'Total Revenue', value: data?.totalRevenue || '0', symbol: '$' },
    { title: 'Total Expenses', value: data?.totalExpenses || '0', symbol: '$' },
    { title: 'Net Profit', value: data?.netProfit || '0', symbol: '$' },
    { title: 'Outstanding AR', value: data?.outstandingAr || '0', symbol: '$' },
    { title: 'Outstanding AP', value: data?.outstandingAp || '0', symbol: '$' },
    { title: 'Cash Balance', value: data?.cashBalance || '0', symbol: '$' },
  ];

  const revenueExpensesData = [
    { date: '2025-01-01', revenue: 36, expenses: 60 },
    { date: '2025-02-01', revenue: 10, expenses: 15 },
    { date: '2025-03-01', revenue: 57, expenses: 63 },
    { date: '2025-04-01', revenue: 10, expenses: 8 },
    { date: '2025-05-01', revenue: 30, expenses: 45 },
    { date: '2025-06-01', revenue: 95, expenses: 68 },
    { date: '2025-07-01', revenue: 13, expenses: 18 },
    { date: '2025-08-01', revenue: 95, expenses: 38 },
    { date: '2025-09-01', revenue: 45, expenses: 14 },
    { date: '2025-10-01', revenue: 80, expenses: 90 },
  ];

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#6B8AFF',
    },
    expenses: {
      label: 'Expenses',
      color: '#4ADE80',
    },
  };

  const expenseDistributionData = [
    { name: 'Bills & utilities', value: 100, color: '#6B8AFF' },
    { name: 'Entertainment', value: 62, color: '#4ADE80' },
    { name: 'Food & Drinking', value: 50, color: '#FB923C' },
    { name: 'Shopping', value: 28, color: '#22D3EE' },
  ];

  const expenseChartConfig = {
    'Bills & utilities': {
      label: 'Bills & utilities',
      color: '#6B8AFF',
    },
    Entertainment: {
      label: 'Entertainment',
      color: '#4ADE80',
    },
    'Food & Drinking': {
      label: 'Food & Drinking',
      color: '#FB923C',
    },
    Shopping: {
      label: 'Shopping',
      color: '#22D3EE',
    },
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <AreaMetricCard
          title="Revenue & Expenses"
          chartData={revenueExpensesData}
          chartConfig={chartConfig}
          className="w-3/5"
        />
        <PieMetricCard
          title="Expense Distribution"
          chartData={expenseDistributionData}
          chartConfig={expenseChartConfig}
          className="w-2/5"
        />
      </div>
    </div>
  );
}
