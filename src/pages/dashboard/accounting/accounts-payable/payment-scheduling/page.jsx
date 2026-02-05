import PaymentScheduleForm from '@/components/dashboard/accounting/accounts-payable/payment-scheduling/schedule-form';
import ViewScheduleModal from '@/components/dashboard/accounting/accounts-payable/payment-scheduling/view-schedule';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import PaymentScheduleService from '@/api/paymentSchedule';
import BillService from '@/api/bills';
import { format } from 'date-fns';

// Table columns configuration - keeping exact same columns
const paymentColumns = [
  {
    key: 'img',
    label: 'Img',
    render: (value, item) => (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
        {item.vendorInitials}
      </div>
    ),
  },
  { key: 'vendor', label: 'Vendor' },
  { key: 'invoiceId', label: 'Invoice ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
  {
    key: 'dueDate',
    label: 'Due Date',
    render: (value, item) => (
      <div className="flex flex-col">
        <span className="text-sm text-[#434343]">{value}</span>
        <span className="text-xs text-red-500">{item.overdueDays}</span>
      </div>
    ),
  },
  { key: 'status', label: 'Status' },
];

const statusStyles = {
  Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  PENDING: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
  PAID: 'bg-green-100 text-green-800 hover:bg-green-100',
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
  PAST_DUE: 'bg-red-100 text-red-800 hover:bg-red-100',
  'Past Due': 'bg-red-100 text-red-800 hover:bg-red-100',
};

export default function PaymentScheduling() {
  const [openScheduleForm, setOpenScheduleForm] = useState(false);
  const [selectPaymentInvoices, setSelectPaymentInvoices] = useState([]);
  const [openViewSchedule, setOpenViewSchedule] = useState(false);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 20,
  });

  // Fetch bills data
  const fetchBills = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await BillService.fetch({ page: currentPage, perPage: 20 });
      const billsData = res.data?.data?.bills || [];
      setBills(billsData);
      setPaginationData({
        page: res.data?.data?.page || 1,
        totalPages: res.data?.data?.totalPages || 1,
        totalDocs: res.data?.data?.totalDocs || 0,
        limit: res.data?.data?.limit || 20,
      });
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBills();
    const sample = async () => {
      const res = await PaymentScheduleService.fetch({ page: 1, perPage: 10 });
      console.log('Payment Schedule Sample Data:', res.data);
    }

    sample()
  }, [currentPage, fetchBills]);

  // Calculate overdue days
  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return '0 days overdue';
    }
    return `${diffDays} days overdue`;
  };

  // Transform bills data for table - keeping exact same structure
  const transformedBills = useMemo(() => {
    return bills.map((bill) => {
      const vendor = bill.vendorId;
      const vendorName =
        `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim();
      const vendorInitials =
        `${vendor?.firstName?.[0] || ''}${vendor?.lastName?.[0] || ''}`.toUpperCase();

      const statusMap = {
        PAST_DUE: 'Overdue',
        PAID: 'Paid',
        PENDING: 'Pending',
      };

      return {
        id: bill._id || bill.id,
        img: '', // Keeping for column compatibility
        vendorInitials: vendorInitials || 'NA',
        vendor: vendorName || 'N/A',
        invoiceId: bill.billNo,
        amount: `$${Number(bill.billAmount).toLocaleString('en-US')}`,
        category:
          bill.category?.charAt(0).toUpperCase() + bill.category?.slice(1) ||
          'N/A',
        dueDate: bill.dueDate
          ? format(new Date(bill.dueDate), 'M/d/yyyy')
          : 'N/A',
        overdueDays: bill.dueDate
          ? calculateOverdueDays(bill.dueDate)
          : '0 days overdue',
        status: statusMap[bill.status] || 'Pending',
      };
    });
  }, [bills]);

  // Calculate metrics from bills
  const billMetrics = useMemo(() => {
    const totalBills = paginationData.totalDocs;
    const totalAmount = bills.reduce((sum, bill) => {
      return sum + (Number(bill.billAmount) || 0);
    }, 0);

    const overdueBills = bills.filter(
      (bill) => bill.status === 'PAST_DUE'
    ).length;

    // Calculate due this week
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueThisWeek = bills.filter((bill) => {
      if (!bill.dueDate) return false;
      const dueDate = new Date(bill.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;

    return [
      { title: 'Total Invoices', value: totalBills.toString() },
      {
        title: 'Total Amount',
        value: totalAmount,
        symbol: '$',
      },
      { title: 'Due This Week', value: dueThisWeek },
      { title: 'Overdue', value: overdueBills.toString() },
    ];
  }, [bills, paginationData]);

  const handleSelectAllTableItems = (checked) => {
    if (checked) {
      setSelectPaymentInvoices(transformedBills.map((item) => item.id));
    } else {
      setSelectPaymentInvoices([]);
    }
  };

  const handleSelectTableItem = (itemId, checked) => {
    if (checked) {
      setSelectPaymentInvoices([...selectPaymentInvoices, itemId]);
    } else {
      setSelectPaymentInvoices(
        selectPaymentInvoices.filter((id) => id !== itemId)
      );
    }
  };

  // const clearAllTableSelections = () => {
  //   setSelectPaymentInvoices([]);
  // };

  // Handle row actions
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case 'edit':
        console.log('Edit invoice:', item.id);
        break;
      case 'view':
        console.log('View invoice:', item.id);
        setOpenViewSchedule(true);
        break;
      case 'schedule':
        setSelectPaymentInvoices([item.id]);
        setOpenScheduleForm(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Payment Scheduling</h1>
          <p className="text-sm text-[#7D7D7D]">
            Process multiple payments efficiently
          </p>
        </hgroup>

        <div className="flex items-center space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => {
              setSelectPaymentInvoices([]);
              setOpenScheduleForm(true);
            }}
          >
            <PlusCircleIcon className="size-4" />
            Schedule Payment
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={billMetrics} />

        <AccountingTable
          className="mt-10"
          title={`Payment Queue (${paginationData.totalDocs} invoices)`}
          isLoading={isLoading}
          data={transformedBills}
          columns={paymentColumns}
          searchFields={['vendor', 'invoiceId', 'amount', 'category']}
          searchPlaceholder="Search vendor, amount or invoice ......"
          statusStyles={statusStyles}
          paginationData={{
            page: paginationData.page,
            totalPages: paginationData.totalPages,
            pageSize: paginationData.limit,
            totalCount: paginationData.totalDocs,
          }}
          onPageChange={setCurrentPage}
          dropdownActions={[
            { key: 'view', label: 'View' },
            { key: 'edit', label: 'Edit' },
            { key: 'schedule', label: 'Schedule Payment' },
          ]}
          selectedItems={selectPaymentInvoices}
          handleSelectAll={handleSelectAllTableItems}
          handleSelectItem={handleSelectTableItem}
          onRowAction={handleRowAction}
        />
      </div>

      <PaymentScheduleForm
        open={openScheduleForm}
        onOpenChange={setOpenScheduleForm}
        preSelectedInvoiceId={selectPaymentInvoices[0]}
      />

      <ViewScheduleModal
        open={openViewSchedule}
        onOpenChange={setOpenViewSchedule}
        // paymentData={}
      />
    </div>
  );
}
