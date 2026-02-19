import { format } from 'date-fns';
import { CustomButton } from '@/components/customs';
import AlertModal from '@/components/customs/alertModal';
import { useModalStore } from '@/stores/modal-store';

const PayrollPreview = ({
  onBack,
  runPayroll,
  employeeScope,
  onSubmit,
  isSubmitting,
}) => {
  const { openModal, closeModal, modals } = useModalStore();
  const runPayrollModal = modals['runPayrollAlert'];

  const summaryItems = buildSummaryItems(runPayroll, employeeScope);

  const handleRunPayroll = () => {
    openModal('runPayrollAlert');
  };

  const handleConfirmRunPayroll = async () => {
    if (isSubmitting) return;
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit();
      }
      closeModal('runPayrollAlert');
    } catch (error) {
      // Submission errors are surfaced by the hook's toast handler
    }
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

      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <CustomButton
          type="button"
          variant="outline"
          onClick={() => onBack?.()}
        >
          Back
        </CustomButton>

        <CustomButton type="button" onClick={handleRunPayroll}>
          {isSubmitting ? 'Processing...' : 'Run Payroll'}
        </CustomButton>
      </div>

      <AlertModal
        open={runPayrollModal?.open}
        handleBack={handleCloseModal}
        handleNext={handleConfirmRunPayroll}
        title="Run Payroll"
        description={buildConfirmationMessage(runPayroll, employeeScope)}
        backText="Back"
        nextText={isSubmitting ? 'Processing...' : 'Confirm & Run'}
      />
    </div>
  );
};
const buildSummaryItems = (runPayroll, employeeScope) => {
  const payrollType = runPayroll?.payrollType || 'Not specified';
  const payDateLabel = formatPayDate(runPayroll?.payDate);
  const payrollPeriod = formatPayrollPeriod(runPayroll);
  const scopeLabel = describeScope(employeeScope);

  return [
    {
      label: 'Payroll Period',
      value: payrollPeriod,
      valueClassName: 'text-gray-900',
    },
    {
      label: 'Payroll Type',
      value: payrollType,
      valueClassName: 'text-gray-900',
    },
    {
      label: 'Pay Date',
      value: payDateLabel,
      valueClassName: 'text-gray-900',
    },
    {
      label: 'Scope',
      value: scopeLabel,
      valueClassName: 'text-gray-900',
    },
    {
      label: 'Departments',
      value: employeeScope?.filterByDepartment
        ? `${employeeScope.departments?.length || 0} selected`
        : 'All departments',
      valueClassName: 'text-gray-900',
    },
    {
      label: 'Specific Employees',
      value: employeeScope?.specificEmployees
        ? `${employeeScope.employees?.length || 0} selected`
        : 'Automatically selected',
      valueClassName: 'text-gray-900',
    },
  ];
};

const formatPayDate = (dateValue) => {
  if (!dateValue) return 'Not scheduled';
  const parsedDate = new Date(dateValue);
  if (isNaN(parsedDate.getTime())) return 'Not scheduled';
  return format(parsedDate, 'PPP');
};

const formatPayrollPeriod = (runPayroll) => {
  if (!runPayroll?.month || !runPayroll?.year) return 'Not set';
  const monthNumber = runPayroll.month.toString().padStart(2, '0');
  const parsedDate = new Date(`${runPayroll.year}-${monthNumber}-01T00:00:00Z`);
  if (isNaN(parsedDate.getTime())) return 'Not set';
  const monthName = parsedDate.toLocaleString('default', { month: 'long' });
  return `${monthName} ${runPayroll.year}`;
};

const describeScope = (employeeScope) => {
  if (!employeeScope) return 'All eligible employees';
  if (employeeScope.specificEmployees) {
    const count = employeeScope.employees?.length || 0;
    return `${count} specific employee${count === 1 ? '' : 's'}`;
  }
  if (employeeScope.filterByDepartment) {
    const count = employeeScope.departments?.length || 0;
    return `${count} department${count === 1 ? '' : 's'}`;
  }
  if (employeeScope.filterByCadres) {
    const count = employeeScope.cadres?.length || 0;
    return `${count} cadre${count === 1 ? '' : 's'}`;
  }
  return 'All eligible employees';
};

const buildConfirmationMessage = (runPayroll, employeeScope) => {
  const period = formatPayrollPeriod(runPayroll);
  const scope = describeScope(employeeScope);
  return `You are about to calculate payroll for ${period}. Scope: ${scope}.`;
};

export default PayrollPreview;
