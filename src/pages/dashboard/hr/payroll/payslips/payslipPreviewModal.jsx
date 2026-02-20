import React from 'react';
import { XIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import StrideIcon from '@/assets/icons/small-stride.svg';
import DocumentIcon from '@/assets/icons/document-text.svg';
import { CustomButton } from '@/components/customs';

const fallbackPayslip = {
  period: 'March 2025',
  employeeName: 'Sarah Jenkins',
  employeeId: 'N145,000',
  department: 'Product Design',
  role: 'Senior Product Designer',
  earnings: [
    { label: 'Basic Salary', amount: '₦145,000' },
    { label: 'Housing Allowance', amount: '₦145,000' },
    { label: 'Transport Allowance', amount: '₦145,000' },
    { label: 'Utility Allowance', amount: '₦145,000' },
  ],
  deductions: [
    { label: 'Employer Pension (10%)', amount: '₦145,000' },
    { label: 'PAYE Tax', amount: '₦145,000' },
    { label: 'NHF Contribution', amount: '₦145,000' },
  ],
  grossPay: '₦200,000',
  deductionsTotal: '₦12,000',
  netPay: '₦188,000',
  generatedAt: 'Mar 28, 2025 at 10:00 AM',
};

const SectionRow = ({ left, right }) => (
  <div className="grid grid-cols-2 gap-4 text-gray-800">
    <div className="font-semibold text-black">{left.label}</div>
    <div className="text-gray-700">{left.value}</div>
    <div className="font-semibold text-gray-900">{right.label}</div>
    <div className="text-gray-700">{right.value}</div>
  </div>
);

const PayslipPreviewModal = ({
  open,
  onClose,
  data,
  onDownload,
  onRelease,
}) => {
  const payslip = data || fallbackPayslip;

  const earningsRows = payslip.earnings || [];

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose?.()}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-4xl"
        showCloseButton={false}
      >
        <div className="flex items-center justify-between border-b px-6 py-8">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-green-600">
              <img src={DocumentIcon} alt="document" className="h-4 w-4" />
            </span>
            {payslip.period} Payslip Preview
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto bg-[#F5F6FA] p-8">
          <div className="bg-white px-6 py-6">
            <div className="flex items-center justify-between pb-8">
              <div className="space-y-2">
                <img src={StrideIcon} alt="stride" />
                <p className="text-xs text-gray-600">HR Management Platform</p>
              </div>

              <div className="text-right text-xs text-gray-600">
                <div>12 Victoria Island</div>
                <div>Lagos, Nigeria</div>
              </div>
            </div>

            <DialogHeader className="gap-1 pb-1">
              <div className="flex items-center justify-between text-gray-600">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  PAYSLIP
                </DialogTitle>

                <span className="font-medium text-black">
                  {payslip.period.replace('2025', '2023')}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-3 bg-white py-3 text-sm text-gray-700">
              <div className="space-y-1 text-xs font-semibold text-black">
                <p>Employee Details</p>
                <hr />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                {employeeData.map((item) => (
                  <div key={item.label} className="space-y-2 text-xs">
                    <p className="text-gray-400">{item.label}</p>

                    <p className="font-semibold text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-800">
              <div className="text-dark space-y-1 text-xs font-semibold">
                <p>Salary Details</p>
                <hr />
              </div>

              <div className="grid grid-cols-2 gap-6 py-3 text-xs text-gray-600">
                <div className="space-y-2">
                  <div className="font-semibold text-gray-700">Earnings</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-700">
                      Components
                    </div>

                    <div className="col-span-1 font-medium text-gray-700">
                      Monthly (₦)
                    </div>

                    {earningsData.map((item) => (
                      <React.Fragment key={item.label}>
                        <div className="font-semibold text-black">
                          {item.label}
                        </div>
                        <div className="text-gray-700">{item.amount}</div>
                      </React.Fragment>
                    ))}

                    {earningsRows.map((item) => (
                      <React.Fragment key={item.label}>
                        <div className="col-span-1 text-gray-700">
                          {item.label}
                        </div>

                        <div className="col-span-1 font-semibold text-gray-900">
                          {item.amount}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-gray-700">Deductions</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <div className="col-span-1 font-medium text-gray-700">
                      Components
                    </div>

                    <div className="col-span-1 font-medium text-gray-700">
                      Monthly (₦)
                    </div>

                    {deductionsData.map((item) => (
                      <React.Fragment key={item.label}>
                        <div className="col-span-1 text-gray-700">
                          {item.label}
                        </div>

                        <div className="col-span-1 font-semibold text-gray-900">
                          {item.amount}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-3 text-sm text-gray-800">
                <p className="text-xs font-semibold text-blue-800">
                  Compensation Summary
                </p>

                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="col-span-1 space-y-2">
                    <div className="text-gray-600">Duration</div>
                    <div className="font-semibold text-gray-900">
                      March 2023
                    </div>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <div className="text-gray-600">Gross Pay (₦)</div>
                    <div className="font-semibold text-gray-900">
                      {payslip.grossPay}
                    </div>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <div className="text-gray-600">Deductions (₦)</div>
                    <div className="font-semibold text-red-500">
                      -{payslip.deductionsTotal}
                    </div>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <div className="text-gray-600">Net Pay (₦)</div>
                    <div className="font-semibold text-green-600">
                      {payslip.netPay}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 text-center text-xs text-gray-500">
              <p>
                This is a system generated payslip and does not require a
                signature.
              </p>
              <p>Generated on {payslip.generatedAt}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t px-6 py-10">
          <div className="flex items-center gap-3">
            <CustomButton variant="outline" onClick={onDownload}>
              Download PDF
            </CustomButton>

            <CustomButton onClick={onRelease}>Release Payslip</CustomButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipPreviewModal;

const employeeData = [
  { label: 'Employee Name', value: 'Sarah Jenkins' },
  { label: 'Employee ID', value: 'N145,000' },
  { label: 'Department', value: 'Product Design' },
  { label: 'Role', value: 'Senior Product Designer' },
];

const earningsData = [
  { label: 'Basic Salary', amount: '₦145,000' },
  { label: 'Housing Allowance', amount: '₦145,000' },
  { label: 'Transport Allowance', amount: '₦145,000' },
  { label: 'Utility Allowance', amount: '₦145,000' },
];

const deductionsData = [
  { label: 'Employer Pension (10%)', amount: '₦145,000' },
  { label: 'PAYE Tax', amount: '₦145,000' },
  { label: 'NHF Contribution', amount: '₦145,000' },
];
