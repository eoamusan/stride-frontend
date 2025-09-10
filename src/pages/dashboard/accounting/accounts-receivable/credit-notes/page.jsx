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
import AddCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/add-credit';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import InvoicingTable from '@/components/dashboard/accounting/invoicing/table';
import ViewCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/view-credit';

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
  const [openCreditNoteForm, setOpenCreditNoteForm] = useState(false);
  const [isViewCreditNoteOpen, setIsViewCreditNoteOpen] = useState(false);
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
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenCreditNoteForm(true)}
          >
            <PlusCircleIcon className="size-4" />
            Create Credit Note
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

      {creditMetrics && creditMetrics.length > 0 && (
        <div className="mt-10">
          <Metrics metrics={creditMetrics} />
        </div>
      )}

      <div className="mt-10">
        <InvoicingTable
          title={'Credit notes & returns'}
          data={creditNotes}
          columns={creditNoteColumns}
          searchFields={['id', 'customer', 'originalInvoice', 'reason']}
          searchPlaceholder="Search credit notes......"
          statusStyles={creditNoteStatusStyles}
          dropdownActions={creditNoteDropdownActions}
          paginationData={creditNotePaginationData}
          onRowAction={handleCreditNoteAction}
        />
      </div>

      <AddCreditNote
        open={openCreditNoteForm}
        onOpenChange={setOpenCreditNoteForm}
      />
      <ViewCreditNote
        open={isViewCreditNoteOpen}
        onOpenChange={setIsViewCreditNoteOpen}
      />
    </div>
  );
}
