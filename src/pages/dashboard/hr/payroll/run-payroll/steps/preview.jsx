import { CustomButton } from '@/components/customs';
import AlertModal from '@/components/customs/alertModal';
import { useModalStore } from '@/stores/modal-store';

const PayrollPreview = ({ onBack }) => {
  const { openModal, closeModal, modals } = useModalStore();
  const runPayrollModal = modals['runPayrollAlert'];

  const handleRunPayroll = () => {
    openModal('runPayrollAlert');
  };

  const handleCloseModal = () => {
    closeModal('runPayrollAlert');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg bg-amber-50 p-4">
        <p className="text-[13px] font-medium text-[#F39C12]">
          This is a draft. No funds will be transferred until you finalize in
          the next stage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-[#F3F4F6] p-6 text-center shadow-sm transition-shadow hover:shadow"
          >
            <h3 className="mb-2 text-sm font-medium text-[#434343]">
              {item.label}
            </h3>

            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex flex-col w-full items-center justify-between gap-4 md:flex-row">
        <CustomButton type="button" variant="outline" onClick={onBack}>
          Back
        </CustomButton>

        <CustomButton type="button" onClick={handleRunPayroll}>
          Run Payroll
        </CustomButton>
      </div>

      <AlertModal
        open={runPayrollModal?.open}
        onOpenChange={handleCloseModal}
        handleBack={handleCloseModal}
        handleNext={handleCloseModal}
        title="Run Payroll"
        description="You are about to calculate payroll for March 2025. This process will include 142 employees."
        backText="Back"
        nextText="Confirm & Run"
      />
    </div>
  );
};

const summaryItems = [
  {
    label: 'Total Employees',
    value: '150',
    valueClassName: 'text-gray-900',
    isLarge: true,
  },
  {
    label: 'Total Gross Pay',
    value: '₦8,500',
    valueClassName: 'text-green-700',
    isLarge: true,
  },
  {
    label: 'Total Deductions',
    value: '₦1,500',
    valueClassName: 'text-red-600',
    isLarge: true,
  },
  {
    label: 'Total Net Pay', 
    value: '₦7,000',
    valueClassName: 'text-gray-900',
    isLarge: true,
  },
  {
    label: 'Pay Date',
    value: 'March 1',
    valueClassName: 'text-gray-800',
    isLarge: false,
  },
  {
    label: 'Payroll Type',
    value: 'Monthly Payroll',
    valueClassName: 'text-gray-800',
    isLarge: false,
  },
];

export default PayrollPreview;
