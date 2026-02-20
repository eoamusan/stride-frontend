import { useMemo } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import BarChartOverview from '@/components/dashboard/bar-metric-card';

export default function BusinessTaxOverview() {

  const pieData = [
    { name: 'Disposed', value: 93, color: '#6366f1' },
    { name: 'Idle', value: 85, color: '#22c55e' },
    { name: 'In Use', value: 53, color: '#f59e0b' },
    { name: 'In Repair', value: 43, color: '#06b6d4' },
  ];

  const pieConfig = {
    Disposed: {
      label: 'Disposed',
      color: '#6366f1',
    },
    'Idle': {
      label: 'Idle',
      color: '#22c55e',
    },
    'In Use': {
      label: 'In Use',
      color: '#f59e0b',
    },
    'In Repair': {
      label: 'In Repair',
      color: '#06b6d4',
    },
  };


  const taxLiabilityChartData = [
    {
      day: 'IT Equipment',
      value: 70,
    },
    {
      day: 'Furniture',
      value: 15,
    },
    {
      day: 'Vehicles',
      value: 30,
    },
    {
      day: 'Lands',
      value: 20,
    },
    {      
      day: 'Buildings',
      value: 25,
    },
  ];

  const taxLiabilityConfig = {
    value: {
      label: 'Amount (thousands)',
      color: '#8B5CF6',
    },
  };

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Tax Liability',
        value: 2000,
      },
      {
        title: 'Taxes Filed',
        value: 3000,
      },
      {
        title: 'Pending Returns',
        value: 23,
      },
      {
        title: 'Overdue',
        value: 1000,
      },
    ]
  })



  return (
    <div className='min-h-screen'>
      <div className="mt-5">
        <Metrics metrics={assetMetrics} />
      </div>
      
        <>
          <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 mt-5'>
            <div className='col-span-2'>
              <BarChartOverview
                title="Tax Liability Trend"
                description="Monthly Tax obligations (2025)"
                chartData={taxLiabilityChartData}
                chartConfig={taxLiabilityConfig}
              />
            </div>
            <div>
              <PieMetricCard
                title="Tax Distribution"
                description="Breakdown by tax type (YTD)"
                chartData={pieData}
                chartConfig={pieConfig}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 mt-5'>
            <div className='col-span-2'>
              <BarChartOverview
                title="Quarterly Comparison"
                description="Tax Liability by quarter"
                chartData={taxLiabilityChartData}
                chartConfig={taxLiabilityConfig}
              />
            </div>
          </div>
        </>
    </div>
  );
}
