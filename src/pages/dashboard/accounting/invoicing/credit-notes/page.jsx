import AddCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/add-credit';
import ViewCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/view-credit';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';

const creditNotes = [
  {
    id: 'CN-2024-001',
    customer: 'ABC Corporation',
    originalInvoice: 'INV-2024-001',
    reason: 'Product Return',
    amount: '$15,400.00',
    issueDate: 'Jul 20, 2024',
    status: 'Approved',
  },
  {
    id: 'CN-2024-001',
    customer: 'ABC Corporation',
    originalInvoice: 'INV-2024-001',
    reason: 'Invoice error',
    amount: '$15,400.00',
    issueDate: 'Jul 20, 2024',
    status: 'Pending',
  },
  {
    id: 'CN-2024-001',
    customer: 'ABC Corporation',
    originalInvoice: 'INV-2024-001',
    reason: 'Product Return',
    amount: '$15,400.00',
    issueDate: 'Jul 20, 2024',
    status: 'Refunded',
  },
];

const creditNoteColumns = [
  { key: 'id', label: 'Credit Note ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'originalInvoice', label: 'Original Invoice' },
  { key: 'reason', label: 'Reason' },
  { key: 'amount', label: 'Amount' },
  { key: 'issueDate', label: 'Issue Date' },
  { key: 'status', label: 'Status' },
];

const creditNoteStatusStyles = {
  Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Refunded: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
};

const creditNoteDropdownActions = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View' },
  { key: 'export', label: 'Export' },
];

const creditNotePaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 10,
  totalCount: 100,
};

const creditMetrics = [
  { title: 'Total Credit Notes', value: '24' },
  {
    title: 'Total Amount',
    value: '$15,600',
  },
  {
    title: 'Pending Credits',
    value: '$64',
  },
  {
    title: 'Applied Credits',
    value: '$15,600',
  },
];

export default function CreditNotes() {
  const [isCreateCreditNoteOpen, setIsCreateCreditNoteOpen] = useState(false);
  const [isViewCreditNoteOpen, setIsViewCreditNoteOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCreditNoteAction = (action, creditNote) => {
    console.log('Credit note action:', action, creditNote);
    // Handle different actions here
    switch (action) {
      case 'edit':
        break;
      case 'view':
        setIsViewCreditNoteOpen(true);
        break;
      case 'export':
        // Handle export action
        break;
      default:
        break;
    }
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
      setSelectedItems(creditNotes.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Credit notes & returns</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage returns, refunds, and invoice corrections
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setIsCreateCreditNoteOpen(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Create Credit Note
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={creditMetrics} />
        <div className="mt-10">
          <AccountingTable
            title={'Credit notes & returns'}
            data={creditNotes}
            columns={creditNoteColumns}
            searchFields={['id', 'customer', 'originalInvoice', 'reason']}
            searchPlaceholder="Search credit notes......"
            statusStyles={creditNoteStatusStyles}
            dropdownActions={creditNoteDropdownActions}
            paginationData={creditNotePaginationData}
            onRowAction={handleCreditNoteAction}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectTableItem}
            handleSelectAll={handleSelectAllItems}
          />
        </div>
      </div>

      <AddCreditNote
        open={isCreateCreditNoteOpen}
        onOpenChange={setIsCreateCreditNoteOpen}
      />

      <ViewCreditNote
        open={isViewCreditNoteOpen}
        onOpenChange={setIsViewCreditNoteOpen}
      />
    </div>
  );
}
