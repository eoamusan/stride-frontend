import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { useState } from 'react';

import { Card } from '@/components/ui/card';

import PayslipTable from './historyTable';
import PayslipPreviewModal from './payslipPreviewModal';

const defaultPreview = {
  period: 'March 2025',
  employeeName: 'Sarah Jenkins',
  employeeId: 'N145,000',
  department: 'Product Design',
  role: 'Senior Product Designer',
  grossPay: '₦8,500',
  deductionsTotal: '₦1,500',
  netPay: '₦7,000',
};

const PayslipsHistory = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const handleAction = (row, action) => {
    if (action === 'view') {
      setSelectedPayslip(
        row?.previewData || { ...defaultPreview, period: row?.period }
      );
      setPreviewOpen(true);
    }

    if (action === 'download') {
      // placeholder for download behaviour
    }
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Payslips History"
        description="View and download your monthly payslips."
        hasYoutubeButton
      ></Header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <Card className="mt-2 w-full border-0 shadow-none">
        <PayslipTable onAction={handleAction} />
      </Card>

      <PayslipPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={selectedPayslip}
        onDownload={() => {}}
        onRelease={() => {}}
      />
    </div>
  );
};

export default PayslipsHistory;

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Latest Net Pays',
    value: '₦365,000',
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Gross Salary',
    value: '₦450,000',
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Total Deductions',
    value: '₦85,000',
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Payslips Available',
    value: 12,
    percentage: 2,
    chartData: sampleChartData,
  },
];
