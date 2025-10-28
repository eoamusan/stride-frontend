import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import DownloadDropdown from '@/components/dashboard/accounting/download-dropdown';
import SettingsDropdown from '@/components/dashboard/accounting/settings-dropdown';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';

// Invoice data from the image
const invoicesData = [
  {
    id: 1,
    img: 'https://placehold.co/40/FF6B35/FFFFFF?text=J%26S',
    vendor: 'JI Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    category: 'Marketing',
    dueDate: '1/10/2024',
    status: 'Pending',
  },
  {
    id: 2,
    img: 'https://placehold.co/40/007ACC/FFFFFF?text=AC',
    vendor: 'Adam craft',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    category: 'Marketing',
    dueDate: '1/10/2024',
    status: 'Paid',
  },
];

// Table columns configuration
const invoiceColumns = [
  {
    key: 'img',
    label: 'Img',
    render: (value) => (
      <div className="flex h-6 w-6 items-center justify-center rounded">
        <img
          src={value}
          alt="Vendor"
          className="h-6 w-6 rounded object-cover"
        />
      </div>
    ),
  },
  { key: 'vendor', label: 'Vendor' },
  { key: 'invoiceId', label: 'Invoice ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
];

const statusStyles = {
  Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const paginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 50,
  totalCount: 500,
};

const vendorInvoicesData = [
  {
    title: 'Total Outstanding',
    value: '$200',
  },
  {
    title: 'Pending Approval',
    value: 64,
  },
  {
    title: 'This Month Paid',
    value: '$264',
  },
  {
    title: 'Active Vendors',
    value: 24,
  },
];

export default function VendorInvoices() {
  // State variables that are being used in the component
  const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
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
      setSelectedItems(invoicesData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Event handlers
  const onDownloadFormats = (format, checked) => {
    console.log(`Download ${format}:`, checked);
    // Handle download logic here
    console.log(openInvoiceForm);
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

  // Handle row actions for the table
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case 'edit':
        console.log('Edit invoice:', item.id);
        break;
      case 'view':
        console.log('View invoice:', item.id);
        break;
      case 'check_history':
        console.log('Check history for invoice:', item.id);
        break;
      case 'delete':
        console.log('Delete invoice:', item.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Vendor Invoices</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your Vendor accounts efficiently
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenInvoiceForm(true)}
          >
            <PlusCircleIcon className="size-4" />
            Record Invoice
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

      <div className="mt-10">
        <Metrics metrics={vendorInvoicesData} />
        <AccountingTable
          className="mt-10"
          title="Recent Invoices"
          data={invoicesData}
          columns={invoiceColumns}
          searchFields={['vendor', 'invoiceId', 'category', 'status']}
          searchPlaceholder="Search vendor or invoice ......"
          statusStyles={statusStyles}
          paginationData={paginationData}
          dropdownActions={[
            { key: 'edit', label: 'Edit' },
            { key: 'view', label: 'View' },
            { key: 'check_history', label: 'Check History' },
            { key: 'delete', label: 'Delete' },
          ]}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
        />
      </div>
    </div>
  );
}
