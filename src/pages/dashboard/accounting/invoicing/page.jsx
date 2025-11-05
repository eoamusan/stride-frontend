import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import EmptyInvoice from '@/components/dashboard/accounting/invoicing/empty-state';
import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';
import PreviewInvoice from '@/components/dashboard/accounting/invoicing/preview-invoice';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircle, SettingsIcon } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import InvoiceService from '@/api/invoice';
import BusinessService from '@/api/business';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/user-store';
import { format } from 'date-fns';

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
  OVERDUE: 'lowercase bg-red-100 text-red-800 hover:bg-red-100',
};

const invoiceDropdownActions = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View' },
  { key: 'generate-receipt', label: 'Generate receipt' },
];

export default function Invoicing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleCreateInvoice, setToggleCreateInvoice] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [invoiceList, setInvoiceList] = useState();
  const [invoiceStatsData, setInvoiceStatsData] = useState({});
  const [businessId, setBusinessId] = useState();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [viewMode, setViewMode] = useState('list'); // 'list', 'preview', 'edit', 'create'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { businessData } = useUserStore();
  const navigate = useNavigate();

  // Transform invoice data to match table format
  const transformInvoiceData = (invoices) => {
    if (!invoices || !Array.isArray(invoices)) return [];

    return invoices.map((invoice) => ({
      id: invoice.invoiceNo,
      customer: invoice.customerId.displayName,
      currency: invoice.currency,
      amount: '$0.00', // Calculate from products when available
      issueDate: format(invoice.invoiceDate, 'PP'),
      dueDate: format(invoice.dueDate, 'PP'),
      status: invoice.product?.status,
    }));
  };

  // Transform API invoice data to form data for editing
  const transformToFormData = (invoice) => {
    if (!invoice) return null;

    return {
      invoice_number: invoice.invoiceNo,
      customerId:
        typeof invoice.customerId === 'string'
          ? invoice.customerId
          : invoice.customerId._id,
      currency: invoice.currency,
      category: invoice.category || 'Services',
      c_o: invoice.co || '',
      invoice_date: new Date(invoice.invoiceDate),
      term_of_payment: invoice.termsOfPayment || '2 days',
      due_date: new Date(invoice.dueDate),
      products:
        invoice.product?.products?.map((product) => ({
          name: product.name || '',
          description: product.description || '',
          unit_price: product.unit_price || 0,
          quantity: product.quantity || 1,
          total_price: product.total_price || 0,
          vat_applicable:
            product.vat_applicable !== undefined
              ? product.vat_applicable
              : true,
        })) || [],
      discount: parseFloat(invoice.product?.discount) || 0,
      vat: parseFloat(invoice.product?.vat) || 7.5,
      delivery_fee: parseFloat(invoice.product?.deliveryFee) || 0,
      terms: invoice.product?.terms || '',
      internal_notes: invoice.product?.notes || '',
      display_bank_details: invoice.product?.displayBankDetails || false,
      apply_signature: invoice.product?.applySignature || false,
    };
  };

  // Calculate subtotal for preview
  const calculateSubtotal = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((sum, product) => {
      const unitPrice = product.unitPrice || product.unit_price || 0;
      const quantity = product.quantity || 1;
      return sum + unitPrice * quantity;
    }, 0);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoadingData(true);

        const businessId = businessData?._id;
        setBusinessId(businessId);
        setHasBankAccount(
          businessData?.businessInvoiceSettings?.bankAccounts?.length > 0
        );

        // Fetch invoices with pagination
        const invoiceRes = await InvoiceService.fetch({
          businessId,
          page: currentPage,
          perPage: paginationData.pageSize,
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
  }, [businessData, currentPage, paginationData.pageSize]);

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
          // Load invoice data into create form
          setSelectedInvoice(invoiceData);
          setViewMode('edit');
          break;
        case 'view':
          // Show invoice preview
          setSelectedInvoice(invoiceData);
          setViewMode('preview');
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

  // Check for create parameter on component mount
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      setToggleCreateInvoice(true);
    } else {
      setToggleCreateInvoice(false);
    }
  }, [searchParams]);

  const handleToggleCreateInvoice = () => {
    if (!isLoadingData && !hasBankAccount) {
      toast.error(
        <p className="text-xs font-semibold">
          Please set up a bank account in your business invoice settings before
          creating an invoice.
        </p>,
        {
          duration: 7000,
        }
      );
      navigate('/dashboard/accounting/invoicing/settings');
      return;
    }
    const newToggleState = !toggleCreateInvoice;
    setToggleCreateInvoice(newToggleState);

    // Update search params when toggleCreateInvoice changes
    if (newToggleState) {
      setSearchParams({ create: 'true' });
    } else {
      // Remove the create parameter when closing
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('create');
      setSearchParams(newSearchParams);
    }
  };

  if (toggleCreateInvoice) {
    return (
      <div className="my-4 min-h-screen">
        <CreateInvoice businessId={businessId} />
      </div>
    );
  }

  // Handle Preview mode
  if (viewMode === 'preview' && selectedInvoice) {
    const formData = transformToFormData(selectedInvoice);

    // Extract customer from the invoice's populated customerId field
    const customer = selectedInvoice.customerId;
    const transformedCustomers = customer
      ? [
          {
            id: customer._id,
            displayName: customer.displayName,
            companyName: customer.companyName,
            address: customer.address,
          },
        ]
      : [];

    return (
      <div className="my-4 min-h-screen">
        <PreviewInvoice
          formData={formData}
          calculateSubtotal={() =>
            calculateSubtotal(selectedInvoice.product?.products)
          }
          onEdit={() => {
            // Go back to list view instead of edit mode
            setViewMode('list');
            setSelectedInvoice(null);
          }}
          customers={transformedCustomers}
        />
      </div>
    );
  }

  // Handle Edit mode
  if (viewMode === 'edit' && selectedInvoice) {
    // Save the invoice data to localStorage so CreateInvoice can load it
    const formData = transformToFormData(selectedInvoice);
    localStorage.setItem('create_invoice_draft', JSON.stringify(formData));

    return (
      <div className="my-4 min-h-screen">
        <Button
          variant="ghost"
          onClick={() => {
            setViewMode('list');
            setSelectedInvoice(null);
            localStorage.removeItem('create_invoice_draft');
          }}
          className="mb-4"
        >
          ← Back to List
        </Button>
        <CreateInvoice
          businessId={businessId}
          isEdit={true}
          invoiceNo={selectedInvoice?.invoiceNo}
          invoiceId={selectedInvoice?._id}
          onBack={() => {
            setViewMode('list');
            setSelectedInvoice(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="my-4 min-h-screen">
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
              onClick={handleToggleCreateInvoice}
              className={'h-10 rounded-2xl text-sm'}
            >
              <PlusCircle className="size-4" />
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
          <div className="my-10 flex w-full flex-wrap gap-4">
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
