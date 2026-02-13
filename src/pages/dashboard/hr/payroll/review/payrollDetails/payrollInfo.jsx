import { useFormContext } from 'react-hook-form';

import MoneyIcon from '@/assets/icons/money.svg';
import { FormInput } from '@/components/customs';

const salaryBreakdown = [
  'Basic Salary',
  'Housing Allowance',
  'Transport Allowance',
  'Utility Allowance',
];

const deductions = ['Employee Pension (10%)', 'PAYE Tax'];

const summary = ['Gross Pay', 'Net Pay'];

const PayrollInfo = ({ isEditing }) => {
  const { control, watch } = useFormContext();

  // Optional: watch values if you want real-time updates in view mode
  // const grossPay = watch('grossPay');
  // const netPay = watch('netPay');

  return (
    <div className="min-h-[400px] space-y-6 rounded-xl border border-gray-100 bg-white p-8">
      <h3 className="font-semibold">Payroll Information</h3>

      <div className="space-y-10">
        {/* Earnings */}
        <div>
          <h6 className="mb-3 text-xs font-semibold">Earnings</h6>
          <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            {salaryBreakdown.map((field) => {
              const name = field.replace(/[^a-zA-Z]/g, '');
              return (
                <div key={field}>
                  <label className="mb-4 block text-sm text-gray-800">
                    {field}
                  </label>
                  {isEditing ? (
                    <FormInput
                      control={control}
                      name={name}
                      placeholder="Enter amount"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <img src={MoneyIcon} alt="money" />
                      {watch(name) || '₦145,000'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h6 className="mb-3 text-xs font-semibold">Deductions</h6>
          <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            {deductions.map((field) => {
              const name = field.replace(/[^a-zA-Z]/g, '').replace(/\(\d+%\)/, '');
              return (
                <div key={field}>
                  <label className="mb-2 block text-sm text-gray-800">
                    {field}
                  </label>
                  {isEditing ? (
                    <FormInput
                      control={control}
                      name={name}
                      placeholder="Enter amount"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <img src={MoneyIcon} alt="money" />
                      {watch(name) || '₦14,500'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h6 className="mb-3 text-xs font-semibold">Summary</h6>
          <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            {summary.map((field) => {
              const name = field.replace(/[^a-zA-Z]/g, '');
              return (
                <div key={field}>
                  <label className="mb-2 block text-sm text-gray-800">
                    {field}
                  </label>
                  {isEditing ? (
                    <FormInput
                      control={control}
                      name={name}
                      placeholder="Enter amount"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <img src={MoneyIcon} alt="money" />
                      {watch(name) || (field === 'Gross Pay' ? '₦145,000' : '₦130,500')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollInfo;