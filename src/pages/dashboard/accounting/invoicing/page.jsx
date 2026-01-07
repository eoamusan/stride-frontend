import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import EmptyInvoice from '@/components/dashboard/accounting/invoicing/empty-state';
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import InvoiceService from '@/api/invoice';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/user-store';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InvoiceTypeModal from '@/components/dashboard/accounting/invoicing/invoice-type-modal';

const invoice = [''];

// Table configuration
const invoiceColumns = [
  { key: 'id', label: 'Invoice #' },
  { key: 'customer', label: 'Customer' },
  { key: 'currency', label: 'Currency' },
  { key: 'amount', label: 'Amount' },
  { key: 'issueDate', label: 'Issue Date' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
];

const invoiceStatusStyles = {
  PAID: 'lowercase bg-green-100 text-green-800 hover:bg-green-100',
  PENDING: 'lowercase bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  PART: 'lowercase bg-blue-100 text-blue-800 hover:bg-blue-100',
  OVERDUE: 'lowercase bg-red-100 text-red-800 hover:bg-red-100',
};

const invoiceDropdownActions = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View' },
  { key: 'generate-receipt', label: 'Generate receipt' },
];

export default function Invoicing() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [invoiceList, setInvoiceList] = useState();
  const [invoiceStatsData, setInvoiceStatsData] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterInvoiceType, setFilterInvoiceType] = useState('all');
  const [isInvoiceTypeModalOpen, setIsInvoiceTypeModalOpen] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const { businessData } = useUserStore();
  const navigate = useNavigate();

  // Transform invoice data to match table format
  const transformInvoiceData = (invoices) => {
    if (!invoices || !Array.isArray(invoices)) return [];

    return invoices.map((invoice) => ({
      id: invoice.invoiceNo,
      customer: invoice.customerId?.displayName || '',
      currency: invoice.currency,
      amount: new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(invoice.product?.total) || 0),
      issueDate: invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'PP') : 'N/A',
      dueDate: invoice.dueDate ? format(new Date(invoice.dueDate), 'PP') : 'N/A',
      status: invoice?.status || 'PENDING',
    }));
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoadingData(true);

        const businessId = businessData?._id;
        setHasBankAccount(
          businessData?.businessInvoiceSettings?.bankAccounts?.length > 0
        );

        // Fetch invoices with pagination
        const invoiceRes = await InvoiceService.fetch({
          businessId,
          page: currentPage,
          perPage: paginationData.pageSize,
          type: filterInvoiceType === 'all' ? undefined : filterInvoiceType,
        });

        if (invoiceRes.data && invoiceRes.data?.data?.invoices?.length > 0) {
          setInvoiceList(invoiceRes.data?.data?.invoices);

          // Update pagination data from API response
          setPaginationData({
            page: invoiceRes.data?.data?.page || currentPage,
            totalPages: invoiceRes.data?.data?.totalPages || 1,
            pageSize: invoiceRes.data?.data?.limit || 10,
            totalCount:
              invoiceRes.data?.data?.totalDocs ||
              invoiceRes.data?.data?.invoices?.length,
          });
        } else {
          setInvoiceList([]);
          setPaginationData({
            page: 1,
            totalPages: 1,
            pageSize: 10,
            totalCount: 0,
          });
        }

        const invoiceStats = await InvoiceService.getAnalytics({ businessId });
        console.log('Invoice Stats:', invoiceStats.data);
        setInvoiceStatsData(invoiceStats.data?.data || {});
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (businessData?._id) {
      fetchInvoices();
    }
  }, [businessData, currentPage, paginationData.pageSize, filterInvoiceType]);

  // Handle row actions for the table
  const handleRowAction = async (action, item) => {
    try {
      // Find the full invoice data from the list
      if (item.id === undefined) return;
      const invoiceData = invoiceList?.find((inv) => inv.invoiceNo === item.id);

      if (!invoiceData) {
        toast.error('Invoice not found');
        return;
      }

      switch (action) {
        case 'edit':
          // Navigate to edit invoice page
          navigate(`/dashboard/accounting/invoicing/${invoiceData._id}/edit`);
          break;
        case 'view':
          // Navigate to invoice preview page
          navigate(`/dashboard/accounting/invoicing/${invoiceData._id}`);
          break;
        case 'generate-receipt':
          // Add receipt generation logic here
          console.log('Generate receipt for:', item.id);
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error handling row action:', error);
      toast.error('An error occurred');
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
      const transformedData = transformInvoiceData(invoiceList);
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

  const handleSelectInvoiceType = (type) => {
    if (!type) return;
    navigate(`/dashboard/accounting/invoicing/create?type=${type}`);
  };

  const handleToggleCreateInvoice = () => {
    if (!isLoadingData && !hasBankAccount) {
      toast.error(
        <p className="text-xs font-semibold">
          Please set up a bank account in your business invoice settings before
          creating an invoice.
        </p>,
        {
          duration: 6000,
        }
      );
      navigate('/dashboard/accounting/invoicing/settings');
      return;
    }
    setIsInvoiceTypeModalOpen(true);
  };

  return (
    <div className="my-4 min-h-screen">
      <InvoiceTypeModal
        isOpen={isInvoiceTypeModalOpen}
        onClose={setIsInvoiceTypeModalOpen}
        onSelectType={handleSelectInvoiceType}
      />

      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Invoice Management</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your accounts receivable
          </p>
        </hgroup>

        {invoice.length > 0 && (
          <div className="flex space-x-4">
            <Button
              className={'h-10 rounded-2xl px-6 text-sm'}
              onClick={handleToggleCreateInvoice}
            >
              Create Invoice
            </Button>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <DownloadIcon size={16} />
            </Button>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <SettingsIcon size={16} />
            </Button>
          </div>
        )}
      </div>
      {invoice.length === 0 ? (
        <EmptyInvoice onClick={handleToggleCreateInvoice} />
      ) : (
        <div>
          <div className="mt-4 ml-1 w-full max-w-xs">
            <Select
              value={filterInvoiceType}
              onValueChange={setFilterInvoiceType}
            >
              <SelectTrigger className="h-10 w-full bg-white">
                <SelectValue placeholder="Filter by invoice type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="regular">Regular Invoice</SelectItem>
                <SelectItem value="proforma">Proforma Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 mb-10 flex w-full flex-wrap gap-4">
            {/* Total Invoices Metric */}
            <MetricCard
              className="w-full max-w-[259px]"
              title="Total Invoices"
              unit=""
              value={invoiceStatsData?.totalInvoices || 0}
              isPositive={true}
              percentage="0"
              chartData={[]}
            />

            {/* Total Amount Metric */}
            <MetricCard
              className="w-full max-w-[259px]"
              title="Total Amount"
              unit="$"
              value={parseFloat(invoiceStatsData?.totalAmount || 0).toFixed(2)}
              isPositive={true}
              percentage="0"
              chartData={[]}
            />

            {/* Placeholder metrics for future data */}
            <MetricCard
              className="w-full max-w-[259px]"
              title="Outstanding Invoices"
              unit="$"
              value={parseFloat(
                invoiceStatsData?.outstandingInvoices || 0
              ).toFixed(2)}
              isPositive={true}
              percentage="0"
              chartData={[]}
            />

            <MetricCard
              className="w-full max-w-[259px]"
              title="Unpaid Invoices"
              unit=""
              value={invoiceStatsData?.unPaidInvoices || 0}
              isPositive={true}
              percentage="0"
              chartData={[]}
            />

            <MetricCard
              className="w-full max-w-[259px]"
              title="Collection Rate"
              unit="%"
              value={invoiceStatsData?.collectionRate || 0}
              isPositive={true}
              percentage="0"
              chartData={[]}
            />
          </div>

          <AccountingTable
            title="Invoice Management"
            data={transformInvoiceData(invoiceList)}
            columns={invoiceColumns}
            searchFields={['customer', 'id']}
            searchPlaceholder="Search invoices......"
            statusStyles={invoiceStatusStyles}
            dropdownActions={invoiceDropdownActions}
            paginationData={paginationData}
            onPageChange={handlePageChange}
            onRowAction={handleRowAction}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectTableItem}
            handleSelectAll={handleSelectAllItems}
            isLoading={isLoadingData}
          />
        </div>
      )}
    </div>
  );
}
