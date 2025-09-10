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
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import InvoicingTable from '@/components/dashboard/accounting/invoicing/table';

const paymentMetrics = [
  { title: 'Total Payments', value: '264' },
  {
    title: 'Total Received',
    value: '$15,600',
  },
  {
    title: 'Completed',
    value: '$64',
  },
  {
    title: 'Pending',
    value: '$64',
  },
];

const paymentData = [
  {
    id: 'P-35476',
    customer: 'ABC Corporation',
    invoice: '#INV-001',
    method: 'Bank Transfer',
    amount: '$15,400.00',
    date: 'Jul 20, 2024',
    status: 'Overdue',
  },
  {
    id: 'P-35477',
    customer: 'Tech Solutions Ltd',
    invoice: '#INV-002',
    method: 'Credit Card',
    amount: '$8,750.00',
    date: 'Aug 15, 2024',
    status: 'Completed',
  },
  {
    id: 'P-35478',
    customer: 'Global Enterprises',
    invoice: '#INV-003',
    method: 'Bank Transfer',
    amount: '$25,000.00',
    date: 'Aug 10, 2024',
    status: 'Pending',
  },
  {
    id: 'P-35479',
    customer: 'Creative Agency Inc',
    invoice: '#INV-004',
    method: 'PayPal',
    amount: '$12,300.00',
    date: 'Jul 30, 2024',
    status: 'Failed',
  },
];

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

const paymentPaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 10,
  totalCount: 100,
};

export default function Payments() {
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
        {paymentMetrics && paymentMetrics.length > 0 && (
          <Metrics metrics={paymentMetrics} />
        )}
      </div>

      <InvoicingTable
        className="mt-10"
        title={'Payments'}
        data={paymentData}
        columns={paymentColumns}
        searchFields={['customer', 'invoice', 'id']}
        searchPlaceholder="Search payment......"
        statusStyles={paymentStatusStyles}
        dropdownActions={paymentDropdownActions}
        paginationData={paymentPaginationData}
        onRowAction={handlePaymentAction}
      />
    </div>
  );
}
