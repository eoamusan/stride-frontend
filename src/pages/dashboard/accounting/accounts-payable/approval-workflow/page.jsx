import { useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';
import ApprovalRequestForm from '@/components/dashboard/accounting/accounts-payable/approval-request/approval-form';

const invoicesData = [
  {
    title: 'Pending Approvals',
    value: '200',
  },
  {
    title: 'Urgent (>$10k)',
    value: '8',
  },
  {
    title: 'Assigned to Me',
    value: '64',
  },
  {
    title: 'Approved Today',
    value: '23',
  },
];

// Approval queue data from the image
const approvalQueueData = [
  {
    id: 1,
    img: 'https://placehold.co/40/ff0000/ffffff?text=J%26L',
    vendor: 'JJ Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    department: 'Operations',
    submittedBy: 'John Smith',
    submittedDate: '1/10/2024',
    approver: 'James frank',
    approverStatus: 'Submitted for approval',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 2,
    img: 'https://placehold.co/40/ff0000/ffffff?text=J%26L',
    vendor: 'JJ Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    department: 'Operations',
    submittedBy: 'John Smith',
    submittedDate: '1/10/2024',
    approver: 'James frank',
    approverStatus: 'Submitted for approval',
    priority: 'Low',
    status: 'Pending',
  },
];

// Table columns configuration
const approvalColumns = [
  {
    key: 'img',
    label: 'Img',
    render: (value) => (
      <div className="flex h-6 w-8 items-center justify-center rounded">
        <img
          src={value}
          alt="Vendor"
          className="h-6 w-8 rounded object-cover"
        />
      </div>
    ),
  },
  { key: 'vendor', label: 'Vendor' },
  { key: 'invoiceId', label: 'Invoice ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'department', label: 'Department' },
  {
    key: 'submittedBy',
    label: 'Submitted By',
    render: (value, row) => (
      <div className="text-sm">
        <div className="font-medium">{value}</div>
        <div className="text-[#434343]">{row.submittedDate}</div>
      </div>
    ),
  },
  {
    key: 'approver',
    label: 'Approver',
    render: (value, row) => (
      <div className="text-sm">
        <div className="font-medium">{value}</div>
        <div className="text-[#434343]">{row.approverStatus}</div>
      </div>
    ),
  },
  {
    key: 'priority',
    label: 'Priority',
    render: (value) => (
      <Badge
        variant="secondary"
        className={
          value === 'High'
            ? 'bg-red-100 text-red-800 hover:bg-red-100'
            : value === 'Medium'
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
      >
        {value}
      </Badge>
    ),
  },
  { key: 'status', label: 'Status' },
];

const statusStyles = {
  Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  Rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const paginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 50,
  totalCount: 2,
};

export default function ApprovalWorkflow() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [openRequestForm, setOpenRequestForm] = useState(false);

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
      setSelectedItems(approvalQueueData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle row actions
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case 'approve':
        console.log('Approve invoice:', item.id);
        break;
      case 'reject':
        console.log('Reject invoice:', item.id);
        break;
      case 'view':
        console.log('View invoice:', item.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Approval Workflow</h1>
          <p className="text-sm text-[#7D7D7D]">
            Review and approve pending invoices
          </p>
        </hgroup>

        <div className="flex items-center space-x-4">
          {selectedItems.length > 0 && (
            <p className="font-medium text-[#434343]">
              {selectedItems.length} item(s) selected
            </p>
          )}
          <Button
            className={
              'h-10 rounded-2xl bg-[#24A959] text-sm hover:bg-[#24A959]/80'
            }
            onClick={() => setOpenRequestForm(true)}
            disabled={selectedItems.length === 0}
          >
            <CheckIcon className="size-4" />
            Approve
          </Button>
          <Button
            className={
              'h-10 rounded-2xl bg-[#EF4444] text-sm hover:bg-[#EF4444]/80'
            }
            onClick={() => setOpenRequestForm(true)}
            disabled={selectedItems.length === 0}
          >
            <XIcon className="size-4" />
            Reject
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={invoicesData} />
      </div>

      <AccountingTable
        className="mt-10"
        title="Approval Queue (2 items)"
        data={approvalQueueData}
        columns={approvalColumns}
        searchFields={[
          'vendor',
          'invoiceId',
          'amount',
          'department',
          'submittedBy',
        ]}
        searchPlaceholder="Search vendor, amount ......"
        statusStyles={statusStyles}
        paginationData={paginationData}
        dropdownActions={[
          { key: 'approve', label: 'Approve' },
          { key: 'reject', label: 'Reject' },
          { key: 'view', label: 'View Details' },
        ]}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
        handleSelectAll={handleSelectAll}
        onRowAction={handleRowAction}
      />

      <ApprovalRequestForm
        open={openRequestForm}
        onOpenChange={setOpenRequestForm}
        // requestData={requestData}
        onApprove={() => {}}
        onReject={() => {}}
      />
    </div>
  );
}
