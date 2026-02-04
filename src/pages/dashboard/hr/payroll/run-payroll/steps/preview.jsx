import { CustomButton } from '@/components/customs';
import React from 'react';

const PayrollPreview = ({ onBack }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg bg-amber-50 p-4">
        <p className="font-medium text-[13px] text-[#F39C12]">
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

            <p
              className="font-bold"
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <hr />

      {/* Action Buttons */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <CustomButton type="button" variant="outline" onClick={onBack}>
          Back
        </CustomButton>

        <CustomButton type="button">
          Run Payroll
        </CustomButton>
      </div>
    </div>
  );
};

export default PayrollPreview;

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
