import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
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
import InvoiceService from '@/api/invoice';
import AccountingTable from '@/components/dashboard/accounting/table';

export default function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
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
          category: invoice.category,
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

  const formatCurrency = (amount, currency) => {
    const symbol =
      currency === 'USD'
        ? '$'
        : currency === 'EUR'
          ? '€'
          : currency === 'GBP'
            ? '£'
            : '₦';
    return `${symbol}${amount?.toLocaleString() || '0'}`;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedInvoices(invoices.map((inv) => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedInvoices((prev) => [...prev, id]);
    } else {
      setSelectedInvoices((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleRowAction = (action, invoice) => {
    console.log('Action:', action, 'Invoice:', invoice);
    // Handle different actions here
    switch (action) {
      case 'view':
        navigate(`/dashboard/accounting/invoicing/${invoice.id}`);
        break;
      default:
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Table columns configuration
  const columns = [
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

  const statusStyles = {
    PENDING: 'lowercase bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    PAID: 'lowercase bg-green-100 text-green-800 hover:bg-green-100',
    OVERDUE: 'lowercase bg-red-100 text-red-800 hover:bg-red-100',
    CANCELLED: 'lowercase bg-gray-100 text-gray-800 hover:bg-gray-100',
  };

  const dropdownActions = [{ key: 'view', label: 'View Details' }];

  const paginationData = {
    page: currentPage,
    totalPages: Math.ceil(invoices.length / itemsPerPage),
    pageSize: itemsPerPage,
    totalCount: invoices.length,
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

  // Get the most recent invoice date (sorted by issue date)
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
  );
  const lastPaymentDate =
    sortedInvoices.length > 0 ? sortedInvoices[0].issueDate : null;

  // Calculate overdue payments (invoices past due date and not paid)
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
              ${totalRevenue.toLocaleString()}
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
              ${customer.creditLimit?.toLocaleString() || '0.00'}
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
            <p className="text-base">${averageInvoice.toFixed(2)}</p>
          </div>

          {/* Overdue Payment */}
          <div>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Overdue Payment
            </p>
            <p className="text-base">${overduePayment.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <AccountingTable
        title="Invoice History"
        data={invoices}
        columns={columns}
        searchFields={['invoiceNumber', 'category', 'currency']}
        searchPlaceholder="Search invoices..."
        statusStyles={statusStyles}
        dropdownActions={dropdownActions}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onRowAction={handleRowAction}
        selectedItems={selectedInvoices}
        handleSelectAll={handleSelectAll}
        handleSelectItem={handleSelectItem}
        showDataSize={false}
        isLoading={isLoading}
      />
    </div>
  );
}
