import PaymentScheduleForm from '@/components/dashboard/accounting/accounts-payable/payment-scheduling/schedule-form';
import ViewScheduleModal from '@/components/dashboard/accounting/accounts-payable/payment-scheduling/view-schedule';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import PaymentScheduleService from '@/api/paymentSchedule';
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
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export default function PaymentScheduling() {
  const [openScheduleForm, setOpenScheduleForm] = useState(false);
  const [selectPaymentInvoices, setSelectPaymentInvoices] = useState([]);
  const [openViewSchedule, setOpenViewSchedule] = useState(false);
  const [selectedPaymentSchedule, setSelectedPaymentSchedule] = useState(null);
  const [schedulePayments, setSchedulePayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 20,
  });

  // Fetch payment schedules data
  const fetchPaymentSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await PaymentScheduleService.fetch({
        page: currentPage,
        perPage: 20,
      });
      const paymentsData = res.data?.data?.schedulePayments || [];
      setSchedulePayments(paymentsData);
      setPaginationData({
        page: res.data?.data?.page || 1,
        totalPages: res.data?.data?.totalPages || 1,
        totalDocs: res.data?.data?.totalDocs || 0,
        limit: res.data?.data?.limit || 20,
      });
    } catch (error) {
      console.error('Error fetching payment schedules:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPaymentSchedules();
  }, [currentPage, fetchPaymentSchedules]);

  // Calculate scheduled status text
  const getScheduledStatusText = (scheduledDate) => {
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  // Transform payment schedules data for table
  const transformedPayments = useMemo(() => {
    const today = new Date();

    return schedulePayments.map((payment) => {
      const vendor = payment.vendorId;
      const vendorName =
        `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim();
      const vendorInitials =
        `${vendor?.firstName?.[0] || ''}${vendor?.lastName?.[0] || ''}`.toUpperCase();

      // Determine if payment is overdue
      let displayStatus = 'Pending';
      if (payment.scheduledDate && payment.status === 'PENDING') {
        const scheduledDate = new Date(payment.scheduledDate);
        if (scheduledDate < today) {
          displayStatus = 'Overdue';
        }
      }

      // Get invoice number from invoiceId if it exists (when populated)
      const invoiceNumber = payment.invoiceId?.billNo || 'N/A';

      return {
        id: payment._id || payment.id,
        img: '', // Keeping for column compatibility
        vendorInitials: vendorInitials || 'NA',
        vendor: vendorName || 'N/A',
        invoiceId: invoiceNumber,
        amount: `$${Number(payment.amount).toLocaleString('en-US')}`,
        category:
          payment.paymentMethod?.charAt(0).toUpperCase() +
            payment.paymentMethod?.slice(1) || 'N/A',
        dueDate: payment.scheduledDate
          ? format(new Date(payment.scheduledDate), 'M/d/yyyy')
          : 'N/A',
        overdueDays: payment.scheduledDate
          ? getScheduledStatusText(payment.scheduledDate)
          : '',
        status: displayStatus,
      };
    });
  }, [schedulePayments]);

  // Calculate metrics from payment schedules
  const paymentMetrics = useMemo(() => {
    const totalPayments = paginationData.totalDocs;
    const totalAmount = schedulePayments.reduce((sum, payment) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);

    // Calculate overdue payments (scheduled date has passed but status is still PENDING)
    const today = new Date();
    const overduePayments = schedulePayments.filter((payment) => {
      if (!payment.scheduledDate || payment.status !== 'PENDING') return false;
      const scheduledDate = new Date(payment.scheduledDate);
      return scheduledDate < today;
    }).length;

    // Calculate due this week
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueThisWeek = schedulePayments.filter((payment) => {
      if (!payment.scheduledDate) return false;
      const scheduledDate = new Date(payment.scheduledDate);
      return scheduledDate >= today && scheduledDate <= nextWeek;
    }).length;

    return [
      { title: 'Total Scheduled', value: totalPayments.toString() },
      {
        title: 'Total Amount',
        value: totalAmount,
        symbol: '$',
      },
      { title: 'Due This Week', value: dueThisWeek.toString() },
      { title: 'Overdue', value: overduePayments.toString() },
    ];
  }, [schedulePayments, paginationData]);

  const handleSelectAllTableItems = (checked) => {
    if (checked) {
      setSelectPaymentInvoices(transformedPayments.map((item) => item.id));
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
        console.log('Edit payment schedule:', item.id);
        // TODO: Implement edit functionality
        break;
      case 'view':
        // Find the full payment data from schedulePayments
        { const paymentData = schedulePayments.find(
          (payment) => (payment._id || payment.id) === item.id
        );
        if (paymentData) {
          setSelectedPaymentSchedule(paymentData);
          setOpenViewSchedule(true);
        }
        break; }
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
        <Metrics metrics={paymentMetrics} />

        <AccountingTable
          className="mt-10"
          title={`Payment Queue (${paginationData.totalDocs} scheduled)`}
          isLoading={isLoading}
          data={transformedPayments}
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
        onSuccess={fetchPaymentSchedules}
      />

      <ViewScheduleModal
        open={openViewSchedule}
        onOpenChange={(isOpen) => {
          setOpenViewSchedule(isOpen);
          if (!isOpen) {
            setSelectedPaymentSchedule(null);
          }
        }}
        paymentData={selectedPaymentSchedule}
      />
    </div>
  );
}
