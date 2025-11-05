import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        setCustomer(customerResponse.data.data);

        // Fetch customer invoices (you may need to adjust this based on your API)
        // const invoiceResponse = await InvoiceService.fetchByCustomer({ customerId: id });
        // setInvoices(invoiceResponse.data.data || []);

        // Mock data for now
        setInvoices([
          {
            id: '1',
            invoiceNumber: 'INV-2025-001',
            amount: 2334,
            currency: 'NGN',
            category: 'Financial Services',
            issueDate: new Date('2025-02-12'),
            dueDate: new Date('2025-02-12'),
            status: 'Active',
          },
          {
            id: '2',
            invoiceNumber: 'INV-2025-001',
            amount: 2334,
            currency: 'EUR',
            category: 'Office Supplies',
            issueDate: new Date('2025-02-12'),
            dueDate: new Date('2025-02-12'),
            status: 'Pending',
          },
          {
            id: '3',
            invoiceNumber: 'INV-2025-001',
            amount: 2334,
            currency: 'USD',
            category: 'Financial Services',
            issueDate: new Date('2025-02-12'),
            dueDate: new Date('2025-02-12'),
            status: 'Active',
          },
          {
            id: '4',
            invoiceNumber: 'INV-2025-001',
            amount: 2334,
            currency: 'GBP',
            category: 'Financial Services',
            issueDate: new Date('2025-02-12'),
            dueDate: new Date('2025-02-12'),
            status: 'Active',
          },
        ]);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'pending':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'overdue':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

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
        // Navigate to invoice details
        break;
      case 'edit':
        // Open edit modal
        break;
      case 'delete':
        // Delete invoice
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
    Active: 'bg-green-100 text-green-700 hover:bg-green-100',
    Pending: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
    Overdue: 'bg-red-100 text-red-700 hover:bg-red-100',
  };

  const dropdownActions = [
    { key: 'view', label: 'View Details' },
    { key: 'edit', label: 'Edit Invoice' },
    { key: 'delete', label: 'Delete' },
  ];

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
  const averageInvoice =
    invoices.length > 0
      ? invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0) /
        invoices.length
      : 0;
  const lastPaymentDate = invoices.length > 0 ? invoices[0].issueDate : null;
  const overduePayment = 3566; // Calculate based on your logic

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
                  {`${customer.firstName || ''} ${customer.lastName || ''}`}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {customer.companyName || 'ABC Corporation'}
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
                    {customer.email || 'jjsolutions@gmail.com'}
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
                      : '22-2-2025'}
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
                      ? `${customer.address.address1}${customer.address.city ? `, ${customer.address.city}` : ''}`
                      : '2118 Thornridge Cir. Syracuse'}
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
                    {customer.addedBy || 'John Adeniyi'}
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
                    {customer.phoneNumber || '+2347065724230'}
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
        <h2 className="mb-6 text-xl font-semibold">Financial Summary</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Due Day</p>
            <p className="font-medium text-green-600">Due in 20 days</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Total Invoices</p>
            <p className="font-semibold">{totalInvoices}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Last Payment</p>
            <p className="font-semibold">
              {lastPaymentDate ? format(lastPaymentDate, 'MMM-d-yyyy') : '-'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Credit Limit</p>
            <p className="font-semibold text-orange-600">
              ${customer.creditLimit?.toLocaleString() || '15,400.00'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">
              Average Invoice
            </p>
            <p className="font-semibold">${averageInvoice.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">
              Overdue Payment
            </p>
            <p className="font-semibold">${overduePayment.toLocaleString()}</p>
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
