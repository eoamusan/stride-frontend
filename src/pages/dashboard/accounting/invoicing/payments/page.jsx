import { useEffect, useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';
import PaymentService from '@/api/payment';

const paymentData = [
  {
    id: 'P-35476',
    customer: 'ABC Corporation',
    invoice: '#INV-001',
    method: 'Bank Transfer',
    amount: '$15,400.00',
    date: 'Jul 20, 2024',
    status: 'Overdue',
  },
  {
    id: 'P-35477',
    customer: 'Tech Solutions Ltd',
    invoice: '#INV-002',
    method: 'Credit Card',
    amount: '$8,750.00',
    date: 'Aug 15, 2024',
    status: 'Completed',
  },
  {
    id: 'P-35478',
    customer: 'Global Enterprises',
    invoice: '#INV-003',
    method: 'Bank Transfer',
    amount: '$25,000.00',
    date: 'Aug 10, 2024',
    status: 'Pending',
  },
  {
    id: 'P-35479',
    customer: 'Creative Agency Inc',
    invoice: '#INV-004',
    method: 'PayPal',
    amount: '$12,300.00',
    date: 'Jul 30, 2024',
    status: 'Failed',
  },
];

const paymentColumns = [
  { key: 'id', label: 'Payment ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'method', label: 'Method' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const paymentStatusStyles = {
  Completed: 'bg-green-100 text-green-800 hover:bg-green-100',
  Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
  Failed: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const paymentDropdownActions = [
  { key: 'view', label: 'View' },
  { key: 'resend', label: 'Resend' },
  { key: 'refund', label: 'Refund' },
  { key: 'export', label: 'Export' },
];

const paymentPaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 10,
  totalCount: 100,
};

const paymentMetrics = [
  { title: 'Total Payments Received', value: '$264' },
  {
    title: 'Successful Pyaments',
    value: '$15,600',
  },
  {
    title: 'Pending Payments',
    value: '$64',
  },
  {
    title: 'Average Payment Time',
    value: '22 days',
  },
];

export default function Payments() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handlePaymentAction = (action, payment) => {
    console.log('Payment action:', action, payment);
    // Handle different actions here
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
      setSelectedItems(paymentData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    async function fetchPayments() {
      try {
        setIsLoadingData(true);
        const response = await PaymentService.fetch();
        console.log('Fetched payments:', response.data);
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchPayments();  
  }, []);

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Payment Processing</h1>
          <p className="text-sm text-[#7D7D7D]">
            Record and track incoming payments
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={paymentMetrics} />
      </div>
      <div className="mt-10">
        <AccountingTable
          title={'Recent Payments'}
          data={paymentData}
          columns={paymentColumns}
          searchFields={['customer', 'invoice', 'id']}
          searchPlaceholder="Search payment......"
          statusStyles={paymentStatusStyles}
          dropdownActions={paymentDropdownActions}
          paginationData={paymentPaginationData}
          onRowAction={handlePaymentAction}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectTableItem}
          handleSelectAll={handleSelectAllItems}
        />
      </div>
    </div>
  );
}
