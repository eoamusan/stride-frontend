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
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import SettingsDropdown from '@/components/dashboard/accounting/settings-dropdown';
import DownloadDropdown from '@/components/dashboard/accounting/download-dropdown';
import SuccessModal from '@/components/dashboard/accounting/success-modal';

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
      setSelectedItems(vendorData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

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
          <DownloadDropdown onDownloadFormats={onDownloadFormats} />
          <SettingsDropdown
            columns={columns}
            onColumnsChange={onColumnsChange}
            includeInactive={includeInactive}
            onIncludeInactiveChange={onIncludeInactiveChange}
            showAccountTypeBadges={showAccountTypeBadges}
            onShowAccountTypeBadgesChange={onShowAccountTypeBadgesChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            tableDensity={tableDensity}
            onTableDensityChange={onTableDensityChange}
          />
        </div>
      </div>

      {vendorData && vendorData.length === 0 ? (
        <EmptyVendor onClick={() => setOpenVendorForm(true)} />
      ) : (
        <div className="mt-10">
          <Metrics metrics={vendorMetricsData} />
          <AccountingTable
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
            selectedItems={selectedItems}
            handleSelectItem={handleSelectItem}
            handleSelectAll={handleSelectAll}
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
      <SuccessModal
        title={'Vendor Added'}
        description={`You've successfully added a vendor`}
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        handleBack={() => setOpenSuccessModal(false)}
      />
    </div>
  );
}
