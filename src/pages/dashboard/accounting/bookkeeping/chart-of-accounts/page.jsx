import AccountActions from '@/components/dashboard/accounting/bookkeeping/account-cta';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
          <Button className={'h-10 rounded-2xl text-sm'}>Add Account</Button>
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
      </div>
    </div>
  );
}
