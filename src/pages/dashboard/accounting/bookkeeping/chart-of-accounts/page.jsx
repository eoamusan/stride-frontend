import AccountActions from '@/components/dashboard/accounting/bookkeeping/account-cta';
import AddAccountForm from '@/components/dashboard/accounting/bookkeeping/add-account';
import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
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

// Pagination data
const accountPaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 75,
  totalCount: 200,
};

export default function ChartOfAccounts() {
  // State for AccountActions
  const [batchAction, setBatchAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
        const response = await AccountService.fetch();
        const accounts = response.data?.data || [];

        // Transform accounts to match table format
        const transformedAccounts = accounts.map((account) => ({
          id: account._id,
          accountNumber: account.accountNumber || '',
          accountName: account.accountName || '',
          accountType: capitalizeText(account.accountType || ''),
          description: account.description || '',
          currency: account.currency || '',
          balance: account.balance
            ? `${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(account.balance))}`
            : '0.00',
        }));

        setAccountsData(transformedAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('Failed to fetch accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [businessData]);

  // Handlers
  const handleBatchActionChange = (value) => {
    setBatchAction(value);
    console.log('Batch action changed to:', value);
  };

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    console.log('Search term changed to:', value);
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
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAllItems = (checked) => {
    const filteredData = getFilteredAccounts();
    if (checked) {
      setSelectedItems(filteredData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Filter accounts based on search term and column visibility
  const getFilteredAccounts = () => {
    let filtered = accountsData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.accountName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.accountNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.accountType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
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
          <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
            Date Range
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
        />

        <AccountingTable
          className="mt-10"
          title="Chart of Accounts"
          data={getFilteredAccounts()}
          columns={getVisibleColumns()}
          searchFields={['accountName', 'accountNumber', 'accountType']}
          searchPlaceholder="Search accounts..."
          dropdownActions={accountDropdownActions}
          paginationData={{
            ...accountPaginationData,
            pageSize: parseInt(pageSize),
          }}
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
            const response = await AccountService.fetch();
            const accounts = response.data?.data || [];
            const transformedAccounts = accounts.map((account) => ({
              id: account._id,
              accountNumber: account.accountNumber || '',
              accountName: account.accountName || '',
              accountType: capitalizeText(account.accountType || ''),
              description: account.description || '',
              currency: account.currency || '',
              balance: account.balance
                ? `${account.currency || '$'}${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(account.balance))}`
                : '$0.00',
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
        onSubmit={() => {
          setOpenRunReportForm(false);
        }}
      />
    </div>
  );
}
