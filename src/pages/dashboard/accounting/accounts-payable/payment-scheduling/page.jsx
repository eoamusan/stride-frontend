import PaymentScheduleForm from '@/components/dashboard/accounting/accounts-payable/payment-scheduling/schedule-form';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import InvoicingTable from '@/components/dashboard/accounting/invoicing/table';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

// Payment queue data from the image
const paymentQueueData = [
  {
    id: 1,
    img: 'https://placehold.co/28/FF6B35/FFFFFF?text=J%26S',
    vendor: 'JI Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    category: 'Office supplies',
    dueDate: '1/10/2024',
    overdueDays: '574 days overdue',
    status: 'Pending',
  },
  {
    id: 2,
    img: 'https://placehold.co/28/FF6B35/FFFFFF?text=J%26S',
    vendor: 'JI Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    category: 'Office supplies',
    dueDate: '1/10/2024',
    overdueDays: '574 days overdue',
    status: 'Pending',
  },
  {
    id: 3,
    img: 'https://placehold.co/28/2D9CDB/FFFFFF?text=AC',
    vendor: 'Acme Corp',
    invoiceId: 'INV-2024-002',
    amount: '$8,200.00',
    category: 'Consulting',
    dueDate: '2/15/2024',
    overdueDays: '540 days overdue',
    status: 'Pending',
  },
  {
    id: 4,
    img: 'https://placehold.co/28/27AE60/FFFFFF?text=GL',
    vendor: 'GreenLeaf',
    invoiceId: 'INV-2024-003',
    amount: '$2,500.00',
    category: 'Maintenance',
    dueDate: '3/01/2024',
    overdueDays: '0 days overdue',
    status: 'Paid',
  },
  {
    id: 5,
    img: 'https://placehold.co/28/EB5757/FFFFFF?text=TS',
    vendor: 'Tech Solutions',
    invoiceId: 'INV-2024-004',
    amount: '$12,000.00',
    category: 'IT Services',
    dueDate: '3/20/2024',
    overdueDays: '507 days overdue',
    status: 'Overdue',
  },
];

// Table columns configuration
const paymentColumns = [
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
  {
    key: 'dueDate',
    label: 'Due Date',
    render: (value, item) => (
      <div className="flex flex-col">
        <span className="text-sm text-[#434343]">{value}</span>
        <span className="text-xs text-red-500">{item.overdueDays}</span>
      </div>
    ),
  },
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
  { title: 'Total Invoices', value: '214215' },
  { title: 'Total Amount', value: '$15,400.00' },
  { title: 'Due This Week', value: '264' },
  { title: 'Overdue', value: '64' },
];

export default function PaymentScheduling() {
  const [openScheduleForm, setOpenScheduleForm] = useState(false);
  const [selectPaymentInvoices, setSelectPaymentInvoices] = useState([]);

  const handleSelectAllTableItems = (checked) => {
    if (checked) {
      setSelectPaymentInvoices(paymentQueueData.map((item) => item.id));
    } else {
      setSelectPaymentInvoices([]);
    }
  };

  const handleSelectTableItem = (itemId, checked) => {
    if (checked) {
      setSelectPaymentInvoices([...selectPaymentInvoices, itemId]);
    } else {
      setSelectPaymentInvoices(
        selectPaymentInvoices.filter((id) => id !== itemId)
      );
    }
  };

  const clearAllTableSelections = () => {
    setSelectPaymentInvoices([]);
  };

  // Handle row actions
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case 'edit':
        console.log('Edit invoice:', item.id);
        break;
      case 'view':
        console.log('View invoice:', item.id);
        break;
      case 'schedule':
        console.log('Schedule payment for:', item.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Payment Scheduling</h1>
          <p className="text-sm text-[#7D7D7D]">
            Process multiple payments efficiently
          </p>
        </hgroup>

        <div className="flex items-center space-x-4">
          <p className="text-sm font-medium text-[#434343]">
            {selectPaymentInvoices.length || '0'} Invoices selected
          </p>
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenScheduleForm(true)}
            disabled={selectPaymentInvoices.length === 0}
          >
            <PlusCircleIcon className="size-4" />
            Schedule Payment ({selectPaymentInvoices.length})
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={vendorInvoicesData} />

        <InvoicingTable
          className="mt-10"
          title={`Payment Queue (${paymentQueueData.length} invoices)`}
          data={paymentQueueData}
          columns={paymentColumns}
          searchFields={['vendor', 'invoiceId', 'amount', 'category']}
          searchPlaceholder="Search vendor, amount or invoice ......"
          statusStyles={statusStyles}
          paginationData={paginationData}
          dropdownActions={[
            { key: 'edit', label: 'Edit' },
            { key: 'view', label: 'View' },
            { key: 'schedule', label: 'Schedule Payment' },
          ]}
          selectedItems={selectPaymentInvoices}
          handleSelectAll={handleSelectAllTableItems}
          handleSelectItem={handleSelectTableItem}
          onRowAction={handleRowAction}
        />
      </div>

      <PaymentScheduleForm
        open={openScheduleForm}
        onOpenChange={setOpenScheduleForm}
        allInvoices={paymentQueueData}
        selectedInvoices={selectPaymentInvoices}
        handleSelectInvoice={handleSelectTableItem}
        clearSelections={clearAllTableSelections}
      />
    </div>
  );
}
