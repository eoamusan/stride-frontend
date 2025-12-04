import LedgerViewCta from '@/components/dashboard/accounting/bookkeeping/ledger-view-cta';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import LedgerService from '@/api/ledger';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ledgercolumns = [
  { key: 'type', label: 'Type' },
  { key: 'refNo', label: 'Reference No' },
  { key: 'account', label: 'Account' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
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

  // State for table selection and data
  const [selectedItems, setSelectedItems] = useState([]);
  const [ledgerData, setLedgerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    totalDocs: 0,
    limit: 20,
    totalPages: 1,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchLedgerEntries = async () => {
      try {
        setIsLoading(true);
        const response = await LedgerService.fetch({});
        const responseData = response.data?.data;

        // Update pagination info
        setPaginationInfo({
          totalDocs: responseData?.totalDocs || 0,
          limit: responseData?.limit || 20,
          totalPages: responseData?.totalPages || 1,
          page: responseData?.page || 1,
          hasNextPage: responseData?.hasNextPage || false,
          hasPrevPage: responseData?.hasPrevPage || false,
        });

        // Transform ledger data
        const ledgerEntries = responseData?.ledger || [];
        const transformedData = ledgerEntries
          .map((entry) => {
            const isExpense = entry.expense !== null;
            const isProduct = entry.product !== null;

            if (isExpense) {
              return {
                id: entry.ledger._id,
                type: 'Expense',
                refNo: entry.expense?.refNo || '-',
                account: entry.expense?.accountingAccountId?.accountName || '-',
                description: entry.expense?.memo || '-',
                amount: `₦${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(entry.expense?.total || 0))}`,
                date: entry.expense?.paymentDate
                  ? format(new Date(entry.expense.paymentDate), 'MMM dd, yyyy')
                  : '-',
              };
            } else if (isProduct) {
              const firstProduct = entry.product?.products?.[0];
              return {
                id: entry.ledger._id,
                type: 'Invoice',
                refNo: entry.product?.invoiceId || '-',
                account: firstProduct?.name || '-',
                description: firstProduct?.description || '-',
                amount: `₦${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(entry.product?.total || 0))}`,
                date: entry.ledger?.createdAt
                  ? format(new Date(entry.ledger.createdAt), 'MMM dd, yyyy')
                  : '-',
              };
            }

            return null;
          })
          .filter(Boolean);

        setLedgerData(transformedData);
      } catch (err) {
        console.error('Error fetching ledger entries:', err);
        toast.error('Failed to fetch ledger entries');
      } finally {
        setIsLoading(false);
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
          searchFields={['type', 'refNo', 'account', 'description']}
          searchPlaceholder="Search ledger entries..."
          paginationData={{
            page: paginationInfo.page,
            totalPages: paginationInfo.totalPages,
            pageSize: paginationInfo.limit,
            totalCount: paginationInfo.totalDocs,
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
          isLoading={isLoading}
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
