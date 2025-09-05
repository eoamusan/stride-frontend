import LedgerViewCta from '@/components/dashboard/accounting/bookkeeping/ledger-view-cta';
import BookkeepingTable from '@/components/dashboard/accounting/bookkeeping/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LedgerView() {
  // State for LedgerViewCta
  const [reportPeriod, setReportPeriod] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountType, setAccountType] = useState('');
  const [accountingMethod, setAccountingMethod] = useState('cash');

  // Handlers
  const handleReportPeriodChange = (value) => {
    setReportPeriod(value);
    console.log('Report period changed to:', value);

    // Clear date fields when not using custom dates
    if (value !== 'custom-dates') {
      setFromDate(null);
      setToDate(null);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    console.log('From date changed to:', date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    console.log('To date changed to:', date);
  };

  const handleAccountTypeChange = (value) => {
    setAccountType(value);
    console.log('Account type changed to:', value);
  };

  const handleAccountingMethodChange = (value) => {
    setAccountingMethod(value);
    console.log('Accounting method changed to:', value);
  };

  const handleRunReport = () => {
    const reportData = {
      reportPeriod,
      fromDate,
      toDate,
      accountType,
      accountingMethod,
    };

    // Add your report generation logic here
    console.log('Report generated successfully');
  };
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Ledger View</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track all debit and credit transactions by account
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
        <LedgerViewCta
          reportPeriod={reportPeriod}
          onReportPeriodChange={handleReportPeriodChange}
          fromDate={fromDate}
          onFromDateChange={handleFromDateChange}
          toDate={toDate}
          onToDateChange={handleToDateChange}
          accountType={accountType}
          onAccountTypeChange={handleAccountTypeChange}
          accountingMethod={accountingMethod}
          onAccountingMethodChange={handleAccountingMethodChange}
          onRunReport={handleRunReport}
        />
      </div>
      <div className="mt-10">
        <BookkeepingTable />
      </div>
    </div>
  );
}
