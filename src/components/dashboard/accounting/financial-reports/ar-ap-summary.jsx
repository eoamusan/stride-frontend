import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import AreaMetricCard from '@/components/dashboard/area-metric-card';

export default function ArApSummary() {
  const metrics = [
    { title: 'Total AR', value: '264', symbol: '$' },
    { title: 'Total AP', value: '164', symbol: '$' },
    { title: 'AR Overdue', value: '30', symbol: '$' },
    { title: 'AP Due Soon', value: '30', symbol: '$' },
  ];

  const arAgingData = [
    { day: '0-30 days', value: 70000 },
    { day: '31-60 days', value: 18000 },
    { day: '61-90 days', value: 33000 },
    { day: '90+ days', value: 20000 },
  ];

  const arAgingConfig = {
    value: {
      label: 'Amount',
      color: '#6B8AFF',
    },
  };

  const apAgingData = [
    { day: '0-30 days', value: 70000 },
    { day: '31-60 days', value: 18000 },
    { day: '61-90 days', value: 33000 },
    { day: '90+ days', value: 20000 },
  ];

  const apAgingConfig = {
    value: {
      label: 'Amount',
      color: '#6B8AFF',
    },
  };

  const arApTrendData = [
    { date: '2025-01-01', accountReceivable: 38000, accountPayable: 60000 },
    { date: '2025-02-01', accountReceivable: 10000, accountPayable: 15000 },
    { date: '2025-03-01', accountReceivable: 60000, accountPayable: 70000 },
    { date: '2025-04-01', accountReceivable: 10000, accountPayable: 8000 },
    { date: '2025-05-01', accountReceivable: 33000, accountPayable: 45000 },
    { date: '2025-06-01', accountReceivable: 95000, accountPayable: 68000 },
    { date: '2025-07-01', accountReceivable: 18000, accountPayable: 20000 },
    { date: '2025-08-01', accountReceivable: 90000, accountPayable: 38000 },
    { date: '2025-09-01', accountReceivable: 45000, accountPayable: 40000 },
    { date: '2025-10-01', accountReceivable: 85000, accountPayable: 18000 },
    { date: '2025-11-01', accountReceivable: 88000, accountPayable: 90000 },
    { date: '2025-12-01', accountReceivable: 85000, accountPayable: 92000 },
  ];

  const arApTrendConfig = {
    accountReceivable: {
      label: 'Account Receivable',
      color: '#6B8AFF',
    },
    accountPayable: {
      label: 'Account Payable',
      color: '#4ADE80',
    },
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Account Receivable Aging"
          chartConfig={arAgingConfig}
          chartData={arAgingData}
          numberOfBars={1}
          showLegend={false}
          className="w-full md:w-1/2"
        />
        <BarChartOverview
          title="Account Payable Aging"
          chartConfig={apAgingConfig}
          chartData={apAgingData}
          numberOfBars={1}
          showLegend={false}
          className="w-full md:w-1/2"
        />
      </div>
      <div className="mt-10">
        <AreaMetricCard
          title="AR/AP Trend"
          chartData={arApTrendData}
          chartConfig={arApTrendConfig}
        />
      </div>
    </div>
  );
}
