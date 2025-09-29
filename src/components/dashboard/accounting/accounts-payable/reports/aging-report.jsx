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

const agingChartData = [
  {
    day: '0-30 days',
    value: 70,
  },
  {
    day: '31-60 days',
    value: 15,
  },
  {
    day: '61-90 days',
    value: 30,
  },
  {
    day: '90+ days',
    value: 20,
  },
];

const chartConfig = {
  value: {
    label: 'Amount (thousands)',
    color: '#8B5CF6',
  },
};

const vendorsData = [
  {
    id: 1,
    img: 'J&J',
    vendor: 'JJ Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
  },
  {
    id: 2,
    img: 'J&J',
    vendor: 'JJ Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
  },
  {
    id: 3,
    img: 'J&J',
    vendor: 'JJ Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
  },
  {
    id: 4,
    img: 'J&J',
    vendor: 'JJ Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
  },
  {
    id: 5,
    img: 'J&J',
    vendor: 'JJ Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
  },
  {
    id: 6,
    img: 'J&J',
    vendor: 'JJ Solutions',
    category: 'Marketing',
    totalInvoices: 40,
    totalAmount: '$15,400.00',
    onTimeRate: '100%',
  },
];

const agingData = [
  {
    period: '0-30 days',
    invoiceCount: 12,
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-green-500',
  },
  {
    period: '31-60 days',
    invoiceCount: 12,
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-orange-500',
  },
  {
    period: '61-90 days',
    invoiceCount: 12,
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-amber-700',
  },
  {
    period: '90+ days',
    invoiceCount: 12,
    amount: '$23,000',
    percentage: '46.4%',
    color: 'bg-red-500',
  },
];

const vendorsColumns = [
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
    key: 'category',
    label: 'Category',
  },
  {
    key: 'totalInvoices',
    label: 'Total Invoices',
  },
  {
    key: 'totalAmount',
    label: 'Total Amount',
  },
  {
    key: 'onTimeRate',
    label: 'On-Time Rate',
    render: (value) => (
      <span className="font-semibold text-green-600">{value}</span>
    ),
  },
];

export default function AgingReport() {
  const [selectedItems, setSelectedItems] = useState([]);

  const vendorsDropdownActions = [
    { key: 'edit', label: 'Edit' },
    { key: 'view', label: 'View' },
    { key: 'delete', label: 'Delete' },
  ];

  const vendorsPaginationData = {
    page: 1,
    totalPages: 10,
    pageSize: 10,
    totalCount: 100,
  };

  const handleVendorAction = (action, vendor) => {
    console.log(`${action} action for vendor:`, vendor);
  };

  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Select all vendor IDs
      const allIds = vendorsData.map((vendor) => vendor.id);
      setSelectedItems(allIds);
    } else {
      // Deselect all
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      // Add item to selection
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      // Remove item from selection
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  return (
    <div className="space-y-10 mb-10">
      <Metrics metrics={metricsData} />
      <div className="flex gap-10">
        <div className="w-full space-y-10">
          <BarChartOverview
            title="Account Payable Aging"
            chartData={agingChartData}
            chartConfig={chartConfig}
          />
          <AccountingTable
            title="Vendors"
            data={vendorsData}
            columns={vendorsColumns}
            searchFields={['vendor', 'category']}
            searchPlaceholder="Search vendor......"
            dropdownActions={vendorsDropdownActions}
            paginationData={vendorsPaginationData}
            onPageChange={handlePageChange}
            onRowAction={handleVendorAction}
            selectedItems={selectedItems}
            handleSelectAll={handleSelectAll}
            handleSelectItem={handleSelectItem}
            showDataSize={false}
          />
        </div>

        <div className="min-w-xs">
          <ListCard title="Aging Summary" items={agingData} />
        </div>
      </div>
    </div>
  );
}
