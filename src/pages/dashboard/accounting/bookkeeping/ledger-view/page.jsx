import LedgerViewCta from '@/components/dashboard/accounting/bookkeeping/ledger-view-cta';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import AccountService from '@/api/accounts';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ledgercolumns = [
  { key: 'type', label: 'Type' },
  { key: 'refNo', label: 'Reference No' },
  { key: 'account', label: 'Account' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'balance', label: 'Balance' },
  { key: 'date', label: 'Date' },
];

export default function LedgerView() {
  // State for LedgerViewCta
  const [reportPeriod, setReportPeriod] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountType, setAccountType] = useState('');
  const [accountingMethod, setAccountingMethod] = useState('cash');
  const [selectedType, setSelectedType] = useState(null);
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
        const response = await AccountService.fetchTransactions({
          businessId: true,
        });
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

        // Helper function to get appropriate balance based on account type
        const getBalanceByAccountType = (transaction) => {
          const accountType =
            transaction.accountingAccountId?.accountType?.toLowerCase();

          switch (accountType) {
            case 'income':
            case 'equity':
            case 'liabilities':
              return transaction.creditBalance || 0;
            case 'expenses':
            case 'assets':
              return transaction.debitBalance || 0;
            default:
              // Fallback to whichever balance has a value
              return transaction.creditBalance || transaction.debitBalance || 0;
          }
        };

        // Transform transaction data
        const transactions = responseData?.transactions || [];
        const transformedData = transactions
          .map((transaction) => {
            const isExpense = transaction.type === 'expense';
            const isProduct = transaction.type === 'product';
            const balance = getBalanceByAccountType(transaction);
            const currency = transaction.invoiceId?.currency || 'NGN';
            const currencySymbol =
              currency === 'NGN'
                ? '₦'
                : currency === 'USD'
                  ? '$'
                  : currency === 'EUR'
                    ? '€'
                    : currency === 'GBP'
                      ? '£'
                      : currency;

            if (isExpense) {
              return {
                id: transaction._id,
                type: 'Expense',
                refNo: transaction.refNo || '-',
                account: transaction.accountingAccountId?.accountName || '-',
                description: transaction.description || '-',
                amount: `${currencySymbol}${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(transaction.amount || 0))}`,
                balance: `${currencySymbol}${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(balance))}`,
                date: transaction.createdAt
                  ? format(new Date(transaction.createdAt), 'MMM dd, yyyy')
                  : '-',
              };
            } else if (isProduct) {
              return {
                id: transaction._id,
                type: 'Invoice',
                refNo: transaction.invoiceId?.invoiceNo || '-',
                account: transaction.accountingAccountId?.accountName || '-',
                description: transaction.description || '-',
                amount: `${currencySymbol}${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(transaction.amount || 0))}`,
                balance: `${currencySymbol}${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(balance))}`,
                date: transaction.createdAt
                  ? format(new Date(transaction.createdAt), 'MMM dd, yyyy')
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

  const handleTypeChange = (value) => {
    setAccountType(value);
    if (value === 'all' || value === '') {
      setSelectedType(null);
    } else {
      setSelectedType(value);
    }
    console.log('Transaction type changed to:', value);
  };

  const handleAccountingMethodChange = (value) => {
    setAccountingMethod(value);
    console.log('Accounting method changed to:', value);
  };

  const handleRunReport = () => {
    if (!selectedType) {
      toast.error('Please select a transaction type first');
      return;
    }

    if (!reportPeriod) {
      toast.error('Please select a report period');
      return;
    }

    // Fetch and navigate with the data from LedgerViewCta
    const fetchAndNavigate = async () => {
      try {
        setIsLoading(true);

        // Fetch transactions with date range and selected type
        const response = await AccountService.fetchTransactions({
          businessId: true,
          type: selectedType,
          startDate: fromDate ? fromDate.toISOString() : undefined,
          endDate: toDate ? toDate.toISOString() : undefined,
        });

        const transactions = response.data?.data?.transactions || [];

        if (transactions.length === 0) {
          toast.error('No records found for the selected criteria');
          return;
        }

        // Navigate to report page with type and date range data
        navigate('/dashboard/accounting/bookkeeping/ledger-view/report', {
          state: {
            type: selectedType,
            startDate: fromDate,
            endDate: toDate,
            accountingMethod: accountingMethod,
          },
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndNavigate();
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
          onAccountTypeChange={handleTypeChange}
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
    </div>
  );
}
