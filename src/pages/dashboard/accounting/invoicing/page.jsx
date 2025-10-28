import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import EmptyInvoice from '@/components/dashboard/accounting/invoicing/empty-state';
import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircle, SettingsIcon } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import InvoiceService from '@/api/invoice';
import BusinessService from '@/api/business';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/user-store';

const invoice = [''];

// Invoice data from invoice-table.jsx
const invoiceData = [
  {
    id: 'INV-1001',
    customer: 'ABC Corporation',
    currency: 'NGN',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Overdue',
  },
  {
    id: 'INV-1002',
    customer: 'ABC Corporation',
    currency: 'EUR',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Paid',
  },
  {
    id: 'INV-1003',
    customer: 'ABC Corporation',
    currency: 'USD',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Pending',
  },
  {
    id: 'INV-1004',
    customer: 'ABC Corporation',
    currency: 'GBP',
    amount: '$15,400.00',
    issueDate: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Overdue',
  },
];

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
  Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
  Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const invoiceDropdownActions = [
  { key: 'edit', label: 'Edit' },
  { key: 'view', label: 'View' },
  { key: 'generate-receipt', label: 'Generate receipt' },
];

const invoiceListData = {
  pagination: {
    page: 1,
    totalPages: 10,
    pageSize: 10,
    totalCount: 100,
  },
};

const invoiceStats = [
  {
    title: 'Total Invoices',
    unit: '',
    value: 120,
    isPositive: true,
    percentage: '2.45',
    chartData: [20, 25, 30, 28, 35, 40, 38, 45, 50],
  },
  {
    title: 'Total Amount',
    unit: '$',
    value: 45000,
    isPositive: true,
    percentage: '3.75',
    chartData: [2000, 2500, 3000, 2800, 3500, 4000, 3800, 4500, 5000],
  },
  {
    title: 'Outstanding Invoices',
    unit: '$',
    value: 15000,
    isPositive: false,
    percentage: '1.25',
    chartData: [500, 600, 550, 580, 620, 700, 680, 720, 750],
  },
  {
    title: 'Unpaid Invoices',
    unit: '',
    value: 45,
    isPositive: false,
    percentage: '0.75',
    chartData: [300, 350, 400, 380, 420, 450, 430, 470, 500],
  },
  {
    title: 'Collection Rate',
    unit: '%',
    value: 88,
    percentage: '92.5',
    isPositive: true,
    chartData: [80, 82, 85, 83, 87, 90, 88, 92, 95],
  },
];

export default function Invoicing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleCreateInvoice, setToggleCreateInvoice] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [invoiceList, setInvoiceList] = useState();
  const [businessId, setBusinessId] = useState();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { businessData } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoadingData(true);

        const businessId = businessData?._id;
        setBusinessId(businessId);
        setHasBankAccount(
          businessData?.businessInvoiceSettings?.bankAccounts?.length > 0
        );
        const invoiceRes = await InvoiceService.fetch({ businessId });
        if (invoiceRes.data && invoiceRes.data?.data?.length > 0) {
          setInvoiceList(invoiceRes.data.data);
        } else {
          setInvoiceList([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInvoices();
  }, [businessData]);

  // Handle row actions for the table
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    console.log(invoiceList);
    switch (action) {
      case 'edit':
        // Add edit logic here
        console.log('Edit invoice:', item.id);
        break;
      case 'view':
        // Add view logic here
        console.log('View invoice:', item.id);
        break;
      case 'generate-receipt':
        // Add receipt generation logic here
        console.log('Generate receipt for:', item.id);
        break;
      default:
        console.log('Unknown action:', action);
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
      setSelectedItems(invoiceData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
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
            {invoiceStats.length > 0 &&
              invoiceStats.map((stat, index) => (
                <MetricCard
                  key={index}
                  className="w-full max-w-[259px]"
                  title={stat.title}
                  unit={stat.unit}
                  {...stat}
                />
              ))}
          </div>

          <AccountingTable
            title="Invoice Management"
            data={invoiceData}
            columns={invoiceColumns}
            searchFields={['customer', 'id']}
            searchPlaceholder="Search invoices......"
            statusStyles={invoiceStatusStyles}
            dropdownActions={invoiceDropdownActions}
            paginationData={invoiceListData.pagination}
            onRowAction={handleRowAction}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectTableItem}
            handleSelectAll={handleSelectAllItems}
          />
        </div>
      )}
    </div>
  );
}
