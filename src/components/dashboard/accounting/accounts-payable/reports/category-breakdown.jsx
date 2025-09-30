import { useState } from 'react';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import Metrics from '../../invoicing/plain-metrics';
import AccountingTable from '../../table';
import ListCard from './report-lists-card';

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

const expenseCategoriesData = [
  {
    day: 'IT Services',
    value: 70,
  },
  {
    day: 'Construction',
    value: 50,
  },
  {
    day: 'Marketing',
    value: 45,
  },
  {
    day: 'Office Supplies',
    value: 45,
  },
  {
    day: 'Legal',
    value: 45,
  },
  {
    day: 'Utilities',
    value: 15,
  },
];

const chartConfig = {
  value: {
    label: 'Amount (thousands)',
    color: '#8B5CF6',
  },
};

const categoryBreakdownData = [
  {
    period: 'IT Services',
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Construction',
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Marketing',
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Office Supplies',
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Legal',
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Utilities',
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
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

const paymentPaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 10,
  totalCount: 100,
};

export default function CategoryBreakdown() {
  const [selectedItems, setSelectedItems] = useState([]);

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
          <BarChartOverview
            title="Expense Categories"
            chartData={expenseCategoriesData}
            chartConfig={chartConfig}
          />
        </div>
        <div className="w-full min-w-[320px] lg:max-w-[400px]">
          <ListCard title="Category Breakdown" items={categoryBreakdownData} />
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
