import AccountActions from '@/components/dashboard/accounting/bookkeeping/account-cta';
import AddAccountForm from '@/components/dashboard/accounting/bookkeeping/add-account';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AccountService from '@/api/accounts';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';

// Table columns configuration
const accountColumns = [
  { key: 'accountNumber', label: 'Account Number' },
  { key: 'accountName', label: 'Name' },
  { key: 'accountType', label: 'Type' },
  { key: 'description', label: 'Description' },
  { key: 'currency', label: 'Currency' },
  { key: 'balance', label: 'Balance' },
];

// Dropdown actions for each row
const accountDropdownActions = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View' },
  { key: 'delete', label: 'Delete' },
  { key: 'duplicate', label: 'Duplicate' },
];

export default function ChartOfAccounts() {
  // State for AccountActions
  const [batchAction, setBatchAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalDocs: 0,
    limit: 50,
    totalPages: 1,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { businessData } = useUserStore();
  const [columns, setColumns] = useState({
    number: true,
    type: true,
    detailType: true,
    currency: true,
    bankBalance: true,
  });
  const [includeInactive, setIncludeInactive] = useState(true);
  const [showAccountTypeBadges, setShowAccountTypeBadges] = useState(true);
  const [pageSize, setPageSize] = useState('75');
  const [tableDensity, setTableDensity] = useState('Cozy');
  const [openAddForm, setOpenAddForm] = useState(false);
  const [showAccountSuccess, setShowAccountSuccess] = useState(false);
  const [openRunReportForm, setOpenRunReportForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const navigate = useNavigate();

  // Helper function to capitalize text
  const capitalizeText = (text) => {
    if (!text) return '';
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!businessData?._id) return;

      try {
        setIsLoading(true);
        const response = await AccountService.fetch({
          search: searchTerm,
          page: currentPage,
          perPage: parseInt(pageSize) || 50,
        });

        const responseData = response.data?.data;
        const accounts = responseData?.accounts || [];

        // Update pagination info
        setPaginationInfo({
          totalDocs: responseData?.totalDocs || 0,
          limit: responseData?.limit || 50,
          totalPages: responseData?.totalPages || 1,
          page: responseData?.page || 1,
          hasNextPage: responseData?.hasNextPage || false,
          hasPrevPage: responseData?.hasPrevPage || false,
        });

        // Transform accounts to match table format
        const transformedAccounts = accounts.map((account) => ({
          id: account._id,
          accountNumber: account.accountCode || account.accountNumber || '',
          accountName: account.accountName || '',
          accountType: capitalizeText(account.accountType || ''),
          description: account.description || '',
          currency: account.currency || 'USD',
          balance: account.balance
            ? `${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(account.balance))}`
            : '0.00',
          parentAccountId: account.parentAccountId || null,
          subAccount: account.subAccount,
          parentAccount: account.parentAccount,
        }));

        setAccountsData(transformedAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('Failed to fetch accounts');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const debounceTimer = setTimeout(() => {
      fetchAccounts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [businessData, searchTerm, currentPage, pageSize]);

  // Handlers
  const handleBatchActionChange = (value) => {
    setBatchAction(value);
    console.log('Batch action changed to:', value);
  };

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
    console.log('Search term changed to:', value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const handleColumnsChange = (column, checked) => {
    setColumns((prev) => ({
      ...prev,
      [column]: checked,
    }));
    console.log(`Column ${column} visibility changed to:`, checked);
  };

  const handleIncludeInactiveChange = (checked) => {
    setIncludeInactive(checked);
    console.log('Include inactive changed to:', checked);
  };

  const handleShowAccountTypeBadgesChange = (checked) => {
    setShowAccountTypeBadges(checked);
    console.log('Show account type badges changed to:', checked);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing page size
    console.log('Page size changed to:', value);
  };

  const handleTableDensityChange = (value) => {
    setTableDensity(value);
    console.log('Table density changed to:', value);
  };

  const handleFilterClick = () => {
    console.log('Filter button clicked');
    // Add filter logic here
  };

  const handleDownloadFormats = (format, checked) => {
    console.log(
      `Download format ${format} ${checked ? 'selected' : 'deselected'}`
    );
    // Add download logic here
  };

  const handleRunReport = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select an account first');
      return;
    }
    setOpenRunReportForm(true);
  };

  // Handle row actions for the accounts table
  const handleAccountRowAction = (action, account) => {
    console.log(`Action: ${action}`, account);
    switch (action) {
      case 'edit':
        console.log('Edit account:', account.accountNumber);
        // Add edit logic here
        break;
      case 'view':
        console.log('View account:', account.accountNumber);
        // Add view logic here
        break;
      case 'delete':
        console.log('Delete account:', account.accountNumber);
        // Add delete logic here
        break;
      case 'duplicate':
        console.log('Duplicate account:', account.accountNumber);
        // Add duplicate logic here
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleSelectTableItem = (itemId, checked) => {
    let newSelectedItems;
    if (checked) {
      newSelectedItems = [...selectedItems, itemId];
      setSelectedItems(newSelectedItems);
    } else {
      newSelectedItems = selectedItems.filter((id) => id !== itemId);
      setSelectedItems(newSelectedItems);
    }

    // Set the selected account based on the last item in the array
    if (newSelectedItems.length > 0) {
      const lastSelectedId = newSelectedItems[newSelectedItems.length - 1];
      const account = accountsData.find((acc) => acc.id === lastSelectedId);
      setSelectedAccount(account);
      console.log('Account selected:', account);
    } else {
      setSelectedAccount(null);
    }
  };

  const handleSelectAllItems = (checked) => {
    if (checked) {
      setSelectedItems(accountsData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Get visible columns based on settings
  const getVisibleColumns = () => {
    return accountColumns.filter((column) => {
      switch (column.key) {
        case 'accountNumber':
          return columns.number;
        case 'accountType':
          return columns.type;
        case 'description':
          return columns.detailType;
        case 'currency':
          return columns.currency;
        case 'balance':
          return columns.bankBalance;
        default:
          return true; // Always show name column
      }
    });
  };
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Chart of Accounts</h1>
          <p className="text-sm text-[#7D7D7D]">
            View and manage your asset, liability, income, and expense accounts
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenAddForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            Add Account
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <AccountActions
          batchAction={batchAction}
          onBatchActionChange={handleBatchActionChange}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          columns={columns}
          onColumnsChange={handleColumnsChange}
          includeInactive={includeInactive}
          onIncludeInactiveChange={handleIncludeInactiveChange}
          showAccountTypeBadges={showAccountTypeBadges}
          onShowAccountTypeBadgesChange={handleShowAccountTypeBadgesChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          tableDensity={tableDensity}
          onTableDensityChange={handleTableDensityChange}
          onFilterClick={handleFilterClick}
          onDownloadFormats={handleDownloadFormats}
          onRunReport={handleRunReport}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <AccountingTable
          className="mt-10"
          title="Chart of Accounts"
          data={accountsData}
          columns={getVisibleColumns()}
          searchFields={['accountName', 'accountNumber', 'accountType']}
          searchPlaceholder="Search accounts..."
          dropdownActions={accountDropdownActions}
          paginationData={{
            page: paginationInfo.page,
            totalPages: paginationInfo.totalPages,
            pageSize: paginationInfo.limit,
            totalCount: paginationInfo.totalDocs,
          }}
          onPageChange={handlePageChange}
          onRowAction={handleAccountRowAction}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectTableItem}
          handleSelectAll={handleSelectAllItems}
          isLoading={isLoading}
        />
      </div>

      <AddAccountForm
        isOpen={openAddForm}
        onClose={setOpenAddForm}
        showSuccessModal={async () => {
          setShowAccountSuccess(true);
          // Refresh accounts list
          try {
            const response = await AccountService.fetch({
              search: searchTerm,
              page: currentPage,
              perPage: parseInt(pageSize) || 50,
            });
            const responseData = response.data?.data;
            const accounts = responseData?.accounts || [];

            // Update pagination info
            setPaginationInfo({
              totalDocs: responseData?.totalDocs || 0,
              limit: responseData?.limit || 50,
              totalPages: responseData?.totalPages || 1,
              page: responseData?.page || 1,
              hasNextPage: responseData?.hasNextPage || false,
              hasPrevPage: responseData?.hasPrevPage || false,
            });

            const transformedAccounts = accounts.map((account) => ({
              id: account._id,
              accountNumber: account.accountCode || account.accountNumber || '',
              accountName: account.accountName || '',
              accountType: capitalizeText(account.accountType || ''),
              description: account.description || '',
              currency: account.currency || 'USD',
              balance: account.balance
                ? `${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(account.balance))}`
                : '0.00',
            }));
            setAccountsData(transformedAccounts);
          } catch (error) {
            console.error('Error refreshing accounts:', error);
          }
        }}
      />

      <SuccessModal
        title={'Account Added'}
        description={`You've successfully added an account.`}
        open={showAccountSuccess}
        onOpenChange={setShowAccountSuccess}
        backText={'Back'}
        handleBack={() => setShowAccountSuccess(false)}
      />

      <RunReportForm
        isOpen={openRunReportForm}
        onClose={() => setOpenRunReportForm(false)}
        onSubmit={async (data) => {
          try {
            if (selectedItems.length === 0) {
              toast.error('No account selected');
              return;
            }

            // Fetch transactions with date range and selected account IDs
            const response = await AccountService.fetchTransactions({
              accountingAccountId: selectedItems,
              startDate: data.fromDate
                ? data.fromDate.toISOString()
                : undefined,
              endDate: data.toDate ? data.toDate.toISOString() : undefined,
            });

            const transactions = response.data?.data?.transactions || [];

            if (transactions.length === 0) {
              toast.error('No records found for the selected date range');
              setOpenRunReportForm(false);
              return;
            }

            // Navigate to report page with account and date range data
            setOpenRunReportForm(false);
            navigate('/dashboard/accounting/bookkeeping/report', {
              state: {
                accountIds: selectedItems,
                accountId: selectedAccount?.id,
                accountName: selectedAccount?.accountName,
                accountNumber: selectedAccount?.accountNumber,
                startDate: data.fromDate,
                endDate: data.toDate,
                accountingMethod: data.accountingMethod,
              },
            });
          } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to fetch transactions');
          }
        }}
      />
    </div>
  );
}
