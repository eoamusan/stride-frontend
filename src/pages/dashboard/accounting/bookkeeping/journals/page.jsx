import { useState } from 'react';
import JournalEntriesCta from '@/components/dashboard/accounting/bookkeeping/journals-cta';
import JournalEntryForm from '@/components/dashboard/accounting/bookkeeping/journal-entry-form';
import { Button } from '@/components/ui/button';
import BookkeepingTable from '@/components/dashboard/accounting/bookkeeping/table';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import JournalEntrySuccess from '@/components/dashboard/accounting/bookkeeping/journal-entry-success';
import { se } from 'date-fns/locale';
import RecurringTemplateForm from '@/components/dashboard/accounting/bookkeeping/recurring-template-form';

const journalTableColumns = [
  { key: 'date', label: 'Date' },
  { key: 'ref', label: 'Ref No' },
  { key: 'type', label: 'Type' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'balance', label: 'Balance' },
  { key: 'total', label: 'Total' },
  { key: 'dateModified', label: 'Date Modified' },
];

const journalEntriesData = [
  {
    id: 1,
    date: '12-12-25',
    ref: '10004',
    type: 'Wage expenses',
    assigned: 'John',
    dueDate: '12-12-25',
    balance: '₦453',
    total: '₦453',
    dateModified: '12-12-25',
  },
  {
    id: 2,
    date: '12-12-25',
    ref: '10005',
    type: 'Wage expenses',
    assigned: 'John',
    dueDate: '12-12-25',
    balance: '₦453',
    total: '₦453',
    dateModified: '12-12-25',
  },
  {
    id: 3,
    date: '12-12-25',
    ref: '10006',
    type: 'Wage expenses',
    assigned: 'John',
    dueDate: '12-12-25',
    balance: '₦453',
    total: '₦453',
    dateModified: '12-12-25',
  },
  {
    id: 4,
    date: '12-12-25',
    ref: '10007',
    type: 'Wage expenses',
    assigned: 'John',
    dueDate: '12-12-25',
    balance: '₦453',
    total: '₦453',
    dateModified: '12-12-25',
  },
  {
    id: 5,
    date: '12-12-25',
    ref: '10008',
    type: 'Wage expenses',
    assigned: 'John',
    dueDate: '12-12-25',
    balance: '₦453',
    total: '₦453',
    dateModified: '12-12-25',
  },
];

export default function JournalEntries() {
  // State for JournalEntriesCta
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactionType, setTransactionType] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [openRunReportForm, setOpenRunReportForm] = useState(false);
  const [openJournalEntryForm, setOpenJournalEntryForm] = useState(false);
  const [entrySuccessOpen, setEntrySuccessOpen] = useState(false);
  const [recurringStatus, setRecurringStatus] = useState(false);
  const [recurringTemplateOpen, setRecurringTemplateOpen] = useState(false);

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

  const handleRecurringStatusChange = (checked) => {
    setRecurringStatus(checked);

    if (checked) {
      setRecurringTemplateOpen(true);
    }
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
          recurringStatus={recurringStatus}
          onRecurringStatusChange={handleRecurringStatusChange}
        />
      </div>
      <div className="mt-10">
        <BookkeepingTable
          data={journalEntriesData}
          columns={journalTableColumns}
          dropdownActions={[
            { key: 'edit', label: 'Edit' },
            { key: 'view', label: 'View' },
          ]}
          paginationData={{
            page: 1,
            totalPages: 10,
            pageSize: 10,
            totalCount: journalEntriesData.length,
          }}
          onRowAction={(action, item) => {
            console.log(`Action: ${action}, Item:`, item);
            // Handle different actions here
            switch (action) {
              case 'edit':
                // Handle edit action
                break;
              case 'view':
                // Handle view action
                break;
              default:
                break;
            }
          }}
        />
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

      <RecurringTemplateForm
        open={recurringTemplateOpen}
        onOpenChange={setRecurringTemplateOpen}
        onSubmit={() => {}}
      />
    </div>
  );
}
