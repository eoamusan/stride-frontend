import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import EmptyVendor from '@/components/dashboard/accounting/accounts-payable/empty-vendor-state';
import AddVendorForm from '@/components/dashboard/accounting/accounts-payable/vendor-form';
import VendorSuccessModal from '@/components/dashboard/accounting/accounts-payable/vendor-success-modal';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import InvoicingTable from '@/components/dashboard/accounting/invoicing/table';

// Vendor data from the image
const vendorData = [
  {
    id: 1,
    img: 'https://placehold.co/40',
    vendor: 'JI Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
    lastPayment: '1/10/2024',
    status: 'Active',
  },
  {
    id: 2,
    img: 'https://placehold.co/40',
    vendor: 'Adam craft',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '83%',
    lastPayment: '1/10/2024',
    status: 'Pending',
  },
];

// Table columns configuration
const vendorColumns = [
  {
    key: 'img',
    label: 'Img',
    render: (value) => (
      <div className="flex h-10 w-10 items-center justify-center rounded">
        <img
          src={value}
          alt="Vendor"
          className="h-10 w-10 rounded object-cover"
        />
      </div>
    ),
  },
  { key: 'vendor', label: 'Vendor' },
  { key: 'category', label: 'Category' },
  { key: 'totalInvoices', label: 'Total Invoices' },
  { key: 'totalAmount', label: 'Total Amount' },
  {
    key: 'onTimeRate',
    label: 'On-Time Rate',
    render: (value) => (
      <span
        className={
          value === '100%'
            ? 'font-medium text-green-600'
            : 'font-medium text-orange-600'
        }
      >
        {value}
      </span>
    ),
  },
  { key: 'lastPayment', label: 'Last Payment' },
  { key: 'status', label: 'Status' },
];

const statusStyles = {
  Active: 'bg-green-100 text-green-800 hover:bg-green-100',
  Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  Inactive: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const paginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 50,
  totalCount: 500,
};
const vendorMetricsData = [
  {
    title: 'Total Vendors',
    value: '200',
  },
  {
    title: 'Active This Month',
    value: '50',
  },
  {
    title: 'Pending Verification',
    value: '4',
  },
  {
    title: 'Top Vendor',
    value: 'JJ Solutions',
  },
];

export default function VendorManagement() {
  const navigate = useNavigate();
  const [openVendorForm, setOpenVendorForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [columns, setColumns] = useState({
    number: true,
    type: true,
    detailType: true,
    currency: true,
    bankBalance: true,
  });
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showAccountTypeBadges, setShowAccountTypeBadges] = useState(true);
  const [pageSize, setPageSize] = useState('50');
  const [tableDensity, setTableDensity] = useState('Cozy');

  // Handle row actions for the table
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case 'edit':
        // Add edit logic here
        console.log('Edit vendor:', item.id);
        break;
      case 'view':
        // Navigate to vendor detail page
        navigate(`/dashboard/accounting/accounts-payable/${item.id}`);
        break;
      case 'delete':
        // Add delete logic here
        console.log('Delete vendor:', item.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Event handlers
  const onDownloadFormats = (format, checked) => {
    console.log(`Download ${format}:`, checked);
    // Handle download logic here
  };

  const onColumnsChange = (columnKey, checked) => {
    setColumns((prev) => ({
      ...prev,
      [columnKey]: checked,
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
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Vendor Mangement</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage vendor profiles and relationships
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenVendorForm(true)}
          >
            <PlusCircleIcon className="size-4" />
            Add Vendor
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

      {vendorData && vendorData.length === 0 ? (
        <EmptyVendor onClick={() => setOpenVendorForm(true)} />
      ) : (
        <div className="mt-10">
          <Metrics metrics={vendorMetricsData} />
          <InvoicingTable
            className="mt-10"
            title="Vendor Management"
            data={vendorData}
            columns={vendorColumns}
            searchFields={['vendor', 'category', 'status']}
            searchPlaceholder="Search vendor......."
            statusStyles={statusStyles}
            paginationData={paginationData}
            dropdownActions={[
              { key: 'edit', label: 'Edit' },
              { key: 'view', label: 'View' },
              { key: 'delete', label: 'Delete' },
            ]}
            onRowAction={handleRowAction}
          />
        </div>
      )}

      <AddVendorForm
        open={openVendorForm}
        showSuccessModal={() => setOpenSuccessModal(true)}
        onOpenChange={setOpenVendorForm}
      />

      <VendorSuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        handleBack={() => setOpenSuccessModal(false)}
      />
    </div>
  );
}
