import { useState } from 'react';

import { CustomButton } from '@/components/customs';
import Header from '@/components/customs/header';

import ReleaseIcon from '@/assets/icons/document-text.svg';
import MetricCard from '@/components/dashboard/hr/metric-card';
import PayslipTable from './payslipTable';
import { Card } from '@/components/ui/card';
import PayslipPreviewModal from './payslipPreviewModal';

export default function Payslips() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const defaultPreview = {
    period: 'March 2025',
    employeeName: 'Sarah Jenkins',
    employeeId: 'N145,000',
    department: 'Product Design',
    role: 'Senior Product Designer',
  };

  const handleAction = (row, action) => {
    if (action === 'preview') {
      setSelectedPayslip(
        row?.previewData || { ...defaultPreview, period: row?.period }
      );
      setPreviewOpen(true);
    }

    if (action === 'generate') {
      // placeholder for generate action
    }
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Payslip Management"
        description="Generate and distribute payslips to employees"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          // onClick={handleFreezePayroll}
        >
          <img src={ReleaseIcon} alt="release payslip" className="mr-1" />
          Release Payslip
        </CustomButton>
      </Header>

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
}

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Total Payroll Periods',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Total Employee Covered',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Released Payrolls',
    value: 4,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Pending Payrolls',
    value: 1,
    percentage: 2,
    chartData: sampleChartData,
  },
];
