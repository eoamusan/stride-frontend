import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import TrialBalanceCta from '@/components/dashboard/accounting/bookkeeping/trial-balance-cta';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Printer, Download, Share } from 'lucide-react';

export default function TrialBalance() {
  const [reportPeriod, setReportPeriod] = useState('empty');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountingMethod, setAccountingMethod] = useState('accrual');
  const [openRunReportForm, setOpenRunReportForm] = useState(false);

  // Trial Balance Data based on the image
  const trialBalanceData = [
    {
      id: 1,
      accountCode: '1000',
      accountName: 'Cash and Cash Equivalents',
      type: 'Assets',
      debit: 125000,
      credit: 0,
    },
    {
      id: 2,
      accountCode: '1000',
      accountName: 'Cash and Cash Equivalents',
      type: 'Assets',
      debit: 125000,
      credit: 0,
    },
  ];

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Trial Balance</h1>
          <p className="text-sm text-[#7D7D7D]">
            Real-time account balance verification
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
            Customize
          </Button>
          <Button className={'h-10 rounded-2xl text-sm'}>Save</Button>
        </div>
      </div>
      <div className="mt-10">
        <TrialBalanceCta
          reportPeriod={reportPeriod}
          onReportPeriodChange={setReportPeriod}
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          accountingMethod={accountingMethod}
          onAccountingMethodChange={setAccountingMethod}
          onRunReport={() => setOpenRunReportForm(true)}
          onFilter={() => {}}
        />
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <button className="text-xs text-gray-500 hover:text-gray-700">
            Add notes
          </button>
          <div className="flex gap-4">
            <Printer className="size-4 cursor-pointer text-[#254C00]" />
            <Download className="size-4 cursor-pointer text-[#254C00]" />
            <Share className="size-4 cursor-pointer text-[#254C00]" />
          </div>
        </div>

        <div className="mb-4 border-b pb-4 text-center">
          <h2 className="text-2xl font-normal text-[#434343]">
            Grace Business Solution Limited
          </h2>
          <h3 className="mt-2 text-base font-semibold text-[#434343]">
            Trial Balance
          </h3>
          <p className="mt-1 font-medium text-[#D3D3D3]">
            As of December 12, 2025
          </p>
        </div>

        <div className="w-full">
          <div className="mb-4 grid grid-cols-12 border-b border-gray-200 pb-4">
            <div className="col-span-6"></div>
            <div className="col-span-3 text-right text-base">Debit</div>
            <div className="col-span-3 text-right text-base">Credit</div>
          </div>

          <div className="space-y-6">
            {trialBalanceData.map((item) => (
              <div key={item.id} className="grid grid-cols-12 items-center">
                <div className="col-span-6 text-base text-[#434343]">
                  {item.accountCode} {item.accountName}
                </div>
                <div className="col-span-3 text-right text-lg text-[#434343]">
                  {item.debit > 0
                    ? item.debit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    : '0.00'}
                </div>
                <div className="col-span-3 text-right text-lg text-[#434343]">
                  {item.credit > 0
                    ? item.credit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RunReportForm
        isOpen={openRunReportForm}
        onClose={() => setOpenRunReportForm(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}
