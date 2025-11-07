import AddCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/add-credit';
import EditCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/edit-credit';
import ViewCreditNote from '@/components/dashboard/accounting/invoicing/credit-notes/view-credit';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreditNoteService from '@/api/creditNote';
import { format } from 'date-fns';

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
  const [isCreateCreditNoteOpen, setIsCreateCreditNoteOpen] = useState(false);
  const [isEditCreditNoteOpen, setIsEditCreditNoteOpen] = useState(false);
  const [isViewCreditNoteOpen, setIsViewCreditNoteOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [creditNoteList, setCreditNoteList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0,
  });

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
      { title: 'Total Amount', value: `$${totalAmount.toFixed(2)}` },
      { title: 'Pending Credits', value: `$${pendingCredits.toFixed(2)}` },
      { title: 'Applied Credits', value: `$${appliedCredits.toFixed(2)}` },
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
      amount: `$${item.creditNote?.lineItems?.reduce((sum, lineItem) => sum + lineItem.amount * lineItem.qty, 0).toFixed(2) || '0.00'}`,
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
        approvedBy: 'System',
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

  const handleSelectTableItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAllItems = (checked) => {
    if (checked) {
      const transformedData = transformCreditNoteData(creditNoteList);
      setSelectedItems(transformedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedItems([]); // Clear selections when changing pages
  };

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
  }, [currentPage, paginationData.pageSize]);

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
        <Metrics metrics={calculateMetrics()} />
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
            onRowAction={handleCreditNoteAction}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectTableItem}
            handleSelectAll={handleSelectAllItems}
            isLoading={isLoadingData}
          />
        </div>
      </div>

      <AddCreditNote
        open={isCreateCreditNoteOpen}
        onOpenChange={setIsCreateCreditNoteOpen}
      />

      <EditCreditNote
        open={isEditCreditNoteOpen}
        onOpenChange={(open) => {
          setIsEditCreditNoteOpen(open);
          if (!open) {
            // Refresh data when modal closes
            const fetchCreditNotes = async () => {
              try {
                setIsLoadingData(true);
                const response = await CreditNoteService.fetch({
                  page: currentPage,
                  perPage: paginationData.pageSize,
                });

                const creditNotes = response.data?.data?.creditNotes || [];
                setCreditNoteList(creditNotes);

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
