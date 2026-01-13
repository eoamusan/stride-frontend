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
import AddCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/add-credit';
import EditCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/edit-credit';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import ViewCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/view-credit';
import CreditNoteService from '@/api/creditNote';
import { format } from 'date-fns';

const creditNoteColumns = [
  { key: 'id', label: 'Credit Memo No' },
  { key: 'customer', label: 'Customer' },
  { key: 'originalInvoice', label: 'Original Invoice' },
  { key: 'reason', label: 'Reason' },
  { key: 'amount', label: 'Amount' },
  { key: 'issueDate', label: 'Issue Date' },
  { key: 'status', label: 'Status' },
];

const creditNoteStatusStyles = {
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  refunded: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
};

const creditNoteDropdownActions = [
  { key: 'view', label: 'View' },
  { key: 'edit', label: 'Edit' },
  { key: 'export', label: 'Export' },
];

export default function CreditNotes() {
  const [openCreditNoteForm, setOpenCreditNoteForm] = useState(false);
  const [isEditCreditNoteOpen, setIsEditCreditNoteOpen] = useState(false);
  const [isViewCreditNoteOpen, setIsViewCreditNoteOpen] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [creditNoteList, setCreditNoteList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
      const transformedData = transformCreditNoteData(creditNoteList);
      setSelectedItems(transformedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedItems([]);
  };

  // Calculate metrics from credit note data
  const calculateMetrics = () => {
    const totalAmount = creditNoteList.reduce((sum, item) => {
      const lineItemsTotal =
        item.creditNote?.lineItems?.reduce(
          (itemSum, lineItem) => itemSum + lineItem.amount * lineItem.qty,
          0
        ) || 0;
      return sum + lineItemsTotal;
    }, 0);

    const pendingCredits = creditNoteList
      .filter((item) => item.creditNote?.sendLater)
      .reduce((sum, item) => {
        const lineItemsTotal =
          item.creditNote?.lineItems?.reduce(
            (itemSum, lineItem) => itemSum + lineItem.amount * lineItem.qty,
            0
          ) || 0;
        return sum + lineItemsTotal;
      }, 0);

    const appliedCredits = creditNoteList
      .filter((item) => !item.creditNote?.sendLater)
      .reduce((sum, item) => {
        const lineItemsTotal =
          item.creditNote?.lineItems?.reduce(
            (itemSum, lineItem) => itemSum + lineItem.amount * lineItem.qty,
            0
          ) || 0;
        return sum + lineItemsTotal;
      }, 0);

    return [
      {
        title: 'Total Credit Notes',
        value: String(paginationData.totalCount || 0),
      },
      {
        title: 'Total Amount',
        value: totalAmount.toFixed(2),
        symbol: '$',
      },
      {
        title: 'Pending Credits',
        value: pendingCredits.toFixed(2),
        symbol: '$',
      },
      {
        title: 'Applied Credits',
        value: appliedCredits.toFixed(2),
        symbol: '$',
      },
    ];
  };

  // Transform credit note data to match table format
  const transformCreditNoteData = (creditNotes) => {
    if (!creditNotes || !Array.isArray(creditNotes)) return [];

    return creditNotes.map((item) => ({
      id: item.creditNote?.memoNumber || 'N/A',
      customer: item.customer?.displayName || 'N/A',
      originalInvoice: item.invoice?.invoiceNo || 'N/A',
      reason: item.creditNote?.messageOnMemo || 'N/A',
      amount: `${item.creditNote?.lineItems?.reduce((sum, lineItem) => sum + lineItem.amount * lineItem.qty, 0).toFixed(2) || '0.00'}`,
      issueDate: item.creditNote?.memoDate
        ? format(new Date(item.creditNote.memoDate), 'MMM dd, yyyy')
        : 'N/A',
      status: item.creditNote?.status?.toLowerCase(),
    }));
  };

  // Transform credit note data for the view component
  const transformCreditNoteForView = (item) => {
    if (!item) return null;

    const totalAmount =
      item.creditNote?.lineItems?.reduce(
        (sum, lineItem) => sum + lineItem.amount * lineItem.qty,
        0
      ) || 0;

    return {
      id: item.creditNote?.memoNumber || 'N/A',
      issueDate: item.creditNote?.memoDate
        ? format(new Date(item.creditNote.memoDate), 'MMM dd, yyyy')
        : 'N/A',
      originalInvoice: item.invoice?.invoiceNo || 'N/A',
      type: item.creditNote?.memoNumber || 'N/A',
      status: item.creditNote?.sendLater ? 'Pending' : 'Approved',
      refundStatus: item.creditNote?.sendLater ? 'Pending' : 'Approved',
      reason: item.creditNote?.messageOnMemo || 'N/A',
      description:
        item.creditNote?.messageOnStatement || 'No description provided',
      customer: {
        id: item.customer?.displayName || 'N/A',
        email: item.customer?.email || 'N/A',
        phone: item.customer?.phoneNumber || 'N/A',
      },
      items:
        item.creditNote?.lineItems?.map((lineItem) => ({
          name: lineItem.service || 'N/A',
          qty: lineItem.qty || 0,
          unitPrice: lineItem.amount || 0,
          total: (lineItem.amount || 0) * (lineItem.qty || 0),
        })) || [],
      amounts: {
        subtotal: totalAmount,
        vat: 0,
        vatAmount: 0,
        total: totalAmount,
        totalCredit: totalAmount,
      },
      approval: {
        approvedBy: '',
        approvalDate: item.creditNote?.memoDate
          ? format(new Date(item.creditNote.memoDate), 'MMM dd, yyyy')
          : 'N/A',
      },
    };
  };

  const handleCreditNoteAction = (action, creditNote) => {
    console.log('Credit note action:', action, creditNote);

    // Find the full credit note data from the list
    const creditNoteData = creditNoteList.find(
      (item) => item.creditNote?.memoNumber === creditNote.id
    );

    // Handle different actions here
    switch (action) {
      case 'edit':
        if (creditNoteData) {
          setSelectedCreditNote(creditNoteData);
          setIsEditCreditNoteOpen(true);
        }
        break;
      case 'view':
        if (creditNoteData) {
          setSelectedCreditNote(creditNoteData);
          setIsViewCreditNoteOpen(true);
        }
        break;
      case 'export':
        // Handle export action
        break;
      default:
        break;
    }
  };

  // Fetch credit notes
  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        setIsLoadingData(true);
        const response = await CreditNoteService.fetch({
          page: currentPage,
          perPage: paginationData.pageSize,
        });

        const creditNotes = response.data?.data?.creditNotes || [];
        setCreditNoteList(creditNotes);

        // Update pagination data from API response
        setPaginationData({
          page: response.data?.data?.page || currentPage,
          totalPages: response.data?.data?.totalPages || 1,
          pageSize: response.data?.data?.limit || 20,
          totalCount: response.data?.data?.totalDocs || 0,
        });
      } catch (error) {
        console.error('Error fetching credit notes:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCreditNotes();
  }, [currentPage, paginationData.pageSize, refreshTrigger]);

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

      <div className="mt-10">
        <Metrics metrics={calculateMetrics()} />
      </div>

      <div className="mt-10">
        <AccountingTable
          title={'Credit notes & returns'}
          data={transformCreditNoteData(creditNoteList)}
          columns={creditNoteColumns}
          searchFields={['id', 'customer', 'originalInvoice', 'reason']}
          searchPlaceholder="Search credit notes......"
          statusStyles={creditNoteStatusStyles}
          dropdownActions={creditNoteDropdownActions}
          paginationData={paginationData}
          onPageChange={handlePageChange}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleCreditNoteAction}
          isLoading={isLoadingData}
        />
      </div>

      <AddCreditNote
        open={openCreditNoteForm}
        onOpenChange={setOpenCreditNoteForm}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <EditCreditNote
        open={isEditCreditNoteOpen}
        onOpenChange={(open) => {
          setIsEditCreditNoteOpen(open);
          if (!open) {
            setRefreshTrigger((prev) => prev + 1);
          }
        }}
        creditNoteData={selectedCreditNote}
      />

      <ViewCreditNote
        open={isViewCreditNoteOpen}
        onOpenChange={setIsViewCreditNoteOpen}
        creditNote={transformCreditNoteForView(selectedCreditNote)}
      />
    </div>
  );
}
