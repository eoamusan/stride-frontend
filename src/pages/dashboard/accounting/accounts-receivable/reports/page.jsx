import { useState, useEffect } from 'react';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import DownloadDropdown from '@/components/dashboard/accounting/download-dropdown';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import InvoiceService from '@/api/invoice';
import { useUserStore } from '@/stores/user-store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';

export default function AccountsReceivableReports() {
  const [dateFilter, setDateFilter] = useState();
  const { businessData } = useUserStore();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState('50');
  const [paginationInfo, setPaginationInfo] = useState({
    totalDocs: 0,
    limit: 50,
    totalPages: 1,
    page: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const reportsMetrics = [
    { title: 'Total AR', value: '$264' },
    { title: 'Total Customer', value: '164' },
    { title: 'AR Overdue', value: '30', symbol: '$' },
    { title: 'AR Due Soon', value: '30', symbol: '$' },
  ];

  // Account Receivable Aging chart data
  const agingChartData = [
    { day: '0-30 days', value: 70000 },
    { day: '31-60 days', value: 18000 },
    { day: '61-90 days', value: 33000 },
    { day: '90+ days', value: 20000 },
  ];

  // Chart configuration
  const agingChartConfig = {
    value: {
      label: 'Amount',
      color: '#8B5CF6',
    },
  };

  // Y-axis formatter for thousands
  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `$${value / 1000}k`;
    }
    return `$${value}`;
  };

  // AR Trend chart data
  const arTrendData = [
    { date: '2026-01-01', value: 60000 },
    { date: '2026-02-01', value: 15000 },
    { date: '2026-03-01', value: 62000 },
    { date: '2026-04-01', value: 12000 },
    { date: '2026-05-01', value: 45000 },
    { date: '2026-06-01', value: 68000 },
    { date: '2026-07-01', value: 20000 },
    { date: '2026-08-01', value: 38000 },
    { date: '2026-09-01', value: 15000 },
    { date: '2026-10-01', value: 45000 },
    { date: '2026-11-01', value: 20000 },
    { date: '2026-12-01', value: 95000 },
  ];

  // AR Trend chart configuration
  const arTrendConfig = [
    {
      dataKey: 'value',
      label: 'Account Receivable',
      color: '#10B981',
    },
  ];

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
          customerId: invoice.customerId?._id || '',
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

  // const handlePageSizeChange = (newPageSize) => {
  //   setPageSize(newPageSize);
  //   setCurrentPage(1); // Reset to first page when changing page size
  // };

  return (
    <div className="my-4 min-h-screen pl-1">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-[#7D7D7D]">All Reports and Analysis</p>
        </hgroup>

        <div className="flex items-center gap-4">
          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 pl-3 text-left font-normal`}
              >
                {dateFilter ? (
                  format(dateFilter, 'PPP')
                ) : (
                  <span>Select date</span>
                )}
                <ChevronDownIcon className="ml-auto h-4 w-4 opacity-90" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                className={'w-full'}
                mode="single"
                defaultMonth={dateFilter}
                selected={dateFilter}
                onSelect={setDateFilter}
              />
            </PopoverContent>
          </Popover>

          <Button className={'h-10 rounded-lg text-sm'}>Run Report</Button>
          <DownloadDropdown />
        </div>
      </div>

      <div className="my-10">
        <div>
          <Metrics metrics={reportsMetrics} />
        </div>
        <div className="mt-10 flex flex-col gap-10 md:flex-row">
          <BarChartOverview
            title="Account Receivable Aging"
            chartConfig={agingChartConfig}
            chartData={agingChartData}
            emptyState={false}
            showLegend={false}
            numberOfBars={1}
            yAxisFormatter={formatYAxis}
            className="w-full md:w-1/2"
          />

          <SimpleAreaMetricCard
            title="AR Trend"
            chartConfig={arTrendConfig}
            chartData={arTrendData}
            emptyState={false}
            className="h-full w-full md:w-1/2"
          />
        </div>

        <div className="mt-10 mb-24">
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
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
