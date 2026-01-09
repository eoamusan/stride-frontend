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
import InvoiceService from '@/api/invoice';
import { useUserStore } from '@/stores/user-store';

export default function AccountsReceivable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createInvoice, setCreateInvoice] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { businessData } = useUserStore();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalDocs: 0,
    limit: 50,
    totalPages: 1,
    page: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

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

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await InvoiceService.fetch({
          businessId: businessData?._id,
          page: currentPage,
          perPage: parseInt(pageSize),
        });
        console.log('Fetched invoices:', response.data);

        const invoicesData = response.data?.data?.invoices || [];
        const pagination = response.data?.data || {};

        // Transform invoice data to match table structure
        const transformedInvoices = invoicesData.map((invoice) => ({
          id: invoice._id,
          customer: invoice.customerId?.displayName || 'Unknown',
          companyName: invoice.customerId?.companyName || '',
          totalSales: invoice.totalSales || 0,
          outstandingBalance: invoice.outstandingBalance || 0,
          totalAmountPaid: invoice.totalAmountPaid || 0,
          dueDate: invoice.dueDate,
          creditTerms: invoice.termsOfPayment || '',
          status: invoice.status,
          invoiceNo: invoice.invoiceNo,
          currency: invoice.currency,
        }));

        setInvoices(transformedInvoices);
        setPaginationInfo({
          totalDocs: pagination.totalDocs || 0,
          limit: pagination.limit || 50,
          totalPages: pagination.totalPages || 1,
          page: pagination.page || 1,
          hasPrevPage: pagination.hasPrevPage || false,
          hasNextPage: pagination.hasNextPage || false,
        });
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (businessData?._id) {
      fetchInvoices();
    }
  }, [businessData?._id, currentPage, pageSize]);

  // Sample data for Accounts Receivable table
  // Removed - using API data instead

  // Table columns configuration
  const tableColumns = [
    {
      key: 'customer',
      label: 'Customer',
      className: 'font-medium',
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          {item.companyName && (
            <div className="text-xs text-gray-500">{item.companyName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'invoiceNo',
      label: 'Invoice No',
    },
    {
      key: 'totalSales',
      label: 'Total Sales',
    },
    {
      key: 'outstandingBalance',
      label: 'Outstanding Balance',
      render: (value, item) => {
        const symbol =
          item.currency === 'USD'
            ? '$'
            : item.currency === 'EUR'
              ? '€'
              : item.currency === 'GBP'
                ? '£'
                : '₦';
        return `${symbol}${value.toLocaleString()}`;
      },
    },
    {
      key: 'totalAmountPaid',
      label: 'Total Amount Paid',
      render: (value, item) => {
        const symbol =
          item.currency === 'USD'
            ? '$'
            : item.currency === 'EUR'
              ? '€'
              : item.currency === 'GBP'
                ? '£'
                : '₦';
        return `${symbol}${parseFloat(value || 0).toLocaleString()}`;
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      key: 'creditTerms',
      label: 'Credit Terms',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'run-report', label: 'Run Report' },
    { key: 'view', label: 'View' },
  ];

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
    setCurrentPage(1); // Reset to first page when changing page size
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
      setSelectedItems(invoices.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        data={invoices}
        columns={tableColumns}
        searchFields={['customer', 'invoiceNo', 'creditTerms']}
        searchPlaceholder="Search invoices......"
        dropdownActions={dropdownActions}
        statusStyles={{
          PAID: 'bg-green-100 text-[#254c00] hover:bg-green-100',
          PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
          PART: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
          OVERDUE: 'bg-red-100 text-red-800 hover:bg-red-100',
        }}
        paginationData={{
          page: paginationInfo.page,
          totalPages: paginationInfo.totalPages,
          pageSize: paginationInfo.limit,
          totalCount: paginationInfo.totalDocs,
        }}
        onPageChange={handlePageChange}
        onRowAction={handleRowAction}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectTableItem}
        handleSelectAll={handleSelectAllItems}
        className="mt-10"
        isLoading={isLoading}
      />
    </div>
  );
}
