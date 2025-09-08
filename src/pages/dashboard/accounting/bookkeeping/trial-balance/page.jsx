import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import BookkeepingTable from '@/components/dashboard/accounting/bookkeeping/table';
import TrialBalanceCta from '@/components/dashboard/accounting/bookkeeping/trial-balance-cta';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

  // Calculate totals
  const totalDebit = trialBalanceData.reduce(
    (sum, item) => sum + item.debit,
    0
  );
  const totalCredit = trialBalanceData.reduce(
    (sum, item) => sum + item.credit,
    0
  );

  // Table columns configuration
  const trialBalanceColumns = [
    {
      key: 'accountCode',
      label: 'Account Code',
    },
    {
      key: 'accountName',
      label: 'Account Name',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'debit',
      label: 'Debit',
      // render: (value) => (value > 0 ? `$${value.toLocaleString()}` : '-'),
    },
    {
      key: 'credit',
      label: 'Credit',
      // render: (value) => (value > 0 ? `$${value.toLocaleString()}` : '-'),
    },
  ];

  const paginationData = {
    page: 10,
    totalPages: 3,
    pageSize: 10,
    totalCount: trialBalanceData.length,
  };

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

      <BookkeepingTable
        className="mt-10"
        data={trialBalanceData}
        columns={trialBalanceColumns}
        paginationData={paginationData}
        summaryRow={
          <div className="border-t bg-red-100 px-4 py-2">
            <div className="grid grid-cols-10 gap-4 text-sm font-semibold">
              <div className="col-span-3 text-left">Total NGN</div>
              <div className="text-right col-start-8">NGN{totalDebit.toLocaleString()}</div>
              <div className="text-right">
                NGN{totalCredit.toLocaleString()}
              </div>
            </div>
          </div>
        }
        dropdownActions={[
          { key: 'edit', label: 'Edit' },
          { key: 'view', label: 'View' },
          { key: 'delete', label: 'Delete' },
        ]}
        onRowAction={() => {}}
      />

      <RunReportForm
        isOpen={openRunReportForm}
        onClose={() => setOpenRunReportForm(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}
