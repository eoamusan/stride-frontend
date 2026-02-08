import { useState } from 'react';

import { CustomButton } from '@/components/customs';
import Header from '@/components/dashboard/hr/header';

import ExportIcon from '@/assets/icons/export.svg';
import RefreshIcon from '@/assets/icons/refresh-circle.svg';
import LockIcon from '@/assets/icons/lock.svg';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import ReviewTable from './reviewTable';
import { useModalStore } from '@/stores/modal-store';
import AlertModal from '@/components/customs/alertModal';
import PayrollDetail from './payrollDetails/payrollDetails';
import BlueLockIcon from '@/assets/icons/blue-lock.svg';
import DocumentIcon from '@/assets/icons/document-text.svg';

export default function Review() {
  const { openModal, closeModal, modals } = useModalStore();
  const freezePayrollModal = modals['freezePayrollAlert'];
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'
  const [isFrozen, setIsFrozen] = useState(false);

  const handleAction = (employee, mode) => {
    setSelectedEmployee(employee);
    setViewMode(mode);
  };

  const handleBackToTable = () => {
    setSelectedEmployee(null);
  };

  const handleFreezePayroll = () => {
    openModal('freezePayrollAlert');
  };

  const handleCloseModal = () => {
    closeModal('freezePayrollAlert');
  };

  const handleConfirmFreeze = () => {
    setIsFrozen(true);
    handleCloseModal();
  };

  if (selectedEmployee) {
    return (
      <PayrollDetail
        data={selectedEmployee}
        initialMode={viewMode}
        isFrozen={isFrozen}
        onBack={handleBackToTable}
      />
    );
  }

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Payroll Review"
        description="Validate and freeze payroll before distribution"
      >
        <CustomButton
          variant="outline"
          className="w-full rounded-xl bg-transparent py-6 text-sm text-gray-500 md:w-auto"

          // onClick={() => handleOpenModal('addComponent')}
        >
          <img src={ExportIcon} alt="Export Report" className="mr-1" />
          Export Report
        </CustomButton>

        {!isFrozen && (
          <CustomButton
            variant="outline"
            className="w-full rounded-xl bg-transparent py-6 text-sm text-gray-500 md:w-auto"

            // onClick={() => handleOpenModal('addComponent')}
          >
            <img src={RefreshIcon} alt="re-calculate" className="mr-1" />
            Recalculate
          </CustomButton>
        )}

        {isFrozen && (
          <CustomButton
            className="w-full rounded-xl py-6 text-sm md:w-auto"
            disabled={isFrozen}
            onClick={handleFreezePayroll}
          >
            <img src={DocumentIcon} alt="queue payroll" className="mr-1" />
            Queue Payroll
          </CustomButton>
        )}

        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          disabled={isFrozen}
          onClick={handleFreezePayroll}
        >
          <img src={LockIcon} alt="approve and freeze" className="mr-1" />
          {isFrozen ? 'Approved & Frozen' : 'Approve & Freeze'}
        </CustomButton>
      </Header>

      {isFrozen && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <img src={BlueLockIcon} alt="Payroll Approved" />
          <div className="space-y-1">
            <p className="text-[13px] font-bold">Payroll is Frozen</p>
            <p className="text-xs text-blue-600">
              You can now download payslips and mark payments as paid.
            </p>
          </div>
        </div>
      )}

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
        <ReviewTable onAction={handleAction} isFrozen={isFrozen} />
      </Card>

      <AlertModal
        open={freezePayrollModal?.open}
        onOpenChange={handleCloseModal}
        handleBack={handleCloseModal}
        handleNext={handleConfirmFreeze}
        title="Freeze Payroll"
        description="You are about to freeze payroll for March 2025. This action cannot be undone. Once frozen, no further changes can be made."
        backText="Back"
        nextText="Confirm & Freeze"
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
    title: 'Total Employees',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Total Gross Pay',
    value: '₦8,500',
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Total Deductions',
    value: 70,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Total Net Pay',
    value: 50,
    percentage: 2,
    chartData: sampleChartData,
  },
];
