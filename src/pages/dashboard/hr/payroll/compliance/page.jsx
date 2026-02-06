import { useState } from 'react';

import { CustomButton } from '@/components/customs';
import Header from '@/components/dashboard/hr/header';
import CustomModal from '@/components/customs/modal';

import PlusIcon from '@/assets/icons/plus.svg';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';

import ComplianceTable from './complianceTable';
import AddObligationForm from './addObligation';
import { defaultComplianceRows } from './data';

export default function Compliance() {
  const [isAddObligationOpen, setIsAddObligationOpen] = useState(false);
  const [obligations, setObligations] = useState(defaultComplianceRows);

  const handleAddObligationOpenChange = (isOpen) =>
    setIsAddObligationOpen(isOpen);

  const handleSaveObligation = (row) => {
    setObligations((prev) => [...prev, row]);
    setIsAddObligationOpen(false);
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Compliance"
        description="Track statutory obligations and due dates"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={() => setIsAddObligationOpen(true)}
        >
          <img src={PlusIcon} alt="add obligation" className="mr-1" />
          Add New Obligation
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
        <ComplianceTable rows={obligations} onRowsChange={setObligations} />
      </Card>

      <CustomModal
        title="Add New Obligation"
        open={isAddObligationOpen}
        handleClose={handleAddObligationOpenChange}
      >
        <AddObligationForm
          open={isAddObligationOpen}
          onOpenChange={handleAddObligationOpenChange}
          onSave={handleSaveObligation}
        />
      </CustomModal>
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
    title: 'Total Obligations',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Completed',
    value: 32,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Upcoming',
    value: 4,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Overdue',
    value: 1,
    percentage: 2,
    chartData: sampleChartData,
  },
];
