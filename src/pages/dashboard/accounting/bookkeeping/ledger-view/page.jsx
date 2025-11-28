import LedgerViewCta from '@/components/dashboard/accounting/bookkeeping/ledger-view-cta';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import LedgerService from '@/api/ledger';
import { useNavigate } from 'react-router';

const ledgercolumns = [
  { key: 'id', label: 'Ledger ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'originalInvoice', label: 'Original Invoice' },
  { key: 'reason', label: 'Reason' },
  { key: 'amount', label: 'Amount' },
  { key: 'issueDate', label: 'Issue Date' },
  { key: 'status', label: 'Status' },
];

const ledgerData = [
  {
    id: 'L001',
    customer: 'ABC Company',
    originalInvoice: 'INV-001',
    reason: 'Service Payment',
    amount: '₦50,000',
    issueDate: '2024-01-15',
    status: 'Completed',
  },
  {
    id: 'L002',
    customer: 'XYZ Corp',
    originalInvoice: 'INV-002',
    reason: 'Product Sale',
    amount: '₦75,000',
    issueDate: '2024-01-16',
    status: 'Pending',
  },
];

export default function LedgerView() {
  // State for LedgerViewCta
  const [reportPeriod, setReportPeriod] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountType, setAccountType] = useState('');
  const [accountingMethod, setAccountingMethod] = useState('cash');
  const [openRunReportForm, setOpenRunReportForm] = useState(false);
  const navigate = useNavigate();

  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchLedgerEntries = async () => {
      try {
        const response = await LedgerService.fetch();
        console.log('Fetched ledger entries:', response.data);
      } catch (err) {
        console.error('Error fetching ledger entries:', err);
      }
    };

    fetchLedgerEntries();
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
      setSelectedItems(ledgerData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

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
    setOpenRunReportForm(true);
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
        <AccountingTable
          title="Ledger Entries"
          data={ledgerData}
          columns={ledgercolumns}
          searchFields={['customer', 'originalInvoice', 'reason']}
          searchPlaceholder="Search ledger entries..."
          paginationData={{
            page: 1,
            totalPages: 1,
            pageSize: 10,
            totalCount: ledgerData.length,
          }}
          dropdownActions={[
            { key: 'edit', label: 'Edit' },
            { key: 'view', label: 'View' },
            { key: 'delete', label: 'Delete' },
          ]}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectTableItem}
          handleSelectAll={handleSelectAllItems}
          onRowAction={() => {}}
        />
      </div>

      <RunReportForm
        isOpen={openRunReportForm}
        onClose={() => setOpenRunReportForm(false)}
        onSubmit={() => {
          setOpenRunReportForm(false);
          navigate('/dashboard/accounting/bookkeeping/ledger-view/report');
        }}
      />
    </div>
  );
}
