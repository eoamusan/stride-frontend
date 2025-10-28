import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import AccountingTable from '@/components/dashboard/accounting/table';
import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';

export default function AccountsReceivable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createInvoice, setCreateInvoice] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // State for column visibility
  const [columns, setColumns] = useState({
    number: true,
    type: true,
    detailType: true,
    currency: true,
    bankBalance: true,
  });

  // State for other settings
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showAccountTypeBadges, setShowAccountTypeBadges] = useState(true);
  const [pageSize, setPageSize] = useState('50');
  const [tableDensity, setTableDensity] = useState('Cozy');

  // Check for create parameter on component mount
  useEffect(() => {
    const createParam = searchParams.get('create-invoice');
    if (createParam === 'true') {
      setCreateInvoice(true);
    } else {
      setCreateInvoice(false);
    }
  }, [searchParams]);

  // Sample data for Accounts Receivable table
  const accountsReceivableData = [
    {
      id: 1,
      customer: 'James frank',
      totalSales: 345,
      outstandingBalance: 15400.0,
      currentDue: 15400.0,
      dueDate: 'Jul 20, 2024',
      creditTerms: '30 days',
    },
    {
      id: 2,
      customer: 'James frank',
      totalSales: 345,
      outstandingBalance: 15400.0,
      currentDue: 15400.0,
      dueDate: 'Jul 20, 2024',
      creditTerms: '15 days',
    },
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: 'customer',
      label: 'Customer',
      className: 'font-medium',
    },
    {
      key: 'totalSales',
      label: 'Total Sales',
    },
    {
      key: 'outstandingBalance',
      label: 'Outstanding Balance',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'currentDue',
      label: 'Current Due',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
    },
    {
      key: 'creditTerms',
      label: 'Credit Terms',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'run-report', label: 'Run Report' },
    { key: 'view', label: 'View' },
  ];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 10,
    pageSize: 50,
    totalCount: 500,
  };

  // Handler functions
  const onDownloadFormats = (format, checked) => {
    console.log(`Download format ${format} changed to:`, checked);
    // Implement download logic here
  };

  const onColumnsChange = (columnName, checked) => {
    setColumns((prev) => ({
      ...prev,
      [columnName]: checked,
    }));
  };

  const onIncludeInactiveChange = (checked) => {
    setIncludeInactive(checked);
  };

  const onShowAccountTypeBadgesChange = (checked) => {
    setShowAccountTypeBadges(checked);
  };

  const onPageSizeChange = (value) => {
    setPageSize(value);
  };

  const onTableDensityChange = (value) => {
    setTableDensity(value);
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);
    // Implement row action logic here
  };

  const handleSelectTableItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAllItems = (checked) => {
    if (checked) {
      setSelectedItems(accountsReceivableData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleToggleCreateInvoice = () => {
    const newToggleState = !createInvoice;
    setCreateInvoice(newToggleState);

    // Update search params when createInvoice changes
    if (newToggleState) {
      setSearchParams({ 'create-invoice': 'true' });
    } else {
      // Remove the create parameter when closing
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('create-invoice');
      setSearchParams(newSearchParams);
    }
  };

  if (createInvoice) {
    return (
      <div className="my-4 min-h-screen">
        <CreateInvoice />
      </div>
    );
  }

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Accounts Receivable</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your accounts receivable
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={handleToggleCreateInvoice}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Create Invoice
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} className={'size-10'} variant={'outline'}>
                <DownloadIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-11 min-w-24 text-xs" align="end">
              <DropdownMenuCheckboxItem
                onCheckedChange={(checked) => onDownloadFormats('pdf', checked)}
              >
                Pdf
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={(checked) =>
                  onDownloadFormats('excel', checked)
                }
              >
                Excel
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={(checked) => onDownloadFormats('csv', checked)}
              >
                csv**
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} className={'size-10'} variant={'outline'}>
                <SettingsIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs" align="end">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={columns.number}
                onCheckedChange={(checked) =>
                  onColumnsChange('number', checked)
                }
              >
                Number
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.type}
                onCheckedChange={(checked) => onColumnsChange('type', checked)}
              >
                Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.detailType}
                onCheckedChange={(checked) =>
                  onColumnsChange('detailType', checked)
                }
              >
                Detail type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.currency}
                onCheckedChange={(checked) =>
                  onColumnsChange('currency', checked)
                }
              >
                Currency
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.bankBalance}
                onCheckedChange={(checked) =>
                  onColumnsChange('bankBalance', checked)
                }
              >
                Bank balance
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Others</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={includeInactive}
                onCheckedChange={onIncludeInactiveChange}
              >
                Include inactive
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showAccountTypeBadges}
                onCheckedChange={onShowAccountTypeBadgesChange}
              >
                Show account type badges
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Page sizes</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={pageSize}
                onValueChange={onPageSizeChange}
              >
                <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="75">75</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="200">200</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="300">300</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Table Density</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={tableDensity}
                onValueChange={onTableDensityChange}
              >
                <DropdownMenuRadioItem value="Cozy">Cozy</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Compact">
                  Compact
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Accounts Receivable Table */}
      <AccountingTable
        title="Accounts Receivable (A/R)"
        data={accountsReceivableData}
        columns={tableColumns}
        searchFields={['customer', 'dueDate', 'creditTerms']}
        searchPlaceholder="Search invoices......"
        dropdownActions={dropdownActions}
        paginationData={paginationData}
        onRowAction={handleRowAction}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectTableItem}
        handleSelectAll={handleSelectAllItems}
        className="mt-10"
      />
    </div>
  );
}
