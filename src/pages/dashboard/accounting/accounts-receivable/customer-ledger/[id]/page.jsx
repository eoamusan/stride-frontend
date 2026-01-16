import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  DownloadIcon,
  Calendar1,
  Contact2Icon,
} from 'lucide-react';
import { format } from 'date-fns';
import CustomerService from '@/api/customer';
import CreditNoteService from '@/api/creditNote';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useUserStore } from '@/stores/user-store';

export default function ViewCustomerLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'invoices'; // 'invoices' or 'credit-notes'
  const { businessData } = useUserStore();
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        // Fetch customer details
        const customerResponse = await CustomerService.get({ id });
        const customerData = customerResponse.data.data;

        setCustomer(customerData.customer);

        // Extract and transform invoice data from response
        const invoiceData = customerData.invoice || [];
        const transformedInvoices = invoiceData.map((invoice) => ({
          id: invoice._id,
          invoiceNumber: invoice.invoiceNo,
          amount: parseFloat(invoice.product?.total || 0),
          currency: invoice.currency,
          category: invoice?.category || '-',
          issueDate: new Date(invoice.invoiceDate),
          dueDate: new Date(invoice.dueDate),
          status: invoice.status,
        }));

        setInvoices(transformedInvoices);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  // Fetch credit notes
  useEffect(() => {
    const fetchCreditNotes = async () => {
      if (view !== 'credit-notes' || !id) return;

      try {
        setIsLoading(true);
        const response = await CreditNoteService.fetch({
          customerId: id,
          page: currentPage,
          perPage: 50,
        });

        const creditNotesData = response.data?.data?.creditNotes || [];
        const transformedCreditNotes = creditNotesData.map((item) => ({
          id: item.memoNumber || 'N/A',
          customer: item.customerId?.displayName || 'N/A',
          originalInvoice: item.invoiceId?.invoiceNo || '-',
          reason: item.messageOnMemo || 'N/A',
          amount: `${item.lineItems?.reduce((sum, lineItem) => sum + lineItem.amount * lineItem.qty, 0).toFixed(2) || '0.00'}`,
          issueDate: item.memoDate
            ? format(new Date(item.memoDate), 'MMM dd, yyyy')
            : 'N/A',
          status: item.status?.toLowerCase(),
        }));

        setCreditNotes(transformedCreditNotes);
      } catch (error) {
        console.error('Error fetching credit notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditNotes();
  }, [view, businessData?._id, id, currentPage]);

  const formatCurrency = (amount, currency) => {
    const symbol =
      currency === 'USD'
        ? '$'
        : currency === 'EUR'
          ? '€'
          : currency === 'GBP'
            ? '£'
            : '₦';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${symbol}${(numAmount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleSelectAll = (checked) => {
    const currentData = view === 'invoices' ? invoices : creditNotes;
    if (checked) {
      setSelectedItems(currentData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== itemId));
    }
  };

  const handleRowAction = (action, item) => {
    console.log('Action:', action, 'Item:', item);
    // Handle different actions here
    switch (action) {
      case 'view':
        if (view === 'invoices') {
          navigate(`/dashboard/accounting/invoicing/${item.id}`);
        }
        break;
      default:
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Invoice table columns
  const invoiceColumns = [
    {
      key: 'invoiceNumber',
      label: 'INVOICE',
      className: 'font-medium',
    },
    {
      key: 'amount',
      label: 'AMOUNT',
      render: (value, item) => formatCurrency(value, item.currency),
    },
    {
      key: 'currency',
      label: 'CURRENCY',
    },
    {
      key: 'category',
      label: 'CATEGORY',
    },
    {
      key: 'issueDate',
      label: 'ISSUE DATE',
      render: (value) => format(new Date(value), 'MMM -dd-yyyy'),
    },
    {
      key: 'dueDate',
      label: 'DUE DATE',
      render: (value) => format(new Date(value), 'MMM -dd-yyyy'),
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Credit notes table columns
  const creditNoteColumns = [
    {
      key: 'id',
      label: 'Credit Memo No',
    },
    {
      key: 'customer',
      label: 'Customer',
    },
    {
      key: 'originalInvoice',
      label: 'Original Invoice',
    },
    {
      key: 'reason',
      label: 'Reason',
    },
    {
      key: 'amount',
      label: 'Amount',
    },
    {
      key: 'issueDate',
      label: 'Issue Date',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  const statusStyles = {
    PENDING: 'lowercase bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    PART: 'lowercase bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    PAID: 'lowercase bg-green-100 text-green-800 hover:bg-green-100',
    OVERDUE: 'lowercase bg-red-100 text-red-800 hover:bg-red-100',
    CANCELLED: 'lowercase bg-gray-100 text-gray-800 hover:bg-gray-100',
    approved: 'bg-green-100 text-green-800 hover:bg-green-100',
    pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    refunded: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  };

  const dropdownActions = [{ key: 'view', label: 'View Details' }];

  const currentData = view === 'invoices' ? invoices : creditNotes;
  const currentColumns =
    view === 'invoices' ? invoiceColumns : creditNoteColumns;

  const paginationData = {
    page: currentPage,
    totalPages: Math.ceil(currentData.length / itemsPerPage),
    pageSize: itemsPerPage,
    totalCount: currentData.length,
  };

  if (isLoading) {
    return (
      <div className="my-4 min-h-screen">
        <div className="flex items-center justify-center rounded-lg bg-white py-20">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="border-primary mb-4 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
            <p className="text-muted-foreground">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="my-4 min-h-screen rounded-lg bg-white">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </div>
    );
  }

  // Calculate financial summary
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const averageInvoice =
    invoices.length > 0 ? totalRevenue / invoices.length : 0;

  // Get the most recent invoice date
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
  );
  const lastPaymentDate =
    sortedInvoices.length > 0 ? sortedInvoices[0].issueDate : null;

  // Calculate overdue payments
  const today = new Date();
  const overduePayment = invoices
    .filter((inv) => inv.status !== 'PAID' && new Date(inv.dueDate) < today)
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <div className="my-4 min-h-screen space-y-6 rounded-lg bg-white">
      {/* Header Section */}
      <div className="flex justify-between p-6">
        <div className="w-full">
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#292D32] text-2xl font-semibold text-white">
                {customer.displayName?.charAt(0).toUpperCase() ||
                  customer.firstName?.charAt(0).toUpperCase() ||
                  'C'}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">
                  {customer.displayName ||
                    `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
                    'Customer'}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {customer.companyName || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-[#7D7D7D]">
                  Email Address
                </p>
                <div className="flex items-center gap-2">
                  <MailIcon className="size-4 text-[#7D7D7D]" />
                  <p className="text-sm font-medium">
                    {customer.email || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-[#7D7D7D]">
                  Date Added
                </p>
                <div className="flex items-center gap-2">
                  <Calendar1 className="size-4 text-[#7D7D7D]" />
                  <p className="text-sm font-medium">
                    {customer.createdAt
                      ? format(new Date(customer.createdAt), 'dd-M-yyyy')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-[#7D7D7D]">
                  Address
                </p>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4 text-[#7D7D7D]" />
                  <p className="text-sm font-medium">
                    {customer.address?.address1
                      ? `${customer.address.address1}${customer.address.city ? `, ${customer.address.city}` : ''}${customer.address.state ? `, ${customer.address.state}` : ''}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-[#7D7D7D]">
                  Added by
                </p>
                <div className="flex items-center gap-2">
                  <Contact2Icon className="size-4 text-[#7d7d7d]" />
                  <p className="text-sm font-medium">
                    {customer.addedBy || 'System'}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-[#7D7D7D]">
                  Phone Number
                </p>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="size-4 text-[#7D7D7D]" />
                  <p className="text-sm font-medium">
                    {customer.phoneNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full max-w-sm flex-col gap-4">
          <h3 className="text-sm font-semibold">Actions</h3>
          <Button className="h-10">
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
          <Button variant="outline" className="h-10">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="rounded-lg bg-white p-6">
        <h2 className="mb-6 text-base font-semibold">Financial Summary</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Revenue */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Total Revenue
            </p>
            <p className="text-base font-bold">
              $
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Total Invoices */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Total Invoices
            </p>
            <p className="text-base">{totalInvoices}</p>
          </div>

          {/* Last Payment */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Last Payment
            </p>
            <p className="text-base">
              {lastPaymentDate ? format(lastPaymentDate, 'MMM-d-yyyy') : '-'}
            </p>
          </div>

          {/* Credit Limit */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Credit Limit
            </p>
            <p className="text-base">
              $
              {Number(customer.creditLimit)?.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || '0.00'}
            </p>
            <div className="mt-2 h-1 w-full max-w-20 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-[#FFC107]"
                style={{
                  width: `${Math.min(
                    (totalRevenue / (parseFloat(customer.creditLimit) || 1)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Average Invoice */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Average Invoice
            </p>
            <p className="text-base">
              $
              {averageInvoice.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Overdue Payment */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Overdue Payment
            </p>
            <p className="text-base">
              $
              {overduePayment.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      {/* <div className="px-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() =>
              navigate(
                `/dashboard/accounting/accounts-receivable/customer-ledger/${id}?view=invoices`
              )
            }
            className={`pb-2 text-sm font-medium ${
              view === 'invoices'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() =>
              navigate(
                `/dashboard/accounting/accounts-receivable/customer-ledger/${id}?view=credit-notes`
              )
            }
            className={`pb-2 text-sm font-medium ${
              view === 'credit-notes'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500'
            }`}
          >
            Credit Notes
          </button>
        </div>
      </div> */}

      {/* Table */}
      <AccountingTable
        title={
          view === 'invoices'
            ? 'Invoice History'
            : 'Credit notes & returns History'
        }
        data={currentData}
        columns={currentColumns}
        searchFields={
          view === 'invoices'
            ? ['invoiceNumber', 'category', 'currency']
            : ['id', 'customer', 'originalInvoice', 'reason']
        }
        searchPlaceholder={
          view === 'invoices' ? 'Search invoices...' : 'Search credit notes...'
        }
        statusStyles={statusStyles}
        dropdownActions={dropdownActions}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onRowAction={handleRowAction}
        selectedItems={selectedItems}
        handleSelectAll={handleSelectAll}
        handleSelectItem={handleSelectItem}
        showDataSize={false}
        isLoading={isLoading}
      />
    </div>
  );
}
