import { useState } from 'react';
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
import { CalendarDaysIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import temporaryImg from '@/assets/images/customer-ledger-temp.png';

const ledgerMetrics = [
  { title: 'Total Outstanding', value: '$264' },
  {
    title: 'Overdue',
    value: '$15,600',
  },
  {
    title: 'Due This week',
    value: '$64',
  },
  {
    title: 'Active Customers',
    value: '264',
  },
];

export default function CustomerLedger() {
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

  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);

  // Handle table item selection
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(customerLedgerData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Customer Ledger data based on the image
  const customerLedgerData = [
    {
      id: 1,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 2,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 3,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 4,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 5,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 6,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 7,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 8,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
    },
    {
      id: 9,
      customer: 'ABC Corporation',
      totalSales: 4999,
      outstandingBalance: 15400.0,
      creditLimit: 15400.0,
      creditAvailable: 15400.0,
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
      label: 'Total sales',
    },
    {
      key: 'outstandingBalance',
      label: 'Outstanding Balance',
      render: (value) => (
        <span className="text-[#FFAE4C]">${value.toLocaleString()}</span>
      ),
    },
    {
      key: 'creditLimit',
      label: 'Credit Limit',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'creditAvailable',
      label: 'Credit Available',
      render: (value) => (
        <span className="text-[#24A959]">${value.toLocaleString()}</span>
      ),
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'invoices', label: 'Invoices' },
    { key: 'receipt', label: 'Receipt' },
    { key: 'credit-note', label: 'Credit note' },
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

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Customer Ledger</h1>
          <p className="text-sm text-[#7D7D7D]">Manage your customers ledger</p>
        </hgroup>

        <div className="flex space-x-4">
          <Button variant="outline" className={'h-10 text-sm'}>
            <CalendarDaysIcon className="size-4" />
            Date Range
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

      <div className="mt-10">
        {ledgerMetrics && ledgerMetrics.length > 0 && (
          <Metrics metrics={ledgerMetrics} />
        )}
      </div>
      <div className="mt-10 flex gap-6">
        <AccountingTable
          title={'Customer Ledger'}
          data={customerLedgerData}
          columns={tableColumns}
          searchFields={['customer', 'totalSales']}
          searchPlaceholder="Search customer......"
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
        />
        <div className="hidden w-full max-w-[188px] lg:block">
          <img src={temporaryImg} alt="temporary" className="w-full" />
        </div>
      </div>
    </div>
  );
}
