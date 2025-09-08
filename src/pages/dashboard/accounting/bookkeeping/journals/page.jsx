import { useState } from 'react';
import JournalEntriesCta from '@/components/dashboard/accounting/bookkeeping/journals-cta';
import JournalEntryForm from '@/components/dashboard/accounting/bookkeeping/journal-entry-form';
import { Button } from '@/components/ui/button';
import BookkeepingTable from '@/components/dashboard/accounting/bookkeeping/table';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import JournalEntrySuccess from '@/components/dashboard/accounting/bookkeeping/journal-entry-success';
import { se } from 'date-fns/locale';

const journalTableColumns = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'ref', label: 'Ref No' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'total', label: 'Total' },
  { key: 'action', label: 'Action' },
];

export default function JournalEntries() {
  // State for JournalEntriesCta
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactionType, setTransactionType] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [openRunReportForm, setOpenRunReportForm] = useState(false);
  const [openJournalEntryForm, setOpenJournalEntryForm] = useState(false);
  const [entrySuccessOpen, setEntrySuccessOpen] = useState(false);

  // Handlers
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Date changed to:', date);
  };

  const handleTransactionTypeChange = (value) => {
    setTransactionType(value);
    console.log('Transaction type changed to:', value);
  };

  const handleReferenceNumberChange = (value) => {
    setReferenceNumber(value);
    console.log('Reference number changed to:', value);
  };

  const handleFilter = () => {
    const filterData = {
      selectedDate,
      transactionType,
      referenceNumber,
    };

    console.log('Filtering journal entries with:', filterData);
    // Add your filtering logic here
    // Example: filterJournalEntries(filterData);
  };

  const handleEntryAdded = () => {
    setEntrySuccessOpen(true);
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Journal Entries</h1>
          <p className="text-sm text-[#7D7D7D]">
            Record and track all accounting journal entries
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
            Customize
          </Button>
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenJournalEntryForm(true)}
          >
            New Entry
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <JournalEntriesCta
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          transactionType={transactionType}
          onTransactionTypeChange={handleTransactionTypeChange}
          referenceNumber={referenceNumber}
          onReferenceNumberChange={handleReferenceNumberChange}
          onFilter={handleFilter}
          onRunReport={() => setOpenRunReportForm(true)}
        />
      </div>
      <div className="mt-10">
        <BookkeepingTable columns={journalTableColumns} />
      </div>

      <RunReportForm
        isOpen={openRunReportForm}
        onClose={() => setOpenRunReportForm(false)}
        onSubmit={() => {
          setOpenRunReportForm(false);
        }}
      />

      <JournalEntryForm
        isOpen={openJournalEntryForm}
        onClose={() => setOpenJournalEntryForm(false)}
        onSuccess={handleEntryAdded}
      />
      <JournalEntrySuccess
        open={entrySuccessOpen}
        onOpenChange={setEntrySuccessOpen}
        handleBack={() => setEntrySuccessOpen(false)}
      />
    </div>
  );
}
