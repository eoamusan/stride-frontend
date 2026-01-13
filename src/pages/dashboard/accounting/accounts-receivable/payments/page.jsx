import { useState, useEffect } from 'react';
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
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import PaymentService from '@/api/payment';
import { useUserStore } from '@/stores/user-store';

const paymentColumns = [
  { key: 'id', label: 'Payment ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'method', label: 'Method' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const paymentStatusStyles = {
  Completed: 'bg-green-100 text-green-800 hover:bg-green-100',
  Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
  Failed: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const paymentDropdownActions = [
  { key: 'view', label: 'View' },
  { key: 'resend', label: 'Resend' },
  { key: 'refund', label: 'Refund' },
  { key: 'export', label: 'Export' },
];

export default function Payments() {
  const { businessData } = useUserStore();
  const [payments, setPayments] = useState([]);
  const [rawPayments, setRawPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentPaginationData, setPaymentPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 50,
    totalCount: 0,
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
      setSelectedItems(payments.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedItems([]);
  };

  // Handler functions
  const handleToggleCreatePayment = () => {
    console.log('Toggle create payment');
    // Implement create payment logic here
  };

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

  const handlePaymentAction = (action, payment) => {
    console.log('Payment action:', action, payment);
    // Handle different actions here
  };

  // Calculate metrics from payment data
  const calculateMetrics = () => {
    const totalPayments = paymentPaginationData.totalCount || 0;
    const completedPayments = rawPayments.filter(
      (item) => item.invoiceId?.status === 'PAID'
    ).length;
    const pendingPayments = totalPayments - completedPayments;

    // Calculate total amount received
    const totalAmount = rawPayments.reduce((sum, item) => {
      const amount = Number(item.amountPaid || 0);
      return sum + amount;
    }, 0);

    return [
      {
        title: 'Total Payments',
        value: totalPayments,
      },
      {
        title: 'Total Received',
        value: totalAmount,
        symbol: '',
      },
      {
        title: 'Completed',
        value: completedPayments,
      },
      {
        title: 'Pending',
        value: pendingPayments,
      },
    ];
  };

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      if (!businessData?._id) return;

      try {
        setIsLoading(true);
        const response = await PaymentService.fetch({
          page: currentPage,
          perPage: parseInt(pageSize),
        });

        console.log('Payments response:', response.data);

        const paymentsData = response.data?.data?.payments || [];
        const pagination = response.data?.data || {};

        // Store raw payment data for metrics calculation
        setRawPayments(paymentsData);

        // Transform payment data
        const transformedPayments = paymentsData.map((payment) => {
          const invoice = payment.invoiceId;
          const currency = invoice?.currency || 'NGN';
          const symbol =
            currency === 'USD'
              ? '$'
              : currency === 'EUR'
                ? '€'
                : currency === 'GBP'
                  ? '£'
                  : '₦';

          return {
            id: payment._id,
            customer: invoice?.customerId || '-',
            invoice: invoice?.invoiceNo || '-',
            method: payment.paymentMethod || '-',
            amount: `${symbol}${parseFloat(
              payment.amountPaid || 0
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            date: payment.paymentDate
              ? new Date(payment.paymentDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '-',
            status: invoice?.status || 'Completed',
          };
        });

        setPayments(transformedPayments);
        setPaymentPaginationData({
          page: pagination.page || currentPage,
          totalPages: pagination.totalPages || 1,
          pageSize: pagination.limit || parseInt(pageSize),
          totalCount: pagination.totalDocs || paymentsData.length,
        });
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [businessData?._id, currentPage, pageSize]);

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Payment Processing</h1>
          <p className="text-sm text-[#7D7D7D]">
            Record and track incoming payments
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={handleToggleCreatePayment}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Record Payment
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
              <Button
                size={'icon'}
                className={'mr-1 size-10'}
                variant={'outline'}
              >
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
        <Metrics metrics={calculateMetrics()} />
      </div>

      <AccountingTable
        className="mt-10"
        title={'Incoming Payments'}
        data={payments}
        columns={paymentColumns}
        searchFields={['customer', 'invoice', 'id']}
        searchPlaceholder="Search payment......"
        statusStyles={paymentStatusStyles}
        dropdownActions={paymentDropdownActions}
        paginationData={paymentPaginationData}
        onPageChange={handlePageChange}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
        handleSelectAll={handleSelectAll}
        onRowAction={handlePaymentAction}
        isLoading={isLoading}
      />
    </div>
  );
}
