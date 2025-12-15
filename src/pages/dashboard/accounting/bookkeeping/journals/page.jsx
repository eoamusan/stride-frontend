import { useState, useEffect } from 'react';
import JournalEntriesCta from '@/components/dashboard/accounting/bookkeeping/journals-cta';
import JournalEntryForm from '@/components/dashboard/accounting/bookkeeping/journal-entry-form';
import { Button } from '@/components/ui/button';
import AccountingTable from '@/components/dashboard/accounting/table';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import RecurringTemplateForm from '@/components/dashboard/accounting/bookkeeping/recurring-template-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import JournalService from '@/api/journal';

const journalTableColumns = [
  { key: 'date', label: 'Date' },
  { key: 'ref', label: 'Ref No' },
  { key: 'type', label: 'Type' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'balance', label: 'Balance' },
  { key: 'total', label: 'Total' },
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

  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  
  // State for journals data
  const [journalsData, setJournalsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch journals on component mount
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setIsLoading(true);
        const response = await JournalService.fetch();
        console.log('Journals:', response.data);
        
        // Transform API data to match table format
        const transformedData = response.data?.data?.map((journal) => {
          // Calculate total debit and credit
          const totalDebit = journal.account.reduce((sum, acc) => sum + (acc.debit || 0), 0);
          const totalCredit = journal.account.reduce((sum, acc) => sum + (acc.credit || 0), 0);
          const balance = totalDebit - totalCredit;
          
          // Format date
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          };
          
          // Get currency symbol
          const getCurrencySymbol = (currency) => {
            const currencyMap = {
              ngn: '₦',
              usd: '$',
              eur: '€',
              gbp: '£',
            };
            return currencyMap[currency?.toLowerCase()] || currency?.toUpperCase() || '';
          };
          
          const currencySymbol = getCurrencySymbol(journal.currency);
          
          return {
            id: journal._id,
            date: formatDate(journal.date),
            ref: journal.journalNo,
            type: journal.account[0]?.description || journal.memo || '-',
            dueDate: '-',
            balance: `${currencySymbol}${balance.toLocaleString()}`,
            total: `${currencySymbol}${totalDebit.toLocaleString()}`,
            dateModified: formatDate(journal.updatedAt),
          };
        });
        
        setJournalsData(transformedData);
      } catch (error) {
        console.error('Error fetching journals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, []);

  // Handle table item selection
  const handleSelectTableItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAllItems = (checked) => {
    if (checked) {
      setSelectedItems(journalsData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

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
    if (checked && selectedItems.length > 0) {
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
        <AccountingTable
          title="Journal Entries"
          data={journalsData}
          columns={journalTableColumns}
          searchFields={['ref', 'type', 'assigned']}
          searchPlaceholder="Search journal entries..."
          dropdownActions={[
            { key: 'edit', label: 'Edit' },
            { key: 'view', label: 'View' },
          ]}
          paginationData={{
            page: 1,
            totalPages: Math.ceil(journalsData.length / 10),
            pageSize: 10,
            totalCount: journalsData.length,
          }}
          isLoading={isLoading}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectTableItem}
          handleSelectAll={handleSelectAllItems}
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

      <SuccessModal
        title={'Entry Added'}
        description={`You've successfully added an entry.`}
        open={entrySuccessOpen}
        onOpenChange={setEntrySuccessOpen}
        backText={'Back'}
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
