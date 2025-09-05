import AccountActions from '@/components/dashboard/accounting/bookkeeping/account-cta';
import AccountSuccess from '@/components/dashboard/accounting/bookkeeping/account-success';
import AddAccountForm from '@/components/dashboard/accounting/bookkeeping/add-account';
import BookkeepingTable from '@/components/dashboard/accounting/bookkeeping/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const accountsData = [
  {
    id: 1,
    codeSeries: '10001',
    name: 'Wage expenses',
    type: 'Office equipment',
    description: 'Thank you',
    currency: 'NGN',
    balance: '$453',
  },
  {
    id: 2,
    codeSeries: '10001',
    name: 'Wage expenses',
    type: 'Office equipment',
    description: 'Received',
    currency: 'EUR',
    balance: '$453',
  },
];

// Table columns configuration
const accountColumns = [
  { key: 'codeSeries', label: 'Code Series' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
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
  const [openAddForm, setOpenAddForm] = useState(true);
  const [showAccountSuccess, setShowAccountSuccess] = useState(false);

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
    console.log('Run report clicked');
    // Add report generation logic here
  };

  // Handle row actions for the accounts table
  const handleAccountRowAction = (action, account) => {
    console.log(`Action: ${action}`, account);
    switch (action) {
      case 'edit':
        console.log('Edit account:', account.codeSeries);
        // Add edit logic here
        break;
      case 'view':
        console.log('View account:', account.codeSeries);
        // Add view logic here
        break;
      case 'delete':
        console.log('Delete account:', account.codeSeries);
        // Add delete logic here
        break;
      case 'duplicate':
        console.log('Duplicate account:', account.codeSeries);
        // Add duplicate logic here
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Filter accounts based on search term and column visibility
  const getFilteredAccounts = () => {
    let filtered = accountsData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.codeSeries.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Get visible columns based on settings
  const getVisibleColumns = () => {
    return accountColumns.filter((column) => {
      switch (column.key) {
        case 'codeSeries':
          return columns.number;
        case 'type':
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

        <BookkeepingTable
          className="mt-10"
          data={getFilteredAccounts()}
          columns={getVisibleColumns()}
          dropdownActions={accountDropdownActions}
          paginationData={{
            ...accountPaginationData,
            pageSize: parseInt(pageSize),
          }}
          onRowAction={handleAccountRowAction}
        />
      </div>

      <AddAccountForm
        isOpen={openAddForm}
        onClose={setOpenAddForm}
        showSuccessModal={() => setShowAccountSuccess(true)}
      />

      <AccountSuccess
        open={showAccountSuccess}
        onOpenChange={setShowAccountSuccess}
      />
    </div>
  );
}
