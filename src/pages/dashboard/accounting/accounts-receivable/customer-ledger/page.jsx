import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
import CustomerService from '@/api/customer';
import { useUserStore } from '@/stores/user-store';

export default function CustomerLedger() {
  const { businessData } = useUserStore();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 50,
    totalCount: 0,
  });

  // Dynamic ledger metrics
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
      value: paginationData.totalCount.toString(),
    },
  ];

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
      setSelectedItems(customers.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

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
      render: (value) =>
        value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      key: 'outstandingBalance',
      label: 'Outstanding Balance',
      render: (value) => (
        <span className="text-[#FFAE4C]">
          {value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: 'creditLimit',
      label: 'Credit Limit',
      render: (value) =>
        value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      key: 'creditAvailable',
      label: 'Credit Available',
      render: (value) => {
        const safeValue = Number(value) < 0 ? 0 : Number(value) || 0;
        return (
          <span className="text-[#24A959]">
            {safeValue.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'view-invoices', label: 'View Invoices' },
    { key: 'receipt', label: 'Generate Receipt' },
    { key: 'view-credit-notes', label: 'View Credit Notes' },
  ];

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const navigate = useNavigate();

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    if (action === 'view-invoices') {
      navigate(
        `/dashboard/accounting/accounts-receivable/customer-ledger/${item.id}?view=invoices`
      );
    } else if (action === 'view-credit-notes') {
      navigate(
        `/dashboard/accounting/accounts-receivable/customer-ledger/${item.id}?view=credit-notes`
      );
    }
  };

  // Transform customer data for ledger table
  const transformCustomerData = (customersData) => {
    return customersData.map((item, index) => {
      const customer = item.customer;
      const invoices = item.invoices || [];

      // Total sales placeholder for now
      const totalSales = item.totalSales || 0;
      const outstandingBalance = item.balance || 0;
      const creditLimit = parseFloat(customer.creditLimit || 0);
      const creditAvailableRaw = item.creditAvailable ?? 0;
      const creditAvailable = creditAvailableRaw < 0 ? 0 : creditAvailableRaw;

      return {
        id: customer._id || index,
        customer:
          customer.displayName || `${customer.firstName} ${customer.lastName}`,
        totalSales,
        outstandingBalance,
        creditLimit,
        creditAvailable,
        currency: invoices[0]?.currency || 'NGN', // Get currency from first invoice
      };
    });
  };

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!businessData?._id) return;

      try {
        setIsLoading(true);
        const response = await CustomerService.fetch({
          page: currentPage,
          perPage: 50,
        });

        console.log('Customers response:', response.data);

        const customersData = response.data?.data?.customers || [];
        const transformedData = transformCustomerData(customersData);
        setCustomers(transformedData);

        // Update pagination data
        const apiData = response.data?.data;
        setPaginationData({
          page: apiData?.page || 1,
          totalPages: apiData?.totalPages || 1,
          pageSize: apiData?.limit || 50,
          totalCount: apiData?.totalDocs || 0,
        });
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [businessData?._id, currentPage]);

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
          data={customers}
          columns={tableColumns}
          searchFields={['customer', 'totalSales']}
          searchPlaceholder="Search customer......"
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
        <div className="hidden w-full max-w-47 lg:block">
          <img src={temporaryImg} alt="temporary" className="w-full" />
        </div>
      </div>
    </div>
  );
}
