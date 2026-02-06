import React from 'react';
import { CheckIcon, DownloadIcon, XIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

const HeaderLogo = () => (
  <div className="flex items-center gap-2 text-xl font-semibold">
    <span className="text-green-600">one</span>
    <span className="text-purple-600">da</span>
  </div>
);

const SectionRow = ({ left, right }) => (
  <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
    <div className="font-semibold text-gray-900">{left.label}</div>
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
  const deductionRows = payslip.deductions || [];

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose?.()}>
      <DialogContent
        className="w-8xl gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl"
        showCloseButton={false}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckIcon className="h-5 w-5" />
            </span>
            {payslip.period} Payslip Preview
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-auto px-6 py-4">
          <div className="flex items-start justify-between pb-4">
            <HeaderLogo />
            <div className="text-right text-xs text-gray-600">
              <div>12 Victoria Island</div>
              <div>Lagos, Nigeria</div>
            </div>
          </div>

          <DialogHeader className="gap-1 pb-3">
            <DialogTitle className="text-sm font-semibold text-gray-900">
              PAYSLIP
            </DialogTitle>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Employee Details</span>
              <span>{payslip.period.replace('2025', '2023')}</span>
            </div>
          </DialogHeader>

          <div className="space-y-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
            <SectionRow
              left={{ label: 'Employee Name', value: payslip.employeeName }}
              right={{ label: 'Employee ID', value: payslip.employeeId }}
            />
            <SectionRow
              left={{ label: 'Department', value: payslip.department }}
              right={{ label: 'Role', value: payslip.role }}
            />
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white text-sm text-gray-800">
            <div className="border-b px-4 py-3 font-semibold">
              Salary Details
            </div>
            <div className="grid grid-cols-2 gap-6 px-4 py-3 text-xs text-gray-600">
              <div className="space-y-2">
                <div className="font-semibold text-gray-900">Earnings</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <div className="col-span-1 font-medium text-gray-700">
                    Components
                  </div>
                  <div className="col-span-1 font-medium text-gray-700">
                    Monthly (₦)
                  </div>
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
                <div className="font-semibold text-gray-900">Deductions</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <div className="col-span-1 font-medium text-gray-700">
                    Components
                  </div>
                  <div className="col-span-1 font-medium text-gray-700">
                    Monthly (₦)
                  </div>
                  {deductionRows.map((item) => (
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

            <div className="border-t px-4 py-3 text-sm text-gray-800">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <div className="text-gray-600">Duration</div>
                  <div className="font-semibold text-gray-900">March 2023</div>
                </div>
                <div className="col-span-1">
                  <div className="text-gray-600">Gross Pay (₦)</div>
                  <div className="font-semibold text-gray-900">
                    {payslip.grossPay}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-gray-600">Deductions (₦)</div>
                  <div className="font-semibold text-red-500">
                    -{payslip.deductionsTotal}
                  </div>
                </div>
                <div className="col-span-1">
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

        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-green-600">
              <span className="font-semibold">A</span>
            </div>
            <span className="font-semibold">{payslip.employeeName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-green-200 bg-white px-4 py-2 text-sm text-green-700"
              onClick={onDownload}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              className="rounded-full px-4 py-2 text-sm"
              onClick={onRelease}
            >
              Release Payslip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipPreviewModal;
