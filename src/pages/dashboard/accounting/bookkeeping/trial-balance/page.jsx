import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import TrialBalanceCta from '@/components/dashboard/accounting/bookkeeping/trial-balance-cta';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TrialBalance() {
  const [reportPeriod, setReportPeriod] = useState('empty');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountingMethod, setAccountingMethod] = useState('accrual');
  const [openRunReportForm, setOpenRunReportForm] = useState(false);

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

      <RunReportForm
        isOpen={openRunReportForm}
        onClose={() => setOpenRunReportForm(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}
