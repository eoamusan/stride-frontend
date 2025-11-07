import { useEffect, useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';
import PaymentService from '@/api/payment';
import { format } from 'date-fns';

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
  { key: 'export', label: 'Export' },
];

export default function Payments() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // Transform payment data to match table format
  const transformPaymentData = (payments) => {
    if (!payments || !Array.isArray(payments)) return [];

    return payments.map((payment) => ({
      id: payment.trxNo || payment._id,
      customer: 'N/A', // Will need to populate from invoice/customer data
      invoice: payment.invoiceId || 'N/A',
      method: payment.paymentMethod || 'N/A',
      amount: `$0.00`, // Amount not in response, will need from invoice
      date: payment.paymentDate
        ? format(new Date(payment.paymentDate), 'MMM dd, yyyy')
        : 'N/A',
      status: 'Completed', // Status not in response, defaulting to Completed
    }));
  };

  // Calculate metrics from payment data
  const calculateMetrics = () => {
    const totalPayments = paginationData.totalCount || 0;

    return [
      {
        title: 'Total Payments Received',
        value: String(totalPayments),
      },
      {
        title: 'Successful Payments',
        value: String(totalPayments),
      },
      {
        title: 'Pending Payments',
        value: '0',
      },
      {
        title: 'Average Payment Time',
        value: '0 days',
      },
    ];
  };

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
      const transformedData = transformPaymentData(paymentList);
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
    async function fetchPayments() {
      try {
        setIsLoadingData(true);
        const response = await PaymentService.fetch();
        console.log('Fetched payments:', response.data);

        const payments = response.data?.data || [];
        setPaymentList(payments);

        // Update pagination data - API doesn't return pagination info yet
        setPaginationData({
          page: 1,
          totalPages: 1,
          pageSize: payments.length,
          totalCount: payments.length,
        });
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchPayments();
  }, [currentPage]);

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
        <Metrics metrics={calculateMetrics()} />
      </div>
      <div className="mt-10">
        <AccountingTable
          title={'Recent Payments'}
          data={transformPaymentData(paymentList)}
          columns={paymentColumns}
          searchFields={['customer', 'invoice', 'id']}
          searchPlaceholder="Search payment......"
          statusStyles={paymentStatusStyles}
          dropdownActions={paymentDropdownActions}
          paginationData={paginationData}
          onPageChange={handlePageChange}
          onRowAction={handlePaymentAction}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectTableItem}
          handleSelectAll={handleSelectAllItems}
          isLoading={isLoadingData}
        />
      </div>
    </div>
  );
}
