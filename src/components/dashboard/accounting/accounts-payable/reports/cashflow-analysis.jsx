import { useState } from 'react';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import Metrics from '../../invoicing/plain-metrics';
import ListCard from './report-lists-card';
import AccountingTable from '../../table';

const metricsData = [
  {
    title: 'Average Days to Pay',
    value: '12.5',
  },
  {
    title: 'Payment Accuracy',
    value: '98.2%',
  },
  {
    title: 'Average Invoice Value',
    value: '$264',
  },
  {
    title: 'Active Vendors',
    value: '23',
  },
];

const monthlyTrendsData = [
  { date: '2024-01-01', value: 70000 },
  { date: '2024-02-01', value: 18000 },
  { date: '2024-03-01', value: 32000 },
  { date: '2024-04-01', value: 20000 },
  { date: '2024-05-01', value: 41000 },
  { date: '2024-06-01', value: 12000 },
  { date: '2024-07-01', value: 57000 },
  { date: '2024-08-01', value: 15000 },
  { date: '2024-09-01', value: 57000 },
  { date: '2024-10-01', value: 52000 },
  { date: '2024-11-01', value: 95000 },
  { date: '2024-12-01', value: 42000 },
];

const paymentHistoryColumns = [
  {
    key: 'img',
    label: 'Img',
    render: (value) => (
      <div className="flex h-6 w-8 items-center justify-center rounded-md bg-red-500 text-xs font-semibold text-white">
        {value}
      </div>
    ),
  },
  {
    key: 'vendor',
    label: 'Vendor',
  },
  {
    key: 'invoiceId',
    label: 'Invoice ID',
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'category',
    label: 'Category',
  },
  {
    key: 'dueDate',
    label: 'Due Date',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

const summaryData = [
  {
    period: 'Average Monthly',
    amount: '$23,000',
    color: 'bg-green-500',
  },
  {
    period: 'Peak Month',
    details: 'June',
    amount: '$23,000',
    color: 'bg-orange-500',
  },
  {
    period: 'Total YTD',
    details: '6 months',
    amount: '$23,000',
    color: 'bg-amber-700',
  },
];

const paymentHistoryData = [
  {
    id: 1,
    img: 'J&J',
    vendor: 'JJ Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    category: 'Office supplies',
    dueDate: '1/10/2024',
    status: 'Paid',
  },
  {
    id: 2,
    img: 'J&J',
    vendor: 'JJ Solutions',
    invoiceId: 'INV-2024-001',
    amount: '$15,400.00',
    category: 'Office supplies',
    dueDate: '1/10/2024',
    status: 'Paid',
  },
];

const paymentPaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 10,
  totalCount: 100,
};

export default function CashflowAnalysis() {
  const [selectedItems, setSelectedItems] = useState([]);

  const chartConfig = [
    {
      dataKey: 'value',
      color: '#6366F1',
    },
  ];

  const statusStyles = {
    Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
    Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
  };

  const paymentDropdownActions = [
    { key: 'view', label: 'View' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
  ];

  const handlePaymentAction = (action, payment) => {
    console.log(`${action} action for payment:`, payment);
  };

  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = paymentHistoryData.map((payment) => payment.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  return (
    <div className="mb-10 space-y-6 md:space-y-10">
      <Metrics metrics={metricsData} />
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <div className="w-full space-y-6 lg:space-y-10">
          <SimpleAreaMetricCard
            title="Monthly Payment Trends"
            chartData={monthlyTrendsData}
            chartConfig={chartConfig}
          />
        </div>
        <div className="w-full lg:w-auto lg:max-w-[400px] lg:min-w-[320px]">
          <ListCard title="Summary" items={summaryData} />
        </div>
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Payment History"
          data={paymentHistoryData}
          columns={paymentHistoryColumns}
          searchFields={['vendor', 'invoiceId', 'amount']}
          searchPlaceholder="Search vendor, amount or invoice ......"
          statusStyles={statusStyles}
          dropdownActions={paymentDropdownActions}
          paginationData={paymentPaginationData}
          onPageChange={handlePageChange}
          onRowAction={handlePaymentAction}
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          showDataSize={false}
        />
      </div>
    </div>
  );
}
